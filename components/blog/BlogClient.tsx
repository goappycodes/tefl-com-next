"use client";

/**
 * The blog template's interactive pieces — the behaviour of the theme's
 * assets/js/ti-single-post-redesign.js, which WpShell drops for native posts.
 */
import { useEffect, useRef, useState } from "react";

import Icon from "./Icon";

/** Reading progress bar (width follows the scroll position). */
export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const onScroll = () => {
      const se = document.scrollingElement || document.documentElement;
      const max = se.scrollHeight - se.clientHeight;
      const p = max > 0 ? se.scrollTop / max : 0;
      bar.style.width = `${Math.max(0, Math.min(1, p)) * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="tibr-progress" id="tibrProgress" aria-hidden="true" ref={ref} />;
}

const TICKER = [
  { place: "Spain", fig: "€800–€1,000", cap: "a month · language assistant" },
  { place: "Thailand", fig: "Up to US$1,200", cap: "a month · TEFL internship" },
  { place: "Online", fig: "US$10.20", cap: "an hour · Cambly published rate" },
  { place: "Germany", fig: "€75", cap: "a week · summer placement" },
];

/** Salary ticker on the salary tool card — rotates every 2.4 s (not with reduced motion). */
export function SalaryTicker() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setOn((i) => (i + 1) % TICKER.length), 2400);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="tibr-ticker" data-tibr-ticker="">
      {TICKER.map((item, i) => (
        <div key={item.place} className={`tibr-ticker__item${i === on ? " is-on" : ""}`}>
          <span className="tibr-ticker__place">{item.place}</span>
          <span className="tibr-ticker__fig">{item.fig}</span>
          <span className="tibr-ticker__cap">{item.cap}</span>
        </div>
      ))}
    </div>
  );
}

export interface Faq {
  question: string;
  answer_html: string;
}

/** FAQ accordion — first open, one open at a time. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      {faqs.map((faq, n) => {
        const isOpen = open === n;
        return (
          <div key={n} className={`tibr-faq${isOpen ? " is-open" : ""}`}>
            <button
              className="tibr-faq__q"
              type="button"
              aria-expanded={isOpen ? "true" : "false"}
              onClick={() => setOpen(isOpen ? null : n)}
            >
              <span className="tibr-faq__num">{String(n + 1).padStart(2, "0")}</span>
              <span className="tibr-faq__t">{faq.question}</span>
              <span className="tibr-faq__sign" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div className="tibr-faq__a" dangerouslySetInnerHTML={{ __html: faq.answer_html }} />
          </div>
        );
      })}
    </>
  );
}

/** Author bio with "Read full bio" — the toggle only shows when the bio is clamped. */
export function AuthorBio({ bio }: { bio: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(true);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && el.scrollHeight <= el.clientHeight + 2) setClamped(false);
  }, []);
  return (
    <>
      <p className={`tibr-author__bio${expanded ? " is-expanded" : ""}`} id="tibrAuthorBio" ref={ref}>
        {bio}
      </p>
      <button
        type="button"
        className="tibr-author__readmore"
        aria-expanded={expanded ? "true" : "false"}
        aria-controls="tibrAuthorBio"
        style={clamped ? undefined : { display: "none" }}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show less" : "Read full bio"}
      </button>
    </>
  );
}

/** "Copy link" share button. */
export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url || location.href).then(done, done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = url || location.href;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
      done();
    }
  };
  return (
    <a
      href="#"
      className={`tibr-copy${copied ? " is-copied" : ""}`}
      data-url={url}
      aria-label={copied ? "Link copied" : "Copy link"}
      onClick={onClick}
    >
      <Icon name="link" size={18} />
    </a>
  );
}

/**
 * GA4 events through the GTM dataLayer, as the theme script pushes them:
 * blog_tool_click, blog_promo_click, blog_cta_click, blog_podcast_click,
 * blog_hirewire_submit, blog_share_click.
 */
export function BlogAnalytics() {
  useEffect(() => {
    const root = document.querySelector(".ti-blog-redesign");
    if (!root) return;
    const pid = root.getAttribute("data-post-id") || "";
    const ptitle = root.getAttribute("data-post-title") || "";
    const push = (event: string, extra?: Record<string, string>) => {
      try {
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event, post_id: pid, post_title: ptitle, ...extra });
      } catch {
        /* ignore */
      }
    };
    const onClick = (e: Event) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const card = t.closest(".tibr-card");
      if (card) push("blog_tool_click", { tool: (card.className.match(/tibr-card--(\w+)/) || [])[1] || "unknown" });
      if (t.closest(".tibr-promo")) push("blog_promo_click");
      if (t.closest(".tibr-cta-wrap a")) push("blog_cta_click");
      if (t.closest(".tibr-podcast")) push("blog_podcast_click");
      const share = t.closest(".tibr-share a");
      if (share) push("blog_share_click", { network: (share.getAttribute("aria-label") || "").replace(/^Share on /, "") || "copy-link" });
    };
    const onSubmit = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(".tibr-wire__form")) push("blog_hirewire_submit");
    };
    root.addEventListener("click", onClick);
    root.addEventListener("submit", onSubmit);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("submit", onSubmit);
    };
  }, []);
  return null;
}
