import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import SettingsTabs from "@/components/settings/SettingsTabs";
import { toSettingsTab } from "@/components/settings/tabs";

export const metadata: Metadata = { title: "Settings" };

// Settings (Settings.dc.html, spec §5): seven tabs, linkable as /settings?tab=<id>.
export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tab } = await searchParams;
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Settings" }]} />
      <AppPage title="Settings">
        <SettingsTabs key={toSettingsTab(tab)} initialTab={toSettingsTab(tab)} />
      </AppPage>
    </>
  );
}
