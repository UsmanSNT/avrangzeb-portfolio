"use client";

import { useEffect, useRef, useState } from "react";
import type { CliStep } from "@/content/network-courses";
import { matchesAnyExactCommand, matchesAnyIosCommand } from "./iosMatch";
import {
  copy,
  Feedback,
  noCopyClass,
  noCopyProps,
  primaryButtonClass,
  secondaryButtonClass,
  StepHeader,
  type StepViewProps,
} from "./shared";

/** Simulated Cisco IOS session: the learner types every command of the scenario in order. */
export function CliView({ step, onSolved }: StepViewProps<CliStep>) {
  const [index, setIndex] = useState(0);
  const [entered, setEntered] = useState<readonly string[]>([]);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const total = step.lines.length;
  const finished = index >= total;
  const line = finished ? null : step.lines[index];
  const lastLine = index > 0 ? step.lines[index - 1] : null;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    if (!finished) inputRef.current?.focus({ preventScroll: true });
  }, [index, finished]);

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!line) return;
    const matches = step.shell === "linux" ? matchesAnyExactCommand : matchesAnyIosCommand;
    if (matches(value, line.accept)) {
      setEntered((prev) => [...prev, value.trim()]);
      setValue("");
      setFailed(false);
      setHintOpen(false);
      const next = index + 1;
      setIndex(next);
      if (next >= total) onSolved();
    } else {
      setFailed(true);
    }
  };

  return (
    <div>
      <StepHeader badge={copy.cliBadge} title={step.title} />
      <p className="text-base leading-7 text-secondary">{step.scenario}</p>

      <div className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-muted">{copy.cliProgress(Math.min(index, total), total)}</span>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          {...noCopyProps}
          className={`max-h-72 overflow-y-auto px-3 py-3 font-mono text-[13px] leading-6 sm:text-sm ${noCopyClass}`}
        >
          {step.lines.slice(0, index).map((done, i) => (
            <div key={i}>
              <p className="break-words">
                <span className="text-cyan-text">{done.prompt}</span>
                <span className="text-foreground">{entered[i]}</span>
              </p>
              {done.output?.map((out, k) => (
                <p key={k} className="whitespace-pre-wrap break-words text-muted">
                  {out}
                </p>
              ))}
            </div>
          ))}

          {line && (
            <form onSubmit={submit} className="flex flex-wrap items-center gap-x-1">
              <label htmlFor="cli-input" className="text-cyan-text">
                {line.prompt}
              </label>
              <input
                id="cli-input"
                ref={inputRef}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  if (failed) setFailed(false);
                }}
                onPaste={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                aria-describedby="cli-task"
                className="min-w-[8rem] flex-1 bg-transparent text-foreground caret-accent-green outline-none"
              />
            </form>
          )}
        </div>
      </div>

      {lastLine && (
        <p className="mt-4 text-sm leading-6 text-secondary">
          <span className="font-bold text-green-text">✓ {lastLine.accept[0]}</span> — {lastLine.explain}
        </p>
      )}

      {line && (
        <div className="mt-4 rounded-xl border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-3">
          <p id="cli-task" className="text-sm leading-6 text-foreground sm:text-base">
            <span className="font-bold text-cyan-text">{copy.cliTask(index + 1)}: </span>
            {line.task}
          </p>
          {hintOpen && (
            <p className={`mt-2 font-mono text-sm text-green-text ${noCopyClass}`} {...noCopyProps}>
              <span data-cli-hint>{line.accept[0]}</span>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={`${primaryButtonClass} px-4 py-2`} disabled={value.trim() === ""} onClick={submit}>
              {copy.cliRun}
            </button>
            {!hintOpen && (
              <button type="button" className={`${secondaryButtonClass} px-4 py-2`} onClick={() => setHintOpen(true)}>
                {copy.hint}
              </button>
            )}
          </div>
        </div>
      )}

      {failed && <Feedback kind="bad">{copy.cliWrong}</Feedback>}

      {finished && <Feedback kind="ok">{copy.cliDone}</Feedback>}
      {index === 0 && (
        <p className="mt-3 text-xs leading-5 text-muted">{step.shell === "linux" ? copy.cliLinuxNote : copy.cliAbbrevNote}</p>
      )}
    </div>
  );
}
