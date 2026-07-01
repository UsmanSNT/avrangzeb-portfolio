import type { HomeDictionary } from "@/lib/i18n/types";

interface FooterSectionProps {
  t: HomeDictionary;
}

export function FooterSection({ t }: FooterSectionProps) {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-slate-500 text-sm sm:text-base">
          짤 2025 Abdujalilov Avrangzeb. {t.footer}
        </p>
      </div>
    </footer>
  );
}
