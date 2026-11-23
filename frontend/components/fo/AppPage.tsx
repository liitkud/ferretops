// App content column (Overview.dc.html .content): max-width 80rem, page heading block, then sections.
// `aside` sits at the right of the heading (e.g. "4 open" on People tasks).
export default function AppPage({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <main className="flex w-full max-w-[80rem] flex-col gap-8 p-5 md:p-8">
      <div className="page-h">
        <div>
          <h1 className="page">{title}</h1>
          {description && <p className="sub">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </main>
  );
}
