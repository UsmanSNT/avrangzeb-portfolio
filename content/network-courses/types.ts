export type LessonCheck = {
  question: string;
  options: readonly string[];
  answerIndex: number;
  explanation: string;
};

export type LessonLab = {
  title: string;
  /** Step-by-step instructions the learner performs on a real machine or in Packet Tracer. */
  steps: readonly string[];
  /** Commands to type by hand; rendered as a code block. */
  commands?: readonly string[];
  /** What the learner should see when the lab is done correctly. */
  expected: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  theory: readonly string[];
  labs: readonly LessonLab[];
  /** Short repetition drills that build muscle memory (typing, drawing, counting). */
  drills: readonly string[];
  checks: readonly LessonCheck[];
};

export type CourseLevelId = "beginner" | "intermediate" | "advanced";

export type CourseLevel = {
  id: CourseLevelId;
  order: number;
  title: string;
  description: string;
  /** Question every learner should be able to answer after finishing this level. */
  outcome: string;
  lessons: readonly Lesson[];
};
