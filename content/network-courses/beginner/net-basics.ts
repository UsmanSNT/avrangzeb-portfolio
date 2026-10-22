import type { Lesson } from "../types";

export const netBasics: Lesson = {
  id: "net-basics",
  title: "Tarmoq nima va qurilmalar kim",
  summary: "Host, switch, router, paket va protokol. O'z kompyuteringiz tarmoq sozlamalarini topasiz.",
  estimatedMinutes: 25,
  goals: [
    "Tarmoq, host, switch va routerni bir-biridan farqlay olasiz",
    "Paket va protokol nima ekanini tushuntirib bera olasiz",
    "O'z kompyuteringizning IP manzili va gateway'ini topasiz",
  ],
  requires: "Kompyuteringizdagi terminal (Windows: cmd, Linux/macOS: Terminal)",
  recap: [
    "Router tarmoqlarni, switch esa bitta tarmoq ichidagi hostlarni ulaydi.",
    "Ma'lumot paketlarga bo'linib yuboriladi, protokol esa kelishilgan qoidalar to'plami.",
    "ipconfig /all (yoki ip a) buyrug'i qurilmaning tarmoq sozlamalarini ko'rsatadi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Tarmoq nima?",
      body: "Tarmoq — ma'lumot almashish uchun o'zaro ulangan qurilmalar to'plami. Uyingizdagi Wi-Fi router telefon va noutbukni ulab turgan bo'lsa, siz allaqachon tarmoqdan foydalanyapsiz.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "phone", label: "Telefon", icon: "host" },
          { id: "laptop", label: "Noutbuk", icon: "host" },
          { id: "router", label: "Wi-Fi router", icon: "router" },
          { id: "net", label: "Internet", icon: "cloud" },
        ],
        links: [
          ["phone", "router"],
          ["laptop", "router"],
          ["router", "net"],
        ],
      },
    },
    {
      type: "quiz",
      question: "Uyingizda telefon va noutbuk bitta Wi-Fi routerga ulangan. Bu nima?",
      options: ["Kichik kompyuter tarmog'i", "Dastur", "Operatsion tizim", "Brauzer"],
      answerIndex: 0,
      explanation: "Ha, ikki va undan ortiq o'zaro ulangan qurilma — tarmoq. Bunday kichik tarmoq LAN deyiladi.",
    },
    {
      type: "learn",
      title: "Uchta asosiy qurilma",
      body: "Tarmoqni uchta turdagi qurilma quradi.",
      points: [
        "Host — oddiy qurilma: kompyuter, telefon, server, printer.",
        "Switch — bitta tarmoq ichidagi hostlarni bir-biriga ulaydi.",
        "Router — turli tarmoqlarni ulaydi, internetga chiqish eshigi.",
      ],
    },
    {
      type: "learn",
      title: "Ular qanday ulanadi?",
      body: "Hostlar switchga, switch routerga, router esa internetga ulanadi. Har paket shu zanjir bo'ylab yuradi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "pc1", label: "Host", icon: "host" },
          { id: "pc2", label: "Host", icon: "host" },
          { id: "sw", label: "Switch", icon: "switch" },
          { id: "r", label: "Router", icon: "router" },
          { id: "net", label: "Internet", icon: "cloud" },
        ],
        links: [
          ["pc1", "sw"],
          ["pc2", "sw"],
          ["sw", "r"],
          ["r", "net"],
        ],
      },
    },
    {
      type: "quiz",
      question: "Qaysi qurilma turli tarmoqlarni (masalan, uy tarmog'i va internetni) bir-biriga ulaydi?",
      options: ["Switch", "Router", "Printer", "Host"],
      answerIndex: 1,
      explanation: "Router tarmoqlar o'rtasida paketlarni yo'naltiradi. Switch esa faqat bitta tarmoq ichida ishlaydi.",
    },
    {
      type: "learn",
      title: "Ma'lumot — paketlar bo'lib yuboriladi",
      body: "Rasm yoki xabar tarmoqda bir butun holda emas, paket deb ataluvchi kichik bo'laklarga bo'linib yuboriladi. Har paketda manzil bor. Qabul qiluvchi bo'laklarni qayta yig'adi.",
      points: ["Katta fayl yuzlab paketga bo'linadi.", "Paketlar turli yo'llardan borishi mumkin.", "Yo'qolgan paket qayta yuboriladi."],
    },
    {
      type: "learn",
      title: "Protokol — kelishilgan qoidalar",
      body: "Protokol — qurilmalar o'zaro kelishgan qoidalar to'plami. Ikki qurilma bir xil protokolda gaplashsa, ishlab chiqaruvchisidan qat'i nazar bir-birini tushunadi. Shuning uchun Cisco, MikroTik va TP-Link bitta tarmoqda ishlay oladi.",
    },
    {
      type: "quiz",
      question: "Protokol nima?",
      options: ["Kabel turi", "Qurilmalar kelishgan qoidalar to'plami", "Dastur nomi", "Tarmoq tezligi"],
      answerIndex: 1,
      explanation: "Protokol — qurilmalar ma'lumot almashishda amal qiladigan qoidalar. Misollar: IP, TCP, HTTP, DNS.",
    },
    {
      type: "lab",
      title: "Kompyuteringiz tarmoq sozlamalarini toping",
      tasks: [
        "Terminal oching (Windows: Win + R, so'ng cmd; Linux/macOS: Terminal).",
        "Quyidagi buyruqlardan o'z tizimingizdagisini qo'lda yozing.",
        "IPv4 manzil, subnet mask va default gateway qiymatlarini daftarga yozib oling.",
      ],
      commands: {
        mode: "choose-one",
        items: [
          { command: "ipconfig /all", note: "Barcha tarmoq sozlamalarini ko'rsatadi: IP, maska, gateway, DNS.", os: "Windows" },
          { command: "ip a", note: "Tarmoq interfeyslari va ularning IP manzillarini ko'rsatadi.", os: "Linux" },
          { command: "ifconfig", note: "Interfeys sozlamalarini ko'rsatadi.", os: "macOS" },
        ],
      },
      expected: "IPv4 manzilingiz (odatda 192.168.x.x yoki 10.x.x.x), subnet mask va gateway manzili ko'rinadi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: tarmoq sozlamalari buyrug'i",
      prompt: "Tarmoq sozlamalarini ko'rsatadigan buyruqni yozing (o'z tizimingizdagisini).",
      options: [
        { command: "ipconfig /all", os: "Windows" },
        { command: "ip a", os: "Linux" },
        { command: "ifconfig", os: "macOS" },
      ],
      reps: 3,
    },
    {
      type: "learn",
      title: "Loopback: kompyuter o'z-o'zini chaqiradi",
      body: "127.0.0.1 — kompyuteringizning o'zi. Bu manzilga yuborilgan paket tashqariga chiqmaydi, shuning uchun u kompyuterdagi tarmoq dasturiy qismi sog'lom ishlayotganini tekshiradi.",
      terminal: ["> ping 127.0.0.1", "Reply from 127.0.0.1: bytes=32 time<1ms TTL=128", "Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)"],
    },
    {
      type: "quiz",
      question: "ping 127.0.0.1 nimani tekshiradi?",
      options: ["Internet tezligini", "Router ishlashini", "Kompyuterdagi tarmoq stekini", "DNS serverni"],
      answerIndex: 2,
      explanation: "Paket kompyuterdan chiqmaydi, shuning uchun bu buyruq faqat lokal tarmoq stekining sog'lig'ini ko'rsatadi.",
    },
    {
      type: "practice",
      title: "Uy tarmog'ingizni chizing",
      instructions: [
        "Daftarga uyingiz tarmog'ini chizing: telefon, noutbuk, Wi-Fi router va internet.",
        "Har qurilma yoniga uning turini yozing: host yoki router.",
        "Bitta qurilmaning IP manzilini yonida yozing (ipconfig natijasidan).",
      ],
    },
  ],
};
