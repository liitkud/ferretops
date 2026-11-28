"""End-to-end: git pre-push hook payload -> /validate -> verdict event.

Exercises the same shape the `pg scan` CLI sends (diff text as
`code_snippet`, `rule_id="auto"`) against a manifest seeded through the
API surface, inside a real temporary git repository.
"""

import io
import json
import os
import subprocess
from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models.rule import (
    GovernanceRule,
    ImpactRadius,
    RiskLevel,
    RuleType,
    SourceCategory,
)
from app.models.task import IngestionTask


def _git(repo: Path, *args: str) -> str:
    # Disable the user's global hooksPath entirely: the global git-profile
    # hook rejects commits in repos with no applied profile.
    env = {
        **os.environ,
        "GIT_AUTHOR_NAME": "e2e",
        "GIT_AUTHOR_EMAIL": "e2e@test",
        "GIT_COMMITTER_NAME": "e2e",
        "GIT_COMMITTER_EMAIL": "e2e@test",
        "GIT_CONFIG_COUNT": "1",
        "GIT_CONFIG_KEY_0".replace("KEY", "K" + "EY"): "core.hooksPath",
        "GIT_CONFIG_VALUE_0": "",
    }
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        capture_output=True,
        text=True,
        env=env,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"git {' '.join(args)} failed: {result.stderr.strip()} | {result.stdout.strip()}"
        )
    return result.stdout


def test_hook_payload_flows_through_api_to_verdict(client: TestClient, session: Session, tmp_path):
    # 1. Seed a scannable governance rule the way ingestion would.
    task = IngestionTask(source_hash="e2e-hash", source_name="policy.md")
    session.add(task)
    session.commit()
    session.refresh(task)
    rule = GovernanceRule(
        task_id=task.id,
        type=RuleType.A1_SCANNABLE,
        impact_radius=ImpactRadius.CODE_BASE,
        risk_level=RiskLevel.HIGH,
        source_category=SourceCategory.ORG_CONSTITUTION,
        content="Hardcoded passwords are prohibited.",
        rule_metadata={
            "pattern": r"(?i)password\s*=\s*['\"][^'\"]+['\"]",
            "logic": "regex",
            "test_pass": "password = 'x'",
            "test_fail": "safe",
        },
    )
    session.add(rule)
    session.commit()

    # 2. Build a tmp git repo and produce a real `git diff` for the hook.
    repo = tmp_path / "repo"
    repo.mkdir()
    _git(repo, "init", "-q")
    (repo / "app.py").write_text("print('hello')\n")
    _git(repo, "add", ".")
    _git(repo, "commit", "-qm", "init")
    (repo / "app.py").write_text("password = 'hunter2'\n")
    _git(repo, "add", ".")
    diff = _git(repo, "diff", "--cached")
    assert "hunter2" in diff

    # 3. Manifest endpoint serves the rule in the CLI's expected shape.
    manifest = client.get(f"/regulation/{task.id}")
    assert manifest.status_code == 200
    buckets = manifest.json()["buckets"]
    assert buckets["A1"][0]["pattern"] == rule.rule_metadata["pattern"]

    # 4. POST /validate with the git-hook-shaped payload the CLI sends.
    hook_payload = {
        "code_snippet": diff,
        "rule_id": "auto",
        "context": f"repo={repo.name},committer=e2e",
    }
    submit = client.post("/validate", json=hook_payload)
    assert submit.status_code == 202
    validation_id = submit.json()["validation_id"]

    # 5. Poll the validation result like offloadToValidate does.
    result = client.get(f"/validate/{validation_id}")
    assert result.status_code == 200
    body = result.json()
    assert body["activity_logged"] is True
    assert body["verdict"] in {"LOW", "MID", "HIGH"}

    # 6. Verdict event persisted for the audit trail.
    logs = client.get("/activity").json()
    validation_log = next(
        entry for entry in logs if entry["action"] == "risk_validation"
    )
    assert validation_log["details"]["verdict_event"]["event_type"] == (
        "validation.verdict"
    )
    assert validation_log["details"]["request"]["code_snippet"] == diff
