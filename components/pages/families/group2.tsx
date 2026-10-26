/**
 * Pages family — one-off page templates, group 2 (spread into
 * lib/native/families/pages.tsx). See docs/NATIVE-TEMPLATES.md. Match on body classes only.
 */
import AffiliatePage, { type AffiliatePageData } from "@/components/pages/affiliate/AffiliatePage";
import EltPage, { type EltPageData } from "@/components/pages/elt/EltPage";
import PodcastPage, { type PodcastPageData } from "@/components/pages/podcast/PodcastPage";
import ResourcesPage, { type ResourcesPageData } from "@/components/pages/resources/ResourcesPage";
import ScholarshipsPage, { type ScholarshipsPageData } from "@/components/pages/scholarships/ScholarshipsPage";
import WebinarsPage, { type WebinarsPageData } from "@/components/pages/webinars/WebinarsPage";
import { template, type NativeTemplate } from "@/lib/native/types";

export const TEMPLATES: NativeTemplate[] = [
  // page-resources.php — /teaching-english-resources/.
  template<ResourcesPageData>({
    endpoint: "page-resources",
    match: (c) => c.has("page-template-page-resources-php"),
    render: (data) => <ResourcesPage data={data} />,
  }),
  // page-affiliate.php — /become-a-tefl-affiliate/.
  template<AffiliatePageData>({
    endpoint: "page-affiliate",
    match: (c) => c.has("page-template-page-affiliate-php"),
    render: (data) => <AffiliatePage data={data} />,
  }),
  // webinars.php — /upcoming-tefl-webinars/.
  template<WebinarsPageData>({
    endpoint: "webinars",
    match: (c) => c.has("page-template-webinars-php"),
    render: (data) => <WebinarsPage data={data} />,
  }),
  // tefl-podcast.php — /tune-in-with-tefl-podcast/ (+ ?pg=N).
  template<PodcastPageData>({
    endpoint: "tefl-podcast",
    match: (c) => c.has("page-template-tefl-podcast-php"),
    render: (data) => <PodcastPage data={data} />,
  }),
  // tefl-scholarships.php — /tefl-scholarships/.
  template<ScholarshipsPageData>({
    endpoint: "tefl-scholarships",
    match: (c) => c.has("page-template-tefl-scholarships-php"),
    render: (data) => <ScholarshipsPage data={data} />,
  }),
  // page-elt.php — the old English level test page.
  template<EltPageData>({
    endpoint: "page-elt",
    match: (c) => c.has("page-template-page-elt-php"),
    render: (data) => <EltPage data={data} />,
  }),
];
