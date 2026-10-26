/**
 * Single screening form — native port of single-screening_form.php: the
 * "Screening Form" CF7 form, then the template's inline jQuery script that
 * fills the questions from ACF and scores the answers (screening-script.ts,
 * generated from the theme file). The script needs jQuery, so like every
 * executable script in the render it is deferred and run by WpScripts in
 * document order. Data from `tefl/v1/native/screening`.
 */
import { screeningScript } from "./screening-script";
import type { ScreeningData } from "./types";
import { h } from "./util";

export default function Screening({ data }: { data: ScreeningData }) {
  return (
    <>
      <div id="primary" className={data.primary_class}>
        <div className="salary-calculator-form" suppressHydrationWarning dangerouslySetInnerHTML={h(data.form)} />
      </div>
      <script type="text/tefl-deferred" suppressHydrationWarning dangerouslySetInnerHTML={h(screeningScript(data))} />
    </>
  );
}
