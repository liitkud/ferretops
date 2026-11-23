import type { Metadata } from "next";
import VerifyFlow from "@/components/auth/VerifyFlow";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyPage() {
  return <VerifyFlow />;
}
