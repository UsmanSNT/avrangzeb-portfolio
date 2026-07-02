"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/app/components/ProjectCard";
import type { HomeDictionary, ProjectFilter } from "@/lib/i18n/types";

const projectFilterOptions: ProjectFilter[] = ["all", "web", "backend", "ai", "cybersecurity", "mobile"];

interface MyProjectsSectionProps {
  t: HomeDictionary;
}

export function MyProjectsSection({ t }: MyProjectsSectionProps) {
  const [activeProjectFilter, setActiveProjectFilter] = useState<ProjectFilter>("all");
  const filteredProjects = useMemo(
    () =>
      activeProjectFilter === "all"
        ? t.myProjects.projects
        : t.myProjects.projects.filter((project) => project.categoryKey === activeProjectFilter),
    [activeProjectFilter, t.myProjects.projects]
  );

  return (
    <section id="my-projects" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <div className="absolute inset-0 bg-[#05070d]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.25),rgba(2,6,23,0.9)),linear-gradient(115deg,rgba(34,211,238,0.1),transparent_36%,rgba(139,92,246,0.1)_74%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_78%,transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-7 grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-violet-100">
              {t.myProjects.featured}
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">
              {t.myProjects.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base lg:justify-self-end">
            {t.myProjects.subtitle}
          </p>
        </div>

        <div className="mb-5 overflow-x-auto pb-1.5">
          <div className="flex w-max min-w-full gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:w-auto sm:flex-wrap">
            {projectFilterOptions.map((filter) => {
              const isActive = activeProjectFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveProjectFilter(filter)}
                  className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    isActive
                      ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-500/15"
                      : "border-transparent text-slate-400 hover:bg-white/[0.07] hover:text-slate-100"
                  }`}
                >
                  {t.myProjects.filters[filter]}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div key={activeProjectFilter} className="mx-auto grid w-full max-w-4xl justify-items-center gap-4 transition-all duration-300 sm:gap-5 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                liveDemoLabel={t.myProjects.viewProject}
                githubLabel={t.myProjects.github}
                caseStudyLabel={t.myProjects.caseStudy}
                featuredLabel={t.myProjects.featured}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center shadow-2xl shadow-slate-950/25 backdrop-blur-2xl">
            <h3 className="mb-2 text-xl font-bold text-white">{t.myProjects.emptyState.title}</h3>
            <p className="text-sm text-slate-400">{t.myProjects.emptyState.description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
