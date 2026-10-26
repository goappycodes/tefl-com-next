/** Data from `tefl/v1/native/astra-archive` (wordpress/headless/native/astra-archive.php). */
export type ArchiveItem =
  | { type: "image"; html: string }
  | { type: "title"; url: string; html: string; attrs: Record<string, string> }
  | { type: "meta"; html: string }
  | { type: "excerpt"; html: string }
  | { type: "read-more"; class: string; url: string; title: string; label: string };

export interface ArchivePost {
  article: Record<string, string>;
  layout_class: string;
  col: string;
  /** layout-5 only: the featured image printed before .post-content. */
  image_html: string | null;
  items: ArchiveItem[];
  entry_attrs: Record<string, string>;
}

export interface AstraArchiveData {
  ok: true;
  path: string;
  country: string;
  kind: "home" | "tag" | "search";
  primary_class: string;
  /** title_html: the <h1>'s inner HTML; or html: the whole banner, passed through. */
  header: { title_html: string; html: string } | null;
  grid: boolean;
  posts: ArchivePost[];
  none: { message: string; form_html: string } | null;
  /** the_posts_pagination()'s <nav>, inside .ast-pagination. */
  pagination: string;
}
