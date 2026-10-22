"use client";

import { useState } from "react";
import type { LabStep } from "@/content/network-courses";
import { copy, noCopyClass, noCopyProps, StepHeader, type StepViewProps } from "./shared";

export function LabView({ step, onSolved }: StepViewProps<LabStep>) {
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());

  const toggle = (index: number) => {
    const next = new Set(checked);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setChecked(next);
    if (next.size === step.tasks.length) onSolved();
  };

  return (
    <div>
      <StepHeader badge={copy.labBadge} title={step.title} />

      <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{copy.tasks}</h3>
      <ul className="space-y-2">
        {step.tasks.map((task, index) => {
          const isChecked = checked.has(index);
          return (
            <li key={task}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggle(index)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-6 transition-colors sm:text-base ${
                  isChecked ? "border-accent-green/50 bg-accent-green/10 text-foreground" : "border-line bg-card text-secondary hover:border-accent-cyan/40"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-black ${
                    isChecked ? "border-accent-green bg-accent-green text-inverse" : "border-line"
                  }`}
                  aria-hidden="true"
                >
                  {isChecked ? "✓" : ""}
                </span>
                {task}
              </button>
            </li>
          );
        })}
      </ul>

      {step.commands && (
        <div className="mt-5">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-cyan-text">
            {step.commands.mode === "sequence" ? copy.commandsSequence : copy.commandsChooseOne}
          </h3>
          <p className="mb-3 mt-1 text-xs leading-5 text-muted">{copy.commandsNoCopy}</p>
          <ol className="space-y-2" {...noCopyProps}>
            {step.commands.items.map((item, index) => (
              <li key={`${index}-${item.command}`} className={`rounded-xl border border-line bg-surface p-3 ${noCopyClass}`}>
                <div className="flex items-start gap-3">
                  {step.commands?.mode === "sequence" && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-green/15 text-xs font-black text-green-text" aria-hidden="true">
                      {index + 1}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <code className="break-words font-mono text-sm font-bold text-green-text">{item.command}</code>
                      {item.os && <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">{item.os}</span>}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-secondary">{item.note}</p>
                    {item.ifFails && (
                      <p className="mt-1 text-xs leading-5 text-muted">
                        <span className="font-bold text-foreground">{copy.ifFails}: </span>
                        {item.ifFails}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="mt-5 rounded-xl border border-line bg-background/60 px-4 py-3 text-sm leading-6 text-secondary">
        <span className="font-bold text-foreground">{copy.expected}: </span>
        {step.expected}
      </p>
    </div>
  );
}
