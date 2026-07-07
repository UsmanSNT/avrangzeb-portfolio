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
      className="group relative aspect-[4/5] w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-line bg-background shadow-2xl shadow-elevation/30 ring-1 ring-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-accent-cyan/40 hover:shadow-accent-cyan/20 focus-within:border-accent-cyan/50"
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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="rounded-lg border border-accent-cyan/40 bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-text backdrop-blur-md">
              {featuredLabel}
            </span>
          )}
          <span className="rounded-lg border border-line bg-background/70 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur-md">
            {project.year}
          </span>
        </div>
        <h3 className="text-2xl font-black leading-tight text-foreground">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-secondary">{project.shortDescription}</p>
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-end bg-background/88 p-4 backdrop-blur-md transition-all duration-300 sm:p-5 ${
          isOverlayOpen ? "opacity-100" : "opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
        }`}
      >
        <div className="mb-auto flex items-center justify-between gap-3">
          <span className="rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-text">
            {project.category}
          </span>
          <span className="rounded-lg border border-accent-green/25 bg-accent-green/10 px-2.5 py-1 text-[10px] font-bold text-green-text">
            {project.status}
          </span>
        </div>

        <h3 className="text-2xl font-black leading-tight text-foreground">{project.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-secondary">{project.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-lg border border-line bg-hover/[0.10] px-2.5 py-1 text-[11px] font-semibold text-foreground">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-2">
          <Link
            href={`/projects/${project.slug}`}
            onClick={(event) => event.stopPropagation()}
            aria-label={`View case study for ${project.title}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3.5 py-2 text-xs font-bold text-cyan-text transition-all duration-300 hover:border-accent-cyan/70 hover:bg-accent-cyan/20 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-surface"
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
              className={`inline-flex min-h-10 items-center justify-center rounded-lg bg-gradient-to-r ${project.color} px-3.5 py-2 text-xs font-bold text-white transition-all duration-300 hover:shadow-xl hover:shadow-accent-cyan/20 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-surface`}
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
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-hover/[0.09] px-3.5 py-2 text-xs font-bold text-foreground transition-all duration-300 hover:border-secondary/60 hover:bg-hover/10 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-surface"
              >
                {githubLabel}
              </a>
            ) : (
              <button
                type="button"
                disabled
                onClick={(event) => event.stopPropagation()}
                aria-label={`GitHub repository for ${project.title} is not available yet`}
                className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-line bg-hover/[0.05] px-3.5 py-2 text-xs font-bold text-subtle"
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
