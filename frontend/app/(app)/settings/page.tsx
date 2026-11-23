import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";

export const metadata: Metadata = { title: "Settings" };

// TODO(app-settings): build from design/project/Settings.dc.html (spec §5).
export default function SettingsPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Settings" }]} />
      <AppPage title="Settings" />
    </>
  );
}
