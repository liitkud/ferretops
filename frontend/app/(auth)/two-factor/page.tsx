import type { Metadata } from "next";
import TwoFactorFlow from "@/components/auth/TwoFactorFlow";

export const metadata: Metadata = { title: "Two-factor" };

export default function TwoFactorPage() {
  return <TwoFactorFlow />;
}
