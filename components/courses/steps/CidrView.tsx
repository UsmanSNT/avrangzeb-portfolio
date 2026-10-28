"use client";

import { useState } from "react";
import type { CidrStep } from "@/content/network-courses";
import { copy, Feedback, StepHeader, type StepViewProps } from "./shared";

const MIN_PREFIX = 8;
const MAX_PREFIX = 30;
const REQUIRED_VALUES = 3;

function maskOctets(prefix: number): number[] {
  return [0, 1, 2, 3].map((i) => {
    const bits = Math.min(8, Math.max(0, prefix - i * 8));
    return 256 - 2 ** (8 - bits);
  });
}

function groupDigits(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function CidrView({ step, onSolved }: StepViewProps<CidrStep>) {
  const [prefix, setPrefix] = useState(24);
  const [visited, setVisited] = useState<ReadonlySet<number>>(new Set([24]));
  const [solved, setSolved] = useState(false);

  const change = (value: number) => {
    setPrefix(value);
    const next = new Set(visited).add(value);
    setVisited(next);
    if (!solved && next.size >= REQUIRED_VALUES) {
      setSolved(true);
      onSolved();
    }
  };

  const hostBits = 32 - prefix;
  const total = 2 ** hostBits;

  return (
    <div>
      <StepHeader badge={copy.interactiveBadge} title={step.title} />
      <p className="text-base leading-7 text-secondary">{step.prompt}</p>

      <div className="mt-6 rounded-2xl border border-line bg-card p-4 sm:p-5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="cidr-prefix" className="text-xs font-semibold uppercase tracking-wider text-muted">
            {copy.cidrPrefix}
          </label>
          <span className="font-mono text-3xl font-black text-foreground">/{prefix}</span>
        </div>
        <input
          id="cidr-prefix"
          type="range"
          min={MIN_PREFIX}
          max={MAX_PREFIX}
          value={prefix}
          onChange={(event) => change(Number(event.target.value))}
          className="mt-3 w-full accent-accent-cyan"
        />

        <div className="mt-4 grid grid-cols-8 gap-0.5 sm:grid-cols-16" aria-hidden="true">
          {Array.from({ length: 32 }, (_, index) => (
            <span key={index} className={`h-3 rounded-sm ${index < prefix ? "bg-accent-cyan" : "bg-line"}`} />
          ))}
        </div>
        <p className="mt-2 flex justify-between text-xs text-muted">
          <span>{prefix} {copy.cidrNetworkBits}</span>
          <span>{hostBits} {copy.cidrHostBits}</span>
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{copy.cidrMask}</dt>
            <dd className="mt-1 font-mono text-sm font-bold text-foreground sm:text-base">{maskOctets(prefix).join(".")}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{copy.cidrBlock}</dt>
            <dd className="mt-1 font-mono text-sm font-bold text-foreground sm:text-base">{groupDigits(total)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{copy.cidrHosts}</dt>
            <dd className="mt-1 font-mono text-sm font-bold text-green-text sm:text-base">{groupDigits(total - 2)}</dd>
          </div>
        </dl>
      </div>

      {solved ? <Feedback kind="ok">{copy.correct}</Feedback> : <p className="mt-3 text-xs text-muted">{copy.cidrTry}</p>}
    </div>
  );
}
