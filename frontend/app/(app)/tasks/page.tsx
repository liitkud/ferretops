import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";

export const metadata: Metadata = { title: "People tasks" };

// TODO(app-settings): build from design/project/Tasks.dc.html (spec §5).
export default function TasksPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "People tasks" }]} />
      <AppPage title="People tasks" />
    </>
  );
}
