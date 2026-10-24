/**
 * Every theme template ported to React, first match wins. Anything that
 * matches none renders as the passthrough page. New templates go in their
 * family file under ./families/ (see docs/NATIVE-TEMPLATES.md).
 */
import BlogPost from "@/components/blog/BlogPost";
import type { BlogPostData } from "@/components/blog/types";

import { TEMPLATES as COURSES } from "./families/courses";
import { TEMPLATES as DESTINATIONS } from "./families/destinations";
import { TEMPLATES as HOME } from "./families/home";
import { TEMPLATES as OVERVIEWS } from "./families/overviews";
import { TEMPLATES as PAGES } from "./families/pages";
import { TEMPLATES as PROMOS } from "./families/promos";
import { template, type NativeTemplate } from "./types";

const BLOG: NativeTemplate[] = [
  // Single blog post — single-post-redesign.php (body class `tibr-active`).
  template<BlogPostData>({
    endpoint: "post",
    match: (c) => c.has("single-post") && c.has("tibr-active"),
    replaces: ["ti-single-post-redesign-js"],
    render: (data) => <BlogPost post={data} />,
  }),
];

export const NATIVE_TEMPLATES: NativeTemplate[] = [
  ...BLOG,
  ...COURSES,
  ...DESTINATIONS,
  ...HOME,
  ...OVERVIEWS,
  ...PROMOS,
  // Last: the generic page / archive templates match broad body classes.
  ...PAGES,
];
