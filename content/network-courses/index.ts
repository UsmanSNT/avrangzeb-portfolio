import { beginnerLevel } from "./beginner";
import type { CourseLevel } from "./types";

export type { CourseLevel, CourseLevelId, Lesson, LessonCheck, LessonLab } from "./types";

/** Levels with published lessons. Intermediate and advanced are appended as they are written. */
export const publishedLevels: readonly CourseLevel[] = [beginnerLevel];

export const upcomingLevels = [
  {
    id: "intermediate",
    order: 2,
    title: "O'rta daraja",
    description: "VLAN, trunk, OSPF, ACL, NAT, STP va tarmoqni loyihalash. Laboratoriyalar chuqurroq va ko'proq buyruqlarni qamrab oladi.",
  },
  {
    id: "advanced",
    order: 3,
    title: "Real tajriba va ishga tayyorgarlik",
    description: "To'liq tarmoq loyihalari, xavfsizlik, monitoring, hujjatlashtirish, CCNA'ga tayyorgarlik va intervyu mashqlari.",
  },
] as const;
