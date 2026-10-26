/**
 * Data for single-course-template-new2023.php (built by
 * wordpress/headless/native/course-new2023.php). Fields named `*html`, and the
 * text values the template echoes raw, are HTML; everything else is plain text.
 */

/** includes/ti-deposit-form.php, resolved. */
export interface New2023Deposit {
  forced: boolean;
  breakdown: boolean;
  object_id: string;
  total_deposits: string;
  full_checked: boolean;
  deposit_checked: boolean;
  show: boolean;
  is_plan: boolean;
  descriptions: string[];
  amount_html: string;
}

export interface New2023TimetableTab {
  name: string;
  /** EducationEvent JSON-LD the theme echoes before each table. */
  ld: string[];
  rows: { disabled: string; n: string; date: string; time: string; low: string; avail: string; href: string }[];
  /** Price HTML shown in every row. */
  price: string;
  more: boolean;
}

export interface New2023Button {
  text: string;
  link: string;
  primary: boolean;
}

export interface CourseNew2023Data {
  primary_class: string;
  ld_course: string;
  top_bar: string[] | null;
  hero: {
    bg: string;
    interactive: boolean;
    border_color: string;
    subtitle: string;
    title: string;
    flex_title: boolean;
    logo_before: boolean;
    logo_after: boolean;
    underline: string;
    klarna: boolean;
    klarna_third: string;
    fixed_3995: string;
    fixed_99: string;
    deposit_percent: string;
    deposit_class: string;
    price: string;
    save: string;
    savings_color: string;
    extra_info: string;
    deposit: New2023Deposit | null;
    /** active bg, active text, inactive bg, inactive text */
    deposit_colors: [string, string, string, string];
    summary: string;
    select_two: { defaults: string; products: { pid: string; name_html: string; name_attr: string }[]; empty?: boolean } | null;
    btn1: string;
    btn2: string;
    virtual: boolean;
    enrol: string;
    tp_tags: string;
    tp_tag: string;
    logos: { src: string; class: string; link: string }[];
  };
  free_bundle: { label: string; title: string; summary: string; image: string; caption: string; alt: string } | null;
  tabs: {
    title: string;
    heading: string;
    extra: string;
    content: string;
    faq: { ld: string; items: { q: string; a: string }[] } | null;
    accordion: { key: string; title: string; subtitle: string; content: string }[] | null;
  }[];
  virtual: { summary: string; product: string; flexible: string; day_light: string; tabs: New2023TimetableTab[] } | null;
  level5: { heading: string; videos: { link: string; thumb: string }[] } | null;
  features: {
    elt: { title: string; text: string; btn: string; link: string } | null;
    salary: { title: string; text: string; btn: string; link: string } | null;
    items: { heading: string; content: string; verify: string | null }[];
    highlighted: string[] | null;
    europass: boolean;
    guide: { link: string; value: string } | null;
  } | null;
  search_html: string;
  reviews: {
    heading: string;
    image: string;
    average: string;
    total: string;
    btn_text: string;
    btn_bg: string;
    bars: { star: string; pct: string }[];
    slider: string;
  } | null;
  trial: { image: string; title: string; content: string; link: string; value: string } | null;
  offers:
    | {
        first: boolean;
        title: string;
        show_incexc: boolean;
        includes: string[];
        excludes: string[];
        image: string;
        timer: string;
        price: string;
        resources: { pid: string; name: string; desc: string; pagelink: string; name_html: string }[] | null;
        show_freebies: boolean;
        freebies: { icon: string; title: string }[];
        others: { icon: string; title: string }[];
        enrol: string;
      }[]
    | null;
  btn2: string;
  is_virtual: boolean;
  instructors: { heading: string; subheading: string; summary: string; items: { image: string; name: string; designation: string }[] } | null;
  salary_bar: { content: string; text: string; link: string } | null;
  ielts: {
    title: string;
    summary: string;
    image: string;
    bg: string;
    color: string;
    cta_text: string;
    cta_link: string;
    btn_bg: string;
    btn_color: string;
  } | null;
  certificate: {
    title: string;
    image: string;
    transcript: string | null;
    buttons: New2023Button[] | null;
    masterclass: { heading: string; image: string; buttons: New2023Button[] } | null;
  } | null;
  accreditation: {
    heading: string;
    subheading: string;
    ofqual: { image: string; content: string } | null;
    own: { image: string; title: string; subtitle: string } | null;
    common: { logo: string; title: string; subtitle: string; link: string }[];
  } | null;
  testimonials: { heading: string; slides: { image: string; title: string; subtitle: string; snippet: string; link: string }[] } | null;
  funding: string | null;
  resources: {
    heading: string;
    cards: { title: string; image: string; summary: string; buttons: { link: string; text: string }[] }[];
  } | null;
  virtual_faqs: { img: string; title: string; content: string; url: string }[] | null;
  learn_more: { link: string } | null;
}
