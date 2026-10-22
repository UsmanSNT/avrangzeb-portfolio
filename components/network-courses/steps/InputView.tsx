"use client";

import { useState, type FormEvent } from "react";
import type { InputStep } from "@/content/network-courses";
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

export function InputView({ step, onSolved }: StepViewProps<InputStep>) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [hintOpen, setHintOpen] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (status === "correct") return;
    const typed = normalizeAnswer(value);
    if (step.answers.some((answer) => normalizeAnswer(answer) === typed)) {
      setStatus("correct");
      onSolved();
    } else {
      setStatus("wrong");
    }
  };

  return (
    <div>
      <StepHeader badge={copy.quizBadge} title={step.question} />
      <form onSubmit={submit}>
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (status === "wrong") setStatus("idle");
          }}
          readOnly={status === "correct"}
          placeholder={step.placeholder ?? copy.inputPlaceholder}
          aria-label={step.placeholder ?? copy.inputPlaceholder}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className={inputClass}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" className={primaryButtonClass} disabled={status === "correct" || value.trim() === ""}>
            {copy.check}
          </button>
          {step.hint && status !== "correct" && !hintOpen && (
            <button type="button" className={secondaryButtonClass} onClick={() => setHintOpen(true)}>
              {copy.hint}
            </button>
          )}
        </div>
      </form>
      {hintOpen && status !== "correct" && <p className="mt-3 text-sm leading-6 text-muted">{step.hint}</p>}
      {status === "wrong" && <Feedback kind="bad">{copy.incorrect}</Feedback>}
      {status === "correct" && (
        <Feedback kind="ok">
          <span className="font-bold text-green-text">{copy.correct}</span> {step.explanation}
        </Feedback>
      )}
    </div>
  );
}
