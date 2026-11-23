"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

// Upload drop zone (Documents.dc.html #upload). Picking or dropping a file confirms it with an
// "Uploaded · reading" row. The backend is not wired, so nothing is sent anywhere.
export default function UploadDrop() {
  const [name, setName] = useState("");
  const [over, setOver] = useState(false);

  const pick = (files: FileList | null | undefined) => {
    const f = files?.[0];
    if (f) setName(f.name);
  };

  return (
    <>
      <label
        id="upload"
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files);
        }}
        className={`relative flex scroll-mt-8 flex-wrap items-center justify-between gap-4 rounded-[0.75rem] border-hair border-dashed p-6 focus-within:outline-[0.125rem] focus-within:outline-offset-[0.125rem] focus-within:outline-focus focus-within:outline-solid ${
          over ? "border-ink-300 bg-bg-200" : "border-line-200 bg-bg-100"
        }`}
      >
        <span className="flex flex-col gap-1">
          <span className="text-[0.9375rem] font-semibold">Drop a document here</span>
          <span className="mute text-sm">PDF, DOCX or XLSX, up to [N] MB. Scanned PDFs are read with OCR.</span>
        </span>
        <span className="btn btn-s">
          <Upload aria-hidden="true" className="ic" />
          Choose file
        </span>
        <input
          type="file"
          accept=".pdf,.docx,.xlsx"
          onChange={(e) => pick(e.target.files)}
          className="absolute h-[0.0625rem] w-[0.0625rem] opacity-0"
        />
      </label>

      {/* Confirmation row: always-present live region so screen readers hear the pick */}
      <div aria-live="polite" className="empty:hidden">
        {name && (
          <div className="box flex flex-col gap-2.5 px-5 py-4">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-medium break-all">{name}</span>
              <span className="s-info">Uploaded · reading page 1</span>
            </div>
            <div aria-hidden="true" className="h-1 overflow-hidden rounded-pill bg-line-100">
              <span className="block h-full w-[8%] bg-info" />
            </div>
            <span className="mute text-sm">
              You can leave this page. Requirements show up for review when reading finishes.
            </span>
          </div>
        )}
      </div>
    </>
  );
}
