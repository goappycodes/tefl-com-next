/**
 * Pieces shared by the promos templates (sale / campaign landing pages).
 *
 * Raw ACF output: the PHP templates `echo` most fields unescaped, so the
 * endpoints return those values as page-ready HTML and they are rendered with
 * dangerouslySetInnerHTML — byte-for-byte what the theme prints. Values the
 * template prints through esc_html()/esc_attr() arrive as plain text.
 */
import AsyncScript from "./AsyncScript";
import type { TimerData } from "./types";

/** dangerouslySetInnerHTML payload. */
export const ih = (html: string | null | undefined) => ({ __html: html ?? "" });

/** HTML-escape text going into a raw HTML string (esc_html / esc_attr equivalent). */
export function esc(s: string | number | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * An inline <script> the template prints in the content area.
 *
 * `deferred` (jQuery / DOMContentLoaded code): emitted as type="text/tefl-deferred"
 * so WpScripts runs it in document order after the page's libraries, exactly
 * like the passthrough render does. Otherwise (self-contained code: function
 * definitions, listeners for custom events) it is emitted as-is and runs while
 * the HTML is parsed, as on live.
 */
export function InlineScript({ code, deferred = false }: { code: string; deferred?: boolean }) {
  return deferred ? (
    <script type="text/tefl-deferred" dangerouslySetInnerHTML={ih(code)} />
  ) : (
    <script dangerouslySetInnerHTML={ih(code)} />
  );
}

/** Trustpilot's TrustBox bootstrap, as the templates print it before their first widget. */
export function TrustBoxScript() {
  return <AsyncScript src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" />;
}

const DIGITS: [string, string, string, string][] = [
  ["clock-day", "tenday", "day", "Days"],
  ["clock-hour", "tenhour", "hour", "Hours"],
  ["clock-min", "tenmin", "min", "Minutes"],
  ["clock-sec", "tensec", "sec", "Seconds"],
];

/**
 * [tefl_timer_shortcode] (includes/tefl-timer-functions.php): "Offer Ends …",
 * then the clock the theme's ti-timer.js counts down — empty digits while the
 * expiry is ahead, zeros once it has passed. The class carries the render time
 * (`<now>--<expiry>`), as the shortcode prints it.
 */
export function TeflTimer({ t }: { t: TimerData }) {
  const clock = (zero: boolean) => (
    <div className="clock">
      {DIGITS.map(([cls, tens, ones, label]) => (
        <div key={cls} className={cls}>
          <div className="clock-inner">
            <div className={`digit ${tens}`}>
              <span className="base">{zero ? "0" : null}</span>
            </div>
            <div className={`digit ${ones}`}>
              <span className="base">{zero ? "0" : null}</span>
            </div>
          </div>
          <span className="digit-text">{label}</span>
        </div>
      ))}
    </div>
  );
  return (
    <>
      <p className="offer-ends">{`Offer Ends ${t.ends}`}</p>
      {t.paid_internship ? <p className="time-left-txt">Time Left To Save</p> : null}
      {t.exp > t.now ? (
        <div className={`${t.now}--${t.exp} tefl_countdown_timer_new`}>
          <input type="hidden" className="tefl_countdown_timer_value" defaultValue={t.expiry} />
          {clock(false)}
        </div>
      ) : t.exp < t.now ? (
        <div className=" tefl_countdown_timer_new">
          <input type="hidden" className="tefl_countdown_timer_value" defaultValue={t.expiry} />
          {clock(true)}
        </div>
      ) : null}
    </>
  );
}
