import type { LearnStep } from "@/content/network-courses";
import { VisualBlock } from "../Visuals";
import { StepHeader, TerminalBlock } from "./shared";

export function LearnView({ step }: { step: LearnStep }) {
  return (
    <div>
      <StepHeader title={step.title} />
      <p className="text-base leading-8 text-secondary sm:text-lg">{step.body}</p>

      {step.points && (
        <ul className="mt-5 space-y-2">
          {step.points.map((point) => (
            <li key={point} className="flex gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6 text-foreground sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {step.terminal && (
        <div className="mt-5">
          <TerminalBlock lines={step.terminal} />
        </div>
      )}

      {step.visual && (
        <div className="mt-6 rounded-2xl border border-line bg-background/60 p-4 sm:p-5">
          <VisualBlock visual={step.visual} />
        </div>
      )}
    </div>
  );
}
