import type { Metadata } from "next";

export const metadata: Metadata = { title: "Two-factor" };

// TODO(auth): build from design/project/TwoFactor.dc.html (spec §6).
export default function TwoFactorPage() {
  return (
    <div className="au-col">
      <h1>Enter your code</h1>
    </div>
  );
}
