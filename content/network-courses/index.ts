import { advancedLevel } from "./advanced";
import type { CourseLevel } from "./types";
import { beginnerLevel } from "./beginner";
import { intermediateLevel } from "./intermediate";

export type {
  CourseLevel,
  CourseLevelId,
  Lesson,
  Step,
  Visual,
  LearnStep,
  QuizStep,
  LabStep,
  LabCommand,
  LabCommands,
  TypeStep,
  InputStep,
  PracticeStep,
  BinaryStep,
  OrderStep,
  CidrStep,
  CliStep,
  CliLine,
  TrainerStep,
  ExamStep,
  ExamQuestion,
} from "./types";

/** Levels with published lessons, in learning order. */
export const publishedLevels: readonly CourseLevel[] = [beginnerLevel, intermediateLevel, advancedLevel];

export type UpcomingLevel = { id: string; order: number; title: string; description: string };

/** Levels announced on the roadmap but not written yet. */
export const upcomingLevels: readonly UpcomingLevel[] = [];
