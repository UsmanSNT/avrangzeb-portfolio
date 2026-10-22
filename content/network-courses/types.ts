/** Data-driven diagrams, rendered by components/network-courses/visuals. */
export type Visual =
  | {
      kind: "stack";
      /** Listed top to bottom. */
      layers: readonly { label: string; note?: string; accent?: boolean }[];
    }
  | {
      kind: "sequence";
      actors: readonly string[];
      /** `from` and `to` are indexes into `actors`. */
      messages: readonly { from: number; to: number; label: string }[];
    }
  | {
      kind: "topology";
      nodes: readonly { id: string; label: string; icon: "host" | "switch" | "router" | "cloud" | "server" }[];
      links: readonly (readonly [string, string])[];
    };

/** Short explanation: one idea per step. */
export type LearnStep = {
  type: "learn";
  title: string;
  body: string;
  points?: readonly string[];
  visual?: Visual;
  /** Sample terminal output / notation, rendered as a monospaced block. */
  terminal?: readonly string[];
};

/** Multiple choice; the learner must pick the right option to continue. */
export type QuizStep = {
  type: "quiz";
  question: string;
  options: readonly string[];
  answerIndex: number;
  explanation: string;
};

export type LabCommand = {
  command: string;
  /** What the command does, in one short sentence. */
  note: string;
  /** Operating system or tool the command belongs to, e.g. "Windows". */
  os?: string;
  /** What a failure of this command usually means (used in diagnostic sequences). */
  ifFails?: string;
};

/**
 * `sequence`: run all commands in the listed order (numbered).
 * `choose-one`: alternatives for different systems; run only the one that fits.
 */
export type LabCommands = {
  mode: "sequence" | "choose-one";
  items: readonly LabCommand[];
};

/** Hands-on task on a real machine or in Packet Tracer; each task is ticked off. */
export type LabStep = {
  type: "lab";
  title: string;
  tasks: readonly string[];
  commands?: LabCommands;
  expected: string;
};

/** Typing drill: the learner types ONE of the listed commands from memory `reps` times. */
export type TypeStep = {
  type: "type";
  title: string;
  prompt: string;
  /** Equivalent commands (usually one per operating system); typing any one counts. */
  options: readonly { command: string; os?: string }[];
  reps: number;
};

/** Free-text answer to a calculation or recall question. */
export type InputStep = {
  type: "input";
  question: string;
  answers: readonly string[];
  hint?: string;
  explanation: string;
  placeholder?: string;
};

/** Offline drill (paper, fingers, speaking) with an optional countdown. */
export type PracticeStep = {
  type: "practice";
  title: string;
  instructions: readonly string[];
  seconds?: number;
};

/** Toggle 8 bits to reach each target number. */
export type BinaryStep = {
  type: "binary";
  title: string;
  prompt: string;
  targets: readonly number[];
};

/** Put items in the right order; `items` are listed in the CORRECT order (the UI scrambles them). */
export type OrderStep = {
  type: "order";
  title: string;
  prompt: string;
  items: readonly string[];
};

/** Interactive CIDR prefix explorer. */
export type CidrStep = {
  type: "cidr";
  title: string;
  prompt: string;
};

export type Step =
  | LearnStep
  | QuizStep
  | LabStep
  | TypeStep
  | InputStep
  | PracticeStep
  | BinaryStep
  | OrderStep
  | CidrStep;

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  /** What the learner will be able to do after this lesson (shown on the intro screen). */
  goals: readonly string[];
  /** Tools needed for the labs, e.g. a terminal or Packet Tracer. */
  requires?: string;
  /** Key takeaways shown on the completion screen. */
  recap: readonly string[];
  steps: readonly Step[];
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
