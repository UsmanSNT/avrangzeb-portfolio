"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import type { ShowcaseProject } from "@/lib/i18n/types";

type ProjectCardProps = {
  project: ShowcaseProject;
  liveDemoLabel: string;
  githubLabel: string;
  caseStudyLabel: string;
  featuredLabel: string;
};

function ProjectCardComponent({ project, liveDemoLabel, githubLabel, caseStudyLabel, featuredLabel }: ProjectCardProps) {
  const cardSizeClass = project.featured ? "md:col-span-2 xl:grid xl:grid-cols-[1.08fr_0.92fr]" : "";
  const imageHeightClass = project.featured ? "h-72 sm:h-96 xl:h-full" : "h-64 sm:h-72";
  const contentPaddingClass = project.featured ? "p-6 sm:p-8 lg:p-10" : "p-5 sm:p-6";
  const titleSizeClass = project.featured ? "text-3xl sm:text-4xl" : "text-2xl";

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/30 ring-1 ring-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-300/40 hover:shadow-cyan-500/20 focus-within:border-cyan-300/50 ${cardSizeClass}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-500 group-hover:opacity-15`}
        aria-hidden="true"
      />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

      <div className={`relative overflow-hidden bg-slate-900 ${imageHeightClass}`}>
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes={project.featured ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" aria-hidden="true" />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 mix-blend-screen`} aria-hidden="true" />
        {project.featured && (
          <span className="absolute left-5 top-5 rounded-full border border-cyan-300/40 bg-slate-950/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 shadow-lg shadow-cyan-500/15 backdrop-blur-md">
            {featuredLabel}
          </span>
        )}
      </div>

      <div className={`relative flex h-full flex-col ${contentPaddingClass}`}>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 shadow-sm shadow-cyan-500/10">
            {project.category}
          </span>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
            {project.status}
          </span>
          <span className="ml-auto rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">{project.year}</span>
        </div>

        <h3 className={`mb-4 font-bold tracking-normal text-white transition-colors group-hover:text-cyan-200 ${titleSizeClass}`}>
          {project.title}
        </h3>

        <p className="mb-6 text-sm leading-7 text-slate-400 sm:text-base">
          {project.shortDescription}
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`View case study for ${project.title}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/70 hover:bg-cyan-400/20 hover:shadow-lg hover:shadow-cyan-500/15 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {caseStudyLabel}
          </Link>

          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open live demo for ${project.title}`}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${project.color} px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
          >
            {liveDemoLabel}
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open GitHub repository for ${project.title}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:col-span-2 xl:col-span-1"
            >
              {githubLabel}
            </a>
          ) : (
            <span
              aria-label={`GitHub repository for ${project.title} is not available yet`}
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-bold text-slate-500 sm:col-span-2 xl:col-span-1"
            >
              {githubLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
