import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";

export const metadata: Metadata = { title: "Evidence" };

// TODO(app-settings): build from design/project/Evidence.dc.html (spec §5).
export default function EvidencePage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Evidence" }]} />
      <AppPage title="Evidence" />
    </>
  );
}
