import type { Lesson } from "../network-courses/types";

/** An English course level. Shares the lesson step model with the network course. */
export type EnglishLevel = {
  id: string;
  order: number;
  title: string;
  description: string;
  /** What the learner can do after finishing this level. */
  outcome: string;
  lessons: readonly Lesson[];
};
