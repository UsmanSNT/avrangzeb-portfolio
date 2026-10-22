import type { Lesson } from "../types";

export const natPat: Lesson = {
  id: "nat-pat",
  title: "NAT va PAT: internetga chiqish",
  summary: "Private manzilli ofis bitta ommaviy manzil orqali internetga qanday chiqadi.",
  estimatedMinutes: 45,
  goals: [
    "NAT nega kerakligini va inside/outside atamalarini tushuntirasiz",
    "Static NAT va PAT (overload) farqini bilasiz",
    "PAT'ni sozlab, tarjimalar jadvalini o'qiysiz",
  ],
  requires: "Cisco Packet Tracer",
  recap: [
    "Private manzillar internetda marshrutlanmaydi; NAT ularni ommaviy manzilga almashtiradi.",
    "PAT (overload) — ko'p qurilma bitta ommaviy IP, farq port raqamida.",
    "ip nat inside / ip nat outside interfeyslarda belgilanishi shart.",
  ],
  steps: [
    {
      type: "learn",
      title: "Nega NAT?",
      body: "IPv4 manzillar (4,3 milliard) allaqachon tugagan. Shuning uchun ofis ichida private manzillar (192.168.x.x, 10.x.x.x) ishlatiladi. Ular internetda marshrutlanmaydi: chiqishda router ularni o'zining ommaviy manziliga almashtiradi — bu NAT.",
    },
    {
      type: "learn",
      title: "Atamalar",
      body: "NAT'da manzillar «qayerda turgani» bo'yicha nomlanadi. Inside — sizning tarmog'ingiz, outside — internet.",
      points: [
        "Inside local — kompyuterning private manzili (192.168.1.10).",
        "Inside global — uni internetda ifodalovchi ommaviy manzil (203.0.113.2).",
        "Outside global — internetdagi server manzili.",
      ],
    },
    {
      type: "learn",
      title: "Uch xil NAT",
      body: "Vazifaga qarab turlicha ishlatiladi.",
      points: [
        "Static NAT — 1:1, doimiy. Ichkaridagi serverni tashqariga ochish uchun.",
        "Dynamic NAT — private manzillar ommaviy manzillar pool'idan vaqtincha oladi.",
        "PAT (overload) — ko'p qurilma bitta ommaviy IP orqali; farq port raqamida. Uy va ofislarda deyarli har doim shu.",
      ],
    },
    {
      type: "quiz",
      question: "Uydagi 15 ta qurilma provayder bergan bitta ommaviy IP orqali internetga chiqadi. Bu qaysi NAT?",
      options: ["Static NAT", "Dynamic NAT", "PAT (overload)", "NAT kerak emas"],
      answerIndex: 2,
      explanation: "PAT har ulanishni port raqami bilan ajratadi, shuning uchun minglab ulanish bitta IP'dan chiqa oladi.",
    },
    {
      type: "learn",
      title: "PAT ishda",
      body: "Router har chiquvchi ulanish uchun yozuv saqlaydi: qaysi private manzil va port qaysi ommaviy manzil va portga almashtirildi. Javob kelganda shu yozuv bo'yicha teskari almashtiradi.",
      visual: {
        kind: "sequence",
        actors: ["PC 192.168.1.10", "R1 (NAT)", "Server"],
        messages: [
          { from: 0, to: 1, label: "Manba: 192.168.1.10:51000" },
          { from: 1, to: 2, label: "Manba almashtirildi: 203.0.113.2:51000" },
          { from: 2, to: 1, label: "Javob: 203.0.113.2:51000 ga" },
          { from: 1, to: 0, label: "Qaytarildi: 192.168.1.10:51000 ga" },
        ],
      },
    },
    {
      type: "learn",
      title: "PAT'ni sozlash rejasi",
      body: "To'rt qism bor va ularning har biri shart.",
      points: [
        "1. ACL: qaysi ichki manzillar tarjima qilinadi.",
        "2. ip nat inside source list ... interface ... overload — tarjima qoidasi.",
        "3. LAN interfeysida ip nat inside.",
        "4. Internet interfeysida ip nat outside.",
      ],
    },
    {
      type: "cli",
      title: "R1 da PAT'ni sozlang",
      scenario: "LAN 192.168.1.0/24 (Gi0/0) ISP'ga ulangan Gi0/1 (203.0.113.2) orqali internetga chiqsin.",
      lines: [
        { prompt: "R1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "R1(config)#." },
        { prompt: "R1(config)#", task: "1-raqamli standart ACL bilan 192.168.1.0/24 ni tanlang.", accept: ["access-list 1 permit 192.168.1.0 0.0.0.255"], explain: "Bu ACL filtrlamaydi — faqat qaysi manzillar tarjima qilinishini belgilaydi." },
        {
          prompt: "R1(config)#",
          task: "ACL 1 dagi manzillarni Gi0/1 manziliga overload bilan tarjima qiling.",
          accept: ["ip nat inside source list 1 interface gigabitEthernet0/1 overload"],
          explain: "overload — PAT: hamma bitta ommaviy IP'dan, turli portlar bilan chiqadi.",
        },
        { prompt: "R1(config)#", task: "LAN interfeysi Gi0/0 ga kiring.", accept: ["interface gigabitEthernet0/0"], explain: "Ichki tomon." },
        { prompt: "R1(config-if)#", task: "Uni NAT ichki tomoni deb belgilang.", accept: ["ip nat inside"], explain: "Shu interfeysdan kirgan paketlar tarjimaga nomzod." },
        { prompt: "R1(config-if)#", task: "Internet interfeysi Gi0/1 ga o'ting.", accept: ["interface gigabitEthernet0/1"], explain: "Tashqi tomon." },
        { prompt: "R1(config-if)#", task: "Uni NAT tashqi tomoni deb belgilang.", accept: ["ip nat outside"], explain: "Endi inside → outside yo'nalishida tarjima ishlaydi." },
        { prompt: "R1(config-if)#", task: "Imtiyozli rejimga qayting.", accept: ["end"], explain: "R1#." },
        {
          prompt: "R1#",
          task: "NAT tarjimalari jadvalini ko'ring.",
          accept: ["show ip nat translations"],
          explain: "Har qator — bitta faol ulanish: ichki manzil:port ↔ ommaviy manzil:port.",
          output: [
            "Pro  Inside global      Inside local       Outside local      Outside global",
            "icmp 203.0.113.2:1      192.168.1.10:1     198.51.100.10:1    198.51.100.10:1",
            "tcp  203.0.113.2:1025   192.168.1.11:1025  198.51.100.10:80   198.51.100.10:80",
          ],
        },
      ],
    },
    {
      type: "quiz",
      question: "Hamma narsa sozlangan, lekin LAN interfeysida ip nat inside unutilgan. Natija?",
      options: ["Hammasi ishlaydi", "Tarjima bo'lmaydi, kompyuterlar internetga chiqolmaydi", "Faqat ping ishlamaydi", "Router qayta yonadi"],
      answerIndex: 1,
      explanation: "Router qaysi interfeys ichki ekanini bilmasa, paketlarni tarjima qilmaydi va private manzil bilan chiqarib yuboradi.",
    },
    {
      type: "quiz",
      question: "show ip nat translations da kompyuterning private manzili qaysi ustunda?",
      options: ["Inside global", "Inside local", "Outside local", "Outside global"],
      answerIndex: 1,
      explanation: "Inside local — ichkaridagi qurilmaning haqiqiy (private) manzili. Inside global — uni internetda ifodalovchi manzil.",
    },
    {
      type: "learn",
      title: "Static NAT: serverni tashqariga ochish",
      body: "Ofis veb-serveri internetdan ochilishi kerak bo'lsa, unga doimiy ommaviy manzil beriladi. Bunda tashqaridan kelgan ulanishlar ham ichkariga o'tadi.",
      terminal: ["R1(config)# ip nat inside source static 192.168.1.100 203.0.113.10"],
    },
    {
      type: "type",
      title: "Qo'l xotirasi: NAT jadvali",
      prompt: "NAT tarjimalari jadvalini ko'rsatadigan buyruqni yozing.",
      options: [
        { command: "show ip nat translations", os: "To'liq" },
        { command: "sh ip nat tr", os: "Qisqa" },
      ],
      reps: 3,
    },
    {
      type: "lab",
      title: "Packet Tracer: ofis internetga chiqadi",
      tasks: [
        "LAN (switch + 2 PC, 192.168.1.0/24) — R1 — ISP router — Server (198.51.100.10) topologiyasini quring.",
        "R1 Gi0/1 = 203.0.113.2/30, ISP Gi0/1 = 203.0.113.1/30, ISP Gi0/0 = 198.51.100.1/24.",
        "R1 da default marshrut 203.0.113.1 ga. ISP'da private tarmoqlarga marshrut YO'Q — xuddi haqiqiy internetdagidek.",
        "R1 da PAT'ni sozlang va PC'dan server'ga ping qiling.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", note: "R1 da: internetga default yo'l." },
          { command: "ping 198.51.100.10", note: "PC'dan. PAT'siz ishlamaydi: ISP javobni 192.168.1.x ga qaytara olmaydi." },
          { command: "show ip nat translations", note: "PAT sozlangach R1 da: PC manzili 203.0.113.2 ga almashtirilgani ko'rinadi.", ifFails: "ip nat inside / outside to'g'ri interfeyslardami, ACL tarmoqni qamrab olganmi — tekshiring." },
        ],
      },
      expected: "PAT'dan keyin ping ishlaydi, tarjimalar jadvalida PC manzillari 203.0.113.2 bilan juftlangan.",
    },
    {
      type: "practice",
      title: "Tarjima jadvalini qo'lda to'ldiring",
      instructions: [
        "3 ta kompyuter (192.168.1.10, .11, .12) bir vaqtda bitta saytga ulanmoqda.",
        "PAT jadvalini qog'ozda to'ldiring: Inside local, Inside global (203.0.113.2), portlar.",
        "Ikki kompyuter bir xil manba port tanlasa, router nima qiladi? Javobni yozing.",
      ],
    },
  ],
};
