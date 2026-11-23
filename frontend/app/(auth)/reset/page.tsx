import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset password" };

// TODO(auth): build from design/project/Reset.dc.html (spec §6).
export default function ResetPage() {
  return (
    <div className="au-col">
      <h1>Reset your password</h1>
    </div>
  );
}
