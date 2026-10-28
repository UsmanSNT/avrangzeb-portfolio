"use client";

import { useEffect, useRef, useState } from "react";
import type { BinaryStep } from "@/content/network-courses";
import { copy, Feedback, StepHeader, type StepViewProps } from "./shared";

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1] as const;

export function BinaryView({ step, onSolved }: StepViewProps<BinaryStep>) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [bits, setBits] = useState<readonly boolean[]>(() => WEIGHTS.map(() => false));
  const [finished, setFinished] = useState(false);
  const advanceTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    },
    [],
  );

  const target = step.targets[targetIndex];
  const sum = WEIGHTS.reduce((total, weight, index) => total + (bits[index] ? weight : 0), 0);
  const matched = sum === target;

  const toggle = (index: number) => {
    if (finished || matched) return;
    const next = bits.map((bit, i) => (i === index ? !bit : bit));
    setBits(next);
    const nextSum = WEIGHTS.reduce((total, weight, i) => total + (next[i] ? weight : 0), 0);
    if (nextSum !== target) return;

    const isLast = targetIndex === step.targets.length - 1;
    advanceTimer.current = window.setTimeout(() => {
      if (isLast) {
        setFinished(true);
        onSolved();
      } else {
        setTargetIndex((value) => value + 1);
        setBits(WEIGHTS.map(() => false));
      }
    }, 700);
  };

  return (
    <div>
      <StepHeader badge={copy.interactiveBadge} title={step.title} />
      <p className="text-base leading-7 text-secondary">{step.prompt}</p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{copy.binaryTarget}</p>
          <p className="font-mono text-5xl font-black tabular-nums text-foreground">{finished ? step.targets[step.targets.length - 1] : target}</p>
        </div>
        <p className="text-xs font-semibold text-muted">{copy.binaryProgress(finished ? step.targets.length : targetIndex, step.targets.length)}</p>
      </div>

      <div className="mt-5 grid grid-cols-8 gap-1.5 sm:gap-2" role="group" aria-label={copy.binarySum}>
        {WEIGHTS.map((weight, index) => (
          <button
            key={weight}
            type="button"
            aria-pressed={bits[index]}
            aria-label={`${weight}: ${bits[index] ? 1 : 0}`}
            onClick={() => toggle(index)}
            className={`flex flex-col items-center rounded-lg border py-2 transition-colors sm:py-3 ${
              bits[index] ? "border-accent-cyan bg-accent-cyan/15 text-foreground" : "border-line bg-card text-muted hover:border-accent-cyan/40"
            }`}
          >
            <span className="text-[10px] font-semibold sm:text-xs">{weight}</span>
            <span className="font-mono text-xl font-black sm:text-2xl">{bits[index] ? 1 : 0}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-secondary">
        {copy.binarySum}: <span className="font-mono font-bold text-foreground">{sum}</span>
      </p>

      {(matched || finished) && <Feedback kind="ok">{copy.correct}</Feedback>}
    </div>
  );
}
