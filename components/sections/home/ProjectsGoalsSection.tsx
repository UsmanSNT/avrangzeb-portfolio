import type { ReactNode } from "react";
import type { HomeDictionary } from "@/lib/i18n/types";
import { CloudIcon, CodeIcon, ServerIcon, ShieldIcon } from "./icons";

const serviceVisuals: {
  icon: ReactNode;
  accent: string;
  panel: string;
  glow: string;
}[] = [
  {
    icon: <CodeIcon />,
    accent: "from-accent-cyan to-accent-blue",
    panel: "border-accent-cyan/25 bg-accent-cyan/[0.075]",
    glow: "shadow-accent-cyan/15",
  },
  {
    icon: <ServerIcon />,
    accent: "from-accent-blue to-accent-blue-deep",
    panel: "border-accent-blue/25 bg-accent-blue/[0.075]",
    glow: "shadow-accent-blue/15",
  },
  {
    icon: <CloudIcon />,
    accent: "from-accent-green to-accent-cyan",
    panel: "border-accent-green/25 bg-accent-green/[0.075]",
    glow: "shadow-accent-green/15",
  },
  {
    icon: <ShieldIcon />,
    accent: "from-accent-blue-deep to-accent-cyan",
    panel: "border-accent-blue/25 bg-accent-blue/[0.075]",
    glow: "shadow-accent-blue/15",
  },
];

interface ProjectsGoalsSectionProps {
  t: HomeDictionary;
}

export function ProjectsGoalsSection({ t }: ProjectsGoalsSectionProps) {
  const services = t.projects.projectsList.slice(0, 4);

  return (
    <section id="projects" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <div className="absolute inset-0 bg-surface" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_86%_18%,rgba(47,226,138,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(2,6,23,0.82))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_78%,transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-lg border border-accent-cyan/20 bg-accent-cyan/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-text shadow-lg shadow-accent-cyan/20 backdrop-blur-xl">
              {t.projects.inProgress}
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-normal text-foreground sm:text-4xl">
              {t.projects.title}
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-sm leading-6 text-secondary sm:text-base">
              {services[0]?.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((service) => (
                <span
                  key={service.title}
                  className="rounded-lg border border-line bg-hover/[0.045] px-3 py-2 text-xs font-bold text-foreground backdrop-blur-xl"
                >
                  {service.title}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const visual = serviceVisuals[index] ?? serviceVisuals[0];

            return (
              <article
                key={service.title}
                className={`group relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 sm:p-5 ${visual.panel} ${visual.glow}`}
              >
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${visual.accent} opacity-80`} aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-line bg-background/50 text-foreground transition-transform duration-300 group-hover:scale-105">
                    {visual.icon}
                  </div>
                  <span className="font-mono text-xs font-black text-subtle">
                  {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-black leading-tight text-foreground sm:text-xl">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-secondary">
                  {service.description}
                </p>
                <div className={`mt-5 h-px bg-gradient-to-r ${visual.accent} opacity-45`} aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
