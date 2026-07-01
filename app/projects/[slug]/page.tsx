import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHomeDictionary } from "@/content/locales";
import { defaultLocale } from "@/lib/i18n/config";
import { ProjectDetailClient } from "./ProjectDetailClient";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const defaultDictionary = getHomeDictionary(defaultLocale);

function getProjectBySlug(slug: string) {
  return defaultDictionary.myProjects.projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return defaultDictionary.myProjects.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | ${defaultDictionary.myProjects.caseStudy}`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | ${defaultDictionary.myProjects.caseStudy}`,
      description: project.shortDescription,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  if (!getProjectBySlug(slug)) {
    notFound();
  }

  return <ProjectDetailClient slug={slug} />;
}
