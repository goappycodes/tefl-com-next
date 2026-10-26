/**
 * Data from the destinations family's `tefl/v1/native/*` endpoints
 * (wordpress/headless/native/<template>.php). Strings named `*_html` / most
 * fields here are HTML fragments the PHP template echoes raw; image URLs and
 * links come already rewritten the way the render rewrites them.
 */
export interface NativeBase {
  ok: true;
  path: string;
  country: string;
}

/** Image: src + alt (alt = basename of the URL, as the templates print it). */
export interface Img {
  src: string;
  alt: string;
}

/** `tefl/v1/native/teach_english_abroad` — single-teach_english_abroad.php. */
export interface TeachEnglishAbroadData extends NativeBase {
  id: number;
  origin: string;
  hero: string;
  page_title: string;
  job_title: string;
  content_html: string;
  country_images: Img[];
  living: { content: string; points: { title: string; content: string }[] | null } | null;
  key_points: { show: boolean; icon: string; alt: string; title: string; content: string }[] | null;
  key_facts: { points: { title: string; content: string }[] | null; content: string } | null;
  country_name: string;
  facts: { icon: string; alt: string; title: string; content: string }[];
  faqs: {
    image: string;
    alt: string;
    items: { question: string; answer: string; q_raw: unknown; a_raw: unknown }[];
  } | null;
  story: { content: string; name: string; image: string; alt: string } | null;
  jobs:
    | {
        logo: string;
        alt: string;
        title: string;
        company: string;
        location: string;
        type: string;
        link: string;
        salary: string;
      }[]
    | null;
  other_links: { title: string; content: string; image: string; link: string; value: string }[];
}

/** `tefl/v1/native/country_page` — page template single-country-page.php. */
export interface CountryPageData extends NativeBase {
  id: number;
  theme: string;
  hero: { background: string; heading: string; color: string; partners: string[] };
  about: { heading: string; description: string; image: string } | null;
  reviews:
    | { show: boolean; photo: string; name: string; name_attr: string; designation: string; review: string }[]
    | null;
  details: {
    why: { title: string; description: string; background: string } | null;
    includes: { title: string; description: string; background: string } | null;
    color: string;
  };
  after: { background: string; title: string; color: string; outcomes: string[] | null };
  course: {
    image: string;
    name: string;
    name_attr: string;
    description: string;
    button_text: string;
    button_link: string;
    button_color: string;
  };
  accreditation: {
    heading: string;
    title: string;
    items: { title: string; logo: string; status: string; icon: string }[];
    description: string;
  } | null;
  faqs: { first: boolean; key: string; question: string; answer: string }[];
}

/** A card / block of where-to-tefl.php. */
export interface WhereCard {
  background: string;
  icon: string;
  title: string;
  subtitle: string;
  link: string;
  value: string;
}

/** `tefl/v1/native/where_to_tefl` — page template where-to-tefl.php. */
export interface WhereToTeflData extends NativeBase {
  title: string;
  subtitle: string;
  path_html: string;
  online: WhereCard;
  abroad: WhereCard;
  courses: WhereCard;
  free_call: WhereCard;
  guides_title: string;
  guides: { image: string; name: string; link: string }[];
}

/** `tefl/v1/native/teach_english_jobs` — page template page-teach-english-jobs.php. */
export interface TeachEnglishJobsData extends NativeBase {
  hero: { image: string; title: string; subtitle: string };
  sections: {
    continent: string;
    cards: { thumbnail: string; country: string; description: string; url: string }[];
  }[];
}

/** `tefl/v1/native/all_jobs` — page template page-all-jobs.php. */
export interface AllJobsData extends NativeBase {
  jobs:
    | {
        count: number;
        id: string;
        info: boolean;
        type: string;
        logo: string;
        title: string;
        company: string;
        location: string;
        rate: string;
        link: string;
      }[]
    | null;
}

