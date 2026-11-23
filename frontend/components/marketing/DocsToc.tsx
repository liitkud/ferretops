"use client";

import { useEffect, useRef, useState } from "react";

export type TocItem = { id: string; label: string };

// "On this page" nav. The current item is the last section whose top passed the upper third of the
// viewport, or the last section once the page bottoms out. A click pins its item until the user scrolls.
export default function DocsToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const pinned = useRef(false);

  useEffect(() => {
    const update = () => {
      if (pinned.current) return;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const passed = items.filter(({ id }) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top <= window.innerHeight * 0.3;
      });
      setActive(atBottom ? items[items.length - 1]?.id : (passed.at(-1)?.id ?? items[0]?.id));
    };
    const unpin = () => {
      pinned.current = false;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    for (const ev of ["wheel", "touchmove", "keydown"]) window.addEventListener(ev, unpin, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      for (const ev of ["wheel", "touchmove", "keydown"]) window.removeEventListener(ev, unpin);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="flex max-w-[13.75rem] flex-[1_1_11.25rem] flex-col gap-0.5 text-[0.8125rem]">
      <span className="px-2 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-300 uppercase">
        On this page
      </span>
      {items.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={() => {
            pinned.current = true;
            setActive(id);
          }}
          aria-current={active === id ? "location" : undefined}
          className="flex min-h-11 items-center rounded-md px-2 text-ink-200 no-underline hover:text-ink-100 aria-[current=location]:bg-bg-200 aria-[current=location]:text-ink-100"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
