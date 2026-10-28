"use client";

import { createContext, useContext, type ReactNode } from "react";
import { courses, type Course, type CourseId } from "@/content/courses";

const CourseContext = createContext<Course | null>(null);

/** Makes one course (its copy, levels and storage key) available to the course components below it. */
export function CourseProvider({ courseId, children }: { courseId: CourseId; children: ReactNode }) {
  return <CourseContext.Provider value={courses[courseId]}>{children}</CourseContext.Provider>;
}

export function useCourse(): Course {
  const course = useContext(CourseContext);
  if (!course) throw new Error("useCourse must be used inside a CourseProvider");
  return course;
}
