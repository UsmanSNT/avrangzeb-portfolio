import { publishedLevels, upcomingLevels, type UpcomingLevel } from "./network-courses";
import { networkCoursesCopy } from "./network-courses/copy";
import type { CourseLevel, Lesson } from "./network-courses/types";
import { englishLevels, englishUpcomingLevels } from "./english-courses";
import { englishCoursesCopy } from "./english-courses/copy";

export type CourseId = "network" | "english";

/** Copy shape with literal strings widened, so every course can supply its own wording. */
type WidenCopy<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends readonly (infer U)[]
      ? readonly WidenCopy<U>[]
      : T extends object
        ? { [K in keyof T]: WidenCopy<T[K]> }
        : T;

export type CourseCopy = WidenCopy<typeof networkCoursesCopy>;

export type Course = {
  id: CourseId;
  /** URL prefix of the course, without a trailing slash. */
  basePath: string;
  /** localStorage key for this course's progress; each course keeps its own. */
  storageKey: string;
  copy: CourseCopy;
  levels: readonly CourseLevel[];
  upcomingLevels: readonly UpcomingLevel[];
};

export const courses: Readonly<Record<CourseId, Course>> = {
  network: {
    id: "network",
    basePath: "/network-courses",
    storageKey: "network-courses:progress:v2",
    copy: networkCoursesCopy,
    levels: publishedLevels,
    upcomingLevels,
  },
  english: {
    id: "english",
    basePath: "/english-courses",
    storageKey: "english-courses:progress:v1",
    copy: englishCoursesCopy,
    levels: englishLevels,
    upcomingLevels: englishUpcomingLevels,
  },
};

export function allLessons(course: Course): readonly Lesson[] {
  return course.levels.flatMap((level) => level.lessons);
}

export const courseHref = (course: Course) => course.basePath;
export const levelHref = (course: Course, levelId: string) => `${course.basePath}/levels/${levelId}`;
export const lessonHref = (course: Course, lessonId: string) => `${course.basePath}/${lessonId}`;

export type LevelLocation = {
  level: CourseLevel;
  previous: CourseLevel | null;
  next: CourseLevel | null;
};

export function findLevel(course: Course, levelId: string): LevelLocation | null {
  const index = course.levels.findIndex((level) => level.id === levelId);
  if (index === -1) return null;
  return { level: course.levels[index], previous: course.levels[index - 1] ?? null, next: course.levels[index + 1] ?? null };
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

export function findLesson(course: Course, lessonId: string): LessonLocation | null {
  for (const [levelIndex, level] of course.levels.entries()) {
    const index = level.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;
    const next = level.lessons[index + 1] ?? null;
    return {
      lesson: level.lessons[index],
      next,
      level,
      nextLevel: next ? null : (course.levels[levelIndex + 1] ?? null),
      number: index + 1,
    };
  }
  return null;
}
