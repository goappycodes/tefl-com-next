"use client";

/**
 * The theme's assets/js/ti-job-service.js (script id `ti-job-service-js-js`,
 * dropped on native jobs pages): the "Download Brochure" button opens the
 * Job Hunter's Guide popup (`.hunter_brochure`) and copies the button's
 * data-guide into the form's `selected-guide` field; the ✖ fades it out.
 */
import { useEffect } from "react";

export function HunterBrochure() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const popups = Array.from(document.querySelectorAll<HTMLElement>(".hunter_brochure"));
      if (t.closest(".hunter-button, .hunter-guide-image")) {
        popups.forEach((p) => (p.style.display = "flex"));
        const guide = document.querySelector(".hunter-button")?.getAttribute("data-guide");
        document.querySelectorAll<HTMLInputElement>('input[name="selected-guide"]').forEach((i) => {
          // jQuery .val(undefined) is a getter: leaves the value alone.
          if (guide !== null && guide !== undefined) i.value = guide;
        });
      }
      if (t.closest(".hunter_brochure .cross")) {
        popups.forEach((p) => {
          const from = getComputedStyle(p).opacity || "1";
          p.animate([{ opacity: from }, { opacity: "0.2" }], { duration: 500, easing: "ease", fill: "forwards" });
          // A timer, not onfinish: animations don't advance in a background tab.
          window.setTimeout(() => {
            p.getAnimations().forEach((a) => a.cancel());
            p.style.display = "none";
            p.style.opacity = "1";
          }, 500);
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
