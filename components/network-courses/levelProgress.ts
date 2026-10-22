import type { CourseLevel, Lesson } from "@/content/network-courses";

export type LevelStatus = "done" | "in-progress" | "not-started";

export type LevelProgress = {
  status: LevelStatus;
  done: number;
  total: number;
  percent: number;
  totalMinutes: number;
  /** First lesson of the level that is not completed yet; null when the level is finished. */
  currentLesson: Lesson | null;
};

export function getLevelProgress(
  level: CourseLevel,
  completed: ReadonlySet<string>,
  position: Readonly<Record<string, number>>,
): LevelProgress {
  const total = level.lessons.length;
  const done = level.lessons.filter((lesson) => completed.has(lesson.id)).length;
  const started = done > 0 || level.lessons.some((lesson) => position[lesson.id] !== undefined);
  return {
    status: done === total ? "done" : started ? "in-progress" : "not-started",
    done,
    total,
    percent: Math.round((done / total) * 100),
    totalMinutes: level.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0),
    currentLesson: level.lessons.find((lesson) => !completed.has(lesson.id)) ?? null,
  };
}
