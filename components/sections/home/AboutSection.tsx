import type { HomeDictionary } from "@/lib/i18n/types";
import { CodeIcon, ServerIcon, ShieldIcon } from "./icons";

const profileIcons = [<ShieldIcon key="degree" />, <ServerIcon key="graduated" />, <CodeIcon key="position" />];

interface AboutSectionProps {
  t: HomeDictionary;
}

export function AboutSection({ t }: AboutSectionProps) {
  const profileItems = [
    {
      label: t.about.university,
      value: t.about.university,
      detail: t.about.education,
    },
    {
      label: t.about.degree,
      value: t.about.degreeValue,
      detail: t.about.faculty,
    },
    {
      label: t.about.graduated,
      value: t.about.graduatedValue,
      detail: t.about.currentPositionValue,
    },
    {
      label: t.about.currentPosition,
      value: t.about.currentPositionValue,
      detail: t.skills.additional,
    },
  ];

  return (
    <section id="about" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--surface)_0%,var(--card)_58%,var(--surface)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-green/50 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-lg border border-accent-green/20 bg-accent-green/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-green-text">
              {t.about.title}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal text-foreground sm:text-4xl">
              {t.about.education}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-secondary sm:text-base">
              {t.about.preparingCerts}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {profileItems.map((item, index) => (
              <article key={`${item.label}-${item.value}`} className="rounded-2xl border border-line bg-hover/[0.045] p-4 shadow-2xl shadow-elevation/25 backdrop-blur-2xl sm:p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-background/55 text-cyan-text">
                    {profileIcons[index % profileIcons.length]}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-subtle">{item.label}</p>
                </div>
                <h3 className="text-xl font-black text-foreground">{item.value}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
