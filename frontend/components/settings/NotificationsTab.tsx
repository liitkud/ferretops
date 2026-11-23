"use client";

import { useState } from "react";
import { currentUser } from "@/lib/demo-data";
import { Group, Panel, Switch } from "./parts";

const initial = [
  { label: "A check starts failing", email: true, slack: true },
  { label: "A task is due in 3 days", email: true, slack: false },
  { label: "A document finished reading", email: true, slack: false },
  { label: "Requirements need review", email: false, slack: true },
  { label: "Weekly summary", email: true, slack: false },
];

// Notifications: one email and one Slack switch per event.
export default function NotificationsTab() {
  const [rows, setRows] = useState(initial);
  const flip = (i: number, key: "email" | "slack") =>
    setRows(rows.map((r, j) => (j === i ? { ...r, [key]: !r[key] } : r)));

  return (
    <Panel>
      <Group
        title="Notifications"
        description={`Slack messages go to #sec-alerts. Email goes to ${currentUser.email}.`}
      >
        <div className="tbl">
          <table className="t">
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Email</th>
                <th scope="col">Slack</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label}>
                  <td className="align-middle">{r.label}</td>
                  <td>
                    <Switch checked={r.email} label={`${r.label} by email`} onToggle={() => flip(i, "email")} />
                  </td>
                  <td>
                    <Switch checked={r.slack} label={`${r.label} in Slack`} onToggle={() => flip(i, "slack")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
    </Panel>
  );
}
