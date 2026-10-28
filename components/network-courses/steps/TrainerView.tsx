"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { TrainerStep } from "@/content/network-courses";
import { answerFor, generateQuestion, isTrainerAnswerCorrect, type TrainerQuestion } from "../trainers";
import {
  copy,
  Feedback,
  inputClass,
  noCopyClass,
  noCopyProps,
  primaryButtonClass,
  StepHeader,
  type StepViewProps,
} from "./shared";

type Result = { correct: boolean; answer: string } | null;

/** Number-only answers get a numeric keypad on phones; addresses need the dot key. */
function keypadFor(question: TrainerQuestion): "numeric" | "decimal" {
  const { params } = question;
  const numberOnly =
    params.kind === "binary" ||
    (params.kind === "subnet" && params.ask === "hosts") ||
    (params.kind === "wildcard" && params.direction === "to-prefix");
  return numberOnly ? "numeric" : "decimal";
}

/** Endless randomized drill: the learner must answer `goal` questions correctly in a row. */
export function TrainerView({ step, onSolved }: StepViewProps<TrainerStep>) {
  const [question, setQuestion] = useState<TrainerQuestion>(() => generateQuestion(step.kind));
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [streak, setStreak] = useState(0);
  const [totals, setTotals] = useState({ correct: 0, wrong: 0 });
  const [solved, setSolved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (result) nextRef.current?.focus({ preventScroll: true });
    else inputRef.current?.focus({ preventScroll: true });
  }, [result]);

  const check = (event: FormEvent) => {
    event.preventDefault();
    if (result || value.trim() === "") return;
    const correct = isTrainerAnswerCorrect(question.params, value);
    setResult({ correct, answer: answerFor(question.params) });
    setTotals((prev) => (correct ? { ...prev, correct: prev.correct + 1 } : { ...prev, wrong: prev.wrong + 1 }));
    const nextStreak = correct ? streak + 1 : 0;
    setStreak(nextStreak);
    if (!solved && nextStreak >= step.goal) {
      setSolved(true);
      onSolved();
    }
  };

  const next = () => {
    setQuestion(generateQuestion(step.kind));
    setValue("");
    setResult(null);
  };

  return (
    <div>
      <StepHeader badge={copy.trainerBadge} title={step.title} />
      <p className="text-base leading-7 text-secondary">{step.prompt}</p>

      <div className="mt-5" aria-label={copy.trainerStreak(Math.min(streak, step.goal), step.goal)}>
        <div className="flex gap-1">
          {Array.from({ length: step.goal }, (_, index) => (
            <span key={index} className={`h-2 flex-1 rounded-full ${index < streak ? "bg-accent-green" : "bg-line"}`} />
          ))}
        </div>
        <p className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-semibold text-muted">
          <span>{copy.trainerStreak(Math.min(streak, step.goal), step.goal)}</span>
          <span>{copy.trainerStats(totals.correct, totals.wrong)}</span>
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-card p-4 sm:p-5" data-question={JSON.stringify(question.params)}>
        <p className={`break-words font-mono text-2xl font-black text-foreground sm:text-3xl ${noCopyClass}`} {...noCopyProps}>
          {question.subject}
        </p>
        <p className="mt-2 text-sm font-semibold text-secondary sm:text-base">{question.ask}</p>

        <form onSubmit={check} className="mt-4">
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            readOnly={result !== null}
            placeholder={question.placeholder}
            aria-label={question.ask}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            inputMode={keypadFor(question)}
            onPaste={(event) => event.preventDefault()}
            className={inputClass}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {result ? (
              <button ref={nextRef} type="button" className={primaryButtonClass} onClick={next}>
                {copy.trainerNext}
              </button>
            ) : (
              <button type="submit" className={primaryButtonClass} disabled={value.trim() === ""}>
                {copy.check}
              </button>
            )}
          </div>
        </form>
      </div>

      {result?.correct && <Feedback kind="ok">{copy.correct}</Feedback>}
      {result && !result.correct && (
        <Feedback kind="bad">
          <p className="font-bold">{copy.trainerWrong(result.answer)}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-muted">{copy.trainerSolution}</p>
          <ul className="mt-1 space-y-1 font-mono text-xs leading-5 sm:text-sm">
            {question.solution.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Feedback>
      )}

      {solved ? <Feedback kind="ok">{copy.trainerDone}</Feedback> : <p className="mt-3 text-xs text-muted">{copy.trainerResetNote}</p>}
    </div>
  );
}
