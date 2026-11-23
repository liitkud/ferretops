import type { Metadata } from "next";

// Per-page metadata for marketing routes. Next merges metadata shallowly, so openGraph and
// twitter are rebuilt here in full instead of inheriting the root layout's site-wide values.
export function marketingMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | FerretOps`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "FerretOps",
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
