import type { HomeDictionary } from "@/lib/i18n/types";
import { CloudIcon, CodeIcon, NetworkIcon, ServerIcon, ShieldIcon } from "./icons";

const skillGroups = [
  {
    title: "Frontend",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    icon: <CodeIcon />,
    className: "border-cyan-300/20 bg-cyan-300/[0.07]",
  },
  {
    title: "Backend",
    tools: ["API Routes", "Supabase", "Postgres", "Auth"],
    icon: <ServerIcon />,
    className: "border-violet-300/20 bg-violet-300/[0.07]",
  },
  {
    title: "AI Workflows",
    tools: ["Automation", "Prompt Systems", "Data Flows", "Internal Tools"],
    icon: <CloudIcon />,
    className: "border-emerald-300/20 bg-emerald-300/[0.07]",
  },
  {
    title: "Security",
    tools: ["Route Protection", "RLS Awareness", "Secure Uploads", "Network Basics"],
    icon: <ShieldIcon />,
    className: "border-amber-300/20 bg-amber-300/[0.07]",
  },
];

const platformTools = [
  "Git",
  "Docker",
  "Linux",
  "PowerShell",
  "REST APIs",
  "Wireshark",
  "Nmap",
  "Vercel",
  "AWS",
  "Azure",
  "Cisco",
  "MikroTik",
  "DNS",
  "TCP/IP",
];

interface SkillsSectionProps {
  t: HomeDictionary;
}

export function SkillsSection({ t }: SkillsSectionProps) {
  return (
    <section id="skills" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-[#060913]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.9))]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100">
              {t.skills.title}
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-black leading-[0.98] text-white sm:text-5xl">
              {t.skills.headline}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {t.about.passion}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group) => (
            <article key={group.title} className={`rounded-2xl border p-5 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl ${group.className}`}>
              <div className="mb-8 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-slate-950/45 text-white">
                  {group.icon}
                </div>
                <NetworkIcon />
              </div>
              <h3 className="text-2xl font-black text-white">{group.title}</h3>
              <div className="mt-5 grid gap-2">
                {group.tools.map((tool) => (
                  <div key={tool} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/35 px-3 py-2">
                    <span className="text-sm font-semibold text-slate-200">{tool}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-black text-white">{t.skills.additional}</h3>
            <p className="text-sm text-slate-400">{t.skills.cybersecurity}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {platformTools.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-cyan-300/35 hover:text-cyan-100"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
