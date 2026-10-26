/**
 * Data from `tefl/v1/native/homepage2023` (wordpress/headless/native/homepage2023.php).
 * Strings documented as HTML are what the template echoes raw (ACF text that
 * may hold markup, shortcode output); everything else is plain text / URLs.
 */
export interface Homepage2023Data {
  ok: true;
  path: string;
  country: string;
  id: number;
  /** WordPress origin, for the template's hardcoded /wp-content/ assets. */
  wp: string;
  /** EducationalOrganization JSON-LD, as wp_json_encode() printed it. */
  org_schema: string;
  primary_class: string;
  slides: HeroSlide[];
  mobile_bg: { key: string; url: string }[];
  mobile_logo: { src: string; link: string } | null;
  cta: CtaSection | null;
  webinars: {
    title: string;
    subtitle: string;
    btn: [string, string];
    list: { title: string; location: string; date: string; time: string; image: string }[];
    register: string;
  } | null;
  ai_app: { ai_title: string; app_title: string; app_text: string; app_image: string };
  videos: { title: string; subtitle: string; items: { thumb: string; name: string; role: string; video: string }[] } | null;
  jobs: {
    title: string;
    subtitle: string;
    btn: [string, string];
    items: { image: string; location: string; title: string; posted: string; salary: string; link: string }[];
  } | null;
  logos: [string[], string[]];
  faq_ld: string;
  faqs: { q: string; a: string }[];
  /** HTML: CF7 "Home Contact Form". */
  cf7: string;
  /** HTML: Instagram feed shortcode. */
  insta: string;
}

export interface HeroSlide {
  key: string;
  overlay: boolean;
  bg: string;
  image_link: string;
  /** Halloween campaign link on ACF row 1 (template hardcode). */
  halloween: string;
  is_offer: boolean;
  title: string | null;
  title_bg: string;
  title_color: string;
  subtitle: string | null;
  summary: string;
  accred: { title: string; logo: string; desc: string; icon: string }[] | null;
  links: { link: string; text: string }[] | null;
  logo: { src: string; link: string; clock: string } | null;
  bubble: { color: string; html: string } | null;
  timer: { ends: string; timer: string } | null;
}

export interface ReadMore {
  /** "" when the paragraph is short (no read-more). */
  id: string;
  short: string;
  full: string;
}

export interface CourseCard {
  col_class: string;
  label_bg_var: string;
  has_label: boolean;
  product_id: string;
  label: { text: string; color: string; bg: string; border: string } | null;
  link: string;
  icon: string;
  title: string;
  /** HTML: WooCommerce price (WCPBC wrapper). */
  price: string;
  discount: [string, string];
  save: string;
  deposit: { icon: string; title: string; desc: string };
  summary: string;
  features: string[];
  cta_style: string[];
  cta_text: string;
  guide_link: string;
  guide_style: string[];
  tp_tag: string;
}

export interface CtaSection {
  btn_style: string[];
  buttons: { col: string; link: string; text: string }[];
  search: { title: string | null; first: ReadMore | null; body: string; last: ReadMore | null };
  cards: CourseCard[] | null;
  reviews: {
    title: string;
    subtitle: string;
    btn: [string, string];
    average: string;
    total: string;
    bars: { star: number; pct: string }[];
    google_link: string;
    g_rating: string;
    g_count: string;
    tp: { link: string; icon: string; rating: string; count: string } | null;
    slider: string;
  } | null;
  exp: { key: string; bg: string; title: string; summary: string; btn: string }[];
  text: string | null;
  img_cards: { bg: string; title: string; summary: string; btn: string; link: string }[];
}

/** Data from `tefl/v1/native/internship` (wordpress/headless/native/internship.php). HTML strings are echoed raw. */
export interface InternshipData {
  ok: true;
  path: string;
  country: string;
  id: number;
  wp: string;
  primary_class: string;
  /** null: the post has no hero group, and the template prints nothing inside #primary. */
  hero: {
    image: string;
    logo: string | null;
    alt_logo: string | null;
    subtitle: string;
    title: string;
    cta: { icon: string; text: string } | null;
  } | null;
  gallery?: string[] | null;
  nav?: [string, string][];
  is_admin?: boolean;
  sidebar?: {
    alerts: { country: string; link: string } | null;
    timer: string | null;
    /** HTML: the Register-your-interest CF7 form. */
    ri: string | null;
    /** HTML inside .sidebar-menu-book-now; null when there's no price (no box). */
    book: string | null;
    screening: { link: string; text: string } | null;
  };
  reviews?: { average: string; total: string; bars: { star: number; pct: string }[] };
  summary?: { title: string; subtitle: string; details: string; video: { thumb: string; id: string } | null } | null;
  overview?: { id: string; title: string; summary: string } | null;
  essentials?: { suffix: string; items: { title: string; list: string[] }[] } | null;
  eligibility?: { bg: string; title: string; content: string; link: string; text: string } | null;
  itinerary?: { title: string; timeline: { day: string; title: string; desc: string }[] } | null;
  testimonials?: { header: string; interns: { link: string; image: string; name: string; content: string }[] } | null;
  banner1?: string | null;
  location?: {
    summary: string;
    map: string;
    group_size: string;
    availability: string;
    form_title: string;
    country: string;
    form_image: string;
    cf7: string;
  } | null;
  script?: { url: string; title: string };
  banner2?: string | null;
  how?: {
    title: string;
    summary: string;
    guide: { popup: string; title: string; content: string; image: string; link: string; text: string } | null;
  } | null;
  excursions?: { title: string; summary: string; items: { image: string; image_title: string; title: string; content: string }[] } | null;
  students?: { slider: string } | null;
  learn?: { heading: string; summary: string; text: string; link: string } | null;
}

