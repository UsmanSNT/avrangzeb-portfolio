"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import type { ShowcaseProject } from "@/lib/i18n/types";

type ProjectCardProps = {
  project: ShowcaseProject;
  liveDemoLabel: string;
  githubLabel: string;
  caseStudyLabel: string;
  featuredLabel: string;
};

function ProjectCardComponent({ project, liveDemoLabel, githubLabel, caseStudyLabel, featuredLabel }: ProjectCardProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <article
      onClick={() => setIsOverlayOpen((value) => !value)}
      onMouseLeave={() => setIsOverlayOpen(false)}
      className="group relative aspect-[4/5] w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/30 ring-1 ring-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-cyan-500/20 focus-within:border-cyan-300/50"
    >
      <Image
        src={project.image}
        alt={`${project.title} project preview`}
        fill
        sizes="(min-width: 1024px) 384px, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 mix-blend-screen`} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="rounded-lg border border-cyan-300/40 bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100 backdrop-blur-md">
              {featuredLabel}
            </span>
          )}
          <span className="rounded-lg border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md">
            {project.year}
          </span>
        </div>
        <h3 className="text-2xl font-black leading-tight text-white">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{project.shortDescription}</p>
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-end bg-slate-950/88 p-4 backdrop-blur-md transition-all duration-300 sm:p-5 ${
          isOverlayOpen ? "opacity-100" : "opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
        }`}
      >
        <div className="mb-auto flex items-center justify-between gap-3">
          <span className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100">
            {project.category}
          </span>
          <span className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold text-emerald-100">
            {project.status}
          </span>
        </div>

        <h3 className="text-2xl font-black leading-tight text-white">{project.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300">{project.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-2">
          <Link
            href={`/projects/${project.slug}`}
            onClick={(event) => event.stopPropagation()}
            aria-label={`View case study for ${project.title}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-400/10 px-3.5 py-2 text-xs font-bold text-cyan-100 transition-all duration-300 hover:border-cyan-200/70 hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {caseStudyLabel}
          </Link>

          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={`Open live demo for ${project.title}`}
              className={`inline-flex min-h-10 items-center justify-center rounded-lg bg-gradient-to-r ${project.color} px-3.5 py-2 text-xs font-bold text-white transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
            >
              {liveDemoLabel}
            </a>

            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                aria-label={`Open GitHub repository for ${project.title}`}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-bold text-slate-200 transition-all duration-300 hover:border-slate-300/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {githubLabel}
              </a>
            ) : (
              <button
                type="button"
                disabled
                onClick={(event) => event.stopPropagation()}
                aria-label={`GitHub repository for ${project.title} is not available yet`}
                className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs font-bold text-slate-500"
              >
                {githubLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
