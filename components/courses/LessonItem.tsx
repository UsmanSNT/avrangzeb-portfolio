import Link from "next/link";
import { lessonHref } from "@/content/courses";
import type { Lesson } from "@/content/network-courses";
import { useCourse } from "./CourseProvider";

interface LessonItemProps {
  lesson: Lesson;
  number: number;
  isDone: boolean;
  /** Zero-based step the learner stopped at, if the lesson was started. */
  savedStep?: number;
  isCurrent: boolean;
}

/** One lesson on the course roadmap; opens the step-by-step player. */
export function LessonItem({ lesson, number, isDone, savedStep, isCurrent }: LessonItemProps) {
  const course = useCourse();
  const t = course.copy;
  const started = !isDone && savedStep !== undefined && savedStep > 0;
  const cta = isDone ? t.card.review : started ? t.card.resume(savedStep + 1, lesson.steps.length) : t.card.start;

  return (
    <Link
      href={lessonHref(course, lesson.id)}
      className={`group flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-lg shadow-elevation/10 transition-colors hover:border-accent-cyan/50 sm:gap-4 sm:p-5 ${
        isCurrent ? "border-accent-cyan/60" : "border-line"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
          isDone ? "bg-accent-green text-inverse" : "border border-line bg-surface text-cyan-text"
        }`}
        aria-hidden="true"
      >
        {isDone ? "✓" : number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold leading-snug text-foreground sm:text-lg">{lesson.title}</span>
        <span className="mt-1 block text-sm leading-6 text-muted">{lesson.summary}</span>
        <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-subtle">
          <span>{t.level.minutes(lesson.estimatedMinutes)}</span>
          <span>{t.card.steps(lesson.steps.length)}</span>
          {isDone && <span className="text-green-text">{t.card.done}</span>}
        </span>
      </span>
      <span className="mt-1 hidden shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-cyan-text transition-colors group-hover:border-accent-cyan/50 sm:inline-block">
        {cta}
      </span>
    </Link>
  );
}
