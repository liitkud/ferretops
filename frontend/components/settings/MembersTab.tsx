"use client";

import { useState } from "react";
import StatusWord from "@/components/fo/StatusWord";
import { users, type Role, type Status } from "@/lib/demo-data";
import { Field, Group, Line, Panel } from "./parts";

type Member = { name: string; email: string; role: Role; status: Status };
type InviteRole = Exclude<Role, "Owner">;

const ACTIVE: Status = { label: "Active", tone: "ok" };

// Auditors are time-boxed: their status shows the access end date.
const initialMembers: Member[] = users.map((u) => ({
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.until ? { label: `Until ${u.until}`, tone: "mute" } : ACTIVE,
}));

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Members: invite by email with a role, then the member table.
export default function MembersTab() {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("Member");
  const [until, setUntil] = useState("");
  const [error, setError] = useState("");

  function invite() {
    if (email.indexOf("@") < 1) return setError("Enter an email address.");
    if (role === "Auditor" && !until) return setError("Pick the date auditor access ends.");
    const label = role === "Auditor" ? `Invite sent · until ${formatDate(until)}` : "Invite sent";
    setMembers([...members, { name: email.split("@")[0], email, role, status: { label, tone: "info" } }]);
    setEmail("");
    setUntil("");
    setError("");
  }

  return (
    <Panel>
      <Group
        title="Invite"
        description="Members can review requirements and complete tasks. Auditors can only read evidence."
      >
        <Line>
          <Field label="Email">
            <input
              className="inp"
              type="email"
              placeholder="name@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={error ? "invite-error" : undefined}
            />
          </Field>
          <Field label="Role" flex="flex-[0_1_10rem]">
            <select className="inp" value={role} onChange={(e) => setRole(e.target.value as InviteRole)}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Auditor">Auditor</option>
            </select>
          </Field>
          {role === "Auditor" && (
            <Field label="Access until" flex="flex-[0_1_11rem]">
              <input className="inp" type="date" value={until} onChange={(e) => setUntil(e.target.value)} />
            </Field>
          )}
          <button type="button" className="btn btn-p" onClick={invite}>
            Send invite
          </button>
        </Line>
        {error && (
          <p id="invite-error" className="m-0 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </Group>

      <div className="tbl">
        <table className="t">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email}>
                <td>
                  <span className="block font-medium">{m.name}</span>
                  <span className="mute">{m.email}</span>
                </td>
                <td>{m.role === "Auditor" ? "Auditor · read only" : m.role}</td>
                <td>
                  <StatusWord status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
