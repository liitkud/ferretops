"use client";

import Link from "next/link";
import { useState } from "react";
import VisuallyHidden from "@/components/app-settings/VisuallyHidden";
import { workspace } from "@/lib/demo-data";
import { Box, Group, Note, Panel, Row } from "./parts";

const invoices = [
  { date: "Nov 14, 2026", id: "2026-11" },
  { date: "Oct 14, 2026", id: "2026-10" },
  { date: "Sep 14, 2026", id: "2026-09" },
];

// Billing: plan with self-serve cancel (inline confirm, then "Resume plan"), payment method, invoices.
export default function BillingTab() {
  const [cancel, setCancel] = useState<"idle" | "ask" | "done">("idle");

  return (
    <Panel>
      <Group title="Plan">
        <Box>
          <Row>
            <span className="flex flex-col gap-1">
              <span className="font-semibold">
                {workspace.plan} · {workspace.developers} developers
              </span>
              <span className="mute">
                $[M] per developer per month · {cancel === "done" ? "ends Dec 14" : "renews Dec 14"}
              </span>
            </span>
            <Link className="btn btn-s" href="/pricing">
              Change plan
            </Link>
          </Row>
        </Box>
        {cancel === "idle" && (
          <div>
            <button type="button" className="btn btn-g" onClick={() => setCancel("ask")}>
              Cancel subscription
            </button>
          </div>
        )}
        {cancel === "ask" && (
          <Note className="flex flex-col gap-3">
            <span>
              Your plan stays active until Dec 14. After that, Acme moves to the Free plan: code checks on public
              repos only. Documents and evidence stay readable.
            </span>
            <span className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-s" onClick={() => setCancel("idle")}>
                Keep plan
              </button>
              <button type="button" className="btn btn-d" onClick={() => setCancel("done")}>
                Cancel subscription
              </button>
            </span>
          </Note>
        )}
        {cancel === "done" && (
          <Note className="flex flex-wrap items-center justify-between gap-3">
            <span>Cancelled. Team stays active until Dec 14.</span>
            <button type="button" className="btn btn-s" onClick={() => setCancel("idle")}>
              Resume plan
            </button>
          </Note>
        )}
      </Group>

      <Group title="Payment method">
        <Box>
          <Row>
            <span>Visa ending 4242 · expires 08/28</span>
            {/* TODO(billing): link to the billing provider's customer portal once billing is wired. */}
            <a className="btn btn-s" href="#">
              Update in billing portal
            </a>
          </Row>
        </Box>
      </Group>

      <Group title="Invoices">
        <div className="tbl">
          <table className="t">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <VisuallyHidden>Download</VisuallyHidden>
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.date}</td>
                  <td className="mono">$[TOTAL]</td>
                  <td>
                    <span className="s-ok">Paid</span>
                  </td>
                  <td>
                    {/* TODO(billing): real invoice PDF URL for this invoice. */}
                    <a href="#" aria-label={`Download PDF for ${inv.date}`}>
                      Download PDF
                    </a>
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
