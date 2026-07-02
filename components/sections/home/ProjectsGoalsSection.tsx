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
    accent: "from-cyan-300 to-blue-500",
    panel: "border-cyan-300/25 bg-cyan-300/[0.075]",
    glow: "shadow-cyan-500/15",
  },
  {
    icon: <ServerIcon />,
    accent: "from-violet-300 to-fuchsia-500",
    panel: "border-violet-300/25 bg-violet-300/[0.075]",
    glow: "shadow-violet-500/15",
  },
  {
    icon: <CloudIcon />,
    accent: "from-emerald-300 to-cyan-500",
    panel: "border-emerald-300/25 bg-emerald-300/[0.075]",
    glow: "shadow-emerald-500/15",
  },
  {
    icon: <ShieldIcon />,
    accent: "from-amber-200 to-orange-500",
    panel: "border-amber-300/25 bg-amber-300/[0.075]",
    glow: "shadow-amber-500/15",
  },
];

interface ProjectsGoalsSectionProps {
  t: HomeDictionary;
}

export function ProjectsGoalsSection({ t }: ProjectsGoalsSectionProps) {
  const [featuredService, ...secondaryServices] = t.projects.projectsList;
  const metrics = t.hero.stats.slice(0, 3);

  return (
    <section id="projects" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-[#070a12]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_86%_18%,rgba(139,92,246,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(2,6,23,0.82))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_78%,transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
              {t.projects.inProgress}
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-black leading-[0.95] tracking-normal text-white sm:text-5xl lg:text-6xl">
              {t.projects.title}
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-7 text-slate-300 sm:text-lg">
              {t.hero.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {t.hero.specialties.slice(0, 4).map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur-xl"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <article className="group relative min-h-[28rem] overflow-hidden rounded-2xl border border-white/12 bg-white/[0.045] p-5 shadow-2xl shadow-slate-950/35 backdrop-blur-2xl sm:p-7 lg:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),transparent_34%,rgba(139,92,246,0.18)_72%,rgba(16,185,129,0.12))] opacity-80" aria-hidden="true" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-xl border border-cyan-200/25 bg-slate-950/55 text-cyan-100 shadow-xl shadow-cyan-500/10 backdrop-blur-xl">
                  {serviceVisuals[0].icon}
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 font-mono text-xs font-bold text-slate-300">
                  01
                </div>
              </div>

              <div>
                <h3 className="max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl">
                  {featuredService.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  {featuredService.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                    <p className="text-2xl font-black text-white">{metric.value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            {secondaryServices.map((service, index) => {
              const visual = serviceVisuals[index + 1] ?? serviceVisuals[0];

              return (
                <article
                  key={service.title}
                  className={`group relative overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 ${visual.panel} ${visual.glow}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${visual.accent} opacity-80`} aria-hidden="true" />
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-950/50 text-white transition-transform duration-300 group-hover:scale-105">
                      {visual.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-500">
                          {String(index + 2).padStart(2, "0")}
                        </span>
                        <span className={`h-px flex-1 bg-gradient-to-r ${visual.accent} opacity-45`} />
                      </div>
                      <h3 className="text-xl font-black leading-tight text-white sm:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl">
          <div className="grid divide-y divide-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
            {t.projects.projectsList.map((service, index) => (
              <div key={service.title} className="flex items-center gap-3 p-4 sm:p-5">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.045] font-mono text-xs font-black text-cyan-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-bold leading-5 text-slate-200">{service.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
