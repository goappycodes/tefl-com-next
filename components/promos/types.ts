/**
 * Data from the promos endpoints (wordpress/headless/native/<template>.php).
 * Fields named `*_html` / documented as HTML are what the template echoes raw;
 * everything else is plain text or a ready URL.
 */

interface Base {
  ok: true;
  path: string;
  country: string;
  primary_class: string;
}

/** tefl_native_promos_timer() — [tefl_timer_shortcode] inputs. */
export interface TimerData {
  expiry: string;
  now: number;
  exp: number;
  ends: string;
  paid_internship: boolean;
}

/** discount-tefl-coupon-codes.php */
export interface CouponCodesData extends Base {
  header: { title: string; desc: string } | null;
  coupons:
    | {
        code: string;
        code_html: string;
        desc: string;
        icon: string;
        discount: string;
        live: boolean;
        expiry: string | null;
      }[]
    | null;
  terms_url: string;
}

/** early-access-black-friday-sale-prz.php */
export interface EarlyAccessData extends Base {
  /** Contact Form 7 form HTML. */
  form: string;
}

/* ---- Shared sale blocks (tefl_native_promos_* in _promos.php) ---- */

export interface SaleTools {
  title: string;
  items: { icon: string; name: string; text: string; link: string; value: string }[];
}

export interface SaleAccreditations {
  title: string;
  graphic: string;
  points: string[];
}

export interface SaleFaq {
  empty: boolean;
  title: string;
  subtitle: string;
  text: string;
  questions: { heading: string; text: string }[];
}

export interface SalePanelItem {
  icon: string;
  heading: string;
  text: string;
}

export interface SaleStarRow {
  star: number;
  /** Attribute value (decoded). */
  percent: string;
  percent_html: string;
}

export interface SaleBundle {
  main_title: string;
  background: string;
  badge: string;
  title: string;
  text: string;
  price: string;
  discount: string;
  included: string[];
  subheading: string;
  learn_more: string;
  enrol_now: string;
}

export interface KlarnaData {
  front: boolean;
  installment: string;
}

/** black-friday-sale-prz.php */
export interface BlackFridaySalePrzData extends Base {
  hero: { background: string; promo: string };
  timer: TimerData;
  top_title: string;
  courses_title: string;
  courses: {
    link: string;
    thumbnail: string;
    discount: string;
    icon: string;
    title: string;
    price: string;
    completion: string;
    installment: string;
    includes_title: string;
    includes: string[];
    offer: string | null;
    button: { link: string; value: string };
    enrol: { link: string; value: string };
    trustpilot: { tag: string; token: string; bootstrap: boolean } | null;
  }[];
  bundle: SaleBundle;
  gifts: { title: string; text: string; guides: string[] };
  reviews: {
    title: string;
    subtitle: string;
    stars: SaleStarRow[];
    slider: string;
    videos: { thumbnail: string; play: string; name: string; subtitle: string; link: string }[];
    logos: { image: string; link: string }[];
  } | null;
  tools: SaleTools;
  accreditations: SaleAccreditations;
  faq: SaleFaq;
  panel: SalePanelItem[];
  klarna: KlarnaData;
  links: { gifts: string; power_more: string; power_deal: string };
  origin: string;
}

/** tefl-january-sale.php */
export interface TeflJanuarySaleData extends Base {
  hero: { background: string; promo: string } | null;
  timer: TimerData;
  top: { title: string; save_graphic: string } | null;
  courses_title: string;
  courses:
    | {
        thumbnail: string;
        discount: string;
        icon: string;
        title: string;
        price: string;
        completion: string;
        enrol_link: string;
        enrol_button: string;
        installment: string;
        includes_title: string;
        includes: string[];
        excludes: string[];
        offer: string | null;
        button: { link: string; value: string };
        learn_more: { link: string; value: string };
      }[]
    | null;
  gifts: { title: string; text: string; guides: { image: string; name: string }[] } | null;
  bundle: SaleBundle;
  reviews: {
    title: string;
    subtitle: string;
    average: string;
    total: string;
    stars: SaleStarRow[];
    slider: string;
  } | null;
  specialist: { image: string; icon: string; title: string; completion: string; link: string; price: string }[] | null;
  tools: SaleTools;
  accreditations: SaleAccreditations;
  faq: SaleFaq;
  panel: SalePanelItem[];
  klarna: KlarnaData;
  origin: string;
}

