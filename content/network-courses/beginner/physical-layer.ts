import type { Lesson } from "../types";

export const physicalLayer: Lesson = {
  id: "physical-layer",
  title: "Kabellar va fizik qatlam",
  summary: "Mis kabel toifalari, RJ45 simlash standarti, optika, PoE, tezlik va duplex. Kabelni o'z qo'lingiz bilan tayyorlashga qadar.",
  estimatedMinutes: 60,
  goals: [
    "Vazifaga mos kabel turini (Cat5e/6/6a, single-mode, multimode) tanlaysiz",
    "T568B rang tartibini yoddan bilasiz va kabel tayyorlay olasiz",
    "Tezlik, duplex va PoE tushunchalarini amalda qo'llaysiz",
  ],
  requires: "Ixtiyoriy: Cat5e/6 kabel, RJ45 ulagichlar, krimper va kabel testeri",
  recap: [
    "Mis Ethernet segmenti — ko'pi bilan 100 metr; 10 Gbit/s uchun 100 m da Cat6a kerak.",
    "T568B: oq-to'q sariq, to'q sariq, oq-yashil, ko'k, oq-ko'k, yashil, oq-jigarrang, jigarrang.",
    "Uzoq masofa — single-mode optika; bino ichida qisqa masofa — multimode.",
  ],
  steps: [
    {
      type: "learn",
      title: "Nega fizik qatlam muhim?",
      body: "Tarmoq muammolarining katta qismi 1-qatlamda: shikastlangan kabel, noto'g'ri simlangan ulagich, juda uzun kabel yoki mos kelmagan modul. Yaxshi muhandis «ping ishlamayapti» deyilganda avval kabel va port chiroqlariga qaraydi.",
    },
    {
      type: "learn",
      title: "Bit va bayt: tezlik birliklari",
      body: "Tarmoq tezligi bitlarda (Mbit/s, Gbit/s), fayl hajmi va yuklab olish tezligi esa ko'pincha baytlarda (MB/s) o'lchanadi. 1 bayt = 8 bit. Shuning uchun 100 Mbit/s internet ideal holda soniyasiga taxminan 12,5 MB yuklaydi.",
      terminal: ["100 Mbit/s ÷ 8 = 12,5 MB/s", "1 Gbit/s   ÷ 8 = 125 MB/s"],
    },
    {
      type: "input",
      question: "1 Gbit/s kanalda nazariy maksimal tezlik soniyasiga necha MB bo'ladi?",
      answers: ["125", "125 mb/s", "125mb/s"],
      hint: "1 Gbit = 1000 Mbit. 8 ga bo'ling.",
      explanation: "1000 ÷ 8 = 125 MB/s. Amalda sarlavhalar va protokollar sababli biroz kamroq bo'ladi.",
      placeholder: "Son",
    },
    {
      type: "learn",
      title: "Mis kabel toifalari (UTP)",
      body: "Ofislarda eng ko'p o'ralgan juftli mis kabel (UTP) ishlatiladi. Ichida 4 juft sim bor. Toifa qanchalik yuqori bo'lsa, shuncha yuqori tezlikni ko'taradi. Mis Ethernet segmentining chegarasi — 100 metr.",
      points: [
        "Cat5e — 1 Gbit/s, 100 m gacha.",
        "Cat6 — 1 Gbit/s 100 m gacha; 10 Gbit/s faqat taxminan 55 m gacha.",
        "Cat6a — 10 Gbit/s, 100 m gacha. Yangi binolar uchun tavsiya.",
      ],
    },
    {
      type: "quiz",
      question: "Shkafdan ish joyigacha 90 metr. 10 Gbit/s kerak. Qaysi kabel?",
      options: ["Cat5e", "Cat6", "Cat6a", "Telefon kabeli"],
      answerIndex: 2,
      explanation: "Cat6 da 10 Gbit/s faqat ~55 m gacha kafolatlanadi. 90 m uchun Cat6a kerak.",
    },
    {
      type: "learn",
      title: "RJ45 va T568B standarti",
      body: "Kabel uchlariga RJ45 (8P8C) ulagich qisiladi. Simlar qat'iy tartibda joylashadi. Amalda eng ko'p T568B standarti ishlatiladi. Ulagichning qulfi pastda, kontaktlar sizga qaragan holda chapdan o'ngga sanaladi.",
      terminal: [
        "1 oq-to'q sariq   2 to'q sariq",
        "3 oq-yashil       4 ko'k",
        "5 oq-ko'k         6 yashil",
        "7 oq-jigarrang    8 jigarrang",
      ],
    },
    {
      type: "order",
      title: "T568B tartibini yig'ing",
      prompt: "Simlarni 1-kontaktdan 8-kontaktgacha bosing.",
      items: ["Oq-to'q sariq", "To'q sariq", "Oq-yashil", "Ko'k", "Oq-ko'k", "Yashil", "Oq-jigarrang", "Jigarrang"],
    },
    {
      type: "learn",
      title: "To'g'ri va kesishgan kabel",
      body: "Ikki uchi bir xil standartda (B–B) bo'lsa — to'g'ri (straight-through) kabel: kompyuterni switch'ga ulash uchun. Bir uchi A, ikkinchisi B bo'lsa — kesishgan (crossover): bir xil turdagi qurilmalarni (switch–switch) ulash uchun. Zamonaviy qurilmalarda Auto-MDIX bor va u buni o'zi moslaydi, lekin eski qurilmalar va imtihonlar uchun farqni bilish kerak.",
      points: ["100 Mbit/s Ethernet 2 juftni (1, 2, 3, 6 kontaktlar) ishlatadi.", "1 Gbit/s va undan yuqori — barcha 4 juftni."],
    },
    {
      type: "quiz",
      question: "Auto-MDIX'siz ikki eski switch'ni ulash kerak. Qaysi kabel?",
      options: ["To'g'ri (straight-through)", "Kesishgan (crossover)", "Konsol kabeli", "Optik patch-kord"],
      answerIndex: 1,
      explanation: "Bir xil turdagi qurilmalar (switch–switch, PC–PC) Auto-MDIX bo'lmasa kesishgan kabel bilan ulanadi.",
    },
    {
      type: "learn",
      title: "Optik tola",
      body: "Optika signalni yorug'lik bilan uzatadi: elektromagnit shovqinga chidamli va juda uzoqqa boradi. Switch'ga SFP/SFP+ modul orqali ulanadi, ulagichlari ko'pincha LC yoki SC.",
      points: [
        "Single-mode (SMF) — ingichka yadro (~9 mkm), lazer, o'nlab kilometr. Ko'pincha sariq qobiq.",
        "Multimode (MMF) — yo'g'onroq yadro (50/62,5 mkm), yuzlab metr. Ko'pincha moviy (OM3/OM4) yoki to'q sariq qobiq.",
        "Modul va tola turi mos bo'lishi shart: SMF modulga MMF tola ishlamaydi.",
      ],
    },
    {
      type: "quiz",
      question: "Ikki bino orasi 15 km. Qaysi muhit to'g'ri keladi?",
      options: ["Cat6a mis kabel", "Multimode optika", "Single-mode optika", "Wi-Fi"],
      answerIndex: 2,
      explanation: "Mis 100 m bilan, multimode yuzlab metr bilan cheklangan. Kilometrlar uchun single-mode optika ishlatiladi.",
    },
    {
      type: "learn",
      title: "PoE: kabel orqali elektr",
      body: "PoE (Power over Ethernet) switch'dan Ethernet kabeli orqali qurilmaga elektr beradi: IP telefon, Wi-Fi kirish nuqtasi, kamera alohida rozetkasiz ishlaydi. Switch'ning umumiy PoE quvvat byudjeti cheklangan — buni loyihada hisoblash kerak.",
      points: ["802.3af (PoE) — portda 15,4 Vt gacha.", "802.3at (PoE+) — 30 Vt gacha.", "802.3bt — 60–90 Vt gacha (kuchli kirish nuqtalari, PTZ kameralar)."],
    },
    {
      type: "learn",
      title: "Tezlik va duplex",
      body: "Ikki port ulanganda autonegotiation orqali tezlik va duplexni kelishadi. Full-duplex — bir vaqtda yuborish va qabul qilish; half-duplex — navbat bilan. Agar bir tomonda qo'lda «100/full» qo'yilib, ikkinchisi avtomatik qolsa, duplex mismatch yuzaga keladi: tarmoq ishlaydi, lekin juda sekin va xatolar ko'payadi.",
    },
    {
      type: "quiz",
      question: "Port ishlayapti, lekin juda sekin va xato hisoblagichlari o'smoqda. Bir tomonda tezlik qo'lda qo'yilgan. Eng ehtimoliy sabab?",
      options: ["DNS muammosi", "Duplex mismatch", "VLAN noto'g'ri", "IP manzil band"],
      answerIndex: 1,
      explanation: "Bir tomon qo'lda, ikkinchisi avtomatik bo'lsa, avtomatik tomon ko'pincha half-duplex'ga tushadi. Ikkala tomonni bir xil sozlang.",
    },
    {
      type: "lab",
      title: "Packet Tracer: to'g'ri kabelni tanlash",
      tasks: [
        "2 ta PC, 2 ta 2960 switch va 1 ta 2911 router qo'ying.",
        "PC → switch, switch → switch, switch → router ulanishlari uchun kabel turini o'zingiz tanlang (avtomatik «chaqmoq» kabelni ishlatmang).",
        "Port chiroqlari yashil bo'lishini kuting; to'q sariq yoki qizil bo'lsa, sababini toping.",
        "Router'ga konsol kabeli bilan PC ulab, Terminal orqali kiring.",
      ],
      expected: "Barcha ulanishlar yashil; switch–switch uchun crossover tanlangan; konsol orqali router CLI ochiladi.",
    },
    {
      type: "practice",
      title: "Qo'l bilan: kabel tayyorlash",
      instructions: [
        "Agar asboblar bo'lsa: kabel uchini 2–3 sm tozalang, juftlarni yoying va T568B tartibida tekislang.",
        "Simlarni ~1,5 sm qoldirib kesing, RJ45 ga oxirigacha kiriting va krimper bilan qising.",
        "Tester bilan 8 ta simni tekshiring. Asbob bo'lmasa, rang tartibini qog'ozga 10 marta yoddan yozing.",
      ],
    },
  ],
};
