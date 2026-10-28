"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CourseShell } from "@/components/courses/CourseShell";
import { getLevelProgress, type LevelProgress } from "@/components/courses/levelProgress";
import { useCourse } from "./CourseProvider";
import { useLessonProgress } from "@/components/courses/useLessonProgress";
import { lessonHref, levelHref } from "@/content/courses";
import type { CourseLevel } from "@/content/network-courses";

type RoadmapNodeProps = {
  order: number;
  state: LevelProgress["status"] | "soon";
  children: ReactNode;
};

/** One stop on the vertical roadmap: numbered marker, connector line to the next stop, and its card. */
function RoadmapNode({ order, state, children }: RoadmapNodeProps) {
  const marker =
    state === "done"
      ? "bg-accent-green text-inverse"
      : state === "in-progress"
        ? "border-2 border-accent-cyan bg-card text-cyan-text"
        : state === "soon"
          ? "border-2 border-dashed border-line bg-card text-subtle"
          : "border-2 border-line bg-card text-muted";
  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] gap-3 pb-5 sm:grid-cols-[3rem_1fr] sm:gap-5">
      <span className="absolute bottom-0 left-5 top-10 w-0.5 -translate-x-1/2 bg-line sm:left-6 sm:top-12" aria-hidden="true" />
      <span
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black sm:h-12 sm:w-12 sm:text-base ${marker}`}
        aria-hidden="true"
      >
        {state === "done" ? "✓" : order}
      </span>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

function LessonTrack({ level, progress, completed }: { level: CourseLevel; progress: LevelProgress; completed: ReadonlySet<string> }) {
  const t = useCourse().copy;
  return (
    <span className="mt-4 block">
      <span className="flex gap-1" aria-hidden="true">
        {level.lessons.map((lesson) => (
          <span
            key={lesson.id}
            className={`h-1.5 flex-1 rounded-full ${
              completed.has(lesson.id)
                ? "bg-accent-green"
                : progress.status === "in-progress" && lesson.id === progress.currentLesson?.id
                  ? "bg-accent-cyan"
                  : "bg-line"
            }`}
          />
        ))}
      </span>
      <span className="mt-2 block text-xs font-semibold text-muted">{t.roadmap.lessonTrack(progress.done, progress.total)}</span>
    </span>
  );
}

export function CourseRoadmap() {
  const course = useCourse();
  const t = course.copy;
  const { completed, position } = useLessonProgress();
  const levels = course.levels.map((level) => ({ level, progress: getLevelProgress(level, completed, position) }));
  const active = levels.find(({ progress }) => progress.status === "in-progress") ?? null;

  return (
    <CourseShell>
      <header className="mb-10">
        <p className="inline-flex rounded-lg border border-accent-green/20 bg-accent-green/[0.14] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-green-text">
          {t.hero.eyebrow}
        </p>
        <h1 className="mt-5 text-3xl font-black leading-tight text-foreground sm:text-5xl">{t.hero.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-secondary sm:text-lg">{t.hero.subtitle}</p>
      </header>

      {active?.progress.currentLesson && (
        <Link
          href={lessonHref(course, active.progress.currentLesson.id)}
          className="mb-10 flex items-center justify-between gap-4 rounded-2xl border border-accent-green/40 bg-accent-green/10 p-4 transition-colors hover:border-accent-green sm:p-5"
        >
          <span className="min-w-0">
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-green-text">
              {t.card.continueTitle} · {t.level.stage(active.level.order)}
            </span>
            <span className="mt-1 block text-base font-bold text-foreground sm:text-lg">{active.progress.currentLesson.title}</span>
          </span>
          <span className="text-xl text-green-text" aria-hidden="true">
            →
          </span>
        </Link>
      )}

      <section aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="text-2xl font-black text-foreground sm:text-3xl">
          {t.roadmap.title}
        </h2>
        <p className="mb-8 mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{t.roadmap.subtitle}</p>

        <ol>
          {levels.map(({ level, progress }, index) => {
            const previous = levels[index - 1];
            const waitsForPrevious = progress.status === "not-started" && previous !== undefined && previous.progress.status !== "done";
            return (
              <RoadmapNode key={level.id} order={level.order} state={progress.status}>
                <Link
                  href={levelHref(course, level.id)}
                  className={`group block rounded-2xl border bg-card p-4 shadow-lg shadow-elevation/10 transition-colors hover:border-accent-cyan/60 sm:p-5 ${
                    progress.status === "in-progress" ? "border-accent-cyan/50" : "border-line"
                  }`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-cyan-text">{t.level.stage(level.order)}</span>
                    <span
                      className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                        progress.status === "done"
                          ? "bg-accent-green/15 text-green-text"
                          : progress.status === "in-progress"
                            ? "bg-accent-cyan/15 text-cyan-text"
                            : "border border-line text-muted"
                      }`}
                    >
                      {waitsForPrevious ? t.roadmap.afterPrevious(previous.level.order) : t.roadmap.status[progress.status]}
                    </span>
                  </span>
                  <span className="mt-2 block text-xl font-black text-foreground sm:text-2xl">{level.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-secondary">{level.description}</span>
                  <span className="mt-3 block text-xs font-semibold text-subtle">
                    {t.level.lessons(level.lessons.length)} · {t.level.totalTime(progress.totalMinutes)}
                  </span>
                  <LessonTrack level={level} progress={progress} completed={completed} />
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-text">
                    {t.roadmap.cta[progress.status]}
                    <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </RoadmapNode>
            );
          })}

          {course.upcomingLevels.map((level) => (
            <RoadmapNode key={level.id} order={level.order} state="soon">
              <div className="rounded-2xl border border-dashed border-line bg-card/50 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-subtle">{t.level.stage(level.order)}</p>
                  <span className="rounded-md border border-line px-2 py-1 text-[11px] font-bold text-muted">{t.level.soon}</span>
                </div>
                <p className="mt-2 text-xl font-black text-foreground sm:text-2xl">{level.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{level.description}</p>
              </div>
            </RoadmapNode>
          ))}

          <li className="grid grid-cols-[2.5rem_1fr] items-center gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
            <span
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent-cyan/15 text-cyan-text sm:h-12 sm:w-12"
              aria-hidden="true"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
              </svg>
            </span>
            <p className="text-sm font-bold text-foreground sm:text-base">
              <span className="mr-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{t.roadmap.goalTitle}:</span>
              {t.roadmap.goalText}
            </p>
          </li>
        </ol>
      </section>

      <section aria-labelledby="method-title" className="mt-14">
        <h2 id="method-title" className="mb-4 text-lg font-bold text-foreground">
          {t.method.title}
        </h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {t.method.items.map((item, index) => (
            <li key={item.label} className="rounded-xl border border-line bg-card p-4">
              <span className="text-xs font-black text-cyan-text">0{index + 1}</span>
              <p className="mt-1 text-sm font-bold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted sm:text-sm sm:leading-6">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </CourseShell>
  );
}
