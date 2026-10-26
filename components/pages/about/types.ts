/** Data from `tefl/v1/native/about` (wordpress/headless/native/about.php). */
export interface AboutPageData {
  ok: true;
  path: string;
  country: string;
  banner: { image: string; title: string; subtitle: string; text: string; btn_text: string; btn_link: string };
  about: { heading: string; text: string; image: string };
  core: { heading: string; values: { icon: string; title: string; text: string }[]; has_values: boolean };
  more: { heading: string; text: string; image: string };
}