/** page-sale-new.php */
export interface SalePage2026Data extends Base {
  hero: {
    bg_desktop: string;
    bg_mobile: string;
    title: string;
    subtitle: string;
    buttons: { type: string; text: string; icon: string }[] | null;
    accreditation: string | null;
    offer: { deadline: string; enrolled: string | null; remaining: string | null; timer: TimerData } | null;
    gift: { icon: string; title: string; text: string; link: string } | null;
    footer: { icon: string; title: string; subtitle: string; link: string } | null;
  }[];
  courses: {
    title: string;
    cards: {
      pid: string;
      theme: string;
      bg: string;
      save: string | null;
      employer: string | null;
      title: string;
      summary: string;
      best_for: string | null;
      price: string;
      installment: string;
      cc: string;
      is_300hr: boolean;
      enrol_url: string;
      course_url: string;
      guide: { url: string; target: string; text: string; icon: string } | null;
      features: string[] | null;
    }[];
  } | null;
  bundle: { title: string | null; worth: string | null; rows: string[][] } | null;
  why_us: {
    image: string | null;
    title: string | null;
    summary: string | null;
    features: { icon: string | null; title: string }[] | null;
  } | null;
  cta_cards:
    | {
        theme: string;
        label: string | null;
        image: string | null;
        alt: string;
        desc: string | null;
        cta: { url: string; target: string; text: string } | null;
      }[]
    | null;
  reviews: {
    title: string;
    summary: string;
    google: { rating: string; count: string; link: string } | null;
    trustpilot: { rating: string; icon: string | null; count: string; link: string } | null;
    slider: string;
  };
  features: { icon: string; title: string }[] | null;
  reels: {
    title: string;
    bold: string;
    reels: { video: string; thumb: string; link: string }[] | null;
    cta_link: string;
    cta_text: string;
  };
  stories: {
    title: string | null;
    summary: string | null;
    bg: string | null;
    stories:
      | {
          active: boolean;
          image: string | null;
          flag: string | null;
          label: string | null;
          title: string;
          summary: string;
          link: string | null;
        }[]
      | null;
  } | null;
  journey: {
    banner: { title: string | null; cta: { text: string; link: string } | null } | null;
    links: { url: string; target: string; icon: string | null; title: string }[] | null;
  } | null;
  links: { compare: string; all_stories: string };
  origin: string;
}

/** tefl_native_promos_jan_top() — hero / countdown / gifts of the January landing pages. */
export interface JanTopData {
  hero: { bg: string; image: string; highlighted: string; main: string; subheader: string } | null;
  timer: { title: string; content: string; timer: TimerData } | null;
  gifts: { title: string; items: { icon: string; title: string; subtitle: string }[] } | null;
  origin: string;
}

/** january-courses-sale.php */
export interface JanuaryCoursesSaleData extends Base, Omit<JanTopData, "origin"> {
  courses:
    | {
        header: string;
        row_attr: string;
        image: string;
        percentage: string;
        logo: string;
        title: string;
        price: string;
        deposits: string;
        first_deposit: string;
        deposit_pct: string;
        cart: string;
        virtual: boolean;
        course_link: string;
        enrol_text: string;
        radio: number | null;
        has_inc_exc: boolean;
        includes: string[];
        excludes: string[];
        extra: {
          main_text: string;
          main_icon: string;
          others: { icon: string; title: string }[] | null;
          read_more: string | null;
        } | null;
      }[]
    | null;
  addons: {
    title: string;
    items: {
      ribbon: string;
      image: string;
      logo: string;
      title: string;
      features: string[] | null;
      price: string;
      link: string;
      cart: string;
    }[];
  } | null;
  guide: {
    header: string;
    title: string;
    subtitle: string;
    price: string;
    link: string;
    image: string;
    view_more: string;
  } | null;
  origin: string;
}

