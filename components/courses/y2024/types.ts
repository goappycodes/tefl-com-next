/** Data for single-course-template-2024.php (built by wordpress/headless/native/course-2024.php). */

/** includes/ti-deposit-form.php, resolved. */
export interface Course2024Deposit {
  forced: boolean;
  /** The installments-breakdown AJAX snippet (deposits forced|optional). */
  breakdown: boolean;
  object_id: string;
  total_deposits: string;
  full_checked: boolean;
  deposit_checked: boolean;
  /** Default selected type is "deposit" → the plan box is shown. */
  show: boolean;
  is_plan: boolean;
  plan_descriptions: string[];
  amount_html: string;
}

export interface Course2024Hero {
  pid: string;
  bg: string;
  icon: string;
  title_html: string;
  subtitle_html: string;
  /** get_price_html() + the "Save n%" div (the .product-price innerHTML); null → no price block. */
  price_html: string | null;
  deposit_percent: string;
  deposit_class: string;
  deposit: Course2024Deposit | null;
  sale: { sold: string; remaining: string } | null;
  desc_class: string;
  desc_html: string;
  enrol_cc: string;
  enrol_href: string;
  completion_html: string | null;
  reviews_count: string | null;
  klarna_cc: string | null;
  logo: {
    banner: string | null;
    common: { counter: string | null; logo: string; link: string | null } | null;
    alternate: string | null;
  };
}

export interface Course2024Data {
  primary_class: string;
  hero: Course2024Hero | null;
  key_features: string[] | null;
  intro: {
    enrolled: string | null;
    cutoff: string | null;
    resources: { pid: string; name: string; name_html: string; desc: string; pagelink: string }[] | null;
    enrol_cc: string;
    enrol_href: string;
    emp_choice: boolean;
    title_html: string;
    desc_html: string;
  } | null;
  outline: {
    title_html: string;
    outlines: { active: boolean; title_html: string; body_html: string }[];
    partners: { logo: string; title_html: string; link: string | null; icon: string }[] | null;
  } | null;
  benefits: {
    title_html: string;
    items: { gap: boolean; icon: string; title_html: string; desc_html: string }[];
  } | null;
  certificate: {
    title_html: string;
    image: string;
    desc_html: string;
    buttons: { primary: boolean; link: string; label_html: string }[];
  } | null;
  modules: {
    title_html: string;
    completion_html: string;
    study_html: string;
    items: { short: string; title_html: string; content_html: string }[];
  } | null;
  cta_boxes: { title_html: string; summary_html: string; button_html: string; link: string }[] | null;
  milestones: { title_html: string; desc_html: string }[] | null;
  guides: {
    guide: Course2024Card | null;
    prospectus: Course2024Card | null;
  } | null;
  team: {
    title_html: string;
    members: { image: string; alt: string; caption_html: string; desc_html: string; name_html: string; desg_html: string }[];
  } | null;
  reviews: {
    title_html: string;
    subtitle_html: string;
    average: string;
    total: string;
    stars: { i: number; pct: string }[];
    brb_html: string;
  } | null;
  videos: {
    title_html: string;
    subtitle_html: string;
    items: { thumb: string; title_html: string; name_html: string; desg_html: string; link: string }[];
  } | null;
  offer_banner: { image: string; clock_html: string; button_html: string } | null;
  faqs: { first: boolean; id: string; question_html: string; answer_html: string }[];
  search_html: string;
}

export interface Course2024Card {
  title_html: string;
  summary_html: string;
  image: string;
  label_html: string;
  link: string;
}
