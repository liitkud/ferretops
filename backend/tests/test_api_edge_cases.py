"""Coverage for API edges not exercised by the main integration suites."""

import io
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.models.rule import (
    GovernanceRule,
    ImpactRadius,
    RiskLevel,
    RuleType,
    SourceCategory,
)
from app.models.task import IngestionTask, TaskStatus
from app.services.logger import ActivityLog


def _make_rule(session: Session, **overrides) -> GovernanceRule:
    task = IngestionTask(source_hash=f"hash-{uuid4()}", source_name="policy.md")
    session.add(task)
    session.commit()
    session.refresh(task)
    fields = {
        "task_id": task.id,
        "type": RuleType.A1_SCANNABLE,
        "impact_radius": ImpactRadius.CODE_BASE,
        "risk_level": RiskLevel.LOW,
        "source_category": SourceCategory.ORG_GUIDELINE,
        "content": "Rule content",
    }
    fields.update(overrides)
    rule = GovernanceRule(**fields)
    session.add(rule)
    session.commit()
    session.refresh(rule)
    return rule


def test_health(client: TestClient):
    assert client.get("/health").json() == {"status": "healthy"}


# ── /ingest status edges ─────────────────────────────────────────────


def test_get_task_status_rejects_non_uuid(client: TestClient):
    res = client.get("/ingest/not-a-uuid")
    assert res.status_code == 400


def test_get_task_status_unknown_uuid_404(client: TestClient):
    res = client.get(f"/ingest/{uuid4()}")
    assert res.status_code == 404


