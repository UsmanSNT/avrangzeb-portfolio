"use client";

import Link from "next/link";
import { courseHref, findLevel, lessonHref, levelHref } from "@/content/courses";
import { CourseShell } from "./CourseShell";
import { LessonItem } from "./LessonItem";
import { getLevelProgress } from "./levelProgress";
import { primaryButtonClass } from "./steps/shared";
import { useCourse } from "./CourseProvider";
import { useLessonProgress } from "./useLessonProgress";

/** A single level on its own page: overview, progress and the ordered lesson path. */
export function LevelView({ levelId }: { levelId: string }) {
  const course = useCourse();
  const t = course.copy;
  const { completed, position } = useLessonProgress();
  const found = findLevel(course, levelId);
  if (!found) return null;

  const { level, previous, next } = found;
  const progress = getLevelProgress(level, completed, position);
  const previousProgress = previous ? getLevelProgress(previous, completed, position) : null;
  const upcoming = !next ? (course.upcomingLevels.find((candidate) => candidate.order === level.order + 1) ?? null) : null;

  return (
    <CourseShell>
      <Link href={courseHref(course)} className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-cyan-text">
        <span aria-hidden="true">←</span>
        {t.level.backToRoadmap}
      </Link>

      <header className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-text">{t.level.stage(level.order)}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-foreground sm:text-5xl">{level.title}</h1>
        <p className="mt-4 text-base leading-7 text-secondary sm:text-lg">{level.description}</p>
        <p className="mt-4 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6 text-secondary">
          <span className="font-bold text-foreground">{t.level.outcomeTitle}: </span>
          {level.outcome}
        </p>
        <p className="mt-4 text-xs font-semibold text-subtle">
          {t.level.lessons(level.lessons.length)} · {t.level.totalTime(progress.totalMinutes)}
        </p>
      </header>

      {previous && previousProgress && previousProgress.status !== "done" && (
        <div className="mt-6 rounded-2xl border border-accent-cyan/40 bg-accent-cyan/10 p-4 text-sm leading-6 text-foreground sm:p-5">
          <p>{t.level.previousNotice(previous.order, previous.title)}</p>
          <Link href={levelHref(course, previous.id)} className="mt-2 inline-flex font-bold text-cyan-text underline underline-offset-4">
            {t.level.previousLink(previous.order)}
          </Link>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-semibold text-muted">
          <span>{t.level.progress(progress.done, progress.total)}</span>
          <span>{progress.percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={level.title}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
          className="mt-2 h-2 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-accent-green transition-[width] duration-500" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      {progress.currentLesson && (
        <Link href={lessonHref(course, progress.currentLesson.id)} className={`${primaryButtonClass} mt-6 w-full sm:w-auto`}>
          {progress.status === "not-started" ? t.level.startLevel(progress.currentLesson.title) : t.level.continueLevel(progress.currentLesson.title)}
        </Link>
      )}

      <section aria-labelledby="level-lessons" className="mt-10">
        <h2 id="level-lessons" className="mb-4 text-lg font-bold text-foreground">
          {t.level.lessonsTitle}
        </h2>
        <div className="relative">
          <span className="absolute bottom-6 left-9 top-6 w-0.5 -translate-x-1/2 bg-line sm:left-10" aria-hidden="true" />
          <ol className="relative space-y-3">
            {level.lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <LessonItem
                  lesson={lesson}
                  number={index + 1}
                  isDone={completed.has(lesson.id)}
                  savedStep={position[lesson.id]}
                  isCurrent={progress.status !== "not-started" && progress.currentLesson?.id === lesson.id}
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-12" aria-label={t.level.nextLevelTitle}>
        {progress.status === "done" && next && <p className="mb-3 text-sm font-bold text-green-text">{t.level.levelDone}</p>}
        {next ? (
          <Link
            href={levelHref(course, next.id)}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-accent-cyan/60 sm:p-5"
          >
            <span className="min-w-0">
              <span className="block text-xs font-black uppercase tracking-[0.16em] text-cyan-text">
                {t.level.nextLevelTitle} · {t.level.stage(next.order)}
              </span>
              <span className="mt-1 block text-lg font-black text-foreground">{next.title}</span>
            </span>
            <span className="text-xl text-cyan-text transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        ) : (
          upcoming ? (
            <div className="rounded-2xl border border-dashed border-line bg-card/50 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-subtle">
                  {t.level.nextLevelTitle} · {t.level.stage(upcoming.order)}
                </p>
                <span className="rounded-md border border-line px-2 py-1 text-[11px] font-bold text-muted">{t.level.soon}</span>
              </div>
              <p className="mt-1 text-lg font-black text-foreground">{upcoming.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{upcoming.description}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-accent-cyan/40 bg-accent-cyan/10 p-4 sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{t.level.finalTitle}</p>
              <p className="mt-1 text-sm leading-6 text-foreground">{t.level.finalText}</p>
            </div>
          )
        )}
      </section>
    </CourseShell>
  );
}
