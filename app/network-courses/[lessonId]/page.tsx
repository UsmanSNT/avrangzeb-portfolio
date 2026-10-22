import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/network-courses/LessonPlayer";
import { allLessons, findLesson } from "@/content/network-courses";

type PageProps = { params: Promise<{ lessonId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allLessons.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const found = findLesson(lessonId);
  if (!found) return {};
  return {
    title: `${found.lesson.title} | Tarmoq darslari`,
    description: found.lesson.summary,
  };
}

export default async function NetworkLessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  if (!findLesson(lessonId)) notFound();
  return <LessonPlayer lessonId={lessonId} />;
}
