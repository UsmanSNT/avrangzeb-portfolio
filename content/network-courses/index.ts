import { advancedLevel } from "./advanced";
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
  TrainerStep,
  ExamStep,
  ExamQuestion,
} from "./types";

/** Levels with published lessons, in learning order. */
export const publishedLevels: readonly CourseLevel[] = [beginnerLevel, intermediateLevel, advancedLevel];

export type UpcomingLevel = { id: string; order: number; title: string; description: string };

/** Levels announced on the roadmap but not written yet. */
export const upcomingLevels: readonly UpcomingLevel[] = [];

export const allLessons: readonly Lesson[] = publishedLevels.flatMap((level) => level.lessons);

export const courseHref = "/network-courses";
export const levelHref = (levelId: string) => `/network-courses/levels/${levelId}`;
export const lessonHref = (lessonId: string) => `/network-courses/${lessonId}`;

export type LevelLocation = {
  level: CourseLevel;
  previous: CourseLevel | null;
  next: CourseLevel | null;
};

export function findLevel(levelId: string): LevelLocation | null {
  const index = publishedLevels.findIndex((level) => level.id === levelId);
  if (index === -1) return null;
  return { level: publishedLevels[index], previous: publishedLevels[index - 1] ?? null, next: publishedLevels[index + 1] ?? null };
}

export type LessonLocation = {
  lesson: Lesson;
  /** Next lesson inside the same level; null on the level's last lesson. */
  next: Lesson | null;
  level: CourseLevel;
  /** Set only on a level's last lesson: the level that follows, if published. */
  nextLevel: CourseLevel | null;
  /** 1-based position of the lesson inside its level. */
  number: number;
};

export function findLesson(lessonId: string): LessonLocation | null {
  for (const [levelIndex, level] of publishedLevels.entries()) {
    const index = level.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;
    const next = level.lessons[index + 1] ?? null;
    return {
      lesson: level.lessons[index],
      next,
      level,
      nextLevel: next ? null : (publishedLevels[levelIndex + 1] ?? null),
      number: index + 1,
    };
  }
  return null;
}
