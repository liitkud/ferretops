import Nav from "@/components/fo/Nav";
import Footer from "@/components/fo/Footer";

// Marketing pages: shared Nav and Footer. Each page renders its own <main>.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fo flex min-h-screen flex-col bg-bg-000 font-sans text-ink-100">
      <Nav />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
