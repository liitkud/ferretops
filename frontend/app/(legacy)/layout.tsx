import { Inter } from "next/font/google";
import Sidebar from "@/components/ui/Sidebar";
import "./legacy.css";

// Inter is only used by the legacy console, so it only loads on these routes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Legacy console shell: the old body styling moved onto a wrapper, plus the old Sidebar.
export default function LegacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`legacy ${inter.variable} flex h-full min-h-screen flex-col antialiased md:flex-row`}
    >
      <Sidebar />
      {children}
    </div>
  );
}
