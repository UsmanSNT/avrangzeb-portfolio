"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "network-courses:progress:v2";
const EMPTY_SNAPSHOT = JSON.stringify({ completed: [], position: {} });

type StoredProgress = {
  completed: string[];
  /** Index of the step the learner was last on, per lesson id. */
  position: Record<string, number>;
};

const listeners = new Set<() => void>();
// Fallback used when localStorage is blocked, so progress still works for this visit.
let memorySnapshot = EMPTY_SNAPSHOT;

function readSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memorySnapshot;
  } catch {
    return memorySnapshot;
  }
}

function writeSnapshot(value: string) {
  memorySnapshot = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
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

function update(mutate: (progress: StoredProgress) => void) {
  const progress = parse(readSnapshot());
  mutate(progress);
  writeSnapshot(JSON.stringify(progress));
}

/** Per-browser lesson progress (completed lessons and last step), persisted in localStorage. */
export function useLessonProgress() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY_SNAPSHOT);
  const progress = useMemo(() => parse(snapshot), [snapshot]);
  const completed = useMemo<ReadonlySet<string>>(() => new Set(progress.completed), [progress]);

  const setPosition = useCallback((lessonId: string, step: number) => {
    update((p) => {
      p.position[lessonId] = step;
    });
  }, []);

  const markCompleted = useCallback((lessonId: string) => {
    update((p) => {
      if (!p.completed.includes(lessonId)) p.completed.push(lessonId);
      delete p.position[lessonId];
    });
  }, []);

  return { completed, position: progress.position, setPosition, markCompleted };
}
