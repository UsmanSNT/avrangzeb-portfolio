import type { HomeDictionary } from "@/lib/i18n/types";

const projectTags = [
  ["Network", "Certification", "2024"],
  ["Cisco", "CCNA", "Routing"],
  ["AI", "Security", "Innovation"],
  ["Career", "Global", "Experience"],
];

const projectStatuses = [false, false, false, false]; // All goals are in progress

interface ProjectsGoalsSectionProps {
  t: HomeDictionary;
}

export function ProjectsGoalsSection({ t }: ProjectsGoalsSectionProps) {
  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
          <span className="gradient-text">{t.projects.title}</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          {t.projects.projectsList.map((project, index) => (
            <div
              key={index}
              className="group p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all hover:transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-xl font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                    projectStatuses[index]
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {projectStatuses[index] ? t.projects.completed : t.projects.inProgress}
                </span>
              </div>
              <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {projectTags[index].map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 sm:px-3 py-1 bg-slate-700/50 rounded-full text-xs text-cyan-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
