/**
 * Pages family — one-off page templates, group 4 (spread into
 * lib/native/families/pages.tsx). See docs/NATIVE-TEMPLATES.md. Match on body classes only.
 */
import EslFranchisePage, { type EslFranchisePageData } from "@/components/pages/esl-franchise/EslFranchisePage";
import SchoolsPage, { type SchoolsPageData } from "@/components/pages/schools/SchoolsPage";
import TashkentPage, { type TashkentPageData } from "@/components/pages/tashkent/TashkentPage";
import { template, type NativeTemplate } from "@/lib/native/types";

export const TEMPLATES: NativeTemplate[] = [
  // ti-esl-franchise.php — /esl-franchise/.
  template<EslFranchisePageData>({
    endpoint: "ti-esl-franchise",
    match: (c) => c.has("page-template-ti-esl-franchise-php"),
    render: (data) => <EslFranchisePage data={data} />,
  }),
  // ti-tashkent-template.php — /tefl-course-in-tashkent-uzbekistan/.
  template<TashkentPageData>({
    endpoint: "ti-tashkent-template",
    match: (c) => c.has("page-template-ti-tashkent-template-php"),
    render: (data) => <TashkentPage data={data} />,
  }),
  // ti-tefl-for-schools-v3.php — /tefl-for-schools/.
  template<SchoolsPageData>({
    endpoint: "ti-tefl-for-schools-v3",
    match: (c) => c.has("page-template-ti-tefl-for-schools-v3-php"),
    render: (data) => <SchoolsPage data={data} />,
  }),
];
