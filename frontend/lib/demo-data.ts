/*
  FerretOps demo dataset (spec §1). One fictional workspace shared by every app page.
  Rows are copied from the mockups' renderVals() and markup so pages import instead of re-typing.
  Keep the counts consistent: 3 documents, 14 code checks (2 failing), 9 infra checks
  (1 failing, 1 running), 6 people tasks, 10 SOC 2 controls (7 collected).
*/

// Status words: always rendered as a colored word, never a dot or pill. See components/fo/StatusWord.
export type Tone = "ok" | "bad" | "warn" | "info" | "mute";
export type Bucket = "code" | "infra" | "people";
export type Status = { label: string; tone: Tone };

/* ---------- Workspace and people ---------- */

export const workspace = {
  name: "Acme",
  plan: "Team",
  developers: 8,
  /** Sidebar workspace line. */
  summary: "Team plan · 8 developers",
};

export type Role = "Owner" | "Admin" | "Member" | "Auditor";
export type User = {
  name: string;
  initials: string;
  email: string;
  role: Role;
  /** Auditor access end date. */
  until?: string;
};

export const users: User[] = [
  { name: "Maya Chen", initials: "MC", email: "maya@acme.com", role: "Owner" },
  { name: "Jordan Lee", initials: "JL", email: "jordan@acme.com", role: "Admin" },
  { name: "Priya Nair", initials: "PN", email: "priya@acme.com", role: "Member" },
  {
    name: "Lena Ortiz",
    initials: "LO",
    email: "lena@auditfirm.example",
    role: "Auditor",
    until: "Jan 31, 2027",
  },
];

/** The signed-in user. The sidebar mockup labels her "Admin" although Members lists her as Owner. */
export const currentUser = users[0];

/* ---------- Documents ---------- */

export type DocumentRow = {
  id: string;
  title: string;
  /** Second line under the title. */
  meta: string;
  type: "Policy" | "Questionnaire";
  /** Requirements column text. */
  requirements: string;
  status: Status;
  uploaded: string;
};

export const documents: DocumentRow[] = [
  {
    id: "isp-004",
    title: "Information Security Policy",
    meta: "ISP-004 · v3.2 · 12 pages",
    type: "Policy",
    requirements: "14 code · 9 infra · 6 people",
    status: { label: "Processed", tone: "ok" },
    uploaded: "Mar 14 · Maya Chen",
  },
  {
    id: "northwind-questionnaire",
    title: "Northwind vendor security questionnaire",
    meta: "64 questions · XLSX",
    type: "Questionnaire",
    requirements: "17 found, not in buckets yet",
    status: { label: "Needs review · 3 unclear", tone: "warn" },
    uploaded: "Yesterday · Jordan Lee",
  },
  {
    id: "incident-response-plan",
    title: "Incident Response Plan",
    meta: "v1.4 · 9 pages",
    type: "Policy",
    requirements: "—",
    status: { label: "Reading · page 4 of 9", tone: "info" },
    uploaded: "Today 10:15 · Maya Chen",
  },
];

/** ISP-004 header facts (Document page). */
export const isp004 = {
  id: "isp-004",
  title: "Information Security Policy",
  code: "ISP-004",
  version: "3.2",
  pages: 12,
  requirements: { code: 14, infra: 9, people: 6, total: 29 },
};

/** The 8 requirements highlighted on ISP-004 page 3 (Document.dc.html). `accepted: false` = needs review. */
export type PageRequirement = {
  clause: string;
  text: string;
  bucket: Bucket | "none";
  rule: string;
  accepted: boolean;
};

export const isp004Page3Requirements: PageRequirement[] = [
  { clause: "4.1", text: "Approve production access requests before provisioning", bucket: "people", rule: "access-approval", accepted: true },
  { clause: "4.2", text: "Rotate production credentials every 90 days", bucket: "infra", rule: "key-rotation-90d", accepted: true },
  { clause: "4.2a", text: "Include service accounts in rotation", bucket: "infra", rule: "key-rotation-90d", accepted: true },
  { clause: "4.2b", text: "Record every rotation in the change log", bucket: "infra", rule: "rotation-logged", accepted: false },
  { clause: "4.3", text: "No secrets in repositories or commit history", bucket: "code", rule: "no-secrets-in-repos", accepted: true },
  { clause: "4.3", text: "Revoke a leaked credential within 24 hours", bucket: "infra", rule: "leaked-key-revoked-24h", accepted: false },
  { clause: "4.4", text: "Review production access every quarter", bucket: "people", rule: "access-review", accepted: true },
  { clause: "4.5", text: "Disable accounts inactive for 90 days", bucket: "infra", rule: "inactive-users-90d", accepted: true },
];

