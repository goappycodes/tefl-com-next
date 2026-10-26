/**
 * Single course — native port of the theme's single-course.php: its two
 * JSON-LD blocks, then the course's design (ACF is_new_design / is_2024_design).
 * Data from `tefl/v1/native/course` (wordpress/headless/native/course.php).
 */
import type { CourseData } from "./types";

import CourseLegacy from "./legacy/CourseLegacy";
import CourseNew2023 from "./new2023/CourseNew2023";
import Course2024 from "./y2024/Course2024";

export default function Course({ course }: { course: CourseData }) {
  return (
    <>
      {course.ld.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
      ))}
      {course.variant === "new2023" ? <CourseNew2023 data={course.data} /> : null}
      {course.variant === "2024" ? <Course2024 data={course.data} /> : null}
      {course.variant === "legacy" ? <CourseLegacy data={course.data} /> : null}
    </>
  );
}
