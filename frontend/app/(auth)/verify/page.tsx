import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verify email" };

// TODO(auth): build from design/project/Verify.dc.html (spec §6).
export default function VerifyPage() {
  return (
    <div className="au-col">
      <h1>Check your email</h1>
    </div>
  );
}
