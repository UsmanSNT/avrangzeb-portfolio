import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/courses/LessonPlayer";
import { allLessons, courses, findLesson } from "@/content/courses";

type PageProps = { params: Promise<{ lessonId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allLessons(courses.network).map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const found = findLesson(courses.network, lessonId);
  if (!found) return {};
  return {
    title: `${found.lesson.title} | Tarmoq darslari`,
    description: found.lesson.summary,
  };
}

export default async function NetworkLessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  if (!findLesson(courses.network, lessonId)) notFound();
  return <LessonPlayer lessonId={lessonId} />;
}