/* ---------- Checks ---------- */

export type Check = {
  id: string;
  description: string;
  /** Clause in ISP-004, e.g. "§4.3". Display as `ISP-004 §4.3`. */
  clause: string;
  scope: string;
  lastRun: string;
  status: Status;
};

const passing: Status = { label: "Passing", tone: "ok" };

export const codeChecks: Check[] = [
  { id: "no-secrets-in-repos", description: "No secrets committed to repositories", clause: "§4.3", scope: "12 repos", lastRun: "2m ago", status: { label: "Failing · 1 finding", tone: "bad" } },
  { id: "signed-commits-main", description: "Commits to main are signed", clause: "§6.4", scope: "12 repos", lastRun: "2m ago", status: passing },
  { id: "branch-protection-main", description: "main only changes through a pull request", clause: "§6.3", scope: "12 repos", lastRun: "2m ago", status: passing },
  { id: "required-reviews", description: "Pull requests need one approving review", clause: "§6.3", scope: "12 repos", lastRun: "2m ago", status: passing },
  { id: "dependency-critical-cves", description: "No critical CVEs in dependencies", clause: "§6.2", scope: "12 repos", lastRun: "1h ago", status: { label: "Failing · 3 in acme/web", tone: "bad" } },
  { id: "sast-high", description: "No high-severity static analysis findings", clause: "§6.2", scope: "12 repos", lastRun: "1h ago", status: passing },
  { id: "pinned-ci-actions", description: "CI actions pinned to a commit SHA", clause: "§6.5", scope: "9 workflows", lastRun: "1h ago", status: passing },
  { id: "ci-logs-masked", description: "CI logs mask secret values", clause: "§4.3", scope: "9 workflows", lastRun: "1h ago", status: passing },
  { id: "codeowners", description: "CODEOWNERS file present", clause: "§6.3", scope: "12 repos", lastRun: "1d ago", status: passing },
  { id: "license-allowlist", description: "Dependencies use approved licenses", clause: "§6.6", scope: "12 repos", lastRun: "1d ago", status: passing },
  { id: "tls-min-version", description: "Services require TLS 1.2 or higher", clause: "§5.3", scope: "7 services", lastRun: "1d ago", status: passing },
  { id: "no-debug-in-prod", description: "Debug mode off in production config", clause: "§6.7", scope: "7 services", lastRun: "1d ago", status: passing },
  { id: "pr-linked-ticket", description: "Pull requests reference a ticket", clause: "§6.3", scope: "12 repos", lastRun: "1d ago", status: passing },
  { id: "container-non-root", description: "Containers do not run as root", clause: "§5.4", scope: "7 images", lastRun: "1d ago", status: passing },
];

export const infraChecks: Check[] = [
  { id: "key-rotation-90d", description: "Production keys rotated within 90 days", clause: "§4.2", scope: "31 credentials", lastRun: "4m ago", status: { label: "Failing · stripe/live at 91 days", tone: "bad" } },
  { id: "db-encryption-at-rest", description: "Databases encrypted at rest", clause: "§5.1", scope: "4 databases", lastRun: "1h ago", status: passing },
  { id: "storage-block-public", description: "Storage buckets block public access", clause: "§5.2", scope: "2 AWS accounts", lastRun: "1h ago", status: passing },
  { id: "admin-mfa", description: "Root and admin users have MFA", clause: "§4.1", scope: "2 AWS accounts", lastRun: "1h ago", status: passing },
  { id: "iam-no-wildcard", description: "No policy grants full admin to everything", clause: "§4.1", scope: "2 AWS accounts", lastRun: "1h ago", status: passing },
  { id: "audit-logging-on", description: "Audit logging on in every region", clause: "§7.1", scope: "2 AWS accounts", lastRun: "1h ago", status: passing },
  { id: "backups-daily", description: "Daily backups kept for 35 days", clause: "§8.2", scope: "4 databases", lastRun: "6h ago", status: passing },
  { id: "no-open-ssh", description: "No firewall rule allows SSH from anywhere", clause: "§5.2", scope: "2 AWS accounts", lastRun: "now", status: { label: "Running", tone: "info" } },
  { id: "inactive-users-90d", description: "Users inactive for 90 days are disabled", clause: "§4.5", scope: "AWS, GitHub org", lastRun: "1h ago", status: passing },
];

