/**
 * Pages family — one-off page templates, group 3 (spread into
 * lib/native/families/pages.tsx). See docs/NATIVE-TEMPLATES.md. Match on body classes only.
 */
import TeachOnlinePage, { type TeachOnlinePageData } from "@/components/pages/teach-online/TeachOnlinePage";
import TeoNewPage, { type TeoNewPageData } from "@/components/pages/teo-new/TeoNewPage";
import TeoPage, { type TeoPageData } from "@/components/pages/teo/TeoPage";
import { template, type NativeTemplate } from "@/lib/native/types";

export const TEMPLATES: NativeTemplate[] = [
  // page-teo.php — /start-teach-english-online/.
  template<TeoPageData>({
    endpoint: "page-teo",
    match: (c) => c.has("page-template-page-teo-php"),
    render: (data) => <TeoPage data={data} />,
  }),
  // page-teo-new.php — /teach-english-online/.
  template<TeoNewPageData>({
    endpoint: "page-teo-new",
    match: (c) => c.has("page-template-page-teo-new-php"),
    render: (data) => <TeoNewPage data={data} />,
  }),
  // teach-english-online.php — /teach-english-online-with-tefl/.
  template<TeachOnlinePageData>({
    endpoint: "teach-english-online",
    match: (c) => c.has("page-template-teach-english-online-php"),
    render: (data) => <TeachOnlinePage data={data} />,
  }),
];
