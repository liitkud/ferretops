"use client";

import { useRef, useState } from "react";
import AccountTab from "./AccountTab";
import ApiKeysTab from "./ApiKeysTab";
import BillingTab from "./BillingTab";
import IntegrationsTab from "./IntegrationsTab";
import MembersTab from "./MembersTab";
import NotificationsTab from "./NotificationsTab";
import WorkspaceTab from "./WorkspaceTab";
import { SETTINGS_TABS, type SettingsTabId } from "./tabs";

const PANELS: Record<SettingsTabId, React.ComponentType> = {
  account: AccountTab,
  workspace: WorkspaceTab,
  members: MembersTab,
  billing: BillingTab,
  notifications: NotificationsTab,
  "api-keys": ApiKeysTab,
  integrations: IntegrationsTab,
};

/*
  Settings tablist. Every panel stays mounted (inactive ones are `hidden`) so edits in one tab
  survive switching, like the mockup's single component. The active tab is mirrored to ?tab=.
  Arrow keys, Home and End move between tabs (roving tabindex).
*/
export default function SettingsTabs({ initialTab }: { initialTab: SettingsTabId }) {
  const [tab, setTab] = useState(initialTab);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(id: SettingsTabId) {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = SETTINGS_TABS.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(SETTINGS_TABS[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="tabs" role="tablist" aria-label="Settings">
        {SETTINGS_TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            className="tab"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={tab === t.id}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => select(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {SETTINGS_TABS.map((t) => {
        const Panel = PANELS[t.id];
        return (
          <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={tab !== t.id}>
            <Panel />
          </div>
        );
      })}
    </div>
  );
}
