import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";

export const metadata: Metadata = { title: "Documents" };

// TODO(app-core): build from design/project/Documents.dc.html (spec §5).
export default function DocumentsPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Documents" }]} />
      <AppPage title="Documents" />
    </>
  );
}
