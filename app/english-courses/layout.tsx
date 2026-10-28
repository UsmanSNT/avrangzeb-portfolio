import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CourseProvider } from "@/components/courses/CourseProvider";

export const metadata: Metadata = {
  title: "Ingliz tili darslari | Avrangzeb Abdujalilov",
  description:
    "IT mutaxassisi uchun ingliz tili: 0 dan erkin suhbatgacha bosqichma-bosqich darslar. Qoida, misol va ovoz chiqarib mashq, INTP uchun mo'ljallangan usul bilan.",
};

export default function EnglishCoursesLayout({ children }: { children: ReactNode }) {
  return <CourseProvider courseId="english">{children}</CourseProvider>;
}
