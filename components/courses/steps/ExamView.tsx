"use client";

import { useState } from "react";
import type { ExamStep } from "@/content/network-courses";
import { copy, Feedback, primaryButtonClass, StepHeader, type StepViewProps } from "./shared";

function shuffledIndexes(length: number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

type Phase = "intro" | "question" | "result";

/** Scored exam: questions in random order, one answer each, pass at `passPercent`. */
export function ExamView({ step, onSolved }: StepViewProps<ExamStep>) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<number[]>([]);
  const [position, setPosition] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [passed, setPassed] = useState(false);

  const total = step.questions.length;
  const question = phase === "question" ? step.questions[order[position]] : null;

  const start = () => {
    setOrder(shuffledIndexes(total));
    setPosition(0);
    setPicked(null);
    setWrongTopics([]);
    setCorrectCount(0);
    setPhase("question");
    window.scrollTo({ top: 0 });
  };

  const choose = (index: number) => {
    if (!question || picked !== null) return;
    setPicked(index);
    if (index === question.answerIndex) setCorrectCount((count) => count + 1);
    else setWrongTopics((topics) => (topics.includes(question.topic) ? topics : [...topics, question.topic]));
  };

  const advance = () => {
    if (position + 1 < total) {
      setPosition(position + 1);
      setPicked(null);
      window.scrollTo({ top: 0 });
      return;
    }
    const percent = Math.round((correctCount / total) * 100);
    const ok = percent >= step.passPercent;
    setPhase("result");
    if (ok && !passed) {
      setPassed(true);
      onSolved();
    }
    window.scrollTo({ top: 0 });
  };

  if (phase === "intro") {
    return (
      <div>
        <StepHeader badge={copy.examBadge} title={step.title} />
        <p className="text-base leading-7 text-secondary">{step.intro}</p>
        <p className="mt-4 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6 text-foreground">
          <span className="font-bold">{copy.examMeta(total, step.passPercent)}</span>
          <br />
          {copy.examRules}
        </p>
        <button type="button" className={`${primaryButtonClass} mt-6`} onClick={start}>
          {copy.examStart}
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const percent = Math.round((correctCount / total) * 100);
    const ok = percent >= step.passPercent;
    return (
      <div>
        <StepHeader badge={copy.examBadge} title={step.title} />
        <p className={`font-mono text-5xl font-black ${ok ? "text-green-text" : "text-red-400"}`}>{percent}%</p>
        <p className="mt-1 text-sm font-semibold text-muted">{copy.examScore(correctCount, total)}</p>
        {ok ? (
          <Feedback kind="ok">{copy.examPassed}</Feedback>
        ) : (
          <Feedback kind="bad">{copy.examFailed(step.passPercent)}</Feedback>
        )}
        {wrongTopics.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{copy.examTopics}</h3>
            <ul className="flex flex-wrap gap-2">
              {wrongTopics.map((topic) => (
                <li key={topic} className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-foreground">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" className={`${primaryButtonClass} mt-6`} onClick={start}>
          {copy.examRetry}
        </button>
      </div>
    );
  }

  if (!question) return null;
  const answered = picked !== null;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="inline-flex rounded-md border border-accent-green/30 bg-accent-green/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-green-text">
          {copy.examBadge}
        </p>
        <span className="text-xs font-semibold tabular-nums text-muted">{copy.examProgress(position + 1, total)}</span>
      </div>
      <div className="mb-5 flex gap-0.5" aria-hidden="true">
        {order.map((_, index) => (
          <span key={index} className={`h-1 flex-1 rounded-full ${index < position || (index === position && answered) ? "bg-accent-cyan" : "bg-line"}`} />
        ))}
      </div>
      <h2 className="text-xl font-black leading-snug text-foreground sm:text-2xl">{question.question}</h2>
      <div className="mt-5 grid gap-2.5" role="group" aria-label={question.question}>
        {question.options.map((option, index) => {
          const isAnswer = index === question.answerIndex;
          const isPicked = index === picked;
          const stateClass = !answered
            ? "border-line bg-card hover:border-accent-cyan/50"
            : isAnswer
              ? "border-accent-green bg-accent-green/10"
              : isPicked
                ? "border-red-400/50 bg-red-400/10"
                : "border-line bg-card opacity-60";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              aria-pressed={isPicked}
              onClick={() => choose(index)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium text-foreground transition-colors disabled:cursor-default sm:text-base ${stateClass}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-xs font-bold text-muted" aria-hidden="true">
                {answered && isAnswer ? "✓" : answered && isPicked ? "✕" : String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <Feedback kind={picked === question.answerIndex ? "ok" : "bad"}>
          <span className="font-bold">{picked === question.answerIndex ? copy.correct : copy.examWrong}</span> {question.explanation}
        </Feedback>
      )}
      {answered && (
        <button type="button" className={`${primaryButtonClass} mt-5`} onClick={advance}>
          {position + 1 < total ? copy.examNext : copy.examFinish}
        </button>
      )}
    </div>
  );
}
