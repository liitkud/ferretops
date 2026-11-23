import type { Metadata } from "next";
import ChecksView from "@/components/app-core/ChecksView";

export const metadata: Metadata = { title: "Checks" };

// Checks (Checks.dc.html). `?tab=infra` opens the Infra tab so Overview links land on the right check.
export default async function ChecksPage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const { tab } = await searchParams;
  return <ChecksView initialTab={tab === "infra" ? "infra" : "code"} />;
}
