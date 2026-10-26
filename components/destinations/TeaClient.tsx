"use client";

/**
 * Interactive pieces of single-teach_english_abroad.php — the behaviour of the
 * theme's assets/js/ti-single-teach-english-abroad.js (script id
 * `single-teach-english-abroad-js-js`, dropped for native pages).
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { raw } from "./html";

// As HTML: React warns on (and later blocks) javascript: URLs.
const MORE = '<a href="javascript:void(0);">Read more <i class="fa fa-angle-down"></i></a>';
const LESS = '<a href="javascript:void(0);">Close <i class="fa fa-angle-up"></i></a>';

type Mode = "idle" | "clamped" | "open" | "closed";

/**
 * A section with the theme's "Read more" / "Close" buttons. With `clampAt`, it
 * is cut to that height on load when taller (the key-facts section: 450px).
 * "Close" re-clamps to 550px and scrolls back to the section, like the theme.
 */
export function ReadMore({
  className,
  id,
  clampAt,
  children,
}: {
  className: string;
  id?: string;
  clampAt?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("idle");

  useEffect(() => {
    const el = ref.current;
    if (clampAt && el && el.offsetHeight > clampAt) setMode("clamped");
  }, [clampAt]);

  const style: CSSProperties | undefined =
    mode === "clamped"
      ? { maxHeight: `${clampAt}px`, overflow: "hidden" }
      : mode === "open"
        ? { maxHeight: "100%" }
        : mode === "closed"
          ? { maxHeight: "550px", overflow: "hidden" }
          : undefined;
  const moreStyle: CSSProperties | undefined =
    mode === "clamped" || mode === "closed" ? { display: "block" } : mode === "open" ? { display: "none" } : undefined;
  const lessStyle: CSSProperties | undefined =
    mode === "open" ? { display: "block" } : mode === "closed" ? { display: "none" } : undefined;

  const close = () => {
    setMode("closed");
    const el = ref.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 50 });
  };

  return (
    <div id={id} className={className} style={style} ref={ref}>
      {children}
      <div className="read-more-btn" style={moreStyle} onClick={() => setMode("open")} {...raw(MORE)} />
      <div className="read-less-btn" style={lessStyle} onClick={close} {...raw(LESS)} />
    </div>
  );
}

/** The FAQ panels: first open; clicking a question opens it and closes the others (no toggle-off). */
export function FaqPanels({ items, children }: { items: { question: string; answer: string }[]; children?: ReactNode }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="panel-group" id="accordion">
      {items.map((faq, i) => {
        const count = i + 1;
        return (
          <div key={count} className="panel panel-default">
            <div className="panel-heading-wrapper" aria-expanded={open === i ? "true" : "false"} onClick={() => setOpen(i)}>
              <div className="panel-side">Q:</div>
              <div className="panel-heading">
                <h4 className="panel-title" data-toggle="collapse" data-target={`#collapse${count}`} {...raw(faq.question)} />
              </div>
            </div>
            <div id={`collapse${count}`} className={`panel-collapse collapse${open === i ? " show" : ""}`}>
              <div className="panel-body panel-extra-space" {...raw(faq.answer)} />
            </div>
          </div>
        );
      })}
      {children}
    </div>
  );
}
