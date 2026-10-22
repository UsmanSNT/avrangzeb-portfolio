"use client";

import { useState } from "react";
import type { LabStep } from "@/content/network-courses";
import { copy, StepHeader, TerminalBlock, type StepViewProps } from "./shared";

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
          <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-text">{copy.commands}</h3>
          <TerminalBlock lines={step.commands} />
        </div>
      )}

      <p className="mt-5 rounded-xl border border-line bg-background/60 px-4 py-3 text-sm leading-6 text-secondary">
        <span className="font-bold text-foreground">{copy.expected}: </span>
        {step.expected}
      </p>
    </div>
  );
}
