import type { ReactNode } from "react";
import { networkCoursesCopy } from "@/content/network-courses/copy";

export const copy = networkCoursesCopy.player;

export type StepViewProps<T> = {
  step: T;
  /** Called once the learner has satisfied the step; lets the player enable "Continue". */
  onSolved: () => void;
};

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/^[>$#]\s*/, "");
}

export function StepHeader({ badge, title }: { badge?: string; title: string }) {
  return (
    <header className="mb-5">
      {badge && (
        <p className="mb-2 inline-flex rounded-md border border-accent-green/30 bg-accent-green/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-green-text">
          {badge}
        </p>
      )}
      <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">{title}</h2>
    </header>
  );
}

export function TerminalBlock({ lines }: { lines: readonly string[] }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-surface p-4 font-mono text-xs leading-6 text-green-text sm:text-sm">
      <code>{lines.join("\n")}</code>
    </pre>
  );
}

export function Feedback({ kind, children }: { kind: "ok" | "bad"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${
        kind === "ok"
          ? "border-accent-green/40 bg-accent-green/10 text-foreground"
          : "border-red-400/40 bg-red-400/10 text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3 font-mono text-base text-foreground outline-none transition-colors placeholder:text-subtle focus:border-accent-cyan";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-accent-green px-5 py-3 text-sm font-bold text-inverse transition-colors hover:bg-accent-cyan disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-line px-4 py-3 text-sm font-semibold text-secondary transition-colors hover:border-accent-cyan/40 hover:text-foreground";
