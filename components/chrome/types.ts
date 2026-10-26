/**
 * Data of `tefl/v1/native/chrome` (wordpress/headless/native/chrome.php): the
 * theme's header and footer for one page. A region is null when WordPress
 * prints something there the port doesn't reproduce — the page then keeps that
 * region's WordPress HTML.
 *
 * Conventions (as in every native endpoint): `*_html` is HTML the theme echoes
 * raw (render rewrites applied); other strings are plain text / attribute
 * values; links are already rewritten for the Next front.
 */

/** HTML attributes as Astra's astra_attr() resolved them (name → value). */
export type Attrs = Record<string, string>;

/** clockdown_function(): the value it prints and which branch (still running at render time). */
export interface Clock {
  value: string;
  active: boolean;
}

export interface ChromeData {
  ok: true;
  /** WordPress origin: root-relative media get it, as the render does. */
  origin: string;
  header: ChromeHeader | null;
  footer: ChromeFooter | null;
  after_page: ChromeAfterPage | null;
  errors?: string[];
}

/* ------------------------------------------------------------------ header */

export interface ChromeHeader {
  skip: string;
  before_html: string;
  masthead: Masthead | null;
  after_html: string;
  content_before_html: string;
}

export interface Masthead {
  attrs: Attrs;
  bar_attrs: Attrs;
  ti: TiHeader;
  branding: { identity_attrs: Attrs; url: string };
  toggle: {
    cart_whatsapp: boolean;
    primary: { class: string; data_attrs: Attrs; inner_html: string } | null;
  } | null;
  nav: {
    align_attrs: Attrs;
    container_class: string;
    nav_attrs: Attrs;
    menu_id: string;
    menu_class: string;
    items: MobileItem[];
  };
  mega: MegaMenu;
}

export interface MobileItem {
  title: string;
  href: string;
  children: MobileItem[];
}

export interface TiHeader {
  offers: {
    bg: string;
    timer_active: boolean;
    clock: Clock;
    logo_link: string;
    logo: string;
    text_color: string;
    font_size: string;
    text_html: string;
    show_button: boolean;
    btn_bg: string;
    btn_color: string;
    btn_size: string;
    btn_link: string;
    btn_text_html: string;
  }[];
  strip: { color: string; items: { url: string; html: string }[]; clock: Clock | null } | null;
  banners: {
    color: string;
    show_clockdown: boolean;
    clock: Clock;
    content_html: string;
    show_button: boolean;
    btn_link: string;
    btn_text_html: string;
  }[];
  country: string;
  logo_href: string;
  links: { href: string; html: string }[];
  search_action: string;
  call_details: string;
  countries: { cc: string; name: string; flag: string }[];
  my_account: string;
  cart: string;
  cart_mobile: string;
}

export interface MegaSubItem {
  heading: boolean;
  css: string;
  title_html: string;
  link: string;
  /** Inline style the template prints (`background:…;color:…`), or null. */
  style?: string | null;
  icon?: string | null;
}

export interface MegaMenu {
  items: {
    has_children: boolean;
    link: string | null;
    title_html: string;
    sub: {
      count: number;
      cta: {
        block_html: string;
        cols: {
          /** The row separator's class suffix (12 / columns) before the 4th column, else null. */
          separator: string | null;
          head_html: string;
          items: MegaSubItem[];
          extra: { head_html: string; items: MegaSubItem[] }[] | null;
        }[];
      } | null;
      cols: { head_html: string; items: MegaSubItem[] }[];
      prospectus: boolean;
    } | null;
    cta: {
      title_html: string;
      guides: { url: string; name_html: string }[];
      buttons: { img: string; text_html: string; link: string; bg: string; color: string; size: string }[];
    } | null;
  }[];
  cta_buttons: { link: string; text_html: string; icon: string }[];
  prospectus: string;
}

/* ------------------------------------------------------------------ footer */

export interface OfferBannerRow {
  test: string;
  thickness: string;
  border_color: string;
  bg: string;
  clock_bubble: boolean;
  clock_text_html: string;
  flip_html: string;
  timer_active: boolean;
  logo_link: string;
  logo: string;
  content_icon: string;
  text_color: string;
  font_size: string;
  text_html: string;
  mobile_html: string;
  show_button: boolean;
  btn_bg: string;
  btn_color: string;
  btn_size: string;
  btn_link: string;
  btn_text_html: string;
}

export interface PromoBanner {
  thickness: string;
  border_color: string;
  bg: string;
  icon: string | null;
  text_color: string;
  font_size: string;
  content_html: string;
  show_button: boolean;
  btn_bg: string;
  btn_color: string;
  btn_size: string;
  btn_link: string;
  btn_text_html: string;
}

export interface ChromeFooter {
  offer: { banners: OfferBannerRow[]; promo: PromoBanner | null };
  content_after_html: string;
  footer_before_html: string;
  colophon: {
    attrs: Attrs;
    adv: { widgets: { n: number; attrs: Attrs; html: string }[]; home: string } | null;
    small: { section_class: string; s1_html: string | null; s2_html: string | null } | null;
  } | null;
  footer_after_html: string;
}

/* -------------------------------------------------------------- after #page */

export interface StickyCta {
  subtitle_html: string;
  title_html: string;
  price_html: string;
  summary_html: string;
  flip_html: string | null;
  enrol: string | null;
  btn_link: string;
  btn_text_html: string;
  icon: string;
}

export interface CourseBanner {
  kind: "offer";
  bg: string;
  content_class: string;
  clock: Clock | null;
  text_color: string;
  font_size: string;
  text_html: string;
  show_button: boolean;
  btn_bg: string;
  btn_color: string;
  btn_size: string;
  btn_link: string;
  btn_text_html: string;
}

export interface ChromeAfterPage {
  body_bottom_html: string;
  legal_img: string;
  sticky: StickyCta | null;
  course_banner: CourseBanner | null;
}
