/**
 * Pages family — one-off page templates, group 1 (spread into
 * lib/native/families/pages.tsx). See docs/NATIVE-TEMPLATES.md. Match on body classes only.
 */
import AboutPage from "@/components/pages/about/AboutPage";
import type { AboutPageData } from "@/components/pages/about/types";
import CallbackPage, { type CallbackPageData } from "@/components/pages/callback/CallbackPage";
import ContactPage, { type ContactPageData } from "@/components/pages/contact/ContactPage";
import SitemapPage, { type SitemapPageData } from "@/components/pages/sitemap/SitemapPage";
import TeamPage from "@/components/pages/team/TeamPage";
import type { TeamPageData } from "@/components/pages/team/types";
import TocPage from "@/components/pages/toc/TocPage";
import type { TocPageData } from "@/components/pages/toc/types";
import { template, type NativeTemplate } from "@/lib/native/types";

export const TEMPLATES: NativeTemplate[] = [
  // about.php — /about-us/.
  template<AboutPageData>({
    endpoint: "about",
    match: (c) => c.has("page-template-about-php"),
    render: (data) => <AboutPage data={data} />,
  }),
  // meet-the-team.php — /meet-the-team/.
  template<TeamPageData>({
    endpoint: "meet-the-team",
    match: (c) => c.has("page-template-meet-the-team-php"),
    render: (data) => <TeamPage data={data} />,
  }),
  // page-contact.php — /contact-us/.
  template<ContactPageData>({
    endpoint: "page-contact",
    match: (c) => c.has("page-template-page-contact-php"),
    render: (data) => <ContactPage data={data} />,
  }),
  // page-toc.php — /privacy-policy/, /terms-and-conditions/, /new-zealand/.
  template<TocPageData>({
    endpoint: "page-toc",
    match: (c) => c.has("page-template-page-toc-php"),
    render: (data) => <TocPage data={data} />,
  }),
  // page-callback.php — /callback/, /vip-black-friday-deals/.
  template<CallbackPageData>({
    endpoint: "page-callback",
    match: (c) => c.has("page-template-page-callback-php"),
    render: (data) => <CallbackPage data={data} />,
  }),
  // page-sitemap.php — /sitemap/.
  template<SitemapPageData>({
    endpoint: "page-sitemap",
    match: (c) => c.has("page-template-page-sitemap-php"),
    render: (data) => <SitemapPage data={data} />,
  }),
];
