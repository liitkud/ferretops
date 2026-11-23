import type { Metadata } from "next";
import EvidenceView from "@/components/app-settings/EvidenceView";

export const metadata: Metadata = { title: "Evidence" };

// Evidence (Evidence.dc.html, spec §5). The export action lives in the top bar, so the whole view is client.
export default function EvidencePage() {
  return <EvidenceView />;
}
