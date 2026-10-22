"use client";

import { useState } from "react";
import { networkCoursesCopy } from "@/content/network-courses/copy";
import type { Lesson, LessonCheck } from "@/content/network-courses";

const t = networkCoursesCopy;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-text">{children}</h4>;
}

function CheckQuestion({ check, index }: { check: LessonCheck; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === check.answerIndex;

  return (
    <div className="rounded-xl border border-line bg-background/60 p-4">
      <p className="text-sm font-semibold text-foreground sm:text-base">
        {index + 1}. {check.question}
      </p>
      <div className="mt-3 grid gap-2" role="group" aria-label={check.question}>
        {check.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const showCorrect = answered && optionIndex === check.answerIndex;
          const stateClass = showCorrect
            ? "border-accent-green/60 bg-accent-green/10 text-foreground"
            : isSelected
              ? "border-red-400/60 bg-red-400/10 text-foreground"
              : "border-line text-secondary hover:border-accent-cyan/40 hover:text-foreground";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              aria-pressed={isSelected}
              onClick={() => setSelected(optionIndex)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default ${stateClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div role="status" className="mt-3 text-sm leading-6 text-secondary">
          <span className={`font-bold ${isCorrect ? "text-green-text" : "text-red-400"}`}>
            {isCorrect ? t.lesson.correct : t.lesson.incorrect}
          </span>{" "}
          {check.explanation}
          {!isCorrect && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="ml-2 font-semibold text-cyan-text underline underline-offset-2"
            >
              {t.lesson.retry}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface LessonItemProps {
  lesson: Lesson;
  number: number;
  isDone: boolean;
  onToggleDone: (lessonId: string) => void;
}

export function LessonItem({ lesson, number, isDone, onToggleDone }: LessonItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `lesson-panel-${lesson.id}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-lg shadow-elevation/10">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-hover/[0.04] sm:gap-4 sm:p-5"
        >
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black ${
              isDone ? "bg-accent-green text-inverse" : "border border-line bg-surface text-cyan-text"
            }`}
            aria-hidden="true"
          >
            {isDone ? "✓" : number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold leading-snug text-foreground sm:text-lg">{lesson.title}</span>
            <span className="mt-1 block text-sm leading-6 text-muted">{lesson.summary}</span>
            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-subtle">
              <span>{t.level.minutes(lesson.estimatedMinutes)}</span>
              {isDone && <span className="text-green-text">{t.lesson.done}</span>}
            </span>
          </span>
          <svg
            className={`mt-2 h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="sr-only">{isOpen ? t.lesson.close : t.lesson.open}</span>
        </button>
      </h3>

      {isOpen && (
        <div id={panelId} className="space-y-8 border-t border-line p-4 sm:p-6">
          <section>
            <SectionHeading>{t.lesson.theory}</SectionHeading>
            <div className="space-y-3 text-sm leading-7 text-secondary sm:text-base">
              {lesson.theory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading>{t.lesson.labs}</SectionHeading>
            <div className="space-y-4">
              {lesson.labs.map((lab) => (
                <div key={lab.title} className="rounded-xl border border-line bg-background/60 p-4">
                  <h5 className="text-sm font-bold text-foreground sm:text-base">{lab.title}</h5>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-secondary">
                    {lab.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  {lab.commands && (
                    <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface p-3 font-mono text-xs leading-6 text-green-text sm:text-sm">
                      <code>{lab.commands.join("\n")}</code>
                    </pre>
                  )}
                  <p className="mt-3 text-sm leading-6 text-secondary">
                    <span className="font-bold text-foreground">{t.lesson.expected}: </span>
                    {lab.expected}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading>{t.lesson.drills}</SectionHeading>
            <ul className="space-y-2 text-sm leading-6 text-secondary">
              {lesson.drills.map((drill) => (
                <li key={drill} className="flex gap-3 rounded-lg border border-line bg-background/60 p-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-hidden="true" />
                  <span>{drill}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeading>{t.lesson.checks}</SectionHeading>
            <div className="space-y-3">
              {lesson.checks.map((check, index) => (
                <CheckQuestion key={check.question} check={check} index={index} />
              ))}
            </div>
          </section>

          <button
            type="button"
            aria-pressed={isDone}
            onClick={() => onToggleDone(lesson.id)}
            className={`w-full rounded-lg px-4 py-3 text-sm font-bold transition-colors sm:w-auto ${
              isDone
                ? "border border-line text-secondary hover:border-accent-cyan/40"
                : "bg-accent-green text-inverse hover:bg-accent-cyan"
            }`}
          >
            {isDone ? t.lesson.markUndone : t.lesson.markDone}
          </button>
        </div>
      )}
    </article>
  );
}
