import type { Lesson } from "../types";

export const ipv4Binary: Lesson = {
  id: "ipv4-binary",
  title: "IPv4 manzil va ikkilik sanoq",
  summary: "IP manzil tuzilishi, ikkilik (binary) o'tkazish va barmoq bilan sanash mashqi.",
  estimatedMinutes: 55,
  goals: [
    "IPv4 manzil tuzilishini tushuntirib bera olasiz",
    "0–255 oralig'idagi sonni ikkilikka o'tkazasiz",
    "Private va maxsus manzillarni taniysiz",
  ],
  requires: "Daftar va qalam; kalkulyator («Programmer» rejimi)",
  recap: [
    "IPv4 — 32 bit, 4 oktet; har oktet 0 dan 255 gacha.",
    "Bit og'irliklari: 128, 64, 32, 16, 8, 4, 2, 1.",
    "Private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. 169.254.x.x — DHCP topilmagan.",
  ],
  steps: [
    {
      type: "learn",
      title: "IP manzil — qurilmaning manzili",
      body: "Uyingizga pochta kelishi uchun manzil kerak. Tarmoqda ham shunday: har bir qurilmaning o'z IP manzili bor. Masalan: 192.168.1.10.",
    },
    {
      type: "learn",
      title: "32 bit, to'rt oktet",
      body: "IPv4 manzil 32 bitdan iborat va 4 ta 8 bitli qismga (oktet) bo'linadi. 8 bit 256 xil qiymat beradi, shuning uchun har oktet 0 dan 255 gacha.",
      terminal: ["192      .168      .1        .10", "11000000 .10101000 .00000001 .00001010"],
    },
    {
      type: "learn",
      title: "Bit og'irliklari",
      body: "Oktetdagi har bitning o'z og'irligi bor. Bit 1 bo'lsa, og'irlik yig'indiga qo'shiladi, 0 bo'lsa qo'shilmaydi.",
      terminal: ["128  64  32  16   8   4   2   1", " 0   0   0   0   0   1   0   1   = 4 + 1 = 5"],
    },
    {
      type: "binary",
      title: "Bitlarni o'zingiz yoqing",
      prompt: "Bitlarni bosib, ko'rsatilgan sonni yig'ing.",
      targets: [5, 10, 64],
    },
    {
      type: "learn",
      title: "168 ni qanday topamiz?",
      body: "Katta og'irlikdan boshlab sig'adiganini olamiz. 168: 128 sig'adi (qoldi 40), 64 sig'maydi, 32 sig'adi (qoldi 8), 16 sig'maydi, 8 sig'adi (qoldi 0).",
      terminal: ["168 = 128 + 32 + 8", "      = 10101000"],
    },
    {
      type: "binary",
      title: "Endi kattaroq sonlar",
      prompt: "Bitlarni bosib, ko'rsatilgan sonni yig'ing.",
      targets: [168, 192, 255],
    },
    {
      type: "quiz",
      question: "IPv4 manzil necha bitdan iborat?",
      options: ["16", "32", "48", "128"],
      answerIndex: 1,
      explanation: "IPv4 — 32 bit (4 oktet × 8 bit). 48 bit MAC manzilga, 128 bit IPv6'ga tegishli.",
    },
    {
      type: "trainer",
      title: "Ikkilik sanoq trenajyori",
      prompt: "Sonlarni ikkilikka va ikkilikdan o'nlikka o'tkazing. Ketma-ket 8 ta to'g'ri javob kerak.",
      kind: "binary",
      goal: 8,
    },
    {
      type: "learn",
      title: "Private manzillar",
      body: "Ba'zi diapazonlar internetda marshrutlanmaydi, ular uy va ofis tarmoqlari uchun ajratilgan. Router ularni NAT orqali bitta ommaviy manzilga aylantiradi.",
      points: ["10.0.0.0/8", "172.16.0.0/12 (172.16.x.x — 172.31.x.x)", "192.168.0.0/16"],
    },
    {
      type: "quiz",
      question: "Quyidagilardan qaysi biri private IPv4 manzil?",
      options: ["172.32.0.5", "192.169.1.1", "10.20.30.40", "8.8.8.8"],
      answerIndex: 2,
      explanation: "10.0.0.0/8 — private. 172.32.x.x va 192.169.x.x private emas, chunki ular diapazondan tashqarida.",
    },
    {
      type: "learn",
      title: "Maxsus manzillar",
      body: "Ikki manzilni tanish diagnostikada juda foydali.",
      points: [
        "127.0.0.1 — loopback, kompyuterning o'zi.",
        "169.254.x.x — APIPA: DHCP serverdan manzil olinmaganda kompyuter o'ziga bergan manzil.",
      ],
    },
    {
      type: "quiz",
      question: "Kompyuteringiz IP manzili 169.254.7.3 bo'lib qoldi. Bu nimani bildiradi?",
      options: [
        "DHCP serverdan manzil olinmagan",
        "Kompyuter private diapazondan tashqarida",
        "DNS yaxshi ishlayapti",
        "Brauzer eskirgan",
      ],
      answerIndex: 0,
      explanation: "169.254.x.x — DHCP topilmaganda Windows va boshqa tizimlar o'zi tanlagan manzil. Router yoki DHCP bilan muammo bor.",
    },
    {
      type: "learn",
      title: "Unicast, broadcast, multicast",
      body: "Paket kimga yuborilishiga qarab uch xil bo'ladi.",
      points: [
        "Unicast — bitta qurilmaga (oddiy holat).",
        "Broadcast — subnetdagi hammaga: subnet broadcast (masalan 192.168.1.255) yoki 255.255.255.255. Router broadcast'ni boshqa tarmoqqa o'tkazmaydi.",
        "Multicast — obuna bo'lgan guruhga: 224.0.0.0/4 diapazoni (masalan, OSPF 224.0.0.5 dan foydalanadi).",
        "0.0.0.0 — «manzil hali yo'q» (DHCP Discover manbasi) yoki marshrutlarda «hamma tarmoqlar».",
      ],
    },
    {
      type: "quiz",
      question: "224.0.0.5 qaysi turdagi manzil?",
      options: ["Private unicast", "Multicast", "Broadcast", "Loopback"],
      answerIndex: 1,
      explanation: "224.0.0.0–239.255.255.255 — multicast. 224.0.0.5 ni OSPF router'lari ishlatadi.",
    },
    {
      type: "learn",
      title: "Tarixiy sinflar (A, B, C)",
      body: "Eski darsliklarda va intervyularda manzil sinflari so'raladi. Bugun CIDR ishlatiladi, lekin birinchi oktet bo'yicha sinfni tanish foydali.",
      terminal: ["A: 1–126     (standart /8)", "B: 128–191   (standart /16)", "C: 192–223   (standart /24)", "D: 224–239   multicast", "E: 240–255   eksperimental", "127 — loopback uchun ajratilgan"],
    },
    {
      type: "practice",
      title: "Barmoq bilan ikkilikda sanash",
      instructions: [
        "O'ng qo'l 5 barmog'i — 5 bit. Ko'tarilgan barmoq = 1, tushirilgani = 0.",
        "0 dan 31 gacha barmoqlaringiz bilan ikkilikda sanang. Bosh barmoq — 1, ko'rsatkich — 2, o'rta — 4, nomsiz — 8, jimjiloq — 16.",
        "Xatosiz sanagunga qadar takrorlang.",
      ],
      seconds: 60,
    },
    {
      type: "lab",
      title: "O'z IP manzilingizni ikkilikka o'tkazing",
      tasks: [
        "1-darsda yozib olgan IPv4 manzilingizni oling.",
        "Har oktetni daftarda 128-64-32-16-8-4-2-1 jadvali bilan ikkilikka o'tkazing.",
        "Kalkulyatorni «Programmer» rejimida ochib, natijangizni tekshiring.",
      ],
      expected: "Qo'lda hisoblangan to'rt oktet ham kalkulyator natijasi bilan mos keladi.",
    },
    {
      type: "practice",
      title: "Tezlik mashqi",
      instructions: [
        "0 dan 255 gacha 10 ta tasodifiy son yozing.",
        "Taymer ichida ularni ikkilikka o'tkazing va kalkulyatorda tekshiring.",
        "Har kuni vaqtni qisqartirishga harakat qiling.",
      ],
      seconds: 120,
    },
  ],
};
