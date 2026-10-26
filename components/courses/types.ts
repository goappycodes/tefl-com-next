/** Data from `tefl/v1/native/course` (wordpress/headless/native/course.php). */
import type { CourseNew2023Data } from "./new2023/types";
import type { CourseLegacyData } from "./legacy/types";
import type { Course2024Data } from "./y2024/types";

interface CourseBase {
  ok: true;
  path: string;
  country: string;
  id: number;
  /** The Course + BreadcrumbList JSON-LD single-course.php prints, as printed. */
  ld: string[];
}

export type CourseData =
  | (CourseBase & { variant: "new2023"; data: CourseNew2023Data })
  | (CourseBase & { variant: "2024"; data: Course2024Data })
  | (CourseBase & { variant: "legacy"; data: CourseLegacyData });
