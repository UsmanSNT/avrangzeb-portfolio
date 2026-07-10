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
  previewLabels: {
    close: string;
    previous: string;
    next: string;
  };
};

function ProjectCardComponent({
  project,
  liveDemoLabel,
  githubLabel,
  caseStudyLabel,
  featuredLabel,
  previewLabels,
}: ProjectCardProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const previewImages = project.previewImages ?? [];
  const hasPreviewImages = previewImages.length > 0;
  const hasCaseStudyPage = project.hasCaseStudyPage !== false;
  const hasDemoUrl = project.demoUrl.trim().length > 0;
  const hasGithubUrl = project.githubUrl.trim().length > 0;
  const activePreview = previewImages[activePreviewIndex];

  const openPreview = () => {
    setActivePreviewIndex(0);
    setIsPreviewOpen(true);
  };

  const showPreviousPreview = () => {
    if (!previewImages.length) return;
    setActivePreviewIndex((index) => (index === 0 ? previewImages.length - 1 : index - 1));
  };

  const showNextPreview = () => {
    if (!previewImages.length) return;
    setActivePreviewIndex((index) => (index + 1) % previewImages.length);
  };

  return (
    <>
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
            {hasPreviewImages ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openPreview();
                }}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3.5 py-2 text-xs font-bold text-cyan-text transition-all duration-300 hover:border-accent-cyan/70 hover:bg-accent-cyan/20 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-surface"
              >
                {caseStudyLabel}
              </button>
            ) : hasCaseStudyPage ? (
              <Link
                href={`/projects/${project.slug}`}
                onClick={(event) => event.stopPropagation()}
                aria-label={`View case study for ${project.title}`}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3.5 py-2 text-xs font-bold text-cyan-text transition-all duration-300 hover:border-accent-cyan/70 hover:bg-accent-cyan/20 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-surface"
              >
                {caseStudyLabel}
              </Link>
            ) : null}

            {(hasDemoUrl || hasGithubUrl) && (
              <div className={`grid gap-2 ${hasDemoUrl && hasGithubUrl ? "sm:grid-cols-2" : ""}`}>
                {hasDemoUrl && (
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
                )}

                {hasGithubUrl ? (
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
                ) : hasDemoUrl ? (
                  <button
                    type="button"
                    disabled
                    onClick={(event) => event.stopPropagation()}
                    aria-label={`GitHub repository for ${project.title} is not available yet`}
                    className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-line bg-hover/[0.05] px-3.5 py-2 text-xs font-bold text-subtle"
                  >
                    {githubLabel}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </article>

      {isPreviewOpen && activePreview && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <div
            className="grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-background shadow-2xl shadow-elevation/40 lg:grid-cols-[1.05fr_0.95fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[360px] bg-surface sm:min-h-[520px]">
              <Image
                src={activePreview.src}
                alt={activePreview.alt}
                fill
                sizes="(min-width: 1024px) 540px, 100vw"
                className="object-contain p-3 sm:p-5"
              />
              <div className="absolute left-3 top-3 rounded-lg border border-line bg-background/85 px-3 py-1.5 text-xs font-bold text-foreground backdrop-blur">
                {activePreview.group}
              </div>
              <div className="absolute bottom-3 right-3 rounded-lg border border-line bg-background/85 px-3 py-1.5 text-xs font-bold text-muted backdrop-blur">
                {activePreviewIndex + 1} / {previewImages.length}
              </div>
            </div>

            <div className="flex max-h-[92vh] flex-col overflow-y-auto p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 inline-flex rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-text">
                    {project.category}
                  </p>
                  <h3 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">{project.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-lg border border-line bg-hover/[0.08] px-3 py-2 text-xs font-bold text-secondary transition-colors hover:text-foreground"
                >
                  {previewLabels.close}
                </button>
              </div>

              <p className="text-sm leading-6 text-secondary">{project.overview}</p>

              {project.facts && (
                <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                  {project.facts.map((fact) => (
                    <div key={fact.label} className="rounded-xl border border-line bg-hover/[0.06] p-3">
                      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{fact.label}</dt>
                      <dd className="mt-1 text-sm font-bold text-foreground">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-lg border border-line bg-hover/[0.10] px-2.5 py-1 text-[11px] font-semibold text-foreground">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <div className="mb-4 flex justify-center gap-1.5">
                  {previewImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setActivePreviewIndex(index)}
                      aria-label={image.alt}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activePreviewIndex ? "w-7 bg-accent-cyan" : "w-2.5 bg-hover/[0.18] hover:bg-hover/[0.3]"
                      }`}
                    />
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={showPreviousPreview}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-hover/[0.08] px-4 py-2 text-sm font-bold text-secondary transition-colors hover:bg-hover/[0.12] hover:text-foreground"
                  >
                    {previewLabels.previous}
                  </button>
                  <button
                    type="button"
                    onClick={showNextPreview}
                    className={`inline-flex min-h-10 items-center justify-center rounded-lg bg-gradient-to-r ${project.color} px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-xl hover:shadow-accent-cyan/20`}
                  >
                    {previewLabels.next}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
