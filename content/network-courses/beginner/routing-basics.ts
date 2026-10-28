import type { Lesson } from "../types";

export const routingBasics: Lesson = {
  id: "routing-basics",
  title: "Router, gateway va marshrutlash",
  summary: "Paket boshqa tarmoqqa qanday chiqadi. Marshrut jadvalini o'qishni o'rganasiz.",
  estimatedMinutes: 55,
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
      title: "Eng aniq moslik: ishlangan misol",
      body: "Router jadvalida bitta manzilga bir nechta yozuv mos kelishi mumkin. U har doim eng uzun prefiksli (eng aniq) yozuvni tanlaydi.",
      terminal: [
        "10.0.0.0/8      via A",
        "10.1.0.0/16     via B",
        "10.1.1.0/24     via C",
        "0.0.0.0/0       via D",
        "",
        "10.1.1.5   → /8, /16, /24 mos → eng uzuni /24 → C",
      ],
    },
    {
      type: "quiz",
      question: "Yuqoridagi jadval bo'yicha 10.1.2.5 manzili qayerga yuboriladi?",
      options: ["A", "B", "C", "D"],
      answerIndex: 1,
      explanation: "10.1.2.5 /8 va /16 ga mos, /24 (10.1.1.x) ga mos emas. Eng uzuni /16 → B.",
    },
    {
      type: "quiz",
      question: "Shu jadval bo'yicha 10.200.3.4 qayerga yuboriladi?",
      options: ["A", "B", "C", "D"],
      answerIndex: 0,
      explanation: "Faqat 10.0.0.0/8 (va default) mos keladi — eng aniqi /8 → A.",
    },
    {
      type: "quiz",
      question: "8.8.8.8 qayerga yuboriladi?",
      options: ["A", "B", "C", "D"],
      answerIndex: 3,
      explanation: "Hech bir aniq yozuv mos emas — default route (0.0.0.0/0) → D.",
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
      options: [
        { command: "route print", os: "Windows" },
        { command: "ip route", os: "Linux" },
        { command: "netstat -rn", os: "macOS" },
      ],
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
      commands: {
        mode: "choose-one",
        items: [
          { command: "route print", note: "Marshrut jadvalini ko'rsatadi.", os: "Windows" },
          { command: "ip route", note: "Marshrut jadvalini ko'rsatadi.", os: "Linux" },
          { command: "netstat -rn", note: "Marshrut jadvalini ko'rsatadi.", os: "macOS" },
        ],
      },
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
      commands: {
        mode: "sequence",
        items: [
          { command: "enable", note: "Imtiyozli rejimga o'tadi (Router#)." },
          { command: "configure terminal", note: "Sozlash rejimiga o'tadi: (config)#." },
          { command: "interface gigabitEthernet 0/0", note: "Sozlanadigan interfeysni tanlaydi: (config-if)#." },
          { command: "ip address 192.168.1.1 255.255.255.0", note: "Interfeysga IP manzil va maska beradi. Bu manzil shu tarmoqdagi PC'larning gateway'i bo'ladi." },
          { command: "no shutdown", note: "Interfeysni yoqadi. Router interfeyslari standart holatda o'chiq turadi." },
          { command: "end", note: "Sozlash rejimidan chiqib, imtiyozli rejimga qaytadi (Router#)." },
          { command: "show ip route", note: "Marshrut jadvalini ko'rsatadi. Ikkala tarmoq «C» (connected) belgisi bilan chiqadi." },
        ],
      },
      expected: "Ikki tarmoq o'rtasida ping ishlaydi. Marshrut jadvalida ikkala tarmoq «C» (connected) sifatida ko'rinadi.",
    },
  ],
};
