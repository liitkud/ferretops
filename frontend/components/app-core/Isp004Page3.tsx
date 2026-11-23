// ISP-004 page 3 rendered as paper (Document.dc.html .paper). Light paper in both themes, like a PDF page.
// Each <mark> is a sentence FerretOps read as a requirement; they match the 8 rows beside it.
const mark = "bg-[#fff2cc] px-0.5 text-[#16171a]";
const clause = "text-[#16171a]";
const runner = "flex justify-between gap-3 text-sm text-[#6b6e76] border-[#d9d9d3]";

export default function Isp004Page3() {
  return (
    <article
      aria-label="ISP-004 page 3"
      className="flex flex-col gap-3 rounded-[0.25rem] border-hair border-[#23262e] bg-[#fafaf8] px-5 py-4 [font-family:Arial,Helvetica,sans-serif] text-sm leading-[1.55] text-[#3a3d44] sm:px-8 sm:py-6 [&_p]:m-0"
    >
      <div className={`${runner} border-b-hair pb-2`}>
        <span>Acme Corp · Information Security Policy</span>
        <span>ISP-004 · v3.2</span>
      </div>
      <p className="text-base font-bold text-[#16171a]">4. Access Control</p>
      <p>
        <b className={clause}>4.1</b>{" "}
        <mark className={mark}>Production access is granted on a least-privilege basis and approved by the system owner.</mark>
      </p>
      <p>
        <b className={clause}>4.2</b> Production credentials, including API keys, database passwords and signing keys,{" "}
        <mark className={mark}>must be rotated at least every 90 days</mark> and stored in an approved secrets manager.
      </p>
      <p className="pl-4">
        (a) <mark className={mark}>Service accounts are in scope.</mark>
        <br />
        (b) <mark className={mark}>Each rotation is recorded in the change log.</mark>
      </p>
      <p>
        <b className={clause}>4.3</b>{" "}
        <mark className={mark}>Secrets must never be committed to source code repositories</mark>, including private
        repositories and commit history. Exceptions require written approval from the CISO.
      </p>
      <p className="pl-4">
        <mark className={mark}>
          A credential found in a repository is treated as compromised and must be revoked within 24 hours.
        </mark>
      </p>
      <p>
        <b className={clause}>4.4</b> Access to production systems{" "}
        <mark className={mark}>must be reviewed quarterly by the system owner</mark>, and unused access removed.
      </p>
      <p>
        <b className={clause}>4.5</b> <mark className={mark}>Accounts inactive for 90 days are disabled.</mark> Access for
        leavers is revoked by the end of their last working day.
      </p>
      <div className={`${runner} mt-2 border-t-hair pt-2`}>
        <span>Internal · Owner: Security · Rev. 2026-03-14</span>
        <span>Page 3 of 12</span>
      </div>
    </article>
  );
}
