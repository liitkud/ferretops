import type { Metadata } from "next";
import Link from "next/link";
import AppTopBar from "@/components/fo/AppTopBar";
import AppPage from "@/components/fo/AppPage";
import StatusWord from "@/components/fo/StatusWord";
import UploadDrop from "@/components/app-core/UploadDrop";
import { documents } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Documents" };

// Documents (Documents.dc.html): upload drop zone, then every document with its type, requirement counts and status.
export default function DocumentsPage() {
  return (
    <>
      <AppTopBar crumbs={[{ label: "Acme", href: "/overview" }, { label: "Documents" }]} />
      <AppPage
        title="Documents"
        description="Policies, frameworks and questionnaires that FerretOps reads requirements from."
      >
        <UploadDrop />
        <div className="tbl">
          <table className="t">
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">Type</th>
                <th scope="col">Requirements</th>
                <th scope="col">Status</th>
                <th scope="col">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link href={`/documents/${d.id}`} className="font-medium">
                      {d.title}
                    </Link>
                    <div className="mute">{d.meta}</div>
                  </td>
                  <td>{d.type}</td>
                  <td>{d.requirements}</td>
                  <td className="whitespace-nowrap">
                    <StatusWord status={d.status} />
                  </td>
                  <td className="mute whitespace-nowrap">{d.uploaded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppPage>
    </>
  );
}
