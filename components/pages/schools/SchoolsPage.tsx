/**
 * "TEFL for Schools v3" — native port of ti-tefl-for-schools-v3.php.
 *
 * The page is one #tfs2 element driven by the theme's tefl-for-schools script
 * (cost calculator, carousels, planner, quiz — all bound to these classes and
 * data attributes, so it keeps working unchanged). Its contents follow the
 * template line by line as an HTML string: text values arrive from
 * native/ti-tefl-for-schools-v3.php already escaped the way the template
 * escapes them; attributes are escaped here (`a()`).
 */
import { html } from "../attrs";

import { icon } from "./icons";

type Esc = string;

interface PlannerOption {
  id: string;
  label: string;
  sub?: string;
}

export interface SchoolsPageData {
  ok: true;
  path: string;
  country: string;
  pid: number;
  variant: "form" | "image";
  to_form: string;
  t: Record<string, Esc>;
  urls: {
    permalink: string;
    staff: string;
    students: string;
    enroll: string;
    booking: string;
    booking_raw: string;
    buy: string;
    brochure: string;
    privacy: string;
    us: string;
    us_book: string;
  };
  hero_img: string;
  form_html: string;
  proof: { img: string; caption: Esc; name: Esc }[];
  proof_label: string;
  quotes: { logo: string; quote: Esc; name: Esc; role: Esc }[];
  quotes_label: string;
  slots: Record<"outcomes" | "cost" | "why" | "planner" | "routes" | "taster" | "faq", string>;
  outcomes: { icon: string; title: Esc; text: Esc }[];
  stats: { icon: string; number: Esc; label: Esc }[];
  trust: { icon: string; text: Esc }[];
  why_cards: { title: Esc; text: Esc }[];
  modules: { title: Esc; text: Esc }[];
  steps: { title: Esc; text: Esc }[];
  faqs: { question: Esc; answer: Esc }[];
  guides: { url: string; title: Esc; text: Esc }[];
  cost: {
    n0: number;
    tiers: { range: string; price: Esc }[];
    tier_ix: number;
    bespoke: number;
    per_student: Esc;
    per_student_gbp: Esc;
    tier_name: Esc;
    total: Esc;
    per_hour: Esc;
    saving: Esc;
  };
  chloe: { img: string; name: Esc; name_attr: string; role: Esc };
  note_body: string;
  planner: { years: PlannerOption[]; slots: PlannerOption[]; starts: PlannerOption[] };
}

/** An attribute value (escaped). */
const a = (s: string | number) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** esc_html for template literals. */
const e = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const pad2 = (n: number) => String(n).padStart(2, "0");
const split = (slot: string, head: string) => `<div class="tfs2-split${slot ? " has-media" : ""}">${head}${slot}</div>`;
const checked = (on: boolean) => (on ? " checked='checked'" : "");

const carCtrl = (prev: string, next: string) =>
  `<div class="tfs2-car__ctrl"><div class="tfs2-car__dots" data-tfs2-carousel-dots></div><div class="tfs2-car__arrows">` +
  `<button type="button" class="tfs2-car__arrow tfs2-car__pause" data-tfs2-carousel-pause aria-label="Pause slideshow">${icon("pause", 16, "tfs2-ic--pause")}${icon("play", 16, "tfs2-ic--play")}</button>` +
  `<button type="button" class="tfs2-car__arrow" data-tfs2-carousel-prev aria-label="${prev}">${icon("chevron-left", 18)}</button>` +
  `<button type="button" class="tfs2-car__arrow" data-tfs2-carousel-next aria-label="${next}">${icon("chevron-right", 18)}</button>` +
  `</div></div>`;

const JUMPS: [string, string][] = [
  ["outcomes", "What students finish with"],
  ["cost", "What it costs per student"],
  ["why", "Why schools choose it"],
  ["quote", "Get a quote"],
  ["planner", "Will it fit your timetable"],
  ["routes", "Where it could take students"],
  ["taster", "Try the course"],
  ["faq", "What schools ask us first"],
];

const ROUTE_QS: [string, string, string, string[]][] = [
  ["when", "When are you thinking about", "", ["While I am still at school", "A gap year before university", "After my degree"]],
  ["want", "What matters most to you", "pick one", ["Earning something", "Getting somewhere far away", "Something serious on the CV", "Working with people, not a screen"]],
  ["struct", "How much structure do you want", "", ["A programme that organises it for me", "I would rather sort it myself"]],
];

const PROGRESS: [string, number, number][] = [
  ["Amira K.", 42, 5],
  ["Ben T.", 30, 4],
  ["Freya M.", 64, 7],
  ["Dan O.", 18, 2],
];

