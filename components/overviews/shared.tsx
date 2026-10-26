/**
 * Shared pieces for the overviews family (course overview / listing / shop
 * page templates). The theme templates echo ACF values unescaped, so the
 * endpoints return them as HTML and they're set with dangerouslySetInnerHTML
 * on the element the template prints them in.
 */
import { createElement, Fragment, type ReactNode } from "react";

/** Escape a value for an attribute inside an HTML string built here. */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Every overviews endpoint returns these. */
export interface OverviewsBase {
  ok: true;
  path: string;
  country: string;
  id: number;
  /** WordPress origin, for the template's root-relative asset URLs. */
  origin: string;
}

export interface Faq {
  /** Raw ACF values, as the template json_encode()s them into its FAQPage JSON-LD. */
  q: string;
  a: string;
  /** The same as page HTML. */
  q_html: string;
  a_html: string;
}

type HProps = { as?: string; html: string } & Record<string, unknown>;

/** An element whose content is an HTML string (what the template echoes into it). */
export function H({ as = "div", html, ...rest }: HProps) {
  return createElement(as, { ...rest, dangerouslySetInnerHTML: { __html: html } });
}

/**
 * The templates print `style=""` in places (an inline conditional that came
 * out empty). React drops an empty style prop; the upper-case spelling is the
 * same HTML attribute and keeps the markup identical.
 */
export const EMPTY_STYLE = { STYLE: "" } as Record<string, string>;

/**
 * A run of inline siblings separated by whitespace, as the PHP source prints
 * them (the gap between inline / inline-block items is visible).
 */
export function Spaced({ children }: { children: ReactNode[] }) {
  return (
    <>
      {children.map((c, i) => (
        <Fragment key={i}>
          {" "}
          {c}
        </Fragment>
      ))}{" "}
    </>
  );
}

/** The FAQPage JSON-LD the templates build by hand from json_encode()d values. */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/**
 * An inline <script> of the template itself. Marked like the render marks
 * every executable script, so WpScripts runs it in document order after the
 * theme's scripts are in place (it relies on jQuery, loaded in the footer).
 */
export function DeferredScript({ code }: { code: string }) {
  return <script type="text/tefl-deferred" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: code }} />;
}

/**
 * The "faqs-section" accordion (radio inputs + labels) the overview templates
 * share; the theme's script drives "Show More Faqs" and the active classes.
 */
export function FaqAccordionItems({
  faqs,
  inputType = "radio",
  contentClass = "font-500 faqs-accordion__content",
}: {
  faqs: Faq[];
  inputType?: "radio" | "checkbox";
  contentClass?: string;
}) {
  return (
    <>
      {faqs.map((faq, key) => (
        <div key={key} className={`faqs-accordion__item ${key === 0 ? "active" : ""}`}>
          <input type={inputType} id={`acc-${key}`} name="faq-accordion" defaultChecked={key === 0} hidden />
          <label className="font-700" htmlFor={`acc-${key}`}>
            <H as="span" html={faq.q_html} /> <i className="fa fa-plus" />
          </label>
          <H className={`${contentClass} ${key === 0 ? "active" : ""}`} html={faq.a_html} />
        </div>
      ))}
    </>
  );
}
