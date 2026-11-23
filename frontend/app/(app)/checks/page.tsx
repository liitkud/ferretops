import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";

export const metadata: Metadata = { title: "Checks" };

// TODO(app-core): build from design/project/Checks.dc.html (spec §5).
export default function ChecksPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Checks" }]} />
      <AppPage title="Checks" />
    </>
  );
}
