import type { Lesson } from "../types";

export const routingBasics: Lesson = {
  id: "routing-basics",
  title: "Router, gateway va marshrutlash",
  summary: "Paket boshqa tarmoqqa qanday chiqadi. Marshrut jadvalini o'qishni o'rganasiz.",
  estimatedMinutes: 35,
  goals: [
    "Default gateway vazifasini tushuntirib bera olasiz",
    "Host paketni to'g'ridan-to'g'ri yoki gateway orqali yuborishini aniqlaysiz",
    "Marshrut jadvalini o'qiysiz va default route'ni topasiz",
  ],
  requires: "Terminal; Cisco Packet Tracer",
  recap: [
    "Nishon o'z subnetida bo'lmasa, paket default gateway'ga beriladi.",
    "Gateway manzili hostning o'z subnetida bo'lishi shart.",
    "Default route — 0.0.0.0/0, boshqa yozuv topilmaganda ishlatiladi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Gateway — chiqish eshigi",
      body: "Host o'z tarmog'idan tashqariga (masalan, internetga) paket yuborishi kerak bo'lsa, u paketni routerga beradi. Hostning shu routerga ko'rsatadigan manzili default gateway deyiladi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "pc", label: "Host 192.168.1.10", icon: "host" },
          { id: "r", label: "Gateway 192.168.1.1", icon: "router" },
          { id: "net", label: "Internet", icon: "cloud" },
        ],
        links: [
          ["pc", "r"],
          ["r", "net"],
        ],
      },
    },
    {
      type: "learn",
      title: "Host qanday qaror qiladi",
      body: "Har paketdan oldin host nishon IP'ni o'z subnet maskasi bilan solishtiradi.",
      points: [
        "Nishon o'z subnetida → to'g'ridan-to'g'ri yuboradi (ARP orqali).",
        "Nishon o'z subnetida emas → paketni default gateway'ga beradi.",
      ],
    },
    {
      type: "quiz",
      question: "192.168.1.10/24 hostdan 8.8.8.8 ga paket kimga beriladi?",
      options: ["Switchga", "Default gateway'ga", "DNS serverga", "Barcha hostlarga"],
      answerIndex: 1,
      explanation: "8.8.8.8 hostning subnetida emas, shuning uchun paket routerga (default gateway) beriladi.",
    },
    {
      type: "quiz",
      question: "192.168.1.10/24 hostdan 192.168.1.50 ga paket qanday boradi?",
      options: [
        "Avval routerga, u yerdan qaytadi",
        "To'g'ridan-to'g'ri (ARP orqali), router kerak emas",
        "Internet orqali",
        "Yuborib bo'lmaydi",
      ],
      answerIndex: 1,
      explanation: "192.168.1.50 o'sha subnetda, shuning uchun host MAC'ni ARP bilan topib, kadrni to'g'ridan-to'g'ri yuboradi.",
    },
    {
      type: "input",
      question: "Host 192.168.1.10/24 da. Gateway sifatida qaysi manzil to'g'ri: 192.168.2.1 yoki 192.168.1.1?",
      answers: ["192.168.1.1"],
      hint: "Gateway hostning o'z subnetida bo'lishi kerak.",
      explanation: "Host gateway'ga to'g'ridan-to'g'ri yetib borishi kerak, shuning uchun gateway o'sha subnetda (192.168.1.x) bo'ladi.",
      placeholder: "Manzilni yozing",
    },
    {
      type: "learn",
      title: "Marshrut jadvali",
      body: "Har host va routerda marshrut jadvali (routing table) bor: «qaysi tarmoqqa qaysi yo'ldan». Quyida Windows'dagi qisqartirilgan misol.",
      terminal: [
        "> route print",
        "Network       Mask            Gateway       Interface",
        "0.0.0.0       0.0.0.0         192.168.1.1   192.168.1.10",
        "192.168.1.0   255.255.255.0   On-link       192.168.1.10",
      ],
    },
    {
      type: "learn",
      title: "Default route va eng aniq moslik",
      body: "Router nishonga eng aniq mos yozuvni tanlaydi (eng uzun prefiks). Hech biri mos kelmasa, default route ishlaydi: 0.0.0.0/0 — «hamma narsa».",
    },
    {
      type: "quiz",
      question: "Default route qanday yoziladi?",
      options: ["127.0.0.1/8", "0.0.0.0/0", "255.255.255.255/32", "192.168.0.0/16"],
      answerIndex: 1,
      explanation: "0.0.0.0/0 barcha manzillarga mos keladi, shuning uchun u eng kam aniq va faqat boshqa yozuv topilmaganda qo'llanadi.",
    },
    {
      type: "learn",
      title: "NAT: bitta ommaviy manzil",
      body: "Uy routeringiz ichki (private) manzillarni internetga chiqishda bitta ommaviy (public) manzilga almashtiradi. Bu jarayon NAT deyiladi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: marshrut jadvali",
      prompt: "Marshrut jadvalini ko'rsatadigan buyruqni yozing (o'z tizimingizdagisini).",
      accept: ["route print", "ip route", "ip route show", "netstat -rn", "netstat -r"],
      reps: 3,
    },
    {
      type: "lab",
      title: "Kompyuteringizning marshrut jadvalini o'qing",
      tasks: [
        "Marshrut jadvalini chiqaring.",
        "0.0.0.0 (default route) qatorini toping.",
        "Gateway manzilini 1-darsda yozib olgan qiymat bilan solishtiring.",
      ],
      commands: ["route print   (Windows)", "ip route   (Linux)", "netstat -rn   (macOS)"],
      expected: "Default route (0.0.0.0/0 yoki «default via ...») routeringiz IP manziliga ishora qiladi.",
    },
    {
      type: "lab",
      title: "Packet Tracer: ikki tarmoq va bitta router",
      tasks: [
        "2 ta switch, 2 ta PC va 1 ta router qo'ying. PC'larni 192.168.1.0/24 va 192.168.2.0/24 tarmoqlarga joylashtiring.",
        "Router interfeyslarini sozlang va yoqing (quyidagi buyruqlar birinchi interfeys uchun; ikkinchisiga 192.168.2.1 bering).",
        "Har PC'da default gateway'ni mos router interfeysiga sozlang.",
        "PC'lar orasida ping qiling va routerda show ip route ni ko'ring.",
      ],
      commands: [
        "enable",
        "configure terminal",
        "interface gigabitEthernet 0/0",
        "ip address 192.168.1.1 255.255.255.0",
        "no shutdown",
        "end",
        "show ip route",
      ],
      expected: "Ikki tarmoq o'rtasida ping ishlaydi. Marshrut jadvalida ikkala tarmoq «C» (connected) sifatida ko'rinadi.",
    },
  ],
};
