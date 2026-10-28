"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useCourse } from "./CourseProvider";

const EMPTY_SNAPSHOT = JSON.stringify({ completed: [], position: {} });

type StoredProgress = {
  completed: string[];
  /** Index of the step the learner was last on, per lesson id. */
  position: Record<string, number>;
};

const listeners = new Set<() => void>();
// Fallback used when localStorage is blocked, so progress still works for this visit. One entry per course.
const memorySnapshots = new Map<string, string>();

function readSnapshot(storageKey: string): string {
  const fallback = memorySnapshots.get(storageKey) ?? EMPTY_SNAPSHOT;
  try {
    return window.localStorage.getItem(storageKey) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeSnapshot(storageKey: string, value: string) {
  memorySnapshots.set(storageKey, value);
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // Storage unavailable (private mode); the in-memory copy keeps this visit consistent.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function parse(snapshot: string): StoredProgress {
  try {
    const raw: unknown = JSON.parse(snapshot);
    if (typeof raw !== "object" || raw === null) return { completed: [], position: {} };
    const { completed, position } = raw as Partial<StoredProgress>;
    return {
      completed: Array.isArray(completed) ? completed.filter((id): id is string => typeof id === "string") : [],
      position:
        typeof position === "object" && position !== null
          ? Object.fromEntries(Object.entries(position).filter(([, value]) => Number.isInteger(value) && value >= 0))
          : {},
    };
  } catch {
    return { completed: [], position: {} };
  }
}

function update(storageKey: string, mutate: (progress: StoredProgress) => void) {
  const progress = parse(readSnapshot(storageKey));
  mutate(progress);
  writeSnapshot(storageKey, JSON.stringify(progress));
}

/** Per-browser lesson progress (completed lessons and last step), persisted in localStorage. */
export function useLessonProgress() {
  const { storageKey } = useCourse();
  const snapshot = useSyncExternalStore(
    subscribe,
    () => readSnapshot(storageKey),
    () => EMPTY_SNAPSHOT,
  );
  const progress = useMemo(() => parse(snapshot), [snapshot]);
  const completed = useMemo<ReadonlySet<string>>(() => new Set(progress.completed), [progress]);

  const setPosition = useCallback(
    (lessonId: string, step: number) => {
      update(storageKey, (p) => {
        p.position[lessonId] = step;
      });
    },
    [storageKey],
  );

  const markCompleted = useCallback(
    (lessonId: string) => {
      update(storageKey, (p) => {
        if (!p.completed.includes(lessonId)) p.completed.push(lessonId);
        delete p.position[lessonId];
      });
    },
    [storageKey],
  );

  return { completed, position: progress.position, setPosition, markCompleted };
}
