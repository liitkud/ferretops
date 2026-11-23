import type { Metadata } from "next";
import ResetFlow from "@/components/auth/ResetFlow";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPage() {
  return <ResetFlow />;
}
