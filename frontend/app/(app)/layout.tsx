import AppSidebar from "@/components/fo/AppSidebar";

// Signed-in app: sidebar + main column. Pages render <AppTopBar> then <AppPage>.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fo flex min-h-screen flex-col bg-bg-000 font-sans text-ink-100 md:flex-row">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
