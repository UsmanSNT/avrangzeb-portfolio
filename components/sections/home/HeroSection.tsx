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

export function HeroSection({ t, scrollToSection, cvUrl, staticCvUrl, shouldReduceMotion }: HeroSectionProps) {
  const heroTitleParts = t.hero.title.split(" ");
  const heroPrimaryName = heroTitleParts.length > 1 ? heroTitleParts.slice(0, -1).join(" ") : t.hero.title;
  const heroAccentName = heroTitleParts.length > 1 ? heroTitleParts[heroTitleParts.length - 1] : "";
  const heroSignalCards = [
    {
      key: "security",
      icon: <ShieldIcon />,
      title: t.hero.visual.security,
      value: t.hero.visual.threatModel,
      detail: t.hero.visual.criticalRisks,
      accent: "emerald",
    },
    {
      key: "server",
      icon: <ServerIcon />,
      title: t.hero.visual.server,
      value: t.hero.visual.edgeReady,
      detail: t.hero.visual.latency,
      accent: "cyan",
    },
    {
      key: "ai",
      icon: <CloudIcon />,
      title: t.hero.visual.aiNetwork,
      value: t.hero.visual.nodes.join(" / "),
      detail: t.hero.terminal.status,
      accent: "violet",
    },
  ] as const;

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden px-4 pt-20 sm:px-6 sm:pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020617_0%,#0f172a_48%,#020617_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(to_bottom,black,transparent_84%)] sm:bg-[size:48px_48px]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/8 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-center gap-6 pb-10 sm:gap-8 lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10 xl:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl pt-2 sm:pt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-xl shadow-cyan-500/10 backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]" aria-hidden="true" />
              {t.hero.availability}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.6, ease: "easeOut" }}
              className="mt-4 max-w-[11ch] text-[2.65rem] font-black leading-[0.9] tracking-normal text-white min-[380px]:text-[3rem] sm:max-w-none sm:text-6xl lg:text-[5.35rem] xl:text-7xl"
            >
              {heroPrimaryName}
              {heroAccentName && <span className="block gradient-text">{heroAccentName}</span>}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
              className="mt-4 max-w-xl text-sm font-medium uppercase tracking-[0.18em] text-slate-400 sm:mt-5 sm:text-xs lg:text-sm"
            >
              {t.hero.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 min-[380px]:text-base sm:leading-7 lg:text-lg"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.55 }}
              className="mt-4 flex flex-wrap gap-2.5"
            >
              {t.hero.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-100 backdrop-blur-xl sm:px-3.5 sm:text-sm"
                >
                  {specialty}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.55 }}
              className="mt-6 grid gap-3 sm:grid-cols-2"
            >
              <button
                onClick={() => scrollToSection("my-projects")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <ArrowRightIcon />
                {t.hero.viewProjects}
              </button>
              <a
                href={cvUrl || staticCvUrl}
                download="Avrangzeb_CV.pdf"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <DownloadIcon />
                {t.hero.downloadResume}
              </a>
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-bold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <MailIcon />
                {t.hero.contact}
              </button>
              <a
                href="https://github.com/UsmanSNT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.hero.githubAria}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-slate-950/40 px-5 py-3 text-sm font-bold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/40 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <GitHubIcon />
                {t.hero.github}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.55 }}
              className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4"
            >
              {t.hero.stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-3 shadow-lg shadow-slate-950/10 backdrop-blur-xl sm:p-4">
                  <p className="text-xl font-black text-white sm:text-2xl lg:text-[2rem]">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[38rem] lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-3 shadow-2xl shadow-slate-950/45 backdrop-blur-2xl sm:rounded-[2rem] sm:p-4">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:26px_26px] opacity-60" aria-hidden="true" />
              <div className="relative grid gap-3">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/88 shadow-lg shadow-slate-950/25"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/90" />
                    </div>
                    <span className="font-mono text-xs text-slate-500">{t.hero.visual.file}</span>
                  </div>
                  <div className="space-y-3 px-4 py-4 font-mono text-[13px] leading-6 text-slate-300 sm:text-sm">
                    <p className="text-cyan-100">{t.hero.terminal.whoami}</p>
                    <p className="text-slate-300">{t.hero.terminal.skills}</p>
                    <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                      {t.hero.terminal.status}
                    </p>
                  </div>
                </motion.div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {heroSignalCards.map((card, index) => (
                    <motion.div
                      key={card.key}
                      animate={shouldReduceMotion ? undefined : { y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                      transition={{ duration: 5.5 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`rounded-[1.4rem] border p-4 shadow-lg shadow-slate-950/20 backdrop-blur-xl ${
                        card.accent === "emerald"
                          ? "border-emerald-300/15 bg-emerald-300/[0.06]"
                          : card.accent === "cyan"
                            ? "border-cyan-300/15 bg-cyan-300/[0.06]"
                            : "border-violet-300/15 bg-violet-300/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-2.5 text-slate-100">
                          {card.icon}
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Live</span>
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-100">{card.title}</p>
                      <p className="mt-1 text-base font-black text-white sm:text-lg">{card.value}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{card.detail}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-900/72 p-4 shadow-lg shadow-slate-950/20"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:22px_22px] opacity-60" aria-hidden="true" />
                  <div className="relative flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t.hero.visual.threatModel}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-200">{t.hero.visual.security}</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-200">{t.hero.visual.server}</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-200">{t.hero.visual.aiNetwork}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-2 text-right">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100">{t.hero.visual.latency}</p>
                      <p className="mt-1 text-sm font-bold text-white">{t.hero.visual.edgeReady}</p>
                    </div>
                  </div>

                  <div className="relative mt-4 h-44 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/85 sm:h-52">
                    <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 420 220" fill="none" aria-hidden="true">
                      <path d="M64 88C116 34 166 136 214 88C262 40 314 144 366 88" stroke="url(#heroLineA)" strokeWidth="1.5" />
                      <path d="M68 152C126 104 184 188 240 142C294 98 342 156 380 116" stroke="url(#heroLineB)" strokeWidth="1.5" />
                      <defs>
                        <linearGradient id="heroLineA" x1="64" y1="84" x2="366" y2="84">
                          <stop stopColor="#22d3ee" stopOpacity="0.05" />
                          <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.95" />
                          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="heroLineB" x1="68" y1="148" x2="380" y2="148">
                          <stop stopColor="#8b5cf6" stopOpacity="0.05" />
                          <stop offset="0.5" stopColor="#a78bfa" stopOpacity="0.9" />
                          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                      {t.hero.visual.nodes.slice(0, 2).map((node, index) => (
                        <motion.div
                          key={node}
                          animate={shouldReduceMotion ? undefined : { y: [0, index === 0 ? -4 : 4, 0], opacity: [0.82, 1, 0.82] }}
                          transition={{ duration: 4.5 + index, repeat: Infinity, ease: "easeInOut" }}
                          className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-slate-900/88 font-mono text-[10px] font-bold text-cyan-100 shadow-lg shadow-cyan-500/10 backdrop-blur-xl sm:h-14 sm:w-14 sm:text-xs"
                        >
                          {node}
                        </motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-8 left-10 flex items-center gap-3">
                      {t.hero.visual.nodes.slice(2).map((node, index) => (
                        <motion.div
                          key={node}
                          animate={shouldReduceMotion ? undefined : { y: [0, index === 0 ? 4 : -4, 0], opacity: [0.82, 1, 0.82] }}
                          transition={{ duration: 4.8 + index, repeat: Infinity, ease: "easeInOut" }}
                          className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/20 bg-slate-900/88 font-mono text-[10px] font-bold text-violet-100 shadow-lg shadow-violet-500/10 backdrop-blur-xl sm:h-14 sm:w-14 sm:text-xs"
                        >
                          {node}
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], scale: [1, 1.03, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.4rem] border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200 shadow-xl shadow-emerald-500/10 backdrop-blur-xl"
                    >
                      <ShieldIcon />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
          type="button"
          onClick={() => scrollToSection("about")}
          aria-label={t.hero.scrollAria}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.04] p-2 backdrop-blur-xl transition-colors hover:border-cyan-300/40 lg:block"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="block h-10 w-6 rounded-full border border-slate-500/70 p-1">
            <span className="mx-auto block h-2 w-1 rounded-full bg-cyan-300" />
          </span>
        </motion.button>
      </section>

      {/* Legacy Hero Section */}
      <section id="legacy-home" className="hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 animate-float">
            <div className="w-28 h-28 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 p-1 animate-pulse-glow">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/profile.png"
                  alt="Abdujalilov Avrangzeb"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span class="text-4xl sm:text-5xl flex items-center justify-center w-full h-full bg-slate-900">*</span>';
                  }}
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">{t.hero.title}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-3 sm:mb-4">
            {t.hero.subtitle}
          </p>
          <p className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <button
              onClick={() => scrollToSection("projects")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              {t.hero.viewProjects}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-6 sm:px-8 py-3 sm:py-4 border border-cyan-500/50 rounded-full font-semibold text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm sm:text-base"
            >
              {t.hero.contact}
            </button>
          </div>

          {/* Terminal Animation */}
          <div className="mt-10 sm:mt-16 max-w-xl mx-auto px-2 sm:px-0">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-slate-500">terminal</span>
              </div>
              <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-left">
                <p className="text-green-400">$ whoami</p>
                <p className="text-slate-300 mb-2 break-all">{t.hero.terminal.whoami}</p>
                <p className="text-green-400">$ cat skills.txt</p>
                <p className="text-slate-300 mb-2 break-all">{t.hero.terminal.skills}</p>
                <p className="text-green-400">$ echo $STATUS</p>
                <p className="text-cyan-400">{t.hero.terminal.status}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
