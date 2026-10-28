"use client";

import { useEffect, useState } from "react";
import type { PracticeStep } from "@/content/network-courses";
import { copy, Feedback, primaryButtonClass, secondaryButtonClass, StepHeader, type StepViewProps } from "./shared";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Offline drill (paper, fingers, speaking) with an optional countdown. */
export function PracticeView({ step, onSolved }: StepViewProps<PracticeStep>) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const running = remaining !== null && remaining > 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((value) => (value !== null && value > 0 ? value - 1 : value));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const markDone = () => {
    setDone(true);
    onSolved();
  };

  return (
    <div>
      <StepHeader badge={copy.practiceBadge} title={step.title} />
      <ol className="space-y-2">
        {step.instructions.map((instruction, index) => (
          <li key={instruction} className="flex gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6 text-foreground sm:text-base">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-green/15 text-xs font-black text-green-text" aria-hidden="true">
              {index + 1}
            </span>
            {instruction}
          </li>
        ))}
      </ol>

      {step.seconds !== undefined && (
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-line bg-background/60 px-4 py-3">
          <span className="font-mono text-3xl font-black tabular-nums text-foreground" aria-live="off">
            {formatTime(remaining ?? step.seconds)}
          </span>
          {remaining === null ? (
            <button type="button" className={secondaryButtonClass} onClick={() => setRemaining(step.seconds ?? 0)}>
              {copy.timerStart}
            </button>
          ) : remaining === 0 ? (
            <span className="text-sm font-semibold text-green-text">{copy.timerDone}</span>
          ) : null}
        </div>
      )}

      <div className="mt-5">
        <button type="button" className={primaryButtonClass} onClick={markDone} disabled={done}>
          {copy.practiceDone}
        </button>
      </div>
      {done && <Feedback kind="ok">{copy.correct}</Feedback>}
    </div>
  );
}
