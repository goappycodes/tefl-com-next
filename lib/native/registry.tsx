/**
 * Every theme template ported to React, first match wins. Anything that
 * matches none renders as the passthrough page. Add one entry per template
 * (see docs/NATIVE-TEMPLATES.md); keep entries in this alphabetical block.
 */
import BlogPost from "@/components/blog/BlogPost";
import type { BlogPostData } from "@/components/blog/types";

import { template, type NativeTemplate } from "./types";

export const NATIVE_TEMPLATES: NativeTemplate[] = [
  // Single blog post — single-post-redesign.php (body class `tibr-active`).
  template<BlogPostData>({
    endpoint: "post",
    match: (c) => c.has("single-post") && c.has("tibr-active"),
    replaces: ["ti-single-post-redesign-js"],
    render: (data) => <BlogPost post={data} />,
  }),
];
