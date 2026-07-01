import type { HomeDictionary } from "@/lib/i18n/types";
import { ShieldIcon } from "./icons";

const certifications = [
  { name: "?ㅽ듃?뚰겕 愿由ъ궗 2湲?(Network Administrator Level 2)", status: "preparing" },
  { name: "CCNA - Cisco Certified Network Associate", status: "preparing" },
  { name: "CompTIA Network+", status: "preparing" },
  { name: "Linux Professional Institute (LPIC-1)", status: "preparing" },
];

interface AboutSectionProps {
  t: HomeDictionary;
}

export function AboutSection({ t }: AboutSectionProps) {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
          <span className="gradient-text">{t.about.title}</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {t.about.greeting} <span className="text-cyan-400 font-semibold">Abdujalilov Avrangzeb</span>,
              {t.about.intro}
            </p>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {t.about.passion}
            </p>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {t.about.goal}
            </p>

            {/* Education */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-3 sm:mb-4">?뱴 {t.about.education}</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-slate-200 text-sm sm:text-base">{t.about.university}</p>
                  <p className="text-slate-400 text-sm sm:text-base">{t.about.faculty}</p>
                  <p className="text-xs sm:text-sm text-slate-500">{t.about.years}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-4 sm:mb-6">?렞 {t.about.certificates}</h3>
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="p-3 sm:p-5 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-200 text-sm sm:text-base break-words">{cert.name}</h4>
                    <p className="text-xs sm:text-sm text-yellow-400 mt-1 flex items-center gap-1">
                      <span aria-hidden="true">*</span> {t.about.preparingCerts || "Preparing"}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldIcon />
                  </div>
                </div>
              </div>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-2xl sm:text-3xl font-bold text-cyan-400">4</p>
                <p className="text-xs sm:text-sm text-slate-500">{t.about.stats.projects}</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">4</p>
                <p className="text-xs sm:text-sm text-slate-500">{t.about.stats.certificates}</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-2xl sm:text-3xl font-bold text-green-400">??</p>
                <p className="text-xs sm:text-sm text-slate-500">{t.about.stats.experience}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
