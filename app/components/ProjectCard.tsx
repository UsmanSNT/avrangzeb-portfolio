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
  const cardSizeClass = project.featured ? "md:col-span-2 lg:grid lg:grid-cols-[1.1fr_0.9fr]" : "";
  const imageHeightClass = project.featured ? "h-56 sm:h-72 lg:h-full" : "h-48 sm:h-56";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 focus-within:border-cyan-500/60 ${cardSizeClass}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
        aria-hidden="true"
      />

      <div className={`relative overflow-hidden bg-slate-900 ${imageHeightClass}`}>
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes={project.featured ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" aria-hidden="true" />
        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur-sm">
            {featuredLabel}
          </span>
        )}
      </div>

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            {project.category}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {project.status}
          </span>
          <span className="ml-auto text-xs font-medium text-slate-500">{project.year}</span>
        </div>

        <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-cyan-300 sm:text-2xl">
          {project.title}
        </h3>

        <p className="mb-5 text-sm leading-6 text-slate-400 sm:text-base">
          {project.shortDescription}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded bg-slate-700/60 px-2.5 py-1 text-xs text-slate-300">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`View case study for ${project.title}`}
            className="inline-flex items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {caseStudyLabel}
          </Link>

          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open live demo for ${project.title}`}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${project.color} px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
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
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {githubLabel}
            </a>
          ) : (
            <span
              aria-label={`GitHub repository for ${project.title} is not available yet`}
              className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-500"
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
