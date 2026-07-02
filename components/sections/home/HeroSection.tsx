"use client";

import { motion } from "framer-motion";
import type { HomeDictionary } from "@/lib/i18n/types";
import { ArrowRightIcon, CloudIcon, DownloadIcon, GitHubIcon, MailIcon, ServerIcon, ShieldIcon } from "./icons";

interface HeroSectionProps {
  t: HomeDictionary;
  scrollToSection: (sectionId: string) => void;
  cvUrl: string | null;
  staticCvUrl: string;
  shouldReduceMotion: boolean | null;
}

const heroTechClasses = [
  "border-cyan-300/30 bg-cyan-300/[0.08] text-cyan-100",
  "border-violet-300/30 bg-violet-300/[0.08] text-violet-100",
  "border-emerald-300/30 bg-emerald-300/[0.08] text-emerald-100",
  "border-amber-300/30 bg-amber-300/[0.08] text-amber-100",
  "border-sky-300/30 bg-sky-300/[0.08] text-sky-100",
];

export function HeroSection({ t, scrollToSection, cvUrl, staticCvUrl, shouldReduceMotion }: HeroSectionProps) {
  const heroTitleParts = t.hero.title.split(" ");
  const heroPrimaryName = heroTitleParts.length > 1 ? heroTitleParts.slice(0, -1).join(" ") : t.hero.title;
  const heroAccentName = heroTitleParts.length > 1 ? heroTitleParts[heroTitleParts.length - 1] : "";
  const primarySpecialties = t.hero.specialties.slice(0, 4);
  const heroSignalCards = [
    {
      key: "security",
      icon: <ShieldIcon />,
      title: t.hero.visual.security,
      value: t.hero.visual.threatModel,
      detail: t.hero.visual.criticalRisks,
      className: "border-emerald-300/20 bg-emerald-300/[0.075] text-emerald-100",
    },
    {
      key: "server",
      icon: <ServerIcon />,
      title: t.hero.visual.server,
      value: t.hero.visual.edgeReady,
      detail: t.hero.visual.latency,
      className: "border-cyan-300/20 bg-cyan-300/[0.075] text-cyan-100",
    },
    {
      key: "ai",
      icon: <CloudIcon />,
      title: t.hero.visual.aiNetwork,
      value: t.hero.visual.nodes.join(" / "),
      detail: t.hero.terminal.status,
      className: "border-violet-300/20 bg-violet-300/[0.075] text-violet-100",
    },
  ];

  return (
    <section id="home" className="relative isolate overflow-hidden px-4 pt-20 text-white sm:px-6 sm:pt-24 lg:pt-28">
      <div className="absolute inset-0 bg-[#05070d]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(34,211,238,0.12)_0%,transparent_24%,rgba(139,92,246,0.12)_48%,transparent_70%,rgba(16,185,129,0.1)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black_0%,black_66%,transparent_96%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 pb-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-300/[0.08] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100 shadow-lg shadow-emerald-950/20 backdrop-blur-xl"
            >
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              {t.hero.availability}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 backdrop-blur-xl"
            >
              {t.hero.role}
            </motion.p>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65, ease: "easeOut" }}
            className="mt-6 max-w-[10ch] text-[3.25rem] font-black leading-[0.9] tracking-normal text-white min-[390px]:text-[3.75rem] sm:max-w-none sm:text-7xl lg:text-[5.75rem] xl:text-[6.6rem]"
          >
            {heroPrimaryName}
            {heroAccentName && (
              <span className="block bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                {heroAccentName}
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55 }}
            className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:text-xl lg:leading-8"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.55 }}
            className="mt-6 flex flex-wrap gap-2.5"
          >
            {t.hero.specialties.map((specialty, index) => (
              <span
                key={specialty}
                className={`rounded-lg border px-3.5 py-2 text-xs font-bold shadow-lg shadow-slate-950/10 backdrop-blur-xl sm:text-sm ${
                  heroTechClasses[index % heroTechClasses.length]
                }`}
              >
                {specialty}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.55 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-cyan-400/25 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <MailIcon />
              {t.hero.contact}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("my-projects")}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/[0.08] px-6 py-3.5 text-sm font-bold text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/[0.14] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <ArrowRightIcon />
              {t.hero.viewProjects}
            </button>
            <a
              href={cvUrl || staticCvUrl}
              download="Avrangzeb_CV.pdf"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <DownloadIcon />
              {t.hero.downloadResume}
            </a>
            <a
              href="https://github.com/UsmanSNT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.hero.githubAria}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <GitHubIcon />
              {t.hero.github}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.55 }}
            className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:grid-cols-4"
          >
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="border-white/10 p-4 odd:border-r sm:border-r sm:last:border-r-0">
                <p className="text-2xl font-black tracking-normal text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-[42rem] lg:max-w-none"
        >
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-300/40 via-white/10 to-violet-400/35 opacity-70 blur-sm" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/72 shadow-2xl shadow-slate-950/50 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>
                <span className="font-mono text-xs text-slate-400">{t.hero.visual.file}</span>
              </div>

              <div className="relative p-4 sm:p-5 lg:p-6">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" aria-hidden="true" />
                <div className="relative grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <motion.div
                      animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative min-h-72 overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/78 p-4 shadow-xl shadow-cyan-950/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                            {t.hero.visual.threatModel}
                          </p>
                          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">{t.hero.terminal.skills}</p>
                        </div>
                        <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-2 text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">{t.hero.visual.latency}</p>
                          <p className="mt-1 text-sm font-black text-white">{t.hero.visual.edgeReady}</p>
                        </div>
                      </div>

                      <div className="relative mt-6 h-44 overflow-hidden rounded-xl border border-white/10 bg-slate-900/65">
                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 220" fill="none" aria-hidden="true">
                          <path d="M58 112C108 48 162 150 210 92C258 34 308 126 362 68" stroke="url(#premiumHeroLineA)" strokeWidth="1.5" />
                          <path d="M60 154C118 108 178 188 236 138C292 88 340 162 382 112" stroke="url(#premiumHeroLineB)" strokeWidth="1.5" />
                          <path d="M74 70H158L212 112L300 78L356 132" stroke="rgba(255,255,255,0.12)" strokeDasharray="5 7" strokeWidth="1" />
                          <defs>
                            <linearGradient id="premiumHeroLineA" x1="58" y1="92" x2="362" y2="92">
                              <stop stopColor="#22d3ee" stopOpacity="0.1" />
                              <stop offset="0.45" stopColor="#67e8f9" stopOpacity="0.95" />
                              <stop offset="1" stopColor="#a78bfa" stopOpacity="0.25" />
                            </linearGradient>
                            <linearGradient id="premiumHeroLineB" x1="60" y1="142" x2="382" y2="142">
                              <stop stopColor="#a78bfa" stopOpacity="0.08" />
                              <stop offset="0.55" stopColor="#8b5cf6" stopOpacity="0.9" />
                              <stop offset="1" stopColor="#34d399" stopOpacity="0.28" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="absolute inset-x-6 top-7 flex justify-between">
                          {t.hero.visual.nodes.slice(0, 2).map((node, index) => (
                            <motion.div
                              key={node}
                              animate={shouldReduceMotion ? undefined : { y: [0, index === 0 ? -5 : 5, 0] }}
                              transition={{ duration: 4.5 + index, repeat: Infinity, ease: "easeInOut" }}
                              className="grid h-14 w-14 place-items-center rounded-xl border border-cyan-300/25 bg-slate-950/90 font-mono text-xs font-black text-cyan-100 shadow-lg shadow-cyan-500/10 backdrop-blur-xl"
                            >
                              {node}
                            </motion.div>
                          ))}
                        </div>
                        <div className="absolute inset-x-9 bottom-7 flex justify-between">
                          {t.hero.visual.nodes.slice(2).map((node, index) => (
                            <motion.div
                              key={node}
                              animate={shouldReduceMotion ? undefined : { y: [0, index === 0 ? 5 : -5, 0] }}
                              transition={{ duration: 4.8 + index, repeat: Infinity, ease: "easeInOut" }}
                              className="grid h-14 w-14 place-items-center rounded-xl border border-violet-300/25 bg-slate-950/90 font-mono text-xs font-black text-violet-100 shadow-lg shadow-violet-500/10 backdrop-blur-xl"
                            >
                              {node}
                            </motion.div>
                          ))}
                        </div>
                        <motion.div
                          animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.03, 1] }}
                          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-300/[0.1] text-emerald-100 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl"
                        >
                          <ShieldIcon />
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="grid gap-4">
                      {heroSignalCards.map((card, index) => (
                        <motion.div
                          key={card.key}
                          animate={shouldReduceMotion ? undefined : { x: [0, index % 2 === 0 ? 4 : -4, 0] }}
                          transition={{ duration: 5.2 + index * 0.45, repeat: Infinity, ease: "easeInOut" }}
                          className={`rounded-xl border p-4 shadow-xl shadow-slate-950/20 backdrop-blur-xl ${card.className}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg border border-white/10 bg-slate-950/50 text-white">
                              {card.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-300">{card.title}</p>
                              <p className="mt-1 text-lg font-black text-white">{card.value}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-400">{card.detail}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    {primarySpecialties.map((specialty, index) => (
                      <div
                        key={specialty}
                        className="rounded-xl border border-white/10 bg-white/[0.045] p-3 shadow-lg shadow-slate-950/10 backdrop-blur-xl"
                      >
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-2 text-sm font-bold leading-5 text-slate-100">{specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToSection("about")}
        aria-label={t.hero.scrollAria}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-3 backdrop-blur-xl transition-colors hover:border-cyan-300/40 lg:block"
        animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="block h-8 w-4 rounded-full border border-slate-500/70 p-1">
          <span className="mx-auto block h-1.5 w-1 rounded-full bg-cyan-300" />
        </span>
      </motion.button>
    </section>
  );
}
