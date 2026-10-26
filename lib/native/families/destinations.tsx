/**
 * Native templates: destinations. Entries are added here, not in ../registry.tsx.
 * See docs/NATIVE-TEMPLATES.md.
 */
import Alert from "@/components/destinations/Alert";
import AllJobs from "@/components/destinations/AllJobs";
import CountryPage from "@/components/destinations/CountryPage";
import FaqPage from "@/components/destinations/FaqPage";
import Guide from "@/components/destinations/Guide";
import JobHuntersPack from "@/components/destinations/JobHuntersPack";
import JobsService from "@/components/destinations/JobsService";
import Placement from "@/components/destinations/Placement";
import Ppc from "@/components/destinations/Ppc";
import SupportCenter from "@/components/destinations/SupportCenter";
import SupportTopic from "@/components/destinations/SupportTopic";
import TeachEnglishAbroad from "@/components/destinations/TeachEnglishAbroad";
import TeachEnglishJobs from "@/components/destinations/TeachEnglishJobs";
import WhereToTefl from "@/components/destinations/WhereToTefl";
import type {
  AlertData,
  AllJobsData,
  CountryPageData,
  FaqPageData,
  GuideData,
  JobHuntersPackData,
  JobsServiceData,
  PlacementData,
  PpcData,
  SupportCenterData,
  SupportTopicData,
  TeachEnglishAbroadData,
  TeachEnglishJobsData,
  WhereToTeflData,
} from "@/components/destinations/types";

import { template, type NativeTemplate } from "../types";

export const TEMPLATES: NativeTemplate[] = [
  // Country guide — single-teach_english_abroad.php.
  template<TeachEnglishAbroadData>({
    endpoint: "teach_english_abroad",
    match: (c) => c.has("single-teach_english_abroad"),
    replaces: ["single-teach-english-abroad-js-js"],
    render: (d) => <TeachEnglishAbroad d={d} />,
  }),
  // City course page — page template single-country-page.php (+ template-parts/country-page/).
  // Its slider / FAQ scripts (slick-slider.js, ti-homepage-2023.js) are shared theme scripts and stay.
  template<CountryPageData>({
    endpoint: "country_page",
    match: (c) => c.has("page-template-single-country-page"),
    render: (d) => <CountryPage d={d} />,
  }),
  // Guide download page — single-guide.php.
  template<GuideData>({
    endpoint: "guide",
    match: (c) => c.has("single-guide"),
    render: (d) => <Guide d={d} />,
  }),
  // "Where can TEFL take you?" — page template where-to-tefl.php.
  template<WhereToTeflData>({
    endpoint: "where_to_tefl",
    match: (c) => c.has("page-template-where-to-tefl"),
    render: (d) => <WhereToTefl d={d} />,
  }),
  // Country guides index — page template page-teach-english-jobs.php.
  template<TeachEnglishJobsData>({
    endpoint: "teach_english_jobs",
    match: (c) => c.has("page-template-page-teach-english-jobs"),
    render: (d) => <TeachEnglishJobs d={d} />,
  }),
  // Free TEFL jobs service — page template page-jobs-service.php.
  template<JobsServiceData>({
    endpoint: "jobs_service",
    match: (c) => c.has("page-template-page-jobs-service"),
    replaces: ["ti-job-service-js-js"],
    render: (d) => <JobsService d={d} />,
  }),
  // All TEFL jobs — page template page-all-jobs.php.
  template<AllJobsData>({
    endpoint: "all_jobs",
    match: (c) => c.has("page-template-page-all-jobs"),
    render: (d) => <AllJobs d={d} />,
  }),
  // Job Hunter's Pack / free resources — page template page-job-hunters-pack.php.
  // Its page-job-hunters-pack.js (lightSlider carousel, FAQ, logo fader) still runs.
  template<JobHuntersPackData>({
    endpoint: "job_hunters_pack",
    match: (c) => c.has("page-template-page-job-hunters-pack"),
    render: (d) => <JobHuntersPack d={d} />,
  }),
  // Single placement — single-placement.php.
  template<PlacementData>({
    endpoint: "placement",
    match: (c) => c.has("single-placement"),
    render: (d) => <Placement d={d} />,
  }),
  // Single support topic — single-support_centre.php.
  template<SupportTopicData>({
    endpoint: "support_centre",
    match: (c) => c.has("single-support_centre"),
    render: (d) => <SupportTopic d={d} />,
  }),
  // Frequently Asked Questions — page template page-faq.php.
  template<FaqPageData>({
    endpoint: "faq_page",
    match: (c) => c.has("page-template-page-faq"),
    render: (d) => <FaqPage d={d} />,
  }),
  // TEFL support center archive — page template page-supportcenter.php.
  template<SupportCenterData>({
    endpoint: "support_center_archive",
    match: (c) => c.has("page-template-page-supportcenter"),
    replaces: ["ti-support-center-js-js"],
    render: (d) => <SupportCenter d={d} />,
  }),
  // Alert sign-up — single-alerts.php.
  template<AlertData>({
    endpoint: "alerts",
    match: (c) => c.has("single-alerts"),
    render: (d) => <Alert d={d} />,
  }),
  // PPC landing page — single-ppc.php.
  template<PpcData>({
    endpoint: "ppc",
    match: (c) => c.has("single-ppc"),
    render: (d) => <Ppc d={d} />,
  }),
];
