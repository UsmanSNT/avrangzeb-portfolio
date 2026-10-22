import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelView } from "@/components/network-courses/LevelView";
import { findLevel, publishedLevels } from "@/content/network-courses";

type PageProps = { params: Promise<{ levelId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLevels.map((level) => ({ levelId: level.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { levelId } = await params;
  const found = findLevel(levelId);
  if (!found) return {};
  return {
    title: `${found.level.order}-bosqich: ${found.level.title} | Tarmoq darslari`,
    description: found.level.description,
  };
}

export default async function NetworkLevelPage({ params }: PageProps) {
  const { levelId } = await params;
  if (!findLevel(levelId)) notFound();
  return <LevelView levelId={levelId} />;
}
