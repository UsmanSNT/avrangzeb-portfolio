"use client";

import { applyTheme, themeStorageKey, type Theme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") as Theme | null;
    const next: Theme = current === "light" ? "dark" : "light";
    applyTheme(next);
    window.localStorage.setItem(themeStorageKey, next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-hover/[0.05] text-muted transition-colors hover:border-accent-cyan/40 hover:text-cyan-text ${className}`}
    >
      {/* Sun: shown in light mode */}
      <svg
        className="absolute h-4.5 w-4.5 scale-100 opacity-100 rotate-0 transition-all duration-300 dark:scale-50 dark:opacity-0 dark:-rotate-90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      {/* Moon: shown in dark mode */}
      <svg
        className="absolute h-4 w-4 scale-50 opacity-0 rotate-90 transition-all duration-300 dark:scale-100 dark:opacity-100 dark:rotate-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}
