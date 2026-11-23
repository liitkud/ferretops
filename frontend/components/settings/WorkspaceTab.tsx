"use client";

import { useState } from "react";
import { currentUser, workspace } from "@/lib/demo-data";
import { Field, Group, Line, Note, Panel } from "./parts";

// Workspace: name, URL, data region; delete asks the owner to confirm by email.
export default function WorkspaceTab() {
  const [saved, setSaved] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  // Any edit after a save re-arms the Save button.
  const edited = () => setSaved(false);

  return (
    <Panel>
      <Group title="Workspace">
        <Line>
          <Field label="Name">
            <input className="inp" type="text" defaultValue={workspace.name} onChange={edited} />
          </Field>
          <Field label="URL">
            <input className="inp mono" type="text" defaultValue="app.ferretops.dev/acme" onChange={edited} />
          </Field>
        </Line>
        <Line>
          <Field label="Data region">
            <select className="inp" defaultValue="United States" onChange={edited}>
              <option>United States</option>
              <option>European Union</option>
              <option>Singapore</option>
            </select>
          </Field>
          <button type="button" className="btn btn-p" onClick={() => setSaved(true)}>
            {saved ? "Saved" : "Save changes"}
          </button>
        </Line>
      </Group>

      <Group
        title="Delete workspace"
        description="Deletes all documents, checks, tasks and evidence for Acme. Export evidence first if you need it for an audit."
      >
        <div>
          <button type="button" className="btn btn-d" onClick={() => setAskDelete(true)}>
            Delete workspace
          </button>
        </div>
        {askDelete && (
          <Note>
            Only the workspace owner can do this, and they get an email to confirm. Owner: {currentUser.name}.
          </Note>
        )}
      </Group>
    </Panel>
  );
}