/** january-internships-sale.php / internship-black-friday-landing-page.php */
export interface InternshipSaleData extends Base, Omit<JanTopData, "origin"> {
  internships:
    | {
        title: string;
        subheader: string;
        percentage: string | null;
        image: string;
        price: string;
        logo: string;
        features: string[];
        stock: string | null;
        link: string;
        buy_now: string;
        learn_more: string;
        guide_link: string;
      }[]
    | null;
  videos: {
    title: string;
    subtitle: string;
    play: string;
    items: { link: string; thumbnail: string; title: string; subtitle: string }[];
  } | null;
  /** [brb_collection id="1150"] HTML. */
  reviews: string;
  cta: Record<"salary" | "elt", { image: string; title: string; subtitle: string; text: string; link: string }> | null;
  origin: string;
}

/** black-friday-landing-page.php */
export interface BlackFridayLandingData extends Base {
  accent: string;
  header: { heading: string; subheading: string } | null;
  timer_section: {
    title: string;
    content: string;
    bonus: { icon: string; title: string; content: string } | null;
    hero: string | null;
    timer: TimerData;
  };
  common_heading: string;
  courses: {
    teachers_choice: boolean;
    image: string;
    logo: string;
    title: string;
    price: string;
    cart: string;
    has_inc_exc: boolean;
    includes: string[];
    excludes: string[];
    has_freebie: boolean;
    freebies: { icon: string; title: string; price: string }[];
    others: { icon: string; title: string }[] | null;
    link: string;
  }[];
  cyber: {
    jobs: { background: string; title: string; info: { icon: string; content: string }[]; link: string }[];
    deal: string;
    code: string;
  } | null;
  add_ons_title: string;
  addons:
    | { image: string; logo: string; title: string; includes: string[] | null; price: string; link: string; cart: string }[]
    | null;
  resources: { image: string; price: string; title: string; link: string }[] | null;
  guide: { image: string; link: string; title: string; subtitle: string; price: string; view_more: string } | null;
  video: { image: string; caption: string; url: string }[] | null;
  why: { image: string; title: string; description: string }[] | null;
  origin: string;
}

/** black-friday-landing-page-2023.php */
export interface BlackFriday2023Data extends Base {
  hero: {
    background: string;
    title: string;
    gifts: { title: string; items: string[] } | null;
    summary: string;
    bubbles: { one: string; two: string; color: string } | null;
  };
  intro: { title: string; subtitle: string; description: string; accordion: { title: string; content: string }[] };
  why: { icon: string; title: string; subtitle: string }[];
  courses: {
    title: string;
    cards: {
      background: string;
      off: string | null;
      sticker: string;
      icon: string;
      plan: string;
      message: string;
      title: string;
      price: string;
      completion: string;
      guide_link: string;
    }[];
    packages: { title: string; includes: string[]; excludes: string[]; learn_more: string; enrol_now: string }[];
  };
  gifts: { title: string; country: string; gif: string; badges: { icon: string; title: string }[] } | null;
  internships: {
    title: string;
    cards: {
      test: string;
      background: string;
      off: string | null;
      country: string;
      icon: string;
      plan: string;
      plan_desc: string;
      title: string;
      price: string;
      completion: string;
      link: string;
    }[];
    cta: string;
  };
  reviews: { title: string; subtitle: string; average: string; total: string; stars: SaleStarRow[]; slider: string } | null;
  specialist: {
    title: string;
    cards: {
      off: string | null;
      background: string;
      sticker: string;
      price: string;
      title: string;
      completion: string;
      link: string;
    }[];
    cta: string;
  };
  trial: { background: string; icon: string; title: string; description: string; text: string; link: string }[];
  partners: { title: string; logos: string[]; points: string[] };
  origin: string;
}
