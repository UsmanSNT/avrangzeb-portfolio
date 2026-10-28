"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/app/components/Logo";
import { SectionsDropdown } from "@/components/SectionsDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCourse } from "./CourseProvider";

/** Site navigation and background shared by the course roadmap and level pages. */
export function CourseShell({ children }: { children: ReactNode }) {
  const { copy } = useCourse();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-line bg-background/78 shadow-2xl shadow-elevation/20 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo />
            <span className="text-lg font-bold sm:text-xl">{copy.nav.brand}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <SectionsDropdown locale="uz" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
        <div className="absolute inset-0 bg-surface" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[linear-gradient(125deg,rgba(47,226,138,0.12),transparent_35%,rgba(34,211,238,0.1)_78%,transparent)] opacity-0 transition-opacity duration-500 dark:opacity-100"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
