import AuthFrame from "@/components/fo/AuthFrame";

// Sign in, verify, reset, two-factor: logo header + centered column (SignIn.dc.html framing).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthFrame>{children}</AuthFrame>;
}