def test_completed_task_exposes_manifest_url(client: TestClient, session: Session):
    task = IngestionTask(
        source_hash="done-hash",
        status=TaskStatus.COMPLETE,
        progress_pct=100,
        current_stage="done",
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    res = client.get(f"/ingest/{task.id}")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "complete"
    assert body["manifest_url"] == f"/regulation/{task.id}"


def test_ingest_markdown_extension_accepted(client: TestClient):
    res = client.post(
        "/ingest",
        files={"file": ("notes.markdown", io.BytesIO(b"# policy"), "text/markdown")},
    )
    assert res.status_code == 202


def test_ingest_without_filename_rejected(client: TestClient):
    res = client.post(
        "/ingest",
        files={"file": ("", io.BytesIO(b"data"), "application/octet-stream")},
    )
    # FastAPI rejects an empty filename before the handler runs.
    assert res.status_code == 422


# ── /regulation manifest edges ───────────────────────────────────────


def test_list_regulations_empty(client: TestClient):
    assert client.get("/regulation").json() == []


def test_manifest_by_task_id_returns_buckets(client: TestClient, session: Session):
    rule = _make_rule(
        session,
        rule_metadata={
            "pattern": r"secret",
            "logic": "regex",
            "test_pass": "a secret",
            "test_fail": "public",
        },
    )
    task_id = rule.task_id

    res = client.get(f"/regulation/{task_id}")
    assert res.status_code == 200
    body = res.json()
    assert body["meta"]["source_uuid"] == str(task_id)
    assert body["meta"]["total_rules"] == 1
    a1 = body["buckets"]["A1"][0]
    assert a1["pattern"] == r"secret"
    assert a1["test_pass"] == "a secret"
    assert a1["test_fail"] == "public"
    # non-A1 buckets stay empty
    assert body["buckets"]["B"] == []


def test_manifest_by_rule_id(client: TestClient, session: Session):
    # NOTE: documents current behavior — a valid rule UUID is treated as a
    # task UUID first, misses, and 404s before the rule fallback is reached.
    # The rule-id branch only runs for non-UUID strings.
    rule = _make_rule(session)
    res = client.get(f"/regulation/{rule.id}")
    assert res.status_code == 404


def test_manifest_invalid_and_unknown_ids_404(client: TestClient):
    assert client.get("/regulation/not-a-uuid").status_code == 404
    assert client.get(f"/regulation/{uuid4()}").status_code == 404


def test_reg_bucket_filter(client: TestClient, session: Session):
    _make_rule(session)
    _make_rule(session, type=RuleType.C_SEMANTIC_GUIDANCE)

    res = client.get("/reg?bucket=A1")
    assert res.status_code == 200
    buckets = res.json()["buckets"]
    assert len(buckets["A1"]) == 1
    assert buckets.get("A2", []) == []


def test_reg_unknown_bucket_returns_requested_key_empty(client: TestClient):
    res = client.get("/reg?bucket=ZZZ")
    assert res.status_code == 200
    assert res.json()["buckets"] == {"ZZZ": []}


def test_reg_source_category_filter(client: TestClient, session: Session):
    _make_rule(session, source_category=SourceCategory.GOVERNMENT_LAW)
    _make_rule(session, source_category=SourceCategory.ORG_CONSTITUTION)

    res = client.get("/reg?source_category=government_law")
    assert res.status_code == 200
    buckets = res.json()["buckets"]
    total = sum(len(v) for v in buckets.values())
    assert total == 1


def test_corp_alias_returns_org_constitution_rules(
    client: TestClient, session: Session
):
    _make_rule(session, source_category=SourceCategory.ORG_CONSTITUTION)
    _make_rule(session, source_category=SourceCategory.GOVERNMENT_LAW)

    res = client.get("/corp")
    assert res.status_code == 200
    buckets = res.json()["buckets"]
    total = sum(len(v) for v in buckets.values())
    assert total == 1


# ── /validate edges ──────────────────────────────────────────────────


def test_validate_with_non_uuid_rule_id_uses_general_guidance(client: TestClient):
    # The CLI sends rule_id="auto"; backend must not crash on it.
    res = client.post(
        "/validate",
        json={"code_snippet": "print('ok')", "rule_id": "auto"},
    )
    assert res.status_code == 202


def test_validate_get_unknown_id_404(client: TestClient):
    assert client.get(f"/validate/{uuid4()}").status_code == 404


def test_validate_patch_unknown_id_404(client: TestClient):
    res = client.patch(f"/validate/{uuid4()}", json={"action": "approve"})
    assert res.status_code == 404


def test_validate_patch_invalid_action_400(client: TestClient):
    res = client.post(
        "/validate",
        json={"code_snippet": "print('ok')", "rule_id": str(uuid4())},
    )
    validation_id = res.json()["validation_id"]

    bad = client.patch(f"/validate/{validation_id}", json={"action": "explode"})
    assert bad.status_code == 400


def test_validate_patch_on_simulation_log_404(client: TestClient):
    sim = client.post("/simulate", json={"candidate_text": "some policy text"})
    log_id = None
    # find the simulation log id via GET /simulate is not exposed; use activity
    # Instead create a validation and check patch works, then verify a
    # simulate log id 404s by querying activity stream.
    assert sim.status_code == 200
    logs = client.get("/activity").json()
    sim_log = next(l for l in logs if l["action"] == "regulatory_simulation")
    log_id = sim_log["id"]
    res = client.patch(f"/validate/{log_id}", json={"action": "approve"})
    assert res.status_code == 404
    assert log_id is not None


def test_list_validations_verdict_filter(client: TestClient):
    client.post(
        "/validate",
        json={"code_snippet": "print('ok')", "rule_id": str(uuid4())},
    )
    low = client.get("/validate?verdict=LOW").json()
    high = client.get("/validate?verdict=HIGH").json()
    assert len(low) == 1
    assert all(v["verdict"] == "LOW" for v in low)
    assert high == []


def test_list_validations_bad_since_ignored(client: TestClient):
    client.post(
        "/validate",
        json={"code_snippet": "print('ok')", "rule_id": str(uuid4())},
    )
    res = client.get("/validate?since=not-a-date")
    assert res.status_code == 200
    assert len(res.json()) == 1


# ── /simulate edges ──────────────────────────────────────────────────


@pytest.mark.parametrize("threshold", [-0.1, 1.1])
def test_simulate_threshold_out_of_range_422(client: TestClient, threshold: float):
    res = client.post(
        "/simulate",
        json={"candidate_text": "policy", "similarity_threshold": threshold},
    )
    assert res.status_code == 422


def test_simulate_unknown_target_policy_scopes_to_nothing(client: TestClient):
    res = client.post(
        "/simulate",
        json={
            "candidate_text": "Section 1: logging requirements.",
            "target_policy_id": str(uuid4()),
        },
    )
    assert res.status_code == 200
    assert res.json()["total_rules_evaluated"] == 0


def test_simulate_get_with_non_simulation_log_id_404(client: TestClient):
    client.post(
        "/validate",
        json={"code_snippet": "print('ok')", "rule_id": str(uuid4())},
    )
    logs = client.get("/activity").json()
    val_log = next(l for l in logs if l["action"] == "risk_validation")
    res = client.get(f"/simulate/{val_log['id']}")
    assert res.status_code == 404


# ── /activity ────────────────────────────────────────────────────────


def test_activity_returns_logged_entries(client: TestClient):
    client.post("/simulate", json={"candidate_text": "org-wide training policy"})
    res = client.get("/activity")
    assert res.status_code == 200
    actions = [entry["action"] for entry in res.json()]
    assert "regulatory_simulation" in actions
