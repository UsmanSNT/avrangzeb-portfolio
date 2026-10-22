/** UI strings for /network-courses. The course is Uzbek-only by design. */
export const networkCoursesCopy = {
  nav: { home: "Bosh sahifa", brand: "Avrangzeb" },
  hero: {
    eyebrow: "Tarmoq darslari",
    title: "Tarmoq mutaxassisi bo'lishning amaliy yo'li",
    subtitle:
      "Bosqichma-bosqich tizim: nazariya qisqa, ko'p qismi kompyuterda qo'l bilan bajariladi. Har dars terminal buyruqlari, laboratoriya va xotira mashqlari bilan tugaydi, shunda bilim qo'lingizga ham o'rnashadi.",
  },
  method: {
    title: "Har dars shu tartibda o'tadi",
    items: [
      { label: "Nazariya", text: "Faqat kerakli tushunchalar, qisqa va aniq." },
      { label: "Laboratoriya", text: "Terminal yoki Packet Tracer'da o'zingiz bajarasiz." },
      { label: "Xotira mashqi", text: "Qo'l va ko'z xotirasi uchun takroriy mashqlar." },
      { label: "Tekshiruv", text: "Tushunganingizni test savollari bilan sinaysiz." },
    ],
  },
  level: {
    stage: (order: number) => `${order}-bosqich`,
    lessons: (count: number) => `${count} ta dars`,
    minutes: (min: number) => `${min} daqiqa`,
    totalTime: (min: number) => `Taxminan ${Math.round(min / 60)} soat`,
    outcomeTitle: "Bosqich oxirida",
    progress: (done: number, total: number) => `${done} / ${total} dars bajarildi`,
    soon: "Tez orada",
    soonNote: "Bu bosqich 1-bosqich tugagach, birin-ketin qo'shiladi.",
  },
  lesson: {
    theory: "Nazariya",
    labs: "Amaliy laboratoriya",
    drills: "Xotira mashqlari",
    checks: "Bilimni tekshirish",
    expected: "Kutilgan natija",
    markDone: "Bajarildi deb belgilash",
    markUndone: "Belgini olib tashlash",
    done: "Bajarilgan",
    open: "Darsni ochish",
    close: "Darsni yopish",
    correct: "To'g'ri.",
    incorrect: "Noto'g'ri.",
    retry: "Qayta urinib ko'ring",
  },
} as const;
