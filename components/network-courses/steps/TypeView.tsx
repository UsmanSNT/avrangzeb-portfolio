"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { TypeStep } from "@/content/network-courses";
import {
  copy,
  Feedback,
  inputClass,
  normalizeAnswer,
  primaryButtonClass,
  secondaryButtonClass,
  StepHeader,
  type StepViewProps,
} from "./shared";

/** Muscle-memory drill: the learner types the command from memory several times. */
export function TypeView({ step, onSolved }: StepViewProps<TypeStep>) {
  const [done, setDone] = useState(0);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = done >= step.reps;
  const showCommand = done === 0 || hintOpen;

  useEffect(() => {
    if (!finished) inputRef.current?.focus();
  }, [done, finished]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const typed = normalizeAnswer(value);
    if (step.accept.some((accepted) => normalizeAnswer(accepted) === typed)) {
      const nextDone = done + 1;
      setDone(nextDone);
      setValue("");
      setFailed(false);
      setHintOpen(false);
      if (nextDone >= step.reps) onSolved();
    } else {
      setFailed(true);
    }
  };

  return (
    <div>
      <StepHeader badge={copy.typeBadge} title={step.title} />
      <p className="text-base leading-7 text-secondary">{step.prompt}</p>

      <div className="mt-4 flex items-center gap-2" aria-label={copy.typeRep(done, step.reps)}>
        {Array.from({ length: step.reps }, (_, index) => (
          <span key={index} className={`h-2 flex-1 rounded-full ${index < done ? "bg-accent-green" : "bg-line"}`} />
        ))}
        <span className="ml-1 text-xs font-semibold text-muted">{copy.typeRep(done, step.reps)}</span>
      </div>

      {!finished && (
        <form onSubmit={submit} className="mt-5">
          {showCommand && (
            <p className="mb-3 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm text-green-text">
              {step.accept.join("   |   ")}
            </p>
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={copy.typePlaceholder}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-label={copy.typePlaceholder}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-muted">{done === 0 ? copy.typeCopyHint : copy.typeMemoryHint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className={primaryButtonClass} disabled={value.trim() === ""}>
              {copy.check}
            </button>
            {!showCommand && (
              <button type="button" className={secondaryButtonClass} onClick={() => setHintOpen(true)}>
                {copy.hint}
              </button>
            )}
          </div>
          {failed && <Feedback kind="bad">{copy.incorrect}</Feedback>}
        </form>
      )}

      {finished && <Feedback kind="ok">{copy.correct}</Feedback>}
    </div>
  );
}
