import type { Lesson } from "../types";

export const switching: Lesson = {
  id: "switching",
  title: "Switch va MAC jadvali",
  summary: "Switch kadrlarni qanday yo'naltiradi. Packet Tracer'da birinchi tarmoqni qurasiz.",
  estimatedMinutes: 60,
  goals: [
    "Switch MAC jadvalini qanday to'ldirishini tushuntirib bera olasiz",
    "Learning, forwarding va flooding farqini bilasiz",
    "Packet Tracer'da ikki kompyuterni switch orqali ulaysiz",
  ],
  requires: "Cisco Packet Tracer (Cisco NetAcad'dan bepul)",
  recap: [
    "Switch kadrning manba MAC'ini o'rganadi, nishon MAC'ni jadvaldan qidiradi.",
    "Nishon noma'lum bo'lsa — flooding (kirish portidan tashqari hammasiga).",
    "show mac address-table — switch jadvalini ko'rsatadi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Switch — aqlli tarqatuvchi",
      body: "Switch bitta tarmoq ichidagi qurilmalarni ulaydi va kadrni faqat kerakli qurilmaga yetkazadi. U 2-qatlam (Data Link) qurilmasi va MAC manzillar bilan ishlaydi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "a", label: "PC-A", icon: "host" },
          { id: "b", label: "PC-B", icon: "host" },
          { id: "c", label: "PC-C", icon: "host" },
          { id: "sw", label: "Switch", icon: "switch" },
        ],
        links: [
          ["a", "sw"],
          ["b", "sw"],
          ["c", "sw"],
        ],
      },
    },
    {
      type: "learn",
      title: "Switch kadrni qanday yo'naltiradi",
      body: "Har kelgan kadr uchun switch to'rtta ish qiladi.",
      points: [
        "1. Kadr portga keladi.",
        "2. Manba MAC manzilni o'qib, jadvalga yozadi (MAC → port). Bu learning.",
        "3. Nishon MAC'ni jadvaldan qidiradi.",
        "4. Topsa — faqat shu portga yuboradi (forwarding).",
      ],
    },
    {
      type: "order",
      title: "Jarayonni tartiblang",
      prompt: "Switch kadrni qayta ishlash tartibini bosib chiqing.",
      items: [
        "Kadr portga keladi",
        "Manba MAC jadvalga yoziladi",
        "Nishon MAC jadvaldan qidiriladi",
        "Topilsa, kadr faqat shu portga yuboriladi",
      ],
    },
    {
      type: "quiz",
      question: "Switch MAC jadvalini qaysi manzil bo'yicha to'ldiradi?",
      options: ["Nishon MAC", "Manba MAC", "IP manzil", "DHCP"],
      answerIndex: 1,
      explanation: "Switch kelgan kadrning manba MAC manzilini va u kelgan portni yozib oladi.",
    },
    {
      type: "learn",
      title: "Flooding: nishon noma'lum bo'lsa",
      body: "Nishon MAC jadvalda bo'lmasa yoki manzil broadcast bo'lsa, switch kadrni kirgan portdan tashqari barcha portlarga yuboradi. Javob qaytganda yangi MAC jadvalga yoziladi va keyingi safar flooding kerak bo'lmaydi.",
    },
    {
      type: "quiz",
      question: "Switch nishon MAC'ni jadvalidan topa olmasa nima qiladi?",
      options: [
        "Kadrni tashlab yuboradi",
        "Kirish portidan tashqari barcha portlarga yuboradi",
        "Routerga yuboradi",
        "Faqat birinchi portga yuboradi",
      ],
      answerIndex: 1,
      explanation: "Noma'lum unicast kadr flooding qilinadi. Shu yo'l bilan javob qaytadi va switch yangi MAC'ni o'rganadi.",
    },
    {
      type: "learn",
      title: "Uzatish usullari va MAC jadvali muddati",
      body: "Switch kadrni ikki usulda uzatishi mumkin. MAC jadvali yozuvlari esa abadiy turmaydi.",
      points: [
        "Store-and-forward — kadrni to'liq qabul qilib, FCS'ni tekshiradi, buzilganini tashlaydi. Zamonaviy switch'larda standart.",
        "Cut-through — manzil MAC o'qilishi bilan uzatishni boshlaydi: kechikish kamroq, lekin buzilgan kadrlar ham o'tadi.",
        "MAC yozuvi faollik bo'lmasa, Cisco switch'larda standart 300 soniyadan keyin o'chadi.",
      ],
    },
    {
      type: "learn",
      title: "Collision va broadcast domain'larni sanash",
      body: "Klassik intervyu savoli. Qoidalar: switch'ning har bir porti — alohida collision domain; router'ning har bir interfeysi (yoki har VLAN) — alohida broadcast domain. Hub esa hech narsani bo'lmaydi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "r", label: "Router", icon: "router" },
          { id: "s1", label: "Switch A · 5 PC", icon: "switch" },
          { id: "s2", label: "Switch B · 5 PC", icon: "switch" },
        ],
        links: [
          ["r", "s1"],
          ["r", "s2"],
        ],
      },
    },
    {
      type: "input",
      question: "Rasmdagi tarmoqda (VLAN'siz) nechta broadcast domain bor?",
      answers: ["2"],
      hint: "Router har interfeysida broadcast'ni to'xtatadi.",
      explanation: "Router ikki interfeysi — ikki broadcast domain: har switch o'z domenida.",
      placeholder: "Son",
    },
    {
      type: "input",
      question: "Shu tarmoqda nechta collision domain bor? (10 ta PC kanali + switch–router kanallari)",
      answers: ["12"],
      hint: "Har switch–qurilma kanali alohida collision domain.",
      explanation: "10 ta PC kanali + 2 ta router–switch kanali = 12.",
      placeholder: "Son",
    },
    {
      type: "learn",
      title: "VLAN: bitta switch, bir nechta tarmoq",
      body: "VLAN bitta fizik switchni mantiqiy tarmoqlarga bo'ladi. Masalan, buxgalteriya va mehmonlar bir switchga ulangan bo'lsa-da, bir-birini ko'rmaydi. Broadcast domain'ni faqat router yoki VLAN ajratadi. Batafsil 2-bosqichda.",
    },
    {
      type: "quiz",
      question: "VLAN nima uchun kerak?",
      options: [
        "Switchni mantiqiy tarmoqlarga bo'lish uchun",
        "Kabelni uzaytirish uchun",
        "Internet tezligini oshirish uchun",
        "IP manzillarni shifrlash uchun",
      ],
      answerIndex: 0,
      explanation: "VLAN bitta fizik switchda alohida mantiqiy tarmoqlar yaratadi va ular o'zaro ajratiladi.",
    },
    {
      type: "lab",
      title: "Packet Tracer: birinchi tarmoq",
      tasks: [
        "Packet Tracer'ni oching. 2 ta PC va 1 ta Switch qo'ying.",
        "Ularni Copper Straight-Through kabel bilan ulang.",
        "PC0 ga 192.168.1.10, PC1 ga 192.168.1.11 bering (maska 255.255.255.0). Desktop → IP Configuration.",
        "PC0 Command Prompt'da ping 192.168.1.11 ni bajaring.",
        "Switch CLI'ga o'ting va MAC jadvalini ko'ring.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "enable", note: "Switch'da imtiyozli rejimga o'tadi. Qatorning oxiri > dan # ga o'zgaradi; show buyruqlari shu rejimda ishlaydi." },
          { command: "show mac address-table", note: "Switch o'rgangan MAC manzillar jadvalini ko'rsatadi: qaysi MAC qaysi portda." },
        ],
      },
      expected: "Ping muvaffaqiyatli. Switch MAC jadvalida ikkala PC ning MAC manzillari va ularning portlari ko'rinadi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: switch jadvali",
      prompt: "Cisco switch'da MAC jadvalini ko'rsatadigan buyruqni yozing.",
      options: [
        { command: "show mac address-table", os: "Cisco switch" },
      ],
      reps: 3,
    },
    {
      type: "practice",
      title: "Switch jadvalini qog'ozda to'ldiring",
      instructions: [
        "4 portli switch va 4 PC (A, B, C, D) chizing, har biriga port raqami bering.",
        "Bo'sh MAC jadvali chizing. Kadrlarni ketma-ket «yuboring»: A → B, B → A, C → A.",
        "Har kadrdan keyin jadvalga nima yozilishini va flooding bo'lgan-bo'lmaganini belgilang.",
      ],
    },
  ],
};
