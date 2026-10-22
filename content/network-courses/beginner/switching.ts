import type { Lesson } from "../types";

export const switching: Lesson = {
  id: "switching",
  title: "Switch va MAC jadvali",
  summary: "Switch kadrlarni qanday yo'naltiradi. Packet Tracer'da birinchi tarmoqni qurasiz.",
  estimatedMinutes: 35,
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
      commands: ["enable", "show mac address-table"],
      expected: "Ping muvaffaqiyatli. Switch MAC jadvalida ikkala PC ning MAC manzillari va ularning portlari ko'rinadi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: switch jadvali",
      prompt: "Cisco switch'da MAC jadvalini ko'rsatadigan buyruqni yozing.",
      accept: ["show mac address-table", "show mac-address-table"],
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
