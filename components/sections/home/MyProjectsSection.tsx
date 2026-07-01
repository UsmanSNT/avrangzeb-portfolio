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
    <section id="my-projects" className="relative overflow-hidden py-12 sm:py-16 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.55))]" aria-hidden="true"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 text-left sm:mb-8 lg:mb-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              Portfolio
            </span>
            <h2 className="flex items-center gap-3 text-3xl font-black tracking-normal text-white sm:text-4xl lg:text-[2.75rem]">
              <span className="text-xl sm:text-2xl lg:text-3xl" aria-hidden="true">💼</span>
              <span className="gradient-text">{t.myProjects.title}</span>
          </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            {t.myProjects.subtitle}
          </p>
          </div>
          <div className="hidden h-px w-52 flex-none bg-gradient-to-r from-cyan-300/35 via-slate-700 to-transparent lg:block"></div>
        </div>

        <div className="mb-6 overflow-x-auto pb-1.5 sm:mb-7">
          <div className="flex w-max min-w-full gap-1.5 rounded-xl border border-white/10 bg-slate-950/55 p-1.5 shadow-xl shadow-slate-950/20 backdrop-blur-md sm:w-auto sm:flex-wrap sm:justify-center">
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
                      ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-500/15"
                      : "border-transparent text-slate-400 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:text-slate-100"
                  }`}
                >
                  {t.myProjects.filters[filter]}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div
            key={activeProjectFilter}
            className="grid gap-5 transition-all duration-300 sm:gap-6 lg:grid-cols-2 xl:gap-7"
          >
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
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 px-6 py-10 text-center shadow-xl shadow-slate-950/20 transition-all duration-300">
            <h3 className="mb-2 text-xl font-bold text-white">{t.myProjects.emptyState.title}</h3>
            <p className="text-sm text-slate-400">{t.myProjects.emptyState.description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
