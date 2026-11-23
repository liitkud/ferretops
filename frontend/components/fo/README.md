# components/fo — shared FerretOps UI (owned by the foundation lane)

- Chrome: `Nav` / `Footer` (marketing layout), `AppSidebar` (app layout), `AuthFrame` (auth layout + 404). Active item comes from the URL; pass `active` only to override.
- Page parts: `AppTopBar crumbs={[{label, href?}]}` with actions as children, then `AppPage title description? aside?` (the `<main>`, max-width 80rem). `StatusWord status={...}` or `tone="ok|bad|warn|info|mute"`. `Logo size="nav|footer|app"`.
- Data: import from `@/lib/demo-data` (spec §1 dataset). Do not re-type rows.
- Tailwind token classes: `bg-bg-000/100/200/inset`, `text-ink-100/200/300`, `border-line-100/200`, `bg-fur text-on-fur`, `text-fur-text`, `text-ok|warn|danger|info`, `text-gate|cycle|ledger` (bucket identity only), `font-heading|sans|mono`, `rounded-pill`.
- Hairlines: `border-hair`, `border-b-hair` etc. plus a color (`border-line-100`). Never bare `border` (pixel width).
- Mockup kit classes (app/styles/fo-app.css) port 1:1: `btn btn-p|s|g|d`, `fld` + `inp`, `tbl` + `t`, `tabs` + `tab`, `box`, `note`, `mono`, `mute`, `s-ok|bad|warn|info|mute`, `page`, `sub`, `sec`, `au-col`, `au-card`. DS classes `fo-*` come from fo-bundle.css.
- Units: rem only, no px anywhere (arbitrary values included). Accent (`fur`) only for primary action, inline links, focus.
- Need a change here? Note it in your lane report instead of editing.