/** One question group of a screening form (values are printed raw into the template's script). */
export interface ScreeningGroup {
  image: string;
  options: { answer: string; points: string }[];
}

/** Data from `tefl/v1/native/screening` (wordpress/headless/native/screening.php). */
export interface ScreeningData {
  ok: true;
  path: string;
  country: string;
  id: number;
  primary_class: string;
  /** HTML: the "Screening Form" CF7 form. */
  form: string;
  /** ACF `country` (the internship country name). */
  sf_country: string;
  get_started: string;
  about: string;
  passport: ScreeningGroup;
  level: ScreeningGroup;
  degree: ScreeningGroup;
  age: ScreeningGroup;
  record: ScreeningGroup;
  healthy: ScreeningGroup;
  open: ScreeningGroup;
  congratulations_image: string;
  url: string;
  title: string;
}

/** Data from `tefl/v1/native/internships` (wordpress/headless/native/internships.php). HTML strings are echoed raw. */
export interface InternshipsData {
  ok: true;
  path: string;
  country: string;
  id: number;
  primary_class: string;
  hero: { badge: string; image: string; title: string; subtitle: string };
  ours: { main_title: string; title: string; content: string; included_title: string; included: string[] };
  cards: {
    image: string;
    country: string;
    price: string;
    benefits: string[];
    link: string;
    guide_image: string;
    guide_link: string;
  }[];
  /** HTML: CF7 "Discover Destinations Form". */
  discover: string;
  more: Record<"left" | "right", { icon: string; title: string; content: string }>;
  videos: { image: string; link: string; length: string; name: string }[];
  insta: string;
  advisor: string;
  /** HTML: CF7 "Want to Learn More?". */
  learn: string;
  script: { url: string; title: string };
  journal: { thumb: string; title: string; link: string }[];
}

export interface HomeCopyCourse {
  icon: string;
  pct: string;
  price: string;
  zoom: { text: string; price: string } | null;
  title: string;
  desc: string;
  images: { icon: string; inactive: boolean }[] | null;
  link: string;
}

/** Data from `tefl/v1/native/homecopy` (wordpress/headless/native/homecopy.php). HTML strings are echoed raw. */
export interface HomeCopyData {
  ok: true;
  path: string;
  country: string;
  id: number;
  wp: string;
  mobile_bg: string;
  slides: {
    n: number;
    free: { title: string; product: string; link: string; expiry: string } | null;
    std: {
      bg: string;
      mobile_bg: string;
      link: string;
      overlay: boolean;
      title: string;
      price: string;
      subtitle: string;
      button: { link: string; text: string } | null;
      show_buttons: boolean;
    } | null;
  }[];
  links: { link: string; text: string }[];
  search: string;
  logos: [string[], string[]];
  govt: { heading: string; details: string; banner: string; title: string; video: string; section: string };
  accredited: HomeCopyCourse[];
  level5: HomeCopyCourse[];
  browse: { link: string; text: string };
  cards: { link: string; image: string; country: string; price: string; benefits: string[]; guide_image: string; guide_link: string }[];
  choice: { image: string; text: string; icons: { icon: string; text: string }[] | null };
  center: { image: string; text: string };
  videos: { img: string; text: string; url: string }[];
  review_banner: string;
  reviews: string;
  why_title: string;
  reasons: { title: string; img: string; text: string }[];
  webinars: {
    title: string;
    list: { image: string; title: string; location: string; date: string; time: string }[];
    link: string;
    text: string;
    register: string;
  };
  faqs: { q: string; a: string }[] | null;
  faq_ld: string;
  go: { title: string; subtitle: string; text: string; image: string; play: string; app: string };
}
