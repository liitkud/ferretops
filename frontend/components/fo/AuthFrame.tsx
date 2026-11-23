import Link from "next/link";
import Logo from "./Logo";

// Account-flow frame (SignIn/Verify/Reset/TwoFactor/NotFound.dc.html .au): logo + "Back to site",
// then a centered <main>. Pages render their own `.au-col` column inside it.
export default function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="fo au flex min-h-screen flex-col bg-bg-000 font-sans text-ink-100">
      <header className="mx-auto flex w-full max-w-[75rem] items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="FerretOps home" className="flex items-center">
          <Logo size="app" />
        </Link>
        <Link href="/" className="text-sm text-ink-200 hover:text-ink-100">
          Back to site
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-20 pt-10">{children}</main>
    </div>
  );
}
