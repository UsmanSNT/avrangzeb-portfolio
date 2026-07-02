import type { HomeDictionary } from "@/lib/i18n/types";

interface FooterSectionProps {
  t: HomeDictionary;
}

export function FooterSection({ t }: FooterSectionProps) {
  return (
    <footer className="relative border-t border-white/10 bg-[#05070d] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-sm font-semibold text-slate-300">Avrangzeb</p>
        <p className="text-sm text-slate-500">2025 Abdujalilov Avrangzeb. {t.footer}</p>
      </div>
    </footer>
  );
}
