/**
 * Native templates: home. Entries are added here, not in ../registry.tsx.
 * See docs/NATIVE-TEMPLATES.md.
 */
import HomeCopy from "@/components/home/HomeCopy";
import Homepage2023 from "@/components/home/Homepage2023";
import Internship from "@/components/home/Internship";
import Internships from "@/components/home/Internships";
import Screening from "@/components/home/Screening";
import type { HomeCopyData, Homepage2023Data, InternshipData, InternshipsData, ScreeningData } from "@/components/home/types";

import { template, type NativeTemplate } from "../types";

export const TEMPLATES: NativeTemplate[] = [
  // Front page + per-market city home pages — ti-homepage-template-2023.php.
  template<Homepage2023Data>({
    endpoint: "homepage2023",
    match: (c) => c.has("page-template-ti-homepage-template-2023"),
    render: (data) => <Homepage2023 data={data} />,
  }),
  // /home-copy/ — homepage_copy.php (the pre-2023 homepage layout).
  template<HomeCopyData>({
    endpoint: "homecopy",
    match: (c) => c.has("page-template-homepage_copy"),
    render: (data) => <HomeCopy data={data} />,
  }),
  // Single internship — single-internship.php's 2023 design (the endpoint 404s for the old design → passthrough).
  template<InternshipData>({
    endpoint: "internship",
    match: (c) => c.has("single-internship"),
    render: (data) => <Internship data={data} />,
  }),
  // Internships overview (/tefl-internships/) — page-internships.php.
  template<InternshipsData>({
    endpoint: "internships",
    match: (c) => c.has("page-template-page-internships"),
    render: (data) => <Internships data={data} />,
  }),
  // Internship screening forms — single-screening_form.php.
  template<ScreeningData>({
    endpoint: "screening",
    match: (c) => c.has("single-screening_form"),
    render: (data) => <Screening data={data} />,
  }),
];
