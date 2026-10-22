"use client";

import Link from "next/link";
import { Logo } from "@/app/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SectionsDropdown } from "@/components/SectionsDropdown";
import { LessonItem } from "@/components/network-courses/LessonItem";
import { useLessonProgress } from "@/components/network-courses/useLessonProgress";
import { networkCoursesCopy } from "@/content/network-courses/copy";
import { allLessons, publishedLevels, upcomingLevels } from "@/content/network-courses";

const t = networkCoursesCopy;

export default function NetworkCoursesPage() {
  const { completed, position } = useLessonProgress();
  const currentLesson = allLessons.find((lesson) => !completed.has(lesson.id));
  const hasStarted = completed.size > 0 || Object.keys(position).length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-line bg-background/78 shadow-2xl shadow-elevation/20 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo />
            <span className="text-lg font-bold sm:text-xl">{t.nav.brand}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <SectionsDropdown locale="uz" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-surface" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[linear-gradient(125deg,rgba(47,226,138,0.12),transparent_35%,rgba(34,211,238,0.1)_78%,transparent)] opacity-0 transition-opacity duration-500 dark:opacity-100"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <header className="mb-10">
            <p className="inline-flex rounded-lg border border-accent-green/20 bg-accent-green/[0.14] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-green-text">
              {t.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-3xl font-black leading-tight text-foreground sm:text-5xl">{t.hero.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-secondary sm:text-lg">{t.hero.subtitle}</p>
          </header>

          {currentLesson && hasStarted && (
            <Link
              href={`/network-courses/${currentLesson.id}`}
              className="mb-10 flex items-center justify-between gap-4 rounded-2xl border border-accent-green/40 bg-accent-green/10 p-4 transition-colors hover:border-accent-green sm:p-5"
            >
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.16em] text-green-text">{t.card.continueTitle}</span>
                <span className="mt-1 block text-base font-bold text-foreground sm:text-lg">{currentLesson.title}</span>
              </span>
              <span className="text-xl text-green-text" aria-hidden="true">→</span>
            </Link>
          )}

          {publishedLevels.map((level) => {
            const doneCount = level.lessons.filter((lesson) => completed.has(lesson.id)).length;
            const totalMinutes = level.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
            const percent = Math.round((doneCount / level.lessons.length) * 100);
            const headingId = `level-${level.id}`;

            return (
              <section key={level.id} aria-labelledby={headingId} className="mb-16">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-text">{t.level.stage(level.order)}</p>
                <h2 id={headingId} className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                  {level.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-secondary">{level.description}</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <span className="font-bold text-foreground">{t.level.outcomeTitle}: </span>
                  {level.outcome}
                </p>
                <p className="mt-3 text-xs font-semibold text-subtle">
                  {t.level.lessons(level.lessons.length)} · {t.level.totalTime(totalMinutes)}
                </p>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted">
                    <span>{t.level.progress(doneCount, level.lessons.length)}</span>
                    <span>{percent}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={level.title}
                    aria-valuemin={0}
                    aria-valuemax={level.lessons.length}
                    aria-valuenow={doneCount}
                    className="mt-2 h-2 overflow-hidden rounded-full bg-line"
                  >
                    <div className="h-full rounded-full bg-accent-green transition-[width] duration-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {level.lessons.map((lesson, index) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      number={index + 1}
                      isDone={completed.has(lesson.id)}
                      savedStep={position[lesson.id]}
                      isCurrent={currentLesson?.id === lesson.id}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <section aria-labelledby="method-title" className="mb-14">
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

          <section aria-label={t.level.soon} className="grid gap-4 sm:grid-cols-2">
            {upcomingLevels.map((level) => (
              <div key={level.id} className="rounded-2xl border border-dashed border-line bg-card/50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-subtle">{t.level.stage(level.order)}</p>
                  <span className="rounded-md border border-line px-2 py-1 text-[11px] font-bold text-muted">{t.level.soon}</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-foreground">{level.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{level.description}</p>
              </div>
            ))}
            <p className="text-sm text-subtle sm:col-span-2">{t.level.soonNote}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
