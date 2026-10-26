/** Data shapes of the pages-family endpoints (wordpress/headless/native/*.php). */

interface NativeBase {
  ok: true;
  template: string;
  path: string;
  country: string;
}

/** `tefl/v1/native/page` — Astra's default page template (native/page.php). */
export interface DefaultPageData extends NativeBase {
  id: number;
  primary_class: string;
  article: Record<string, string>;
  header: { class: string; title_html: string; title_attrs: Record<string, string> } | null;
  entry_attrs: Record<string, string>;
  content_html: string;
}
