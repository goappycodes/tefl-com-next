/**
 * Pages family — the blog index and the archive / search views (spread into
 * lib/native/families/pages.tsx). See docs/NATIVE-TEMPLATES.md. Match on body classes only.
 */
import AstraArchive from "@/components/pages/archive/AstraArchive";
import type { AstraArchiveData } from "@/components/pages/archive/types";
import BlogIndex from "@/components/pages/blog/BlogIndex";
import type { BlogIndexData } from "@/components/pages/blog/types";
import CategoryArchive from "@/components/pages/category/CategoryArchive";
import type { CategoryArchiveData } from "@/components/pages/category/types";
import { template, type NativeTemplate } from "@/lib/native/types";

export const TEMPLATES: NativeTemplate[] = [
  // /blog/ — page-blog.php ("Blog Archive Template").
  template<BlogIndexData>({
    endpoint: "page-blog",
    match: (c) => c.has("page-template-page-blog-php"),
    render: (data) => <BlogIndex data={data} />,
  }),
  // Category archives (+ paging) — child theme category.php.
  template<CategoryArchiveData>({
    endpoint: "category",
    match: (c) => c.has("archive") && c.has("category"),
    render: (data) => <CategoryArchive data={data} />,
  }),
  // Astra's index.php (posts index paging: /blog/page/N/), archive.php (tags)
  // and search.php (/?s=…). The endpoint declines any other listing.
  template<AstraArchiveData>({
    endpoint: "astra-archive",
    match: (c) =>
      (c.has("blog") && !c.has("page") && !c.has("home")) || (c.has("archive") && c.has("tag")) || c.has("search"),
    render: (data) => <AstraArchive data={data} />,
  }),
];
