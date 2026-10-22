import type { Lesson } from "../types";

export const subnetCidr: Lesson = {
  id: "subnet-cidr",
  title: "Subnet mask va CIDR",
  summary: "Manzilning tarmoq va host qismini ajratish; /24, /26, /30 hisoblari.",
  estimatedMinutes: 40,
  goals: [
    "Mask va prefiks (/24) o'rtasida o'tkaza olasiz",
    "Subnetdagi hostlar sonini hisoblaysiz",
    "Manzil uchun tarmoq va broadcast manzilini topasiz",
  ],
  requires: "Daftar va qalam",
  recap: [
    "Maskada 1 lar tarmoq qismi, 0 lar host qismi; /24 = 24 ta bir.",
    "Hostlar soni = 2^(32 − prefiks) − 2.",
    "Blok o'lchami = 256 − mask'ning oxirgi oktet qiymati.",
  ],
  steps: [
    {
      type: "learn",
      title: "Mask nima uchun kerak?",
      body: "IP manzil ikki qismdan iborat: tarmoq (ko'cha nomi) va host (uy raqami). Subnet mask manzilning qayerda tugab, qayerda boshlanishini aytadi.",
    },
    {
      type: "learn",
      title: "Mask — bitlar qatori",
      body: "Maskada 1 lar tarmoq qismini, 0 lar host qismini bildiradi. Birlar sonini prefiks deymiz: 24 ta bir — /24.",
      terminal: ["255.255.255.0", "11111111.11111111.11111111.00000000", "|---- 24 ta 1 (tarmoq) ----|--- 8 ta 0 (host) ---|", "= /24"],
    },
    {
      type: "cidr",
      title: "Prefiksni o'zgartirib ko'ring",
      prompt: "Slayderni suring: mask, hostlar soni va blok o'lchami qanday o'zgarishini kuzating.",
    },
    {
      type: "quiz",
      question: "255.255.255.192 maskasi qaysi prefiksga to'g'ri keladi?",
      options: ["/24", "/25", "/26", "/27"],
      answerIndex: 2,
      explanation: "192 = 11000000: oxirgi oktetda 2 ta bit tarmoqqa tegishli. 24 + 2 = /26.",
    },
    {
      type: "learn",
      title: "Subnetda nechta host bor?",
      body: "Hostlar soni = 2^(host bitlari) − 2. Ikkita manzil hostga berilmaydi: birinchisi (tarmoq manzili) va oxirgisi (broadcast).",
      terminal: ["/24 → 2^8 − 2 = 254", "/26 → 2^6 − 2 = 62", "/30 → 2^2 − 2 = 2"],
    },
    {
      type: "input",
      question: "192.168.1.0/27 subnetida nechta host manzili bor?",
      answers: ["30"],
      hint: "/27 da host bitlari 32 − 27 = 5 ta. 2^5 − 2 = ?",
      explanation: "5 ta host biti: 2^5 = 32, ikkita maxsus manzil chiqarilsa 30.",
      placeholder: "Sonni yozing",
    },
    {
      type: "learn",
      title: "Misol: 192.168.10.0/24",
      body: "Hamma narsani ko'rsatib beradigan eng oddiy misol.",
      terminal: [
        "Tarmoq manzili : 192.168.10.0",
        "Birinchi host  : 192.168.10.1",
        "Oxirgi host    : 192.168.10.254",
        "Broadcast      : 192.168.10.255",
      ],
    },
    {
      type: "learn",
      title: "Blok o'lchami: tez hisoblash usuli",
      body: "Oxirgi oktetdagi mask qiymatini 256 dan ayiring: bu subnetlar «qadami». /26 uchun 256 − 192 = 64.",
      terminal: ["/26 → blok 64:   .0   .64   .128   .192", "/27 → blok 32:   .0   .32   .64   .96  ...", "/28 → blok 16:   .0   .16   .32   .48  ..."],
    },
    {
      type: "learn",
      title: "Ishlangan misol: 172.16.5.130/26",
      body: "Bloklar .0, .64, .128, .192. 130 soni 128–191 blokiga tushadi. Demak, blokning birinchisi — tarmoq manzili, oxirgisi — broadcast.",
      terminal: [
        "Tarmoq manzili : 172.16.5.128",
        "Hostlar        : 172.16.5.129 — 172.16.5.190",
        "Broadcast      : 172.16.5.191",
        "Hostlar soni   : 62",
      ],
    },
    {
      type: "input",
      question: "172.16.5.200/26 manziliga tegishli tarmoq manzili qanday?",
      answers: ["172.16.5.192"],
      hint: "/26 bloklari: 0, 64, 128, 192. 200 qaysi blokka tushadi?",
      explanation: "200 soni 192–255 blokida. Blokning birinchi manzili — 172.16.5.192.",
      placeholder: "Masalan: 10.0.0.0",
    },
    {
      type: "input",
      question: "10.1.1.70/28 manziliga tegishli broadcast manzili qanday?",
      answers: ["10.1.1.79"],
      hint: "/28 blok o'lchami 16: ..., 64–79, 80–95. 70 qaysi blokda? Broadcast — blokning oxirgisi.",
      explanation: "/28 da blok 16. 70 soni 64–79 blokida, oxirgi manzil 10.1.1.79.",
      placeholder: "Masalan: 10.0.0.255",
    },
    {
      type: "practice",
      title: "2 ning darajalari jadvali",
      instructions: [
        "Qog'ozga yodingizdan yozing: 2, 4, 8, 16, 32, 64, 128, 256 (2^1 dan 2^8 gacha).",
        "So'ng /24 dan /30 gacha prefikslar uchun mask va hostlar sonini yozing.",
        "Har kuni 3 marta, har gal vaqtni o'lchang.",
      ],
      seconds: 60,
    },
    {
      type: "lab",
      title: "Uy tarmog'ingizni tahlil qiling",
      tasks: [
        "1-darsdagi IP manzil va subnet mask qiymatlaringizni oling.",
        "Maskani prefiksga (masalan, /24) aylantiring.",
        "Tarmoq manzili, broadcast va hostlar sonini qo'lda hisoblang.",
      ],
      expected: "Uy tarmog'ingiz uchun tarmoq manzili, broadcast va hostlar soni to'g'ri hisoblangan.",
    },
  ],
};
