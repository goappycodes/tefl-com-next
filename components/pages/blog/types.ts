/** Data from `tefl/v1/native/page-blog` (wordpress/headless/native/page-blog.php). */
export interface BlogCard {
  /** As get_the_title() returns it (entities kept). */
  title: string;
  thumb: string;
  link: string;
}

export interface BlogRow {
  title: string;
  posts: BlogCard[];
}

export interface BlogTile {
  background_image: string;
  title: string;
  content_text: string;
  button_text: string;
  button_link: string;
}

export interface BlogIndexData {
  ok: true;
  path: string;
  country: string;
  banner: {
    background_image: string;
    banner_title: string;
    banner_subtitle: string;
    banner_text: string;
    banner_cta_button_link: string;
    banner_cta_button_text: string;
    banner_logo: string;
  };
  grid: BlogCard[];
  grid_more: boolean;
  english_test: BlogTile;
  life_stories: BlogRow;
  read_story: BlogTile;
  tefl_advice: BlogRow;
  destinations: { title: string; form_html: string };
  teaching: BlogRow;
  hear_from: BlogTile;
  categories: { name: string; url: string; alt: string }[];
}
