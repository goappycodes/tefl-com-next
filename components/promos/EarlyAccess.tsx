/**
 * VIP early-access sign-up — native port of the theme's
 * early-access-black-friday-sale-prz.php: the page's own <style>, the logo /
 * title box and its Contact Form 7 form (plugin HTML, driven by CF7's script),
 * then the template's wpcf7mailsent redirect listener.
 */
import { ih, InlineScript } from "./shared";
import type { EarlyAccessData } from "./types";

const CSS = "\n\n#content .ast-container {\n    max-width: 100%;\n    padding: 0 !important;\n}\n\n#primary {\n    height: 50rem;\n}\n\n#content {\n    background-image: url('https://tefl.ie/wp-content/uploads/2024/11/Screenshot-2024-11-12-at-09.15.58.png');\n    background-repeat: no-repeat;\n    background-size: cover;\n}\n\n.page-outer {\n    background: rgba(255, 255, 255, 0.1);\n    backdrop-filter: blur(10px);\n    height: -webkit-fill-available;\n    position: fixed;\n    width: 100%;\n    top: 0;\n    z-index: 1111111;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: auto;\n    padding: 15px;\n}\n\n.box-outer {\n    background: #000;\n    width: 800px;\n    margin: auto;\n    border-radius: 10px;\n    border: 1px solid white;\n    padding: 2rem;\n    color: white;\n    overflow: auto;\n}\n\n.box-outer img {\n    height: 40px;\n    width: auto;\n    margin: auto;\n    display: block;\n}\n\n.box-outer .title {\n    font-size: 34px;\n    line-height: 1.5;\n    font-weight: 600;\n    margin: 15px 0 0px;\n    text-align: center;\n}\n\n.box-outer .title span {\n    color: #EB2F43;\n}\n\n.box-outer .subtitle {\n    font-size: 30px;\n    text-align: center;\n    margin-bottom: 10px;\n}\n\n.wpcf7 form>div {\n    margin-bottom: 0rem;\n}\n\n.wpcf7 form>div {\n    margin-bottom: 0rem;\n}\n\n.form p {\n    margin-bottom: 1rem !important;\n}\n\n.join-txt p {\n    display: flex;\n    font-size: 14px;\n    align-items: center;\n}\n\n.wpcf7 .wpcf7-form-control-wrap {\n    width: auto;\n}\n\n.join-txt .wpcf7-form-control-wrap {\n    margin: 5px;\n}\n\nlabel {\n    display: block;\n    margin-bottom: -20px;\n}\n\n.wpcf7-form-control.wpcf7-submit.has-spinner.btn.ptefl-button {\n    background: #EB2F43;\n    display: block;\n    font-size: 18px;\n    border-radius: 10px;\n    font-weight: 600;\n    height: 50px;\n    width: 200px;\n    margin: 10px auto -50px !important;\n}\n\n.intl-tel-input.allow-dropdown input {\n    padding-left: 52px !important;\n}\n\ninput, select {\n    padding: 8px 12px !important;\n}\n\n";

const SCRIPT = "\n\ndocument.addEventListener('wpcf7mailsent', function(event) {\n    if (event.detail.contactFormId == '91266') {\n        window.location.href = 'https://teflinstitute.com/tefl-january-sale/';\n    }\n}, false);\n   \n";

export default function EarlyAccess({ d }: { d: EarlyAccessData }) {
  return (
    <>
      <style dangerouslySetInnerHTML={ih(CSS)} />

      <div id="primary" className={d.primary_class}>
        <div className="page-outer">
          <div className="box-outer">
            <img src="https://teflinstitute.com/wp-content/uploads/2024/11/site-logo-white.svg" className="logo" />
            <div className="title">
              <span>VIP Early Access</span> our January Sales
            </div>
            <div className="subtitle">Includes 4 Free Gifts!</div>

            <div className="form" dangerouslySetInnerHTML={ih(d.form)} />
          </div>
        </div>
      </div>

      {/* Self-contained (a listener for CF7's own event), so it runs at parse time as on live. */}
      <InlineScript code={SCRIPT} />
    </>
  );
}
