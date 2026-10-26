/**
 * Native templates: overviews (course overview / listing / shop page
 * templates). Entries are added here, not in ../registry.tsx.
 * See docs/NATIVE-TEMPLATES.md.
 */
import CourseExtension, { type CourseExtensionData } from "@/components/overviews/CourseExtension";
import CoursesOverview, { type CoursesOverviewData } from "@/components/overviews/CoursesOverview";
import CountryCourse, { type CountryCourseData } from "@/components/overviews/CountryCourse";
import GiftVouchers, { type GiftVouchersData } from "@/components/overviews/GiftVouchers";
import PageCourses, { type PageCoursesData } from "@/components/overviews/PageCourses";
import SearchCourses, { type SearchCoursesData } from "@/components/overviews/SearchCourses";
import SecondaryOverview, { type SecondaryOverviewData } from "@/components/overviews/SecondaryOverview";
import TeflPlus, { type TeflPlusData } from "@/components/overviews/TeflPlus";
import TeflShop, { type TeflShopData } from "@/components/overviews/TeflShop";
import Trial, { type TrialData } from "@/components/overviews/Trial";

import { template, type NativeTemplate } from "../types";

export const TEMPLATES: NativeTemplate[] = [
  // Courses Overview Template 2023 — ti-courses-overview-template.php (/tefl-courses-overview/).
  template<CoursesOverviewData>({
    endpoint: "courses-overview",
    match: (c) => c.has("page-template-ti-courses-overview-template"),
    render: (data) => <CoursesOverview data={data} />,
  }),
  // Courses — page-courses.php (/tefl-courses/ in the geo folders; the US root redirects).
  template<PageCoursesData>({
    endpoint: "page-courses",
    match: (c) => c.has("page-template-page-courses"),
    render: (data) => <PageCourses data={data} />,
  }),
  // Country TEFL Course Page — ti-page-country-course-template.php (/tefl-course-azerbaijan/).
  template<CountryCourseData>({
    endpoint: "country-course",
    match: (c) => c.has("page-template-ti-page-country-course-template"),
    render: (data) => <CountryCourse data={data} />,
  }),
  // Secondary Overview Landing — ti-secondary-overview-template.php (/specialist-tefl-courses/).
  template<SecondaryOverviewData>({
    endpoint: "secondary-overview",
    match: (c) => c.has("page-template-ti-secondary-overview-template"),
    render: (data) => <SecondaryOverview data={data} />,
  }),
  // TEFL Plus Landing Page — tefl-plus.php (/the-tefl-plus/, /best-tefl-course/, /tefl-specialist-course-bundle/).
  template<TeflPlusData>({
    endpoint: "tefl-plus",
    match: (c) => c.has("page-template-tefl-plus"),
    render: (data) => <TeflPlus data={data} />,
  }),
  // 3 Days Free Trial — trial.php (/test-tefl-course-free/).
  template<TrialData>({
    endpoint: "trial",
    match: (c) => c.has("page-template-trial"),
    render: (data) => <Trial data={data} />,
  }),
  // TI Extensions — ti-course-extension.php (/course-extensions/).
  template<CourseExtensionData>({
    endpoint: "course-extension",
    match: (c) => c.has("page-template-ti-course-extension"),
    render: (data) => <CourseExtension data={data} />,
  }),
  // Gift Vouchers — gift-vouchers.php (/tefl-gift-vouchers/).
  template<GiftVouchersData>({
    endpoint: "gift-vouchers",
    match: (c) => c.has("page-template-gift-vouchers"),
    render: (data) => <GiftVouchers data={data} />,
  }),
  // Course recommender — search-courses-template.php (/search-courses/?usertype=…&userpreference=…&userlevel=…&userqual=…).
  template<SearchCoursesData>({
    endpoint: "search-courses",
    match: (c) => c.has("page-template-search-courses-template"),
    render: (data) => <SearchCourses data={data} />,
  }),
  // TEFL Shop — page-tefl-shop.php (/tefl-shop/).
  template<TeflShopData>({
    endpoint: "tefl-shop",
    match: (c) => c.has("page-template-page-tefl-shop"),
    render: (data) => <TeflShop data={data} />,
  }),
];
