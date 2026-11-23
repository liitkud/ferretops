"use client";

import Link from "next/link";
import { useState } from "react";
import AppPage from "@/components/fo/AppPage";
import StatusWord from "@/components/fo/StatusWord";
import { peopleTasks, taskStatus } from "@/lib/demo-data";
import VisuallyHidden from "./VisuallyHidden";

const DONE = { label: "Done", tone: "ok" } as const;

// People tasks (Tasks.dc.html): Mark done / Reopen per row; the "N open" count follows.
export default function TasksView() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const open = peopleTasks.filter((_, i) => !done[i]).length;

  return (
    <AppPage
      title="People tasks"
      description="Requirements a person has to do. Each task collects its own evidence when it is marked done."
      aside={
        <span className="mute text-sm" aria-live="polite">
          {open} open
        </span>
      }
    >
      <div className="tbl">
        <table className="t">
          <thead>
            <tr>
              <th scope="col">Task</th>
              <th scope="col">From</th>
              <th scope="col">Owner</th>
              <th scope="col">Due</th>
              <th scope="col">Evidence</th>
              <th scope="col">Status</th>
              <th scope="col">
                <VisuallyHidden>Action</VisuallyHidden>
              </th>
            </tr>
          </thead>
          <tbody>
            {peopleTasks.map((t, i) => (
              <tr key={t.name}>
                <td className="min-w-64">
                  <span className="block font-medium">{t.name}</span>
                  <span className="mute">{t.description}</span>
                </td>
                <td className="whitespace-nowrap">
                  <Link href="/documents/isp-004">ISP-004 {t.clause}</Link>
                </td>
                <td className="whitespace-nowrap">{t.owner}</td>
                <td className="whitespace-nowrap">{t.due}</td>
                <td className="mute whitespace-nowrap">{t.evidence}</td>
                <td className="whitespace-nowrap">
                  <StatusWord status={done[i] ? DONE : taskStatus[t.state]} />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-s"
                    aria-label={`${done[i] ? "Reopen" : "Mark done"}: ${t.name}`}
                    onClick={() => setDone({ ...done, [i]: !done[i] })}
                  >
                    {done[i] ? "Reopen" : "Mark done"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppPage>
  );
}