/** One-line summaries under the Checks tabs. */
export const checkSummaries = {
  code: "12 passing, 2 failing. Runs on every commit, pull request and nightly.",
  infra: "7 passing, 1 failing, 1 running. Runs every hour against your cloud accounts.",
};

/* ---------- People tasks ---------- */

export type TaskState = "in_progress" | "todo" | "scheduled";
export type PeopleTask = {
  name: string;
  description: string;
  clause: string;
  owner: string;
  due: string;
  evidence: string;
  state: TaskState;
};

/** Status word per task state; a task marked done shows { label: "Done", tone: "ok" }. */
export const taskStatus: Record<TaskState, Status> = {
  in_progress: { label: "In progress", tone: "info" },
  todo: { label: "To do", tone: "warn" },
  scheduled: { label: "Scheduled", tone: "mute" },
};

export const peopleTasks: PeopleTask[] = [
  { name: "Q4 access review", description: "Confirm who still needs production access in AWS, GitHub, Stripe and the admin panel.", clause: "§4.4", owner: "Maya Chen", due: "Dec 1", evidence: "2 of 4 systems", state: "in_progress" },
  { name: "Annual security training", description: "Every employee completes the training and the quiz.", clause: "§9.1", owner: "All staff", due: "Dec 15", evidence: "18 of 24 people", state: "in_progress" },
  { name: "Northwind vendor review", description: "Review Northwind’s SOC 2 report and their answers to the questionnaire.", clause: "§10.2", owner: "Jordan Lee", due: "Dec 20", evidence: "None yet", state: "todo" },
  { name: "Backup restore test", description: "Restore last night’s production backup into staging and record the time taken.", clause: "§8.3", owner: "Priya Nair", due: "Jan 10, 2027", evidence: "None yet", state: "scheduled" },
  { name: "Incident response tabletop", description: "Run one scenario from the incident response plan with on-call engineers.", clause: "§11.4", owner: "Maya Chen", due: "Feb 14, 2027", evidence: "None yet", state: "scheduled" },
  { name: "Annual policy review", description: "Review ISP-004 and publish a new version or confirm the current one.", clause: "§1.3", owner: "Maya Chen", due: "Mar 14, 2027", evidence: "None yet", state: "scheduled" },
];

/* ---------- Evidence (SOC 2) ---------- */

export const evidenceStatus = {
  collected: { label: "Collected", tone: "ok" },
  partial: { label: "Partial", tone: "warn" },
  missing: { label: "Missing", tone: "bad" },
} as const satisfies Record<string, Status>;

export type Soc2Control = {
  id: string;
  requirement: string;
  /** ISP-004 clauses, e.g. "ISP-004 §4.1, §4.5". Links to the document. */
  source: string;
  /** Check ids or task names that supply the evidence. */
  collectedFrom: string[];
  evidence: string;
  status: keyof typeof evidenceStatus;
};

export const soc2 = {
  framework: "SOC 2 Type II",
  auditWindow: "Jan 1 to Dec 31, 2026",
  auditor: users[3],
};

export const soc2Controls: Soc2Control[] = [
  { id: "CC6.1", requirement: "Logical access is restricted", source: "ISP-004 §4.1, §4.5", collectedFrom: ["iam-no-wildcard", "inactive-users-90d"], evidence: "312 scan results", status: "collected" },
  { id: "CC6.2", requirement: "Access is approved and removed", source: "ISP-004 §4.1", collectedFrom: ["Approve production access"], evidence: "18 approvals", status: "collected" },
  { id: "CC6.3", requirement: "Access is reviewed", source: "ISP-004 §4.4", collectedFrom: ["Q4 access review"], evidence: "2 of 4 systems", status: "partial" },
  { id: "CC6.6", requirement: "External threats are blocked", source: "ISP-004 §5.2", collectedFrom: ["storage-block-public", "no-open-ssh"], evidence: "96 scan results", status: "collected" },
  { id: "CC6.7", requirement: "Data in transit is encrypted", source: "ISP-004 §5.3", collectedFrom: ["tls-min-version"], evidence: "41 scan results", status: "collected" },
  { id: "CC6.8", requirement: "Malicious software is prevented", source: "ISP-004 §6.2", collectedFrom: ["dependency-critical-cves"], evidence: "Check failing since Nov 20", status: "missing" },
  { id: "CC7.1", requirement: "Configuration changes are monitored", source: "ISP-004 §7.1", collectedFrom: ["audit-logging-on"], evidence: "2 accounts, all regions", status: "collected" },
  { id: "CC7.2", requirement: "Anomalies are detected and handled", source: "ISP-004 §4.3", collectedFrom: ["no-secrets-in-repos"], evidence: "41 events", status: "collected" },
  { id: "CC8.1", requirement: "Changes are authorized", source: "ISP-004 §6.3", collectedFrom: ["branch-protection-main", "required-reviews"], evidence: "1,208 pull requests", status: "collected" },
  { id: "A1.2", requirement: "Backups can be restored", source: "ISP-004 §8.2, §8.3", collectedFrom: ["backups-daily", "Backup restore test"], evidence: "Restore test not done yet", status: "missing" },
];

