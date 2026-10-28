import type { UpcomingLevel } from "../network-courses";
import type { CourseLevel } from "../network-courses/types";
import { englishBeginnerLevel } from "./beginner";

export const englishLevels: readonly CourseLevel[] = [englishBeginnerLevel];

/** Levels announced on the English roadmap but not written yet. */
export const englishUpcomingLevels: readonly UpcomingLevel[] = [
  {
    id: "english-pre-intermediate",
    order: 2,
    title: "O'rta-boshlang'ich: gapni kengaytirish",
    description: "O'tgan va kelasi zamon, sayohat va kundalik ish vaziyatlari, savol-javobni kengaytirish.",
  },
  {
    id: "english-intermediate",
    order: 3,
    title: "O'rta daraja: fikr va ish muloqoti",
    description: "Fikr bildirish, muammoni tushuntirish, jamoa yig'ilishlari va IT mavzularda erkin suhbat.",
  },
];
