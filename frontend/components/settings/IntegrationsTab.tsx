"use client";

import { useState } from "react";
import { integrations } from "@/lib/demo-data";
import { Box, Group, Panel, Row } from "./parts";

// Integrations: connect or disconnect each source host, cloud and notification target.
export default function IntegrationsTab() {
  const [rows, setRows] = useState(integrations);

  return (
    <Panel>
      <Group
        title="Integrations"
        description="Code checks need a source host. Infra checks need a cloud account with a read-only role."
      >
        <Box>
          {rows.map((g, i) => (
            <Row key={g.name}>
              <span className="flex flex-col gap-1">
                <span className="font-medium">{g.name}</span>
                <span className="mute">{g.detail}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className={g.connected ? "s-ok" : "s-mute"}>{g.connected ? "Connected" : "Not connected"}</span>
                <button
                  type="button"
                  className="btn btn-s"
                  aria-label={`${g.connected ? "Disconnect" : "Connect"} ${g.name}`}
                  onClick={() => setRows(rows.map((m, j) => (j === i ? { ...m, connected: !m.connected } : m)))}
                >
                  {g.connected ? "Disconnect" : "Connect"}
                </button>
              </span>
            </Row>
          ))}
        </Box>
      </Group>
    </Panel>
  );
}
