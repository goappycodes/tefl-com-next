/**
 * Native templates: pages. Entries are added here, not in ../registry.tsx.
 * See docs/NATIVE-TEMPLATES.md.
 *
 * This family is spread LAST into the registry, and inside it the order is:
 * one-off page templates (page-template-<file>-php), then the archive / search
 * / 404 views, then the default page template, which matches the broadest
 * body class and must never capture a page with a custom template.
 */
import DefaultPage from "@/components/pages/DefaultPage";
import { TEMPLATES as ARCHIVES } from "@/components/pages/families/archives";
import { TEMPLATES as GROUP1 } from "@/components/pages/families/group1";
import { TEMPLATES as GROUP2 } from "@/components/pages/families/group2";
import { TEMPLATES as GROUP3 } from "@/components/pages/families/group3";
import { TEMPLATES as GROUP4 } from "@/components/pages/families/group4";
import type { DefaultPageData } from "@/components/pages/types";

import { template, type NativeTemplate } from "../types";

export const TEMPLATES: NativeTemplate[] = [
  ...GROUP1,
  ...GROUP2,
  ...GROUP3,
  ...GROUP4,
  ...ARCHIVES,
  // Default page template (Astra page.php). Last resort: only pages with no
  // custom template, never the front page or WooCommerce pages. The endpoint
  // also declines (→ passthrough) when Astra would print anything this
  // markup doesn't cover, or the content's HTML isn't self-contained.
  template<DefaultPageData>({
    endpoint: "page",
    match: (c) =>
      c.has("page-template-default") && c.has("page") && !c.has("home") && !c.has("woocommerce-page"),
    render: (data) => <DefaultPage data={data} />,
  }),
];
