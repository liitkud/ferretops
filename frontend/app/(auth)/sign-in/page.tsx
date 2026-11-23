import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

// TODO(auth): build from design/project/SignIn.dc.html (spec §6).
export default function SignInPage() {
  return (
    <div className="au-col">
      <h1>Sign in to FerretOps</h1>
    </div>
  );
}
