/** Data from `tefl/v1/native/category` (wordpress/headless/native/category.php). */
export interface CategoryArchiveData {
  ok: true;
  path: string;
  country: string;
  /** single_cat_title() output (entities kept). */
  title_html: string;
  posts: { thumb: string; title: string; url: string }[];
  /** the_posts_pagination()'s <nav>, inside .ast-pagination ("" when one page). */
  pagination: string;
}
