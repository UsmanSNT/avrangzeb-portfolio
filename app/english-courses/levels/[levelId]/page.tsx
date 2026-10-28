import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelView } from "@/components/courses/LevelView";
import { courses, findLevel } from "@/content/courses";

type PageProps = { params: Promise<{ levelId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.english.levels.map((level) => ({ levelId: level.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { levelId } = await params;
  const found = findLevel(courses.english, levelId);
  if (!found) return {};
  return {
    title: `${found.level.order}-bosqich: ${found.level.title} | Ingliz tili darslari`,
    description: found.level.description,
  };
}

export default async function EnglishLevelPage({ params }: PageProps) {
  const { levelId } = await params;
  if (!findLevel(courses.english, levelId)) notFound();
  return <LevelView levelId={levelId} />;
}
