/**
 * Native templates: courses. Entries are added here, not in ../registry.tsx.
 * See docs/NATIVE-TEMPLATES.md.
 */
import Course from "@/components/courses/Course";
import type { CourseData } from "@/components/courses/types";
import Course2026 from "@/components/courses/c26/Course2026";
import type { Course2026Data } from "@/components/courses/c26/types";

import { template, type NativeTemplate } from "../types";

export const TEMPLATES: NativeTemplate[] = [
  // Course with the 2026 design — course-page-2026.php (template_include filter, body class `ti-c26-page`).
  template<Course2026Data>({
    endpoint: "course-2026",
    match: (c) => c.has("single-course") && c.has("ti-c26-page"),
    render: (data) => <Course2026 data={data} />,
  }),
  // Single course — single-course.php and the design it includes (new2023 / 2024 / legacy).
  template<CourseData>({
    endpoint: "course",
    match: (c) => c.has("single-course") && !c.has("ti-c26-page"),
    render: (data) => <Course course={data} />,
  }),
];
