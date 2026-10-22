"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { findLesson, type Lesson, type Step } from "@/content/network-courses";
import { networkCoursesCopy } from "@/content/network-courses/copy";
import { BinaryView } from "./steps/BinaryView";
import { CidrView } from "./steps/CidrView";
import { CliView } from "./steps/CliView";
import { InputView } from "./steps/InputView";
import { LabView } from "./steps/LabView";
import { LearnView } from "./steps/LearnView";
import { OrderView } from "./steps/OrderView";
import { PracticeView } from "./steps/PracticeView";
import { QuizView } from "./steps/QuizView";
import { TypeView } from "./steps/TypeView";
import { primaryButtonClass, secondaryButtonClass } from "./steps/shared";
import { useLessonProgress } from "./useLessonProgress";

const t = networkCoursesCopy.player;

function StepView({ step, onSolved }: { step: Step; onSolved: () => void }) {
  switch (step.type) {
    case "learn":
      return <LearnView step={step} />;
    case "quiz":
      return <QuizView step={step} onSolved={onSolved} />;
    case "lab":
      return <LabView step={step} onSolved={onSolved} />;
    case "type":
      return <TypeView step={step} onSolved={onSolved} />;
    case "input":
      return <InputView step={step} onSolved={onSolved} />;
    case "practice":
      return <PracticeView step={step} onSolved={onSolved} />;
    case "binary":
      return <BinaryView step={step} onSolved={onSolved} />;
    case "order":
      return <OrderView step={step} onSolved={onSolved} />;
    case "cidr":
      return <CidrView step={step} onSolved={onSolved} />;
    case "cli":
      return <CliView step={step} onSolved={onSolved} />;
  }
}

type IntroScreenProps = {
  lesson: Lesson;
  stage: number;
  number: number;
  savedStep: number;
  onStart: (from: number) => void;
};

function IntroScreen({ lesson, stage, number, savedStep, onStart }: IntroScreenProps) {
  const resumable = savedStep > 0 && savedStep < lesson.steps.length;
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-text">
        {t.lessonOf(stage, number)} · {networkCoursesCopy.level.minutes(lesson.estimatedMinutes)} ·{" "}
        {networkCoursesCopy.card.steps(lesson.steps.length)}
      </p>
      <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl">{lesson.title}</h1>
      <p className="mt-3 text-base leading-7 text-secondary sm:text-lg">{lesson.summary}</p>

      <h2 className="mb-3 mt-8 text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{t.goalsTitle}</h2>
      <ul className="space-y-2">
        {lesson.goals.map((goal) => (
          <li key={goal} className="flex gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6 text-foreground sm:text-base">
            <span className="mt-0.5 text-green-text" aria-hidden="true">✓</span>
            {goal}
          </li>
        ))}
      </ul>

      {lesson.requires && (
        <p className="mt-5 text-sm leading-6 text-muted">
          <span className="font-bold text-foreground">{t.requiresTitle}: </span>
          {lesson.requires}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className={primaryButtonClass} onClick={() => onStart(resumable ? savedStep : 0)}>
          {resumable ? networkCoursesCopy.card.resume(savedStep + 1, lesson.steps.length) : t.start}
        </button>
        {resumable && (
          <button type="button" className={secondaryButtonClass} onClick={() => onStart(0)}>
            {t.start}
          </button>
        )}
      </div>
    </div>
  );
}

function OutroScreen({ lesson, next }: { lesson: Lesson; next: Lesson | null }) {
  return (
    <div>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-green text-2xl font-black text-inverse" aria-hidden="true">
        ✓
      </div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-green-text">{t.completedTitle}</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-foreground sm:text-4xl">{lesson.title}</h1>

      <h2 className="mb-3 mt-8 text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{t.recapTitle}</h2>
      <ul className="space-y-2">
        {lesson.recap.map((item) => (
          <li key={item} className="flex gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6 text-foreground sm:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        {next && (
          <Link href={`/network-courses/${next.id}`} className={primaryButtonClass}>
            {t.nextLesson}: {next.title}
          </Link>
        )}
        <Link href="/network-courses" className={next ? secondaryButtonClass : primaryButtonClass}>
          {t.toCourse}
        </Link>
      </div>
    </div>
  );
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const found = findLesson(lessonId);
  const reduceMotion = useReducedMotion();
  const { completed, position, setPosition, markCompleted } = useLessonProgress();

  /** 0 = intro, 1..n = steps, n + 1 = completion screen. */
  const [screen, setScreen] = useState(0);
  const [direction, setDirection] = useState(1);
  const [solved, setSolved] = useState<ReadonlySet<number>>(new Set());

  if (!found) return null;
  const { lesson, next, level, number } = found;
  const total = lesson.steps.length;
  const stepIndex = screen - 1;
  const isIntro = screen === 0;
  const isOutro = screen === total + 1;
  const step = !isIntro && !isOutro ? lesson.steps[stepIndex] : null;
  const canContinue = step ? step.type === "learn" || solved.has(stepIndex) || completed.has(lesson.id) : true;

  const goTo = (nextScreen: number) => {
    setDirection(nextScreen > screen ? 1 : -1);
    setScreen(nextScreen);
    window.scrollTo({ top: 0 });
    if (nextScreen >= 1 && nextScreen <= total) setPosition(lesson.id, nextScreen - 1);
    if (nextScreen === total + 1) markCompleted(lesson.id);
  };

  const start = (fromStep: number) => {
    // Steps before the resume point were already completed in an earlier visit.
    setSolved(new Set(Array.from({ length: fromStep }, (_, i) => i)));
    goTo(fromStep + 1);
  };

  const markSolved = (index: number) => setSolved((prev) => new Set(prev).add(index));

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 24 * direction },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 * direction },
        transition: { duration: 0.2 },
      };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            href="/network-courses"
            aria-label={t.exit}
            title={t.exit}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent-cyan/40 hover:text-foreground"
          >
            <span aria-hidden="true">✕</span>
          </Link>
          <div
            className="flex flex-1 gap-1"
            role="progressbar"
            aria-label={lesson.title}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={Math.max(0, Math.min(total, stepIndex))}
          >
            {lesson.steps.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index < stepIndex || isOutro ? "bg-accent-green" : index === stepIndex ? "bg-accent-cyan" : "bg-line"
                }`}
              />
            ))}
          </div>
          <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-muted">
            {step ? t.stepOf(screen, total) : ""}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-8 sm:pt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={screen} {...motionProps}>
            {isIntro && (
              <IntroScreen lesson={lesson} stage={level.order} number={number} savedStep={position[lesson.id] ?? 0} onStart={start} />
            )}
            {step && <StepView key={screen} step={step} onSolved={() => markSolved(stepIndex)} />}
            {isOutro && <OutroScreen lesson={lesson} next={next} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {step && (
        <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <button type="button" className={secondaryButtonClass} onClick={() => goTo(screen - 1)}>
              {t.back}
            </button>
            <button type="button" className={primaryButtonClass} disabled={!canContinue} onClick={() => goTo(screen + 1)}>
              {stepIndex === total - 1 ? t.finish : t.next}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
