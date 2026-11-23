import type { Metadata } from "next";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import { documents } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Document" };

// TODO(app-core): build from design/project/Document.dc.html (spec §5). Demo route: /documents/isp-004.
export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = documents.find((d) => d.id === id) ?? documents[0];
  return (
    <>
      <AppTopBar
        crumbs={[
          { label: "Acme", href: "/overview" },
          { label: "Documents", href: "/documents" },
          { label: doc.title },
        ]}
      />
      <AppPage title={doc.title} />
    </>
  );
}
