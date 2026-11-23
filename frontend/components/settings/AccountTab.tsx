"use client";

import { useState } from "react";
import { currentUser } from "@/lib/demo-data";
import { Box, Field, Group, Line, Note, Panel, Row } from "./parts";

const MIN_PASSWORD = 12;

// Account: profile, email change, password, 2FA, sessions, delete account.
export default function AccountTab() {
  const [emailSent, setEmailSent] = useState(false);
  const [pw, setPw] = useState<"closed" | "open" | "done">("closed");
  const [newPw, setNewPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [signedOutOther, setSignedOutOther] = useState(false);
  const [tfa, setTfa] = useState(false);
  const [phone, setPhone] = useState(true);
  const [delText, setDelText] = useState("");
  const [delMsg, setDelMsg] = useState("");

  // Saving a new password signs out every other session.
  function savePassword() {
    if (newPw.length < MIN_PASSWORD) {
      setPwError(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    setPwError("");
    setSignedOutOther(phone);
    setPhone(false);
    setPw("done");
  }

  // Deleting is blocked while the user owns a workspace (Maya owns Acme).
  function deleteAccount() {
    setDelMsg(
      delText === "DELETE"
        ? "Acme has an owner (you). Transfer ownership in Members or delete the workspace first."
        : "Type DELETE in the box to confirm.",
    );
  }

  return (
    <Panel>
      <Group title="Profile">
        <Line>
          <Field label="Name">
            <input className="inp" type="text" defaultValue={currentUser.name} autoComplete="name" />
          </Field>
        </Line>
        <Line>
          <Field label="Email">
            <input className="inp" type="email" defaultValue={currentUser.email} autoComplete="email" />
          </Field>
          <button type="button" className="btn btn-s" onClick={() => setEmailSent(true)}>
            Change email
          </button>
        </Line>
        {emailSent && (
          <Note>We sent a confirmation link to the new address. Your email changes when you open it.</Note>
        )}
      </Group>

      <Group title="Password" description="Changing your password signs you out everywhere else.">
        {pw === "closed" && (
          <div>
            <button type="button" className="btn btn-s" onClick={() => setPw("open")}>
              Change password
            </button>
          </div>
        )}
        {pw === "open" && (
          <>
            <Line>
              <Field label="Current password">
                <input className="inp" type="password" autoComplete="current-password" />
              </Field>
              <Field label="New password">
                <input
                  className="inp"
                  type="password"
                  autoComplete="new-password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  aria-describedby="new-pw-hint"
                />
              </Field>
              <button type="button" className="btn btn-p" onClick={savePassword}>
                Save password
              </button>
            </Line>
            <p id="new-pw-hint" className={`m-0 text-sm ${pwError ? "text-danger" : "text-ink-300"}`}>
              {pwError || `At least ${MIN_PASSWORD} characters.`}
            </p>
          </>
        )}
        {pw === "done" && (
          <Note>{signedOutOther ? "Password changed. Your other session was signed out." : "Password changed."}</Note>
        )}
      </Group>

      <Group title="Two-factor authentication" description="Required for admins on the Team plan.">
        <Box>
          <Row>
            <span>Authenticator app</span>
            <span className="flex items-center gap-3">
              <span className={tfa ? "s-ok" : "s-warn"}>{tfa ? "On" : "Off"}</span>
              <button type="button" className="btn btn-s" onClick={() => setTfa(!tfa)}>
                {tfa ? "Turn off" : "Set up"}
              </button>
            </span>
          </Row>
          <Row>
            <span>Recovery codes</span>
            <span className="mute">{tfa ? "10 codes saved Nov 23" : "Created when you set up the app"}</span>
          </Row>
        </Box>
      </Group>

      <Group title="Sessions">
        <Box>
          <Row>
            <span>
              Chrome on macOS · Manila<span className="mute"> · this device</span>
            </span>
            <span className="s-ok">Active now</span>
          </Row>
          {phone && (
            <Row>
              <span>
                Safari on iPhone · Manila<span className="mute"> · 2 days ago</span>
              </span>
              <button type="button" className="btn btn-s" onClick={() => setPhone(false)}>
                Sign out
              </button>
            </Row>
          )}
        </Box>
      </Group>

      <Group
        title="Delete account"
        description="Removes your login and personal data. Workspaces you own must be transferred or deleted first."
      >
        <Line>
          <Field label="Type DELETE to confirm">
            <input
              className="inp"
              type="text"
              autoComplete="off"
              value={delText}
              onChange={(e) => setDelText(e.target.value)}
            />
          </Field>
          <button type="button" className="btn btn-d" onClick={deleteAccount}>
            Delete account
          </button>
        </Line>
        {delMsg && <Note>{delMsg}</Note>}
      </Group>
    </Panel>
  );
}
