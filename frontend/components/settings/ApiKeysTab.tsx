"use client";

import { useState } from "react";
import VisuallyHidden from "@/components/app-settings/VisuallyHidden";
import { Box, Field, Group, Line, Note, Panel, Row } from "./parts";

type Scope = "Read only" | "Read and write";
type ApiKey = { id: string; name: string; prefix: string; scope: Scope; used: string; revoked: boolean };

const initialKeys: ApiKey[] = [
  { id: "k1", name: "GitHub Actions", prefix: "fo_live_3kQ2…", scope: "Read only", used: "12m ago", revoked: false },
  { id: "k2", name: "Terraform pipeline", prefix: "fo_live_9Wd7…", scope: "Read and write", used: "3 days ago", revoked: false },
];

// Demo key: 24 random base-36 characters after the live prefix.
function makeKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return "fo_live_" + Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}

// API keys: create (full key shown once with Copy), revoke, plus the signed webhook endpoint.
export default function ApiKeysTab() {
  const [keys, setKeys] = useState(initialKeys);
  const [name, setName] = useState("");
  const [scope, setScope] = useState<Scope>("Read only");
  const [newKey, setNewKey] = useState("");
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");

  function createKey() {
    const full = makeKey();
    setNewKey(full);
    setCopy("idle");
    setKeys([
      { id: full, name: name || "Untitled key", prefix: full.slice(0, 12) + "…", scope, used: "Never", revoked: false },
      ...keys,
    ]);
    setName("");
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(newKey);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  }

  return (
    <Panel>
      <Group
        title="API keys"
        description="Keys act as the workspace, not as you. A key is shown once when it is created."
      >
        <Line>
          <Field label="Key name">
            <input
              className="inp"
              type="text"
              placeholder="e.g. CI pipeline"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Access" flex="flex-[0_1_11rem]">
            <select className="inp" value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
              <option value="Read only">Read only</option>
              <option value="Read and write">Read and write</option>
            </select>
          </Field>
          <button type="button" className="btn btn-p" onClick={createKey}>
            Create key
          </button>
        </Line>
        {newKey && (
          <Note className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex min-w-0 flex-col gap-1">
              <span>Copy this key now. You will not see it again.</span>
              <code className="mono break-all text-ink-100">{newKey}</code>
            </span>
            <button type="button" className="btn btn-s" onClick={copyKey}>
              {copy === "copied" ? "Copied" : copy === "failed" ? "Copy failed" : "Copy key"}
            </button>
          </Note>
        )}
        <div className="tbl">
          <table className="t">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Key</th>
                <th scope="col">Access</th>
                <th scope="col">Last used</th>
                <th scope="col">
                  <VisuallyHidden>Action</VisuallyHidden>
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td>{k.name}</td>
                  <td className="mono mute whitespace-nowrap">{k.prefix}</td>
                  <td className="whitespace-nowrap">{k.scope}</td>
                  <td className="mute whitespace-nowrap">{k.revoked ? "—" : k.used}</td>
                  <td className="text-right">
                    {k.revoked ? (
                      // Same height as the button so the row does not shrink on revoke.
                      <span className="s-mute inline-flex min-h-11 items-center">Revoked</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-g"
                        aria-label={`Revoke ${k.name}`}
                        onClick={() => setKeys(keys.map((m) => (m.id === k.id ? { ...m, revoked: true } : m)))}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>

      <Group title="Webhooks" description="FerretOps signs every request with your signing secret.">
        <Box>
          <Row>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="mono break-all">https://hooks.acme.com/ferretops</span>
              <span className="mute">check.failed, task.overdue · last delivery 2m ago</span>
            </span>
            <span className="s-ok">Delivering</span>
          </Row>
        </Box>
      </Group>
    </Panel>
  );
}
