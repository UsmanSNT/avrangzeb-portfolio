import { beginnerLevel } from "./beginner";
import type { CourseLevel, Lesson } from "./types";

export type {
  CourseLevel,
  CourseLevelId,
  Lesson,
  Step,
  Visual,
  LearnStep,
  QuizStep,
  LabStep,
  LabCommand,
  LabCommands,
  TypeStep,
  InputStep,
  PracticeStep,
  BinaryStep,
  OrderStep,
  CidrStep,
} from "./types";

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

export const allLessons: readonly Lesson[] = publishedLevels.flatMap((level) => level.lessons);

export function findLesson(lessonId: string): { lesson: Lesson; next: Lesson | null } | null {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return null;
  return { lesson: allLessons[index], next: allLessons[index + 1] ?? null };
}
