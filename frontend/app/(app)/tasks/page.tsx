import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import TasksView from "@/components/app-settings/TasksView";

export const metadata: Metadata = { title: "People tasks" };

// People tasks (Tasks.dc.html, spec §5). The table and open count are client state in TasksView.
export default function TasksPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "People tasks" }]} />
      <TasksView />
    </>
  );
}
