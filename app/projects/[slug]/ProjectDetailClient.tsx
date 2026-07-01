"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getHomeDictionary } from "@/content/locales";
import { defaultLocale, isSupportedLocale, languageStorageKey } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/types";

type ProjectDetailClientProps = {
  slug: string;
};

export function ProjectDetailClient({ slug }: ProjectDetailClientProps) {
  const [language, setLanguage] = useState<Locale>(defaultLocale);
  const t = getHomeDictionary(language);
  const project = useMemo(
    () => t.myProjects.projects.find((item) => item.slug === slug),
    [slug, t.myProjects.projects]
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem(languageStorageKey);

    if (isSupportedLocale(savedLanguage)) {
      const timer = window.setTimeout(() => setLanguage(savedLanguage), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  if (!project) {
    return null;
  }

  const detailSections = [
    { title: t.myProjects.details.overview, content: project.overview },
    { title: t.myProjects.details.problem, content: project.problem },
    { title: t.myProjects.details.solution, content: project.solution },
  ];

  const listSections = [
    { title: t.myProjects.details.keyFeatures, items: project.keyFeatures },
    { title: t.myProjects.details.challenges, items: project.challenges },
    { title: t.myProjects.details.lessonsLearned, items: project.lessonsLearned },
    { title: t.myProjects.details.futureImprovements, items: project.futureImprovements },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#my-projects"
            className="mb-8 inline-flex items-center rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {t.myProjects.backToProjects}
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  {project.category}
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {project.status}
                </span>
                <span className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300">
                  {project.year}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-bold tracking-normal text-white sm:text-5xl">
                {project.title}
              </h1>
              <p className="mb-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                {project.shortDescription}
              </p>

              <div className="mb-8 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-r ${project.color} px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950`}
                >
                  {t.myProjects.viewProject}
                </a>

                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    {t.myProjects.github}
                  </a>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-500">
                    {t.myProjects.github}
                  </span>
                )}
              </div>
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-500/10 sm:h-96">
              <Image
                src={project.image}
                alt={`${project.title} project preview`}
                fill
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {detailSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-slate-700 bg-slate-800/45 p-5 sm:p-6">
                <h2 className="mb-3 text-xl font-semibold text-white">{section.title}</h2>
                <p className="leading-7 text-slate-400">{section.content}</p>
              </article>
            ))}
          </div>

          <div className="space-y-6">
            {listSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-slate-700 bg-slate-800/45 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">{section.title}</h2>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
