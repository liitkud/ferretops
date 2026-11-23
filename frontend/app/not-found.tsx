import type { Metadata } from "next";
import AuthFrame from "@/components/fo/AuthFrame";

export const metadata: Metadata = { title: "Page not found" };

// TODO(auth): build from design/project/NotFound.dc.html (spec §6).
export default function NotFound() {
  return (
    <AuthFrame>
      <div className="au-col">
        <h1>Page not found</h1>
      </div>
    </AuthFrame>
  );
}