/* ---------- Overview ---------- */

/** Bucket strip: segment sizes for the pass/fail bar, in display order. */
export const bucketSummary: {
  bucket: Bucket;
  label: string;
  href: string;
  total: number;
  parts: { count: number; label: string; tone: Tone }[];
}[] = [
  {
    bucket: "code",
    label: "Code checks",
    href: "/checks",
    total: 14,
    parts: [
      { count: 12, label: "passing", tone: "ok" },
      { count: 2, label: "failing", tone: "bad" },
    ],
  },
  {
    bucket: "infra",
    label: "Infra checks",
    href: "/checks",
    total: 9,
    parts: [
      { count: 7, label: "passing", tone: "ok" },
      { count: 1, label: "failing", tone: "bad" },
      { count: 1, label: "running", tone: "info" },
    ],
  },
  {
    bucket: "people",
    label: "People tasks",
    href: "/tasks",
    total: 6,
    parts: [
      { count: 2, label: "in progress", tone: "info" },
      { count: 1, label: "to do", tone: "warn" },
      { count: 3, label: "scheduled", tone: "mute" },
    ],
  },
];

export type AttentionItem = {
  status: Status;
  item: string;
  /** Monospace when the item is a check id. */
  mono: boolean;
  href: string;
  detail: string;
  source: string;
};

export const needsAttention: AttentionItem[] = [
  { status: { label: "Failing", tone: "bad" }, item: "no-secrets-in-repos", mono: true, href: "/checks", detail: "Live Stripe key in acme/api billing/config.ts:18", source: "ISP-004 §4.3" },
  { status: { label: "Failing", tone: "bad" }, item: "key-rotation-90d", mono: true, href: "/checks", detail: "stripe/live was last rotated 91 days ago", source: "ISP-004 §4.2" },
  { status: { label: "Failing", tone: "bad" }, item: "dependency-critical-cves", mono: true, href: "/checks", detail: "3 critical CVEs in acme/web", source: "ISP-004 §6.2" },
  { status: { label: "Needs review", tone: "warn" }, item: "Northwind vendor questionnaire", mono: false, href: "/documents/northwind-questionnaire", detail: "3 answers need a person before they become checks", source: "Questionnaire" },
  { status: { label: "Due Dec 1", tone: "warn" }, item: "Q4 access review", mono: false, href: "/tasks", detail: "2 of 4 systems reviewed · Maya Chen", source: "ISP-004 §4.4" },
];

export const activity: { time: string; source: string; text: string }[] = [
  { time: "11:02", source: "code", text: "scanned acme/api@9f2c1e · 1 finding" },
  { time: "10:47", source: "infra", text: "rotation started · stripe/live" },
  { time: "10:15", source: "docs", text: "reading incident-response-plan.pdf · page 4 of 9" },
  { time: "09:58", source: "tasks", text: "Jordan Lee finished security training" },
  { time: "Yesterday", source: "docs", text: "Northwind questionnaire read · 17 requirements" },
  { time: "Yesterday", source: "evidence", text: "CC7.2 evidence collected · 41 events" },
];

/* ---------- Integrations (Settings, Onboarding) ---------- */

export const integrations: { name: string; detail: string; connected: boolean }[] = [
  { name: "GitHub", detail: "acme · 12 repositories", connected: true },
  { name: "AWS", detail: "2 accounts · read-only role", connected: true },
  { name: "Slack", detail: "#sec-alerts", connected: true },
  { name: "Google Cloud", detail: "Infra checks for GCP projects", connected: false },
  { name: "Jira", detail: "Create tickets for failing checks", connected: false },
];

/* ---------- Derived counts (sidebar, headers) ---------- */

export const counts = {
  documents: documents.length,
  checks: codeChecks.length + infraChecks.length,
  tasks: peopleTasks.length,
  controls: soc2Controls.length,
  controlsCollected: soc2Controls.filter((c) => c.status === "collected").length,
};
