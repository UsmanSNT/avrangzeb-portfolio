import type { CourseLevel } from "../../network-courses/types";
import {
  articlesLesson,
  courseHowItWorks,
  introductionLesson,
  soundsLesson,
  toBeLesson,
} from "./sentence-and-be";
import {
  beginnerExam,
  numbersTimeLesson,
  presentSimpleLesson,
  questionsLesson,
  smallTalkLesson,
  whQuestionsLesson,
} from "./daily-english";

export const englishBeginnerLevel: CourseLevel = {
  id: "english-beginner",
  order: 1,
  title: "Boshlang'ich: 0 dan birinchi gaplargacha",
  description:
    "Gap tuzilishi, to be, artikllar, Present Simple, savollar, raqamlar va kichik suhbat. Har dars qoida, misol va ovoz chiqarib mashq bilan.",
  outcome:
    "O'zingiz haqingizda, ishingiz va qiziqishlaringiz haqida to'g'ri gaplar tuzasiz; oddiy savolga javob berasiz va suhbatni savol bilan davom ettirasiz.",
  lessons: [
    courseHowItWorks,
    soundsLesson,
    toBeLesson,
    introductionLesson,
    articlesLesson,
    presentSimpleLesson,
    questionsLesson,
    whQuestionsLesson,
    numbersTimeLesson,
    smallTalkLesson,
    beginnerExam,
  ],
};
