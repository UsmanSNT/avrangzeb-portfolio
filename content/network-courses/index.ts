import { beginnerLevel } from "./beginner";
import { intermediateLevel } from "./intermediate";
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
  CliStep,
  CliLine,
} from "./types";

/** Levels with published lessons. The advanced level is appended once it is written. */
export const publishedLevels: readonly CourseLevel[] = [beginnerLevel, intermediateLevel];

export const upcomingLevels = [
  {
    id: "advanced",
    order: 3,
    title: "Real tajriba va ishga tayyorgarlik",
    description: "To'liq tarmoq loyihalari, xavfsizlik, monitoring, hujjatlashtirish, CCNA'ga tayyorgarlik va intervyu mashqlari.",
  },
] as const;

export const allLessons: readonly Lesson[] = publishedLevels.flatMap((level) => level.lessons);

export type LessonLocation = {
  lesson: Lesson;
  next: Lesson | null;
  level: CourseLevel;
  /** 1-based position of the lesson inside its level. */
  number: number;
};

export function findLesson(lessonId: string): LessonLocation | null {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return null;
  const lesson = allLessons[index];
  const level = publishedLevels.find((candidate) => candidate.lessons.includes(lesson));
  if (!level) return null;
  return { lesson, next: allLessons[index + 1] ?? null, level, number: level.lessons.indexOf(lesson) + 1 };
}
