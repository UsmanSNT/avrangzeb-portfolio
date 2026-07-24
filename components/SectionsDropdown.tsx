"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type SectionsLocale = "uz" | "en" | "ru" | "ko";

const COPY: Record<SectionsLocale, { trigger: string; notes: string; books: string; news: string; gallery: string }> = {
  uz: { trigger: "Bo'limlar", notes: "Qaydlar", books: "Kitob fikrlari", news: "Yangiliklar", gallery: "Galereya" },
  en: { trigger: "Sections", notes: "Notes", books: "Book Quotes", news: "News", gallery: "Gallery" },
  ru: { trigger: "Разделы", notes: "Заметки", books: "Цитаты из книг", news: "Новости", gallery: "Галерея" },
  ko: { trigger: "섹션", notes: "노트", books: "책 인용구", news: "뉴스", gallery: "갤러리" },
};

function resolveLocale(locale: string): SectionsLocale {
  return (locale === "uz" || locale === "en" || locale === "ru" || locale === "ko") ? locale : "en";
}

const SectionsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function useSectionLinks(locale: string) {
  const t = COPY[resolveLocale(locale)];
  return [
    { href: "/notes", label: t.notes },
    { href: "/books", label: t.books },
    { href: "/news", label: t.news },
    { href: "/gallery", label: t.gallery },
  ];
}

interface SectionsDropdownProps {
  locale: string;
  className?: string;
  /**
   * Set on pages that always render dark regardless of the site's theme
   * toggle (their colors are hardcoded slate/cyan, not theme tokens) —
   * e.g. /books and /gallery. Using the token classes there would follow
   * the user's light/dark preference and could end up illegible against
   * the page's forced-dark background.
   */
  forceDark?: boolean;
}

/** Desktop: click-to-open dropdown listing Notes/Books/News/Gallery. */
export function SectionsDropdown({ locale, className = "", forceDark = false }: SectionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const links = useSectionLinks(locale);
  const t = COPY[resolveLocale(locale)];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerClass = forceDark
    ? "flex items-center gap-1 rounded-lg px-1.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-cyan-400 lg:gap-1.5 lg:px-2 lg:text-sm"
    : "flex items-center gap-1 rounded-lg px-1.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-hover/[0.09] hover:text-cyan-text lg:gap-1.5 lg:px-2 lg:text-sm";
  const panelClass = forceDark
    ? "absolute left-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl"
    : "absolute left-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-background/95 shadow-2xl shadow-elevation/40 backdrop-blur-2xl";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button onClick={() => setIsOpen((prev) => !prev)} className={triggerClass} aria-expanded={isOpen}>
        <SectionsIcon />
        {t.trigger}
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div className={panelClass}>
          {links.map((link) => {
            const active = pathname === link.href;
            const linkClass = forceDark
              ? `block px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-700/50 ${active ? "bg-cyan-500/20 text-cyan-400" : "text-slate-300"}`
              : `block px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-2/50 ${active ? "bg-accent-cyan/20 text-cyan-text" : "text-secondary"}`;
            return (
              <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={linkClass}>
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Mobile: an inline expandable group (accordion) for use inside a burger menu. */
export function SectionsDropdownMobile({ locale, onNavigate }: SectionsDropdownProps & { onNavigate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const links = useSectionLinks(locale);
  const t = COPY[resolveLocale(locale)];

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium text-secondary transition-colors hover:bg-card/50 hover:text-cyan-text"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <SectionsIcon />
          {t.trigger}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-line pl-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-accent-cyan/10 text-cyan-text" : "text-secondary hover:bg-card/50 hover:text-cyan-text"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
