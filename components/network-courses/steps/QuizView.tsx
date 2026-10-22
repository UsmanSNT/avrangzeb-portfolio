"use client";

import { useState } from "react";
import type { QuizStep } from "@/content/network-courses";
import { copy, Feedback, StepHeader, type StepViewProps } from "./shared";

export function QuizView({ step, onSolved }: StepViewProps<QuizStep>) {
  const [wrong, setWrong] = useState<ReadonlySet<number>>(new Set());
  const [correct, setCorrect] = useState(false);

  const choose = (index: number) => {
    if (correct || wrong.has(index)) return;
    if (index === step.answerIndex) {
      setCorrect(true);
      onSolved();
    } else {
      setWrong((prev) => new Set(prev).add(index));
    }
  };

  return (
    <div>
      <StepHeader badge={copy.quizBadge} title={step.question} />
      <div className="grid gap-2.5" role="group" aria-label={step.question}>
        {step.options.map((option, index) => {
          const isCorrect = correct && index === step.answerIndex;
          const isWrong = wrong.has(index);
          const stateClass = isCorrect
            ? "border-accent-green bg-accent-green/10"
            : isWrong
              ? "border-red-400/50 bg-red-400/10 opacity-70"
              : "border-line bg-card hover:border-accent-cyan/50";
          return (
            <button
              key={option}
              type="button"
              disabled={correct || isWrong}
              aria-pressed={isCorrect || isWrong}
              onClick={() => choose(index)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium text-foreground transition-colors disabled:cursor-default sm:text-base ${stateClass}`}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-xs font-bold text-muted"
                aria-hidden="true"
              >
                {isCorrect ? "✓" : isWrong ? "✕" : String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {wrong.size > 0 && !correct && <Feedback kind="bad">{copy.incorrect}</Feedback>}
      {correct && (
        <Feedback kind="ok">
          <span className="font-bold text-green-text">{copy.correct}</span> {step.explanation}
        </Feedback>
      )}
    </div>
  );
}
