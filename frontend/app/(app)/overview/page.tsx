import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";

export const metadata: Metadata = { title: "Overview" };

// TODO(app-core): build from design/project/Overview.dc.html (spec §5).
export default function OverviewPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Overview" }]} />
      <AppPage title="Overview" />
    </>
  );
}
