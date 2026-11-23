import type { Metadata } from "next";
import Link from "next/link";
import AuthFrame from "@/components/fo/AuthFrame";

export const metadata: Metadata = { title: "Page not found" };

// NotFound.dc.html.
export default function NotFound() {
  return (
    <AuthFrame>
      <div className="au-col">
        <div className="flex flex-col gap-2">
          <h1>Page not found</h1>
          <p className="lead">
            The link may be old, or the item was deleted. Error 404.
          </p>
        </div>
        <div className="au-card">
          <Link className="btn btn-p w" href="/overview">
            Go to your workspace
          </Link>
          <Link className="btn btn-s w" href="/">
            Back to the website
          </Link>
        </div>
        <p className="m-0 text-center text-sm text-ink-300">
          Still stuck? <a href="mailto:support@[DOMAIN]">Email support</a>
        </p>
      </div>
    </AuthFrame>
  );
}
