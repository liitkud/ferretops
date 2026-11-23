// Settings tab ids, as used in `/settings?tab=<id>`. Plain module so the server page can import it.
export const SETTINGS_TABS = [
  { id: "account", label: "Account" },
  { id: "workspace", label: "Workspace" },
  { id: "members", label: "Members" },
  { id: "billing", label: "Billing" },
  { id: "notifications", label: "Notifications" },
  { id: "api-keys", label: "API keys" },
  { id: "integrations", label: "Integrations" },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export function toSettingsTab(value: unknown): SettingsTabId {
  return SETTINGS_TABS.find((t) => t.id === value)?.id ?? "account";
}