function render(d: SchoolsPageData): string {
  const { t, urls: u, cost: c, chloe } = d;
  const n0 = c.n0;
  const out: string[] = [];
  const push = (s: string) => out.push(s);

  // SUB NAVIGATION
  push(
    `<nav class="tfs2-subnav" aria-label="TEFL for Schools"><div class="tfs2-subnav__in">` +
      `<a class="tfs2-subnav__tab is-current" href="${a(u.permalink)}" aria-current="page">Overview</a>` +
      `<a class="tfs2-subnav__tab" href="${a(u.staff)}">For staff</a>` +
      `<a class="tfs2-subnav__tab" href="${a(u.students)}">For students</a>` +
      `<div class="tfs2-jump"><button type="button" class="tfs2-jump__btn" aria-expanded="false" aria-controls="tfs2-jump-menu">Jump to ${icon("chevron-down", 16)}</button>` +
      `<div class="tfs2-jump__menu" id="tfs2-jump-menu" hidden>` +
      JUMPS.map(([id, label], i) => `<a class="tfs2-jump__item" href="#${a(id)}"><span class="tfs2-jump__n">${pad2(i + 1)}</span>${e(label)}</a>`).join("") +
      `<a class="tfs2-jump__item tfs2-jump__item--mobile" href="${a(u.staff)}">For staff</a>` +
      `<a class="tfs2-jump__item tfs2-jump__item--mobile" href="${a(u.students)}">For students</a>` +
      `</div></div>` +
      `<div class="tfs2-subnav__ctas"><a class="tfs2-btn tfs2-btn--outline tfs2-btn--sm" href="${a(u.enroll)}">${t.enroll_label}</a>` +
      `<a class="tfs2-btn tfs2-btn--navy tfs2-btn--sm" href="${a(d.to_form)}">Request a quote</a></div>` +
      `</div></nav>`,
  );

  // HERO
  let hero =
    `<section class="tfs2-hero tfs2-hero--${a(d.variant)}"><div class="tfs2-wrap tfs2-hero__grid"><div class="tfs2-hero__copy">` +
    `<p class="tfs2-eyebrow tfs2-eyebrow--wide">${t.hero_eyebrow}</p><h1 class="tfs2-hero__title">${t.hero_title}</h1><p class="tfs2-hero__lede">${t.hero_lede}</p>`;
  hero +=
    d.variant === "image"
      ? `<div class="tfs2-row"><a class="tfs2-btn tfs2-btn--green" href="#planner">Plan it into your timetable</a><a class="tfs2-btn tfs2-btn--ghost" href="#outcomes">See where it takes students</a></div>`
      : `<p class="tfs2-hero__talk"><span>${t.hero_talk_text}</span> <a class="tfs2-textlink" href="${a(u.booking)}" data-dlopo-embed="true" data-dlopo-url="${a(u.booking_raw)}">${t.hero_talk_label}</a></p>`;
  hero += `<p class="tfs2-hero__meta">${t.hero_meta}</p></div>`;
  hero +=
    d.variant === "image"
      ? `<div class="tfs2-hero__media">${d.hero_img}</div>`
      : `<div class="tfs2-hero__form" id="letsTalkTEFL"><h2 class="tfs2-hero__form-title">${t.hero_form_title}</h2><p class="tfs2-hero__form-intro">${t.hero_form_intro}</p>` +
        `<div class="tfs2-cf7">${d.form_html}</div><p class="tfs2-small tfs2-muted">${t.hero_form_note}</p>` +
        `<p class="tfs2-hero__buy">${t.hero_buy_text} <a href="${a(u.buy)}">${t.hero_buy_label}</a></p></div>`;
  if (d.proof.length) {
    hero +=
      `<div class="tfs2-proof" data-tfs2-carousel data-interval="6000" role="region" aria-roledescription="carousel" aria-label="${a(d.proof_label)}"><div class="tfs2-proof__track" data-tfs2-carousel-track>` +
      d.proof
        .map(
          (s, si) =>
            `<figure class="tfs2-proof__slide" data-tfs2-slide role="group" aria-roledescription="slide" aria-label="${a(`${si + 1} of ${d.proof.length}`)}">${s.img}` +
            (s.caption || s.name
              ? `<figcaption class="tfs2-proof__cap">${s.caption ? `<span class="tfs2-proof__q">${s.caption}</span>` : ""}${s.name ? `<span class="tfs2-proof__who">${s.name}</span>` : ""}</figcaption>`
              : "") +
            `</figure>`,
        )
        .join("") +
      `</div>${d.proof.length > 1 ? carCtrl("Previous slide", "Next slide") : ""}</div>`;
  }
  hero += `</div></section>`;
  push(hero);

  // TESTIMONIAL CAROUSEL
  if (d.quotes.length) {
    push(
      `<section class="tfs2-voices" aria-label="${a(d.quotes_label)}"><div class="tfs2-wrap"><div class="tfs2-voices__in" data-tfs2-carousel data-interval="7000" role="region" aria-roledescription="carousel" aria-label="${a(d.quotes_label)}">` +
        `<div class="tfs2-voices__head"><div><p class="tfs2-eyebrow">${t.quotes_eyebrow}</p><h2 class="tfs2-h3 tfs2-h3--serif tfs2-h3--lg">${t.quotes_title}</h2></div>` +
        `${d.quotes.length > 1 ? carCtrl("Previous testimonials", "Next testimonials") : ""}</div>` +
        `<div class="tfs2-voices__track" data-tfs2-carousel-track>` +
        d.quotes
          .map(
            (q, qi) =>
              `<figure class="tfs2-testi${q.logo ? "" : " tfs2-testi--nologo"}" data-tfs2-slide role="group" aria-roledescription="slide" aria-label="${a(`${qi + 1} of ${d.quotes.length}`)}">` +
              `${q.logo ? `<div class="tfs2-testi__media">${q.logo}</div>` : ""}` +
              `<div class="tfs2-testi__body"><blockquote><p>“${q.quote}”</p></blockquote><figcaption>&mdash; ${q.name}${q.role ? `, ${q.role}` : ""}</figcaption></div></figure>`,
          )
          .join("") +
        `</div></div></div></section>`,
    );
  }

  // 1. OUTCOMES
  push(
    `<section class="tfs2-sec tfs2-sec--white" id="outcomes"><div class="tfs2-wrap">` +
      split(d.slots.outcomes, `<div class="tfs2-head"><p class="tfs2-eyebrow">${t.outcomes_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.outcomes_title}</h2><p class="tfs2-intro">${t.outcomes_intro}</p></div>`) +
      `<ul class="tfs2-outcomes">` +
      d.outcomes.map((o) => `<li class="tfs2-outcome"><span class="tfs2-outcome__ic">${icon(o.icon, 20)}</span><span><strong>${o.title}</strong><span>${o.text}</span></span></li>`).join("") +
      `</ul><div class="tfs2-stats" role="group" aria-label="The course in numbers"><div class="tfs2-stats__grid">` +
      d.stats
        .map(
          (s) =>
            `<div class="tfs2-stat"><span class="tfs2-stat__ic">${icon(s.icon, 20)}</span><span class="tfs2-stat__txt"><span class="tfs2-stat__n">${s.number}</span><span class="tfs2-stat__l">${s.label}</span></span></div>`,
        )
        .join("") +
      `</div><ul class="tfs2-trust">` +
      d.trust.map((x) => `<li>${icon(x.icon, 18)}<span>${x.text}</span></li>`).join("") +
      `</ul></div></div></section>`,
  );

  // 2. COST
  push(
    `<section class="tfs2-sec tfs2-sec--ivory" id="cost"><div class="tfs2-wrap">` +
      split(d.slots.cost, `<div class="tfs2-head"><p class="tfs2-eyebrow">${t.cost_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.cost_title}</h2><p class="tfs2-intro">${t.cost_intro}</p></div>`) +
      `<div class="tfs2-calc"><div class="tfs2-calc__in"><div><h3 class="tfs2-h3 tfs2-h3--serif">${t.cost_card_title}</h3><p class="tfs2-small tfs2-muted">${t.cost_card_text}</p></div>` +
      `<div class="tfs2-range"><label class="tfs2-range__top" for="tfs2-n"><span>How many students</span><output class="tfs2-range__val" data-bind="n" for="tfs2-n">${n0}</output></label>` +
      `<input type="range" id="tfs2-n" min="5" max="60" step="1" value="${n0}" data-tfs2-n><div class="tfs2-range__ends" aria-hidden="true"><span>5</span><span>60</span></div></div>` +
      `<fieldset class="tfs2-cur"><legend>Show it in</legend><div class="tfs2-cur__pills">` +
      (
        [
          ["GBP", "£"],
          ["EUR", "€"],
          ["USD", "$"],
        ] as const
      )
        .map(([code, sym]) => `<label class="tfs2-cur__p"><input type="radio" name="tfs2-cur" value="${code}"${checked(code === "GBP")}><span>${e(`${code} ${sym}`)}</span></label>`)
        .join("") +
      `</div><span class="tfs2-cur__note" data-bind="curNote">we invoice in pounds sterling</span></fieldset>` +
      `<div class="tfs2-tiers" data-tfs2-tiers>` +
      c.tiers.map((x, i) => `<div class="tfs2-tiers__row${i === c.tier_ix ? " is-on" : ""}"><span>${x.range} students</span><span>${x.price} each</span></div>`).join("") +
      `<div class="tfs2-tiers__row"><span>${c.bespoke} or more students</span><span>Talk to Chloe</span></div></div></div>` +
      `<div class="tfs2-calc__out" aria-live="polite"><p class="tfs2-label tfs2-label--onink">Your cohort</p>` +
      `<p class="tfs2-calc__big"><span data-bind="perStudent">${c.per_student}</span> <span class="tfs2-calc__unit" data-bind="perLabel">per student</span></p>` +
      `<p class="tfs2-calc__tier" data-bind="tierName">${c.tier_name}</p>` +
      `<dl class="tfs2-calc__rows" data-tfs2-costrows><div><dt>Students</dt><dd>${n0}</dd></div><div><dt>Total for the group</dt><dd>${c.total}</dd></div>` +
      `<div><dt>Cost per guided learning hour</dt><dd>${c.per_hour}</dd></div><div><dt>Against the smallest cohort rate</dt><dd>${c.saving}</dd></div></dl>` +
      `<p class="tfs2-calc__next" data-bind="nextTier">&nbsp;</p><p class="tfs2-calc__vat">${t.vat_note}</p>` +
      `<a class="tfs2-btn tfs2-btn--white tfs2-btn--block" href="${a(d.to_form)}">Put this in writing</a></div></div></div></section>`,
  );

  // 3. WHY
  push(
    `<section class="tfs2-sec tfs2-sec--white" id="why"><div class="tfs2-wrap">` +
      split(d.slots.why, `<div class="tfs2-head"><span class="tfs2-rule" aria-hidden="true"></span><h2 class="tfs2-h2 tfs2-h2--lg tfs2-h2--narrow">${t.why_title}</h2></div>`) +
      `<div class="tfs2-cards3">` +
      d.why_cards.map((w) => `<div class="tfs2-card"><h3 class="tfs2-h3">${w.title}</h3><p>${w.text}</p></div>`).join("") +
      `</div><div class="tfs2-row tfs2-row--after"><a class="tfs2-btn tfs2-btn--green" href="#planner">Plan it into your timetable</a><a class="tfs2-btn tfs2-btn--ghost" href="#cost">See what it costs per student</a></div></div></section>`,
  );

  // 4. MODULES
  push(
    `<section class="tfs2-prog" id="programme" data-tfs2-prog><div class="tfs2-prog__pin"><div class="tfs2-wrap tfs2-prog__head">` +
      `<div><p class="tfs2-eyebrow tfs2-eyebrow--onink">${t.programme_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.programme_title}</h2><p class="tfs2-intro tfs2-intro--onink">${t.programme_intro}</p></div>` +
      `<div class="tfs2-prog__count" aria-hidden="true"><p><span class="tfs2-prog__num" data-tfs2-modnum>01</span> <span>of ${d.modules.length}</span></p><div class="tfs2-prog__bar"><span data-tfs2-modbar></span></div></div></div>` +
      `<ol class="tfs2-prog__track" data-tfs2-track>` +
      d.modules
        .map(
          (m, mi) =>
            `<li class="tfs2-mod${mi === 0 ? " is-on" : ""}"><span class="tfs2-mod__n">${pad2(mi + 1)}</span><span class="tfs2-mod__t">${m.title}</span>` +
            `${m.text ? `<span class="tfs2-mod__d">${m.text}</span>` : ""}<span class="tfs2-mod__foot">${icon("check", 16)}Ends in a quiz they can retake</span></li>`,
        )
        .join("") +
      `<li class="tfs2-mod tfs2-mod--end"><span class="tfs2-mod__t tfs2-mod__t--end">${t.programme_end}</span>` +
      `<a class="tfs2-btn tfs2-btn--white tfs2-btn--block" href="#outcomes">${t.programme_receive}</a>` +
      `<a class="tfs2-btn tfs2-btn--onink tfs2-btn--block" href="${a(u.brochure)}">${t.brochure_label}</a></li></ol></div></section>`,
  );

  // 5. STAFF OR STUDENT
  const door = (kind: "staff" | "student", href: string) =>
    `<a class="tfs2-door tfs2-door--${kind}" href="${a(href)}"><span class="tfs2-label">${t[`door_${kind}_eyebrow`]}</span><span class="tfs2-door__title">${t[`door_${kind}_title`]}</span>` +
    `<span class="tfs2-door__text">${t[`door_${kind}_text`]}</span><span class="tfs2-door__go">${t[`door_${kind}_link`]} ${icon("arrow-right", 16)}</span></a>`;
  push(
    `<section class="tfs2-who" id="who"><div class="tfs2-wrap"><span class="tfs2-rule" aria-hidden="true"></span><h2 class="tfs2-h2">${t.who_title}</h2>` +
      `<div class="tfs2-doors">${door("staff", u.staff)}${door("student", u.students)}</div></div></section>`,
  );

  // 6. HOW IT WORKS + QUOTE
  const nSpan = `<span data-bind="n">${n0}</span>`;
  push(
    `<section class="tfs2-sec tfs2-sec--ivory tfs2-sec--how"><div class="tfs2-wrap"><div class="tfs2-story" data-tfs2-story><div class="tfs2-story__steps">` +
      `<div class="tfs2-head tfs2-head--tight"><p class="tfs2-eyebrow">${t.steps_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.steps_title}</h2><p class="tfs2-intro">${t.steps_intro}</p></div>` +
      `<ol class="tfs2-story__list">` +
      d.steps
        .map(
          (st, si) =>
            `<li class="tfs2-step${si === 0 ? " is-on is-done" : ""}" data-step="${si}"><span class="tfs2-step__n" aria-hidden="true">${si + 1}</span>` +
            `<div><h3 class="tfs2-step__t">${st.title}</h3><p class="tfs2-step__d">${st.text}</p></div></li>`,
        )
        .join("") +
      `</ol></div><div class="tfs2-story__visual" aria-hidden="true"><div class="tfs2-story__panel">` +
      `<div class="tfs2-story__top"><span class="tfs2-label tfs2-label--onink" data-bind="stepLabel">Step 1 of ${d.steps.length}</span><span class="tfs2-story__dots">` +
      d.steps.map((_, si) => `<i class="${si === 0 ? "is-on" : ""}"></i>`).join("") +
      `</span></div>` +
      `<div class="tfs2-layer is-on" data-layer="0"><div class="tfs2-mock"><div class="tfs2-mock__head"><img src="${a(chloe.img)}" alt="" width="36" height="36" loading="lazy"><div><strong>${chloe.name}, The TEFL Institute</strong><span>Your written quote</span></div></div>` +
      `<dl class="tfs2-mock__rows"><div><dt>Students</dt><dd data-bind="n">${n0}</dd></div><div><dt>Year group</dt><dd data-bind="yearLabel">Year 12</dd></div><div><dt>Start date</dt><dd data-bind="startLabel">September</dd></div>` +
      `<div><dt>Per student</dt><dd data-bind="perStudent">${c.per_student_gbp}</dd></div><div><dt>Total for the group</dt><dd data-bind="total" class="is-strong">${c.total}</dd></div></dl></div></div>` +
      `<div class="tfs2-layer" data-layer="1"><div class="tfs2-mock"><div class="tfs2-mock__head tfs2-mock__head--lg"><img src="${a(chloe.img)}" alt="" width="52" height="52" loading="lazy"><div><strong class="tfs2-serif">Call with ${chloe.name}</strong><span>${chloe.role}</span></div></div>` +
      `<ul class="tfs2-mock__ticks"><li>${icon("check", 14)}Cohort size</li><li>${icon("check", 14)}Timetable</li><li>${icon("check", 14)}Who is administering it at your end</li></ul></div></div>` +
      `<div class="tfs2-layer" data-layer="2"><div class="tfs2-mock tfs2-mock--center"><div class="tfs2-mock__code"><span class="tfs2-label tfs2-label--grey">Your school code</span><span class="tfs2-mock__codebox">SIXTH-${nSpan}</span>` +
      `<span class="tfs2-small tfs2-muted">Students enrol themselves online using the school code.</span></div><div class="tfs2-mock__foot"><span>Students enrolled</span><strong>0 of ${nSpan}</strong></div></div></div>` +
      `<div class="tfs2-layer" data-layer="3"><div class="tfs2-mock"><div class="tfs2-mock__title"><strong class="tfs2-serif">Cohort progress</strong><span>${nSpan} students</span></div><div class="tfs2-mock__prog">` +
      PROGRESS.map(([who, pct, mod]) => `<div><strong>${e(who)}</strong><span class="tfs2-mock__track"><i style="width:${pct}%"></i></span><span>Module ${mod} of 10</span></div>`).join("") +
      `</div></div></div></div></div></div>` +
      `<div class="tfs2-quotecta" id="quote"><div><span class="tfs2-rule" aria-hidden="true"></span><h2 class="tfs2-h2">${t.quote_title}</h2><p class="tfs2-intro">${t.quote_text}</p></div>` +
      `<div class="tfs2-contact"><div class="tfs2-contact__who"><img src="${a(chloe.img)}" alt="${a(chloe.name_attr)}" width="56" height="56" loading="lazy"><div><strong>${chloe.name}</strong><span>${chloe.role}</span></div></div>` +
      `<p class="tfs2-onink-muted">${t.quote_reply}</p><a class="tfs2-btn tfs2-btn--white tfs2-btn--block" href="${a(d.to_form)}">${t.quote_button}</a></div></div></div></section>`,
  );

  // 7. PLANNER GATE
  push(
    `<section class="tfs2-sec tfs2-sec--white" id="planner"><div class="tfs2-wrap">` +
      split(d.slots.planner, `<div class="tfs2-head"><p class="tfs2-eyebrow">${t.planner_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.planner_title}</h2><p class="tfs2-intro">${t.planner_intro}</p></div>`) +
      `<div class="tfs2-gate"><div><h3 class="tfs2-h3 tfs2-h3--serif">${t.planner_card_title}</h3><p class="tfs2-muted">${t.planner_card_text}</p></div>` +
      `<form class="tfs2-gate__form" data-tfs2-gate novalidate><div class="tfs2-gate__fields">` +
      `<label class="tfs2-field"><span>Name</span><input type="text" name="name" autocomplete="name" placeholder="Your name" required></label>` +
      `<label class="tfs2-field"><span>School email</span><input type="email" name="email" autocomplete="email" placeholder="name@school.org.uk" required></label></div>` +
      `<label class="tfs2-hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>` +
      `<p class="tfs2-error" role="alert" data-tfs2-gate-error hidden></p>` +
      `<div class="tfs2-row tfs2-row--center"><button type="submit" class="tfs2-btn tfs2-btn--green">Open the planner</button><span class="tfs2-small tfs2-muted">${t.planner_privacy}</span></div>` +
      `</form></div></div></section>`,
  );

  // 8. PERIOD SIX
  push(
    `<section class="tfs2-p6" id="periodsix"><div class="tfs2-wrap tfs2-p6__grid">` +
      `<div><p class="tfs2-label tfs2-label--onink">${t.p6_eyebrow}</p><h2 class="tfs2-h3 tfs2-h3--serif tfs2-h3--lg">${t.p6_title}</h2><p class="tfs2-onink-muted">${t.p6_text}</p></div>` +
      `<div><form class="tfs2-p6__form" data-tfs2-p6 novalidate><label class="tfs2-sr" for="tfs2-p6-name">First name</label>` +
      `<input id="tfs2-p6-name" type="text" name="name" placeholder="First name" autocomplete="given-name" required>` +
      `<label class="tfs2-sr" for="tfs2-p6-email">School email</label><input id="tfs2-p6-email" type="email" name="email" placeholder="School email" autocomplete="email" required>` +
      `<button type="submit" class="tfs2-btn tfs2-btn--green">${t.p6_button}</button></form>` +
      `<p class="tfs2-p6__msg" role="status" data-tfs2-p6-msg></p><p class="tfs2-p6__fine">${t.p6_fine} <a href="${a(u.privacy)}">Privacy policy</a>.</p></div></div></section>`,
  );

  // 9. ROUTES
  push(
    `<section class="tfs2-sec tfs2-sec--white" id="routes"><div class="tfs2-wrap">` +
      split(d.slots.routes, `<div class="tfs2-head"><p class="tfs2-eyebrow">${t.routes_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.routes_title}</h2><p class="tfs2-intro">${t.routes_intro}</p></div>`) +
      `<div class="tfs2-tool tfs2-tool--ivory"><div class="tfs2-tool__head"><h3 class="tfs2-h3 tfs2-h3--serif">${t.routes_card_title}</h3><p class="tfs2-small tfs2-muted">${t.routes_card_text}</p></div>` +
      `<form class="tfs2-tool__body" data-tfs2-routes>` +
      ROUTE_QS.map(
        ([key, title, hint, opts], qi) =>
          `<fieldset class="tfs2-q"><legend class="tfs2-q__label"><span class="tfs2-q__num">${e(`0${qi + 1}`)}</span><span class="tfs2-q__title">${e(title)}</span>${hint ? `<span class="tfs2-q__hint">${e(hint)}</span>` : ""}</legend>` +
          `<div class="tfs2-chips">` +
          opts.map((label, oi) => `<label class="tfs2-chip tfs2-chip--green"><input type="radio" name="${a(key)}" value="${oi}"${checked(oi === 0)}><span>${e(label)}</span></label>`).join("") +
          `</div></fieldset>`,
      ).join("") +
      `<button type="submit" class="tfs2-btn tfs2-btn--green tfs2-self-start">Show me the routes</button><div class="tfs2-matches" data-tfs2-matches aria-live="polite" hidden></div></form></div></div></section>`,
  );

  // TASTER
  push(
    `<section class="tfs2-sec tfs2-sec--ivory" id="taster"><div class="tfs2-wrap tfs2-taster"><div class="tfs2-taster__intro">` +
      `<p class="tfs2-eyebrow">${t.taster_eyebrow}</p><h2 class="tfs2-h2 tfs2-h2--lg">${t.taster_title}</h2><p class="tfs2-intro">${t.taster_intro}</p>${d.slots.taster}</div>` +
      `<div class="tfs2-tool"><div class="tfs2-tool__head"><h3 class="tfs2-h3 tfs2-h3--serif tfs2-h3--sm">${t.taster_card_title}</h3><p class="tfs2-small tfs2-muted">${t.taster_card_text}</p></div>` +
      `<div class="tfs2-tool__body"><div class="tfs2-quiz" data-tfs2-quiz aria-live="polite"><noscript><p class="tfs2-muted">The taster needs JavaScript switched on.</p></noscript></div></div></div></div></section>`,
  );

  // 10. FAQ
  push(
    `<section class="tfs2-sec tfs2-sec--white" id="faq"><div class="tfs2-wrap tfs2-faq"><div><span class="tfs2-rule" aria-hidden="true"></span><h2 class="tfs2-h2 tfs2-h2--lg">${t.faq_title}</h2>${d.slots.faq}</div>` +
      `<div class="tfs2-faq__list">` +
      d.faqs
        .map((f, fi) => {
          const open = fi === 0;
          return (
            `<div class="tfs2-faq__item"><h3 class="tfs2-faq__q"><button type="button" class="tfs2-faq__btn" aria-expanded="${open ? "true" : "false"}" aria-controls="tfs2-faq-${fi}">` +
            `<span>${f.question}</span>${icon("chevron-down", 20)}</button></h3>` +
            `<div class="tfs2-faq__a" id="tfs2-faq-${fi}"${open ? "" : " hidden"}><p>${f.answer}</p></div></div>`
          );
        })
        .join("") +
      `</div></div></section>`,
  );

  // 11. US SCHOOLS
  push(
    `<section class="tfs2-sec tfs2-sec--white tfs2-sec--us"><div class="tfs2-wrap"><div class="tfs2-us">` +
      `<div><p class="tfs2-label">${t.us_eyebrow}</p><h2 class="tfs2-h3 tfs2-h3--serif tfs2-h3--lg">${t.us_title}</h2><p class="tfs2-muted">${t.us_text}</p></div>` +
      `<a class="tfs2-btn tfs2-btn--green" href="${a(u.us)}"${u.us_book ? ` data-dlopo-embed="true" data-dlopo-url="${a(u.us_book)}"` : ""}>${t.us_label}</a></div></div></section>`,
  );

  // 12. NOTE FROM CHLOE
  push(
    `<section class="tfs2-sec tfs2-sec--white tfs2-note-sec" id="chloe"><div class="tfs2-wrap"><div class="tfs2-note"><div class="tfs2-note__side">` +
      `<img class="tfs2-note__pic" src="${a(chloe.img)}" alt="${a(chloe.name_attr)}" width="230" height="230" loading="lazy">` +
      `<div class="tfs2-note__who"><strong>${chloe.name}</strong><span>${chloe.role}</span></div>` +
      `<a class="tfs2-btn tfs2-btn--green tfs2-btn--sm" href="${a(u.booking)}" data-dlopo-embed="true" data-dlopo-url="${a(u.booking_raw)}">Book a Call</a></div>` +
      `<div class="tfs2-note__main"><span class="tfs2-rule" aria-hidden="true"></span><h2 class="tfs2-h2">${t.note_title}</h2>` +
      `<div class="tfs2-note__body" id="tfs2-note-body" data-collapsed="true">${d.note_body}</div>` +
      `<button type="button" class="tfs2-note__toggle" aria-expanded="false" aria-controls="tfs2-note-body"><span>Read more</span>${icon("chevron-down", 16)}</button></div></div></div></section>`,
  );

  // GUIDES
  if (d.guides.length) {
    push(
      `<section class="tfs2-sec tfs2-sec--white tfs2-sec--guides"><div class="tfs2-wrap"><h2 class="tfs2-h3 tfs2-h3--serif tfs2-h3--lg">${t.guides_title}</h2><ul class="tfs2-guides">` +
        d.guides.map((g) => `<li><a href="${a(g.url)}"><strong>${g.title}</strong><span>${g.text}</span></a></li>`).join("") +
        `</ul></div></section>`,
    );
  }

  // PLANNER DIALOG
  const pqs: [string, string, string, PlannerOption[], string][] = [
    ["year", "Which year group", "", d.planner.years, "y12"],
    ["slot", "What slot can you give it", "per week, in school time", d.planner.slots, "hour"],
    ["start", "When would you start", "", d.planner.starts, "sep"],
  ];
  push(
    `<div class="tfs2-modal" data-tfs2-modal="planner" hidden><div class="tfs2-modal__box tfs2-modal__box--wide" role="dialog" aria-modal="true" aria-labelledby="tfs2-planner-title">` +
      `<div class="tfs2-modal__head"><div><h2 class="tfs2-h3 tfs2-h3--serif" id="tfs2-planner-title">${t.planner_card_title}</h2>` +
      `<p class="tfs2-small tfs2-muted">Your plan for <span data-bind="leadName"></span>. You can print the result.</p></div>` +
      `<button type="button" class="tfs2-modal__x" data-tfs2-close aria-label="Close">${icon("x", 20)}</button></div>` +
      `<form class="tfs2-modal__body" data-tfs2-planner>` +
      pqs
        .map(
          ([key, title, hint, opts, def], qi) =>
            `<fieldset class="tfs2-q"><legend class="tfs2-q__label"><span class="tfs2-q__num tfs2-q__num--grey">${e(`0${qi + 1}`)}</span><span class="tfs2-q__title">${e(title)}</span>${hint ? `<span class="tfs2-q__hint">${e(hint)}</span>` : ""}</legend>` +
            `<div class="tfs2-chips">` +
            opts
              .map(
                (o) =>
                  `<label class="tfs2-chip"><input type="radio" name="${a(key)}" value="${a(o.id)}"${checked(o.id === def)}><span>${e(o.label)}${o.sub ? ` <small>${e(o.sub)}</small>` : ""}</span></label>`,
              )
              .join("") +
            `</div></fieldset>`,
        )
        .join("") +
      `<div class="tfs2-q"><label class="tfs2-q__label" for="tfs2-pn"><span class="tfs2-q__num tfs2-q__num--grey">04</span><span class="tfs2-q__title">How many students</span><output class="tfs2-range__val tfs2-push" data-bind="n" for="tfs2-pn">${n0}</output></label>` +
      `<input type="range" id="tfs2-pn" min="5" max="60" step="1" value="${n0}" data-tfs2-n></div>` +
      `<div class="tfs2-row tfs2-row--center"><button type="submit" class="tfs2-btn tfs2-btn--green">Build the plan</button><span class="tfs2-small tfs2-muted">Cohort size is shared with the cost calculator</span></div>` +
      `<div class="tfs2-plan" data-tfs2-plan hidden><div class="tfs2-plan__head"><h3 class="tfs2-h3 tfs2-h3--serif" data-bind="planTitle"></h3>` +
      `<button type="button" class="tfs2-btn tfs2-btn--outline-green tfs2-btn--xs" data-tfs2-print>Print the plan</button></div>` +
      `<dl class="tfs2-plan__rows" data-tfs2-planrows></dl><p class="tfs2-small tfs2-muted" data-tfs2-plan-sent></p></div></form></div></div>`,
  );

  // STICKY PRICE
  push(
    `<div class="tfs2-pill" data-tfs2-pill aria-hidden="true"><span><strong data-bind="stickyPrice">${c.per_student_gbp} per student</strong> <span class="tfs2-pill__sub" data-bind="stickySub">for ${n0} students</span></span>` +
      `<a class="tfs2-btn tfs2-btn--green tfs2-btn--xs" href="#cost" tabindex="-1">What it costs ${icon("arrow-right", 15)}</a></div>`,
  );

  return out.join("\n");
}

export default function SchoolsPage({ data }: { data: SchoolsPageData }) {
  return <div id="tfs2" className="tfs2" data-page={data.pid} dangerouslySetInnerHTML={html(render(data))} />;
}
