import { networkCoursesCopy } from "../network-courses/copy";

/** UI strings for /english-courses. Shares the player and card strings with the network course. */
export const englishCoursesCopy = {
  ...networkCoursesCopy,
  hero: {
    eyebrow: "Ingliz tili darslari",
    title: "IT mutaxassisi uchun ingliz tili: 0 dan erkin suhbatgacha",
    subtitle:
      "Har dars qisqa qadamlardan iborat: qoida, misol, o'z gapingiz va ovoz chiqarib mashq. Tizim avval, gapirish keyin — o'qishni yaxshi ko'radiganlar uchun.",
  },
  method: {
    title: "Dars qanday o'tadi",
    items: [
      { label: "Qoida tizimi", text: "Nima uchun shunday — mantiq bilan." },
      { label: "Qolip", text: "Gap tuzilishini bir marta ko'rasiz." },
      { label: "O'z gapingiz", text: "Oldindan tayyorlanadigan, o'zingizga tegishli gaplar." },
      { label: "Ovoz", text: "Har darsda ovoz chiqarib mashq qilasiz." },
    ],
  },
  roadmap: {
    ...networkCoursesCopy.roadmap,
    title: "Yo'l xaritasi",
    subtitle: "Uch bosqich ketma-ket keladi. Har bosqich oldingisiga tayanadi: avval boshlang'ich, keyin davomi.",
    goalText: "Ingliz tilida erkin suhbat (taxminan 50%)",
  },
  level: {
    ...networkCoursesCopy.level,
    finalText: "Bu so'nggi bosqich. Uni tugatgach, IT jamoasida ingliz tilida ishlash va suhbatlashishga tayyor bo'lasiz.",
  },
  player: {
    ...networkCoursesCopy.player,
    typePlaceholder: "Javobni yozing",
  },
};
