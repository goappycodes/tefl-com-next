/**
 * Data for single-course-template.php (built by wordpress/headless/native/course-legacy.php).
 *
 * Conventions: fields documented as HTML are what the template echoes raw
 * (already rewritten like the render); everything else is decoded text for
 * attributes / JSX. `null` means the template doesn't print that block.
 */

interface Module {
  numbers: string; // HTML
  title: string; // HTML
  content: string; // HTML
}

export interface CourseLegacyData {
  primary_class: string;
  course_id: string;
  /** The Course JSON-LD printed when the course has a product, as printed. */
  product_ld: string | null;
  banner: {
    image: string;
    cta_title: string; // HTML
    price: string; // HTML
    fixed99: string;
    deposit_percent: string;
    deposit_class: string;
    free_offer: string | null; // HTML
    /** Product id for the installments-breakdown ajax snippet (deposits enabled without a plan). */
    installments: string | null;
    sale: { sold: string; remaining: string } | null;
    cta_text: string; // HTML
    highfield: boolean;
    yoga: string | null; // HTML
    btn1: string; // HTML
    btn2: string; // HTML
    enrol: string;
    freebies: { price: string; img: string; content: string }[] | null; // price/content HTML
  };
  black_bar: { icon: string; text: string }[] | null; // text HTML
  below_bar: { icon: string; text: string }[] | null; // text HTML
  guarantee: string | null; // HTML
  tabs: {
    card: { image: string; title: string; stitle: string; btn: string; link: string; color: string }; // title/stitle/btn HTML
    has1: boolean;
    has2: boolean;
    has3: boolean;
    has4: boolean;
    has5: boolean;
    tab1_title: string; // HTML
    tab1_details: string; // HTML
    tab2_title: string; // HTML
    tab2_content: Module[] | null;
    tab2_second: { title: string; modules: Module[] } | null;
    tab3_title: string; // HTML
    tab3_logos: string[];
    tab3_details: string; // HTML
    tab4_title: string; // HTML
    tab4_details: string; // HTML
    tab5_title: string; // HTML
    tab5_details: string; // HTML
    faq_ld: string | null;
    faqs: { q: string; a: string }[] | null; // HTML
    bonus: string | null; // HTML
    promise: string | null; // HTML
  };
  level5: { heading: string; videos: { href: string; thumb: string }[] } | null;
  eligibility: string[] | null; // HTML
  funding: string | null; // HTML
  reviews: {
    average: string;
    total: string;
    statuses: string[]; // 5 → 1 star
    banner: string | null;
    brb: string; // HTML
  };
  /** [] = the bar prints empty (one of its fields is missing). */
  salary: { content?: string; button?: string; url?: string } | null;
  sale_courses: {
    image: string | null;
    logo: string | null;
    title: string | null; // HTML
    price: string | null; // HTML
    enrol: string | null;
    countdown: string | null;
    incexc: { inc: string[]; exc: string[] } | null; // HTML
    freebie: {
      courses: { icon: string | null; title: string | null; price: string | null }[] | null;
      other: { icon: string | null; title: string | null }[] | null;
      cart: string | null;
    } | null;
  }[];
  certificate: {
    body: {
      img: string;
      transcript: string | null;
      title: string; // HTML
      details: string | null; // HTML
      buttons: { text: string; link: string }[]; // text HTML
    } | null;
  } | null;
  ofqual: { img: string | null; content: string | null } | null;
  accred: { img: string; title: string; subtitle: string } | null; // title/subtitle HTML
  highfield: boolean;
  benefits: string[] | null; // HTML
  slides: { image: string; url: string; title: string }[] | null; // title HTML
  timer_script: string | null;
  hunter: { guide: boolean; bg: string; title: string; subtitle: string; img: string }; // title/subtitle HTML
  app: { title: string; subtitle: string; preview: string; google: string | null; apple: string | null }; // title/subtitle HTML
  cf7: string; // HTML
  recommended: { link: string; icon: string; title: string; text: string }[] | null; // title/text HTML
  webinar: {
    title: string; // HTML
    list: {
      upcoming: { image: string; link: string; title: string; location: string; date: string; time: string } | null; // title/location/date/time HTML
      register: string;
    } | null;
  };
}
