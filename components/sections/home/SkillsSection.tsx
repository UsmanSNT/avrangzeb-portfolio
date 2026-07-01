import type { HomeDictionary } from "@/lib/i18n/types";
import { CloudIcon, CodeIcon, NetworkIcon, ServerIcon, ShieldIcon } from "./icons";

const skillsData = [
  { name: "Cisco Networking", level: 85, icon: <NetworkIcon /> },
  { name: "Linux Server", level: 80, icon: <ServerIcon /> },
  { name: "Windows Server", level: 75, icon: <ServerIcon /> },
  { name: "Cybersecurity", level: 70, icon: <ShieldIcon /> },
  { name: "Cloud Computing", level: 65, icon: <CloudIcon /> },
  { name: "Python Scripting", level: 60, icon: <CodeIcon /> },
];

interface SkillsSectionProps {
  t: HomeDictionary;
}

export function SkillsSection({ t }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
          <span className="gradient-text">{t.skills.title}</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-200 text-sm sm:text-base">{skill.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500">{skill.level}%</p>
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-8 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-4 sm:mb-6">⚙️ {t.skills.additional}</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              "TCP/IP", "DNS", "DHCP", "Active Directory", "VMware", "Docker",
              "Ansible", "Git", "Bash", "PowerShell", "Wireshark", "Nmap",
              "pfSense", "MikroTik", "Ubiquiti", "AWS", "Azure"
            ].map((tech, index) => (
              <span
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 rounded-full text-xs sm:text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
