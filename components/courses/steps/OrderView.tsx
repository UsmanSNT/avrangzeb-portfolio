"use client";

import { useState } from "react";
import type { OrderStep } from "@/content/network-courses";
import { copy, Feedback, secondaryButtonClass, StepHeader, type StepViewProps } from "./shared";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Deterministic, hydration-safe scramble: walk the list with a stride coprime to its length. */
function scramble<T>(items: readonly T[]): T[] {
  const n = items.length;
  let stride = 2;
  while (gcd(stride, n) !== 1) stride += 1;
  return items.map((_, index) => items[(index * stride) % n]);
}

export function OrderView({ step, onSolved }: StepViewProps<OrderStep>) {
  const [pool] = useState(() => scramble(step.items));
  const [picked, setPicked] = useState<readonly string[]>([]);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  const pick = (item: string) => {
    if (status === "correct") return;
    const next = [...picked, item];
    setPicked(next);
    if (next.length === step.items.length) {
      const ok = next.every((value, index) => value === step.items[index]);
      setStatus(ok ? "correct" : "wrong");
      if (ok) onSolved();
    } else {
      setStatus("idle");
    }
  };

  const remove = (item: string) => {
    if (status === "correct") return;
    setPicked((prev) => prev.filter((value) => value !== item));
    setStatus("idle");
  };

  const reset = () => {
    setPicked([]);
    setStatus("idle");
  };

  return (
    <div>
      <StepHeader badge={copy.interactiveBadge} title={step.title} />
      <p className="text-base leading-7 text-secondary">{step.prompt}</p>

      <ol className="mt-5 space-y-2" aria-label={step.title}>
        {step.items.map((_, index) => {
          const item = picked[index];
          return (
            <li key={index}>
              <button
                type="button"
                disabled={!item || status === "correct"}
                onClick={() => item && remove(item)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-medium sm:text-base ${
                  item
                    ? status === "correct"
                      ? "border-accent-green/60 bg-accent-green/10 text-foreground"
                      : status === "wrong"
                        ? "border-red-400/50 bg-red-400/10 text-foreground"
                        : "border-accent-cyan/50 bg-accent-cyan/10 text-foreground"
                    : "border-dashed border-line text-subtle"
                }`}
              >
                <span className="w-5 shrink-0 text-xs font-black text-muted">{index + 1}</span>
                {item ?? ""}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={copy.orderPickHint}>
        {pool.map((item) => {
          const used = picked.includes(item);
          return (
            <button
              key={item}
              type="button"
              disabled={used || status === "correct"}
              onClick={() => pick(item)}
              className="rounded-lg border border-line bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent-cyan/50 disabled:opacity-30"
            >
              {item}
            </button>
          );
        })}
      </div>

      {status === "wrong" && (
        <Feedback kind="bad">
          {copy.incorrect}{" "}
          <button type="button" className={`${secondaryButtonClass} ml-1 px-3 py-1.5`} onClick={reset}>
            {copy.orderReset}
          </button>
        </Feedback>
      )}
      {status === "correct" && <Feedback kind="ok">{copy.correct}</Feedback>}
      {status === "idle" && picked.length === 0 && <p className="mt-3 text-xs text-muted">{copy.orderPickHint}</p>}
    </div>
  );
}
