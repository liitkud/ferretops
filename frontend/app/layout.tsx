import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted at build time. Variables feed the token font families in globals.css.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: ["600", "700"],
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const description =
  "Turns compliance documents into checks that run in your code, your infra and your team.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://complyaigent.ferretops.dev",
  ),
  title: {
    default: "FerretOps",
    template: "%s | FerretOps",
  },
  description,
  keywords: [
    "FerretOps",
    "compliance",
    "security policy",
    "security questionnaire",
    "compliance checks",
    "SOC 2",
    "evidence collection",
  ],
  authors: [{ name: "FerretOps" }],
  creator: "FerretOps",
  publisher: "FerretOps",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://complyaigent.ferretops.dev",
    siteName: "FerretOps",
    title: "FerretOps",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "FerretOps",
    description,
  },
};

// Bare document shell. Each route group (marketing, auth, onboarding, app, legacy) brings its own chrome.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} min-h-full`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
