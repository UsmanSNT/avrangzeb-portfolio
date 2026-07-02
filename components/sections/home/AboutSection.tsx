import type { HomeDictionary } from "@/lib/i18n/types";
import { CodeIcon, ServerIcon, ShieldIcon } from "./icons";

const trustCards = [
  { value: "MVP", tone: "text-cyan-200", icon: <CodeIcon /> },
  { value: "API", tone: "text-violet-200", icon: <ServerIcon /> },
  { value: "SEC", tone: "text-emerald-200", icon: <ShieldIcon /> },
];

interface AboutSectionProps {
  t: HomeDictionary;
}

export function AboutSection({ t }: AboutSectionProps) {
  return (
    <section id="about" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070d_0%,#080b14_58%,#05070d_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-violet-100">
            {t.about.title}
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[0.98] tracking-normal text-white sm:text-5xl">
            {t.about.greeting} <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">Abdujalilov Avrangzeb</span>
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-slate-300 sm:text-lg">
            <p>{t.about.intro}</p>
            <p>{t.about.passion}</p>
            <p>{t.about.goal}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {trustCards.map((card, index) => (
                <div key={card.value} className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
                  <div className={`mb-5 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/[0.04] ${card.tone}`}>
                    {card.icon}
                  </div>
                  <p className="text-2xl font-black text-white">{card.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {index === 0 ? t.hero.specialties[0] : index === 1 ? t.hero.specialties[1] : t.skills.cybersecurity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.065] p-5 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100">{t.about.education}</p>
              <p className="mt-3 text-lg font-black text-white">{t.about.university}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{t.about.faculty}</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">{t.about.years}</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.065] p-5 shadow-xl shadow-emerald-950/20 backdrop-blur-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100">{t.about.certificates}</p>
              <p className="mt-3 text-lg font-black text-white">CCNA / Network+ / LPIC-1</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t.about.preparingCerts}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
