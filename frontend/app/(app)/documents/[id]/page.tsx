import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import StatusWord from "@/components/fo/StatusWord";
import Isp004Page3 from "@/components/app-core/Isp004Page3";
import RequirementReview from "@/components/app-core/RequirementReview";
import { documents, needsAttention } from "@/lib/demo-data";

type Props = { params: Promise<{ id: string }> };

// One static page per demo document; any other id is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return documents.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: documents.find((d) => d.id === id)?.title ?? "Document" };
}

// Facts for documents that are not processed yet, taken from the same dataset rows Overview and Documents show.
const PENDING: Record<string, { note: string; reading?: { page: number; of: number } }> = {
  "northwind-questionnaire": {
    note: needsAttention.find((a) => a.href === "/documents/northwind-questionnaire")?.detail ?? "",
  },
  "incident-response-plan": {
    note: "Requirements show up for review when reading finishes.",
    reading: { page: 4, of: 9 },
  },
};

// Document (Document.dc.html). ISP-004 gets the page-3 requirement review; the others show their current state.
export default async function DocumentPage({ params }: Props) {
  const { id } = await params;
  const doc = documents.find((d) => d.id === id);
  if (!doc) notFound();
  if (doc.id === "isp-004") return <RequirementReview paper={<Isp004Page3 />} />;

  const pending = PENDING[doc.id];
  return (
    <>
      <AppTopBar
        crumbs={[
          { label: "Acme", href: "/overview" },
          { label: "Documents", href: "/documents" },
          { label: doc.title },
        ]}
      />
      <AppPage title={doc.title} description={doc.meta}>
        {/* Current state: status, requirement count and upload facts, plus reading progress while it is read */}
        <section aria-label="Document status" className="box flex max-w-[48rem] flex-col gap-4 px-5 py-4">
          <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:gap-y-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <dt className="mute">Status</dt>
            <dd className="m-0">
              <StatusWord status={doc.status} />
            </dd>
            <dt className="mute">Type</dt>
            <dd className="m-0">{doc.type}</dd>
            <dt className="mute">Requirements</dt>
            <dd className="m-0">{doc.requirements}</dd>
            <dt className="mute">Uploaded</dt>
            <dd className="m-0">{doc.uploaded}</dd>
          </dl>
          {pending?.reading && (
            <div
              role="progressbar"
              aria-label="Reading progress"
              aria-valuemin={0}
              aria-valuemax={pending.reading.of}
              aria-valuenow={pending.reading.page}
              aria-valuetext={`Page ${pending.reading.page} of ${pending.reading.of}`}
              className="h-1 overflow-hidden rounded-pill bg-line-100"
            >
              <span
                className="block h-full bg-info"
                style={{ width: `${(pending.reading.page / pending.reading.of) * 100}%` }}
              />
            </div>
          )}
          {pending?.note && <p className="m-0 text-sm text-ink-200">{pending.note}</p>}
        </section>
      </AppPage>
    </>
  );
}
