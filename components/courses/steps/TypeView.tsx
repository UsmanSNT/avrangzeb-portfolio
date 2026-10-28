"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { TypeStep } from "@/content/network-courses";
import {
  copy,
  Feedback,
  inputClass,
  noCopyClass,
  noCopyProps,
  normalizeAnswer,
  primaryButtonClass,
  secondaryButtonClass,
  StepHeader,
  type StepViewProps,
} from "./shared";
import { useCourse } from "../CourseProvider";

/** Muscle-memory drill: the learner types the command from memory several times. */
export function TypeView({ step, onSolved }: StepViewProps<TypeStep>) {
  const course = useCourse();
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
    if (step.options.some((option) => normalizeAnswer(option.command) === typed)) {
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
            <div className={`mb-3 rounded-lg border border-line bg-surface p-3 ${noCopyClass}`} {...noCopyProps}>
              {step.options.length > 1 && <p className="mb-2 text-xs font-semibold text-muted">{copy.typePickOne}</p>}
              <ul className="space-y-1.5">
                {step.options.map((option) => (
                  <li key={option.command} className="flex flex-wrap items-center gap-2">
                    {option.os && <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">{option.os}</span>}
                    <code data-command className="font-mono text-sm text-green-text">{option.command}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={course.copy.player.typePlaceholder}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            onPaste={(event) => event.preventDefault()}
            onDrop={(event) => event.preventDefault()}
            aria-label={course.copy.player.typePlaceholder}
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