/** `tefl/v1/native/jobs_service` — page template page-jobs-service.php. */
export interface JobsServiceData extends NativeBase {
  origin: string;
  banner: { photo: string; title: string; subtitle: string; slugline: string };
  brochure_pdf: string;
  form_html: string;
  featured: { background: string; salary: string; title: string; info: { icon: string; content: string }[]; link: string }[] | null;
  header: { title: string; subtitle: string; image: string };
  ti_jobs: { title: string; logo: string; link: string; type: string; company: string; location: string; salary: string }[] | null;
  gocambio_empty: boolean;
  experience: { hours: string; class_size: string };
  team: { offset: boolean; last: boolean; photo: string; position: string; name: string; designation: string; about: string }[];
  promo: { image: string; title: string; subtitle: string; link: string };
  blogs: { title: string; image: string; url: string }[];
  faqs: { question: string; answer: string }[] | null;
}

/** `tefl/v1/native/job_hunters_pack` — page template page-job-hunters-pack.php. */
export interface JobHuntersPackData extends NativeBase {
  hero: { background: string; title: string; summary: string } | null;
  resources: { title: string; cards: { title: string; alt: string; image: string; summary: string; link: string }[] } | null;
  jobs: {
    title: string;
    subtitle: string;
    pdf: string;
    items: { image: string; location: string; title: string; posted: string; salary: string; link: string }[];
  } | null;
  first_gallery: string[] | null;
  second_gallery: string[] | null;
  contact_image: string;
  form_html: string;
  faqs: { key: string; first: boolean; question: string; answer: string; q_raw: unknown; a_raw: unknown }[];
}

/** `tefl/v1/native/placement` — single-placement.php. */
export interface PlacementData extends NativeBase {
  origin: string;
  hero: { title: string; background: string; collage: string[] | null; subtitle: string };
  sidebar: { type: string; info: { title: string; subtitle: string }[] };
  was: string;
  now: string;
  timer: boolean;
  timer_script: string;
  introduction: string;
  inclusions: string[];
  requirements: string[];
  organise: string[];
  virtual: { day_light: string; is_placement: boolean; panes: Record<string, string> } | null;
  location: { content: string; map: string; form_content: string; form_image: string; form_html: string };
}

/** `tefl/v1/native/support_centre` — single-support_centre.php. */
export interface SupportTopicData extends NativeBase {
  heading: string;
  subheading: string;
  details: string;
}

/** `tefl/v1/native/faq_page` — page template page-faq.php. */
export interface FaqPageData extends NativeBase {
  faqs: { question: string; answer: string; q_raw: unknown; a_raw: unknown }[];
}

/** `tefl/v1/native/support_center_archive` — page template page-supportcenter.php. */
export interface SupportCenterData extends NativeBase {
  title: string;
  stitle: string;
  webinar: { title: string; image: string; location: string; date: string; time: string };
  cards: { grey: boolean; style: string; title: string; excerpt: string; url: string }[];
  test: { background: string; title: string; content: string; link: string; button: string };
}

/** `tefl/v1/native/alerts` — single-alerts.php. */
export interface AlertData extends NativeBase {
  script: string;
  title: string;
  content: string;
  form_html: string;
}

/** `tefl/v1/native/ppc` — single-ppc.php. */
export interface PpcData extends NativeBase {
  origin: string;
  hero: { background: string; title: string; subtitle: string } | null;
  main: {
    title: string;
    subtitle: string;
    image: string;
    overlay_color: string;
    overlay_title: string;
    overlay_sub: string;
    overlay_small: string;
    form_html: string;
  } | null;
  accreditations: { title: string; desktop: string; mobile: string; points: string[] } | null;
  courses: {
    title: string;
    subtitle: string;
    most_popular: string;
    timer_html: string;
    rows: {
      popular: boolean;
      theme: string;
      title: string;
      subtitle: string;
      thumbnail: string;
      jobs_text: string;
      stars: string;
      price_html: string;
      percentage: string;
      labels: string[];
      book: string;
      learn_more: string;
    }[];
    extras: { background: string; title: string; subtitle: string; learn_more: string }[];
    videos: { image: string; youtube: string; caption: string }[];
    reviews_html: string;
  } | null;
  sale: { title: string; subtitle: string; points: string[]; heading: string; link: string; value: string } | null;
  script: string;
}

/** `tefl/v1/native/guide` — single-guide.php. */
export interface GuideData extends NativeBase {
  id: number;
  image: string;
  title: string;
  description: string;
  /** The "Book a call" block (guide 107391 only). */
  book_call: boolean;
  form_html: string;
  /** Inline script text after #primary, as printed by the template. */
  script: string;
}
