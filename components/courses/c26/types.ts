/** Data from `tefl/v1/native/course-2026` (wordpress/headless/native/course-2026.php). */

/** ti_c26_link(): href (rewritten), target ('' = none), title. */
export interface C26Link {
  href: string;
  target: string;
  title: string;
}

/** An <img> wp_get_attachment_image() printed, as [name, value] attributes in order. */
export type C26ImgAttrs = [string, string][];

export interface Course2026Data {
  ok: true;
  path: string;
  country: string;
  id: number;

  title: string;
  page_title: string;
  enrol: string;
  cart_url: string;
  home_url: string;
  courses_url: string;

  nav: { id: string; label: string }[];
  crumb: { href: string; title: string } | null;
  badges: { style: string; label: string }[];
  intro: string;
  points: string[];
  secondary: string;
  trust: { rating: string; rating_label: string; stat: string; stat_label: string };
  form: { title: string; intro: string; cf7: string; note: string } | null;
  /** HTML of .c26-hero-media (when there's no schools form). */
  hero_media: string;
  strip: { text: string; href: string } | null;

  overview: { heading: string; body: string; stats: { value: string; label: string }[] } | null;
  included: { kicker: string; heading: string; items: { icon: string; title: string; text: string }[] } | null;
  who: {
    heading: string;
    who: { title: string; text: string }[] | null;
    promos: { style: string; kicker: string; title: string; text: string; link: C26Link | null }[] | null;
  } | null;
  modules: {
    kicker: string;
    heading: string;
    time_note: string;
    access_note: string;
    foot: string;
    items: { num: string; open: boolean; title: string; text: string }[];
  } | null;
  certificate: {
    heading: string;
    intro: string;
    /** HTML of the uploaded certificate image, or null for the drawn sample. */
    image: string | null;
    /** HTML of the site logo in the drawn sample. */
    logo: string;
    cert_title: string;
    cert_footer: string;
    card_heading: string;
    card_text: string;
    sample: C26Link | null;
    verify: C26Link | null;
    accs: { logo: string; badge: string; name: string; note: string }[] | null;
  } | null;
  resources: {
    kicker: string;
    heading: string;
    guides: { fit: string; image: string; title: string; text: string; href: string; download: boolean }[];
  } | null;

  quote: {
    now: string;
    was: string;
    saving: string;
    total: string;
    addons: { id: string; name: string; price: string }[] | null;
  } | null;
  price_kicker: string;
  addons_heading: string;
  price_note: string;
  /** End of the offer in ms ('' = no countdown). */
  countdown: string;
  quote_box: { avatar: C26ImgAttrs | null; heading: string; link: C26Link | null } | null;

  students: {
    kicker: string;
    heading: string;
    videos: { i: string; video: string; label: string; image: C26ImgAttrs | null; name: string }[];
  } | null;
  reviews: { kicker: string; heading: string; quotes: { logo: string; quote: string; name: string; role: string }[] } | null;
  faq: { heading: string; intro: string; rows: { q: string; a: string }[] } | null;
  cta: { kicker: string; heading: string; secondary: C26Link | null } | null;
}
