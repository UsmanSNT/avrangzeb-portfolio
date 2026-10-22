"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "network-courses:completed-lessons:v1";
const EMPTY_SNAPSHOT = "[]";

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

function parseIds(snapshot: string): string[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/** Per-browser lesson completion, persisted in localStorage. */
export function useLessonProgress() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY_SNAPSHOT);
  const completed = useMemo<ReadonlySet<string>>(() => new Set(parseIds(snapshot)), [snapshot]);

  const toggle = useCallback((lessonId: string) => {
    const next = new Set(parseIds(readSnapshot()));
    if (next.has(lessonId)) next.delete(lessonId);
    else next.add(lessonId);
    writeSnapshot(JSON.stringify([...next]));
  }, []);

  return { completed, toggle };
}
