import type { Lesson } from "../types";

export const routingTroubleshooting: Lesson = {
  id: "routing-troubleshooting",
  title: "Marshrutlash, NAT va ACL nosozliklarini tuzatish",
  summary: "3-qatlam muammolarini tizimli topish: o'rnatilmagan marshrut, qaytish yo'li, halqa, ACL va NAT xatolari.",
  estimatedMinutes: 70,
  goals: [
    "Marshrut jadvalida nega yo'l yo'qligini aniqlaysiz",
    "traceroute bilan halqa va uzilish joyini topasiz",
    "ACL va NAT xatolarini show buyruqlari bilan topasiz",
  ],
  requires: "Cisco Packet Tracer; statik marshrutlash, ACL va NAT darslari",
  recap: [
    "Next-hop yetib bo'lmaydigan statik marshrut jadvalga o'rnatilmaydi.",
    "traceroute'da ikki manzil navbatlashsa — marshrutlash halqasi.",
    "ACL: show access-lists dagi hisoblagichlar; NAT: ip nat inside/outside joylashuvi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Paket yo'li bo'ylab fikrlash",
      body: "3-qatlam muammosida paketning ikki yo'nalishdagi yo'lini qadamma-qadam tasavvur qiling: har router'da «bu paketni qayerga yuboraman?» va javob uchun ham xuddi shu savol. Ko'p muammolar qaytish yo'lida.",
      points: [
        "show ip route — yo'l bormi, qaysi manba (C, S, O) va qaysi next-hop?",
        "show ip interface brief — chiqish interfeysi up/up mi?",
        "ping va traceroute — paket qayergacha yetib boradi?",
        "show access-lists va show ip nat translations — filtrlanyaptimi yoki tarjima qilinyaptimi?",
      ],
    },
    {
      type: "learn",
      title: "Marshrut nega jadvalda yo'q?",
      body: "Konfiguratsiyada ip route bor, lekin show ip route da u ko'rinmaydi. Sabab odatda bitta: router next-hop manzilga yetib bora olmaydi (u hech bir ulangan subnetda emas yoki chiqish interfeysi down). Bunday statik marshrut jadvalga o'rnatilmaydi.",
    },
    {
      type: "cli",
      title: "Tiket: LAN2 ga yo'l yo'q",
      scenario: "R1 dan 192.168.2.0/24 ga ping ishlamayapti. Kanal R1 Gi0/1 = 10.0.0.1/30, R2 = 10.0.0.2. Sababni topib, tuzating.",
      lines: [
        {
          prompt: "R1#",
          task: "Statik marshrutlarni ko'ring.",
          accept: ["show ip route static"],
          explain: "Jadvalda statik marshrut yo'q, holbuki konfiguratsiyada bo'lishi kerak edi.",
          output: ["(bo'sh)"],
        },
        {
          prompt: "R1#",
          task: "Konfiguratsiyadan ip route qatorlarini ko'ring.",
          accept: ["show running-config | include ip route"],
          explain: "Next-hop 10.0.0.6 — u 10.0.0.0/30 da emas (bu subnetda faqat .1 va .2). Router unga yetolmaydi, shuning uchun marshrut o'rnatilmagan.",
          output: ["ip route 192.168.2.0 255.255.255.0 10.0.0.6"],
        },
        { prompt: "R1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "(config)#." },
        { prompt: "R1(config)#", task: "Noto'g'ri marshrutni o'chiring.", accept: ["no ip route 192.168.2.0 255.255.255.0 10.0.0.6"], explain: "Xato qator olib tashlandi." },
        { prompt: "R1(config)#", task: "To'g'ri next-hop (10.0.0.2) bilan marshrut qo'shing.", accept: ["ip route 192.168.2.0 255.255.255.0 10.0.0.2"], explain: "Next-hop endi ulangan subnetda." },
        { prompt: "R1(config)#", task: "Imtiyozli rejimga qayting.", accept: ["end"], explain: "R1#." },
        {
          prompt: "R1#",
          task: "Statik marshrutlarni qayta tekshiring.",
          accept: ["show ip route static"],
          explain: "Marshrut o'rnatildi. Endi R2 da qaytish yo'li borligini ham tekshiring.",
          output: ["S    192.168.2.0/24 [1/0] via 10.0.0.2"],
        },
      ],
    },
    {
      type: "learn",
      title: "Marshrutlash halqasi",
      body: "R1 «192.168.5.0 R2 da» deydi, R2 esa «192.168.5.0 R1 da» deydi. Paket ular orasida TTL tugaguncha aylanadi. traceroute'da bu juda aniq ko'rinadi.",
      terminal: ["1  10.0.0.2", "2  10.0.0.1", "3  10.0.0.2", "4  10.0.0.1", "...  (TTL tugaguncha)"],
    },
    {
      type: "quiz",
      question: "traceroute natijasida ikki router manzili navbat bilan takrorlanmoqda. Bu nima?",
      options: ["Normal holat", "Marshrutlash halqasi", "DNS muammosi", "ACL ishlayapti"],
      answerIndex: 1,
      explanation: "Ikki router bir-birini next-hop deb ko'rsatgan. Ikkalasining marshrut jadvalini solishtiring.",
    },
    {
      type: "learn",
      title: "ACL nosozliklari",
      body: "ACL xatolarini topishning eng tez yo'li — hisoblagichlar. show access-lists har qatorga nechta paket mos kelganini ko'rsatadi. Ping qilib, qaysi qator hisoblagichi o'sganini kuzating.",
      points: [
        "Kerakli permit oxirida yashirin deny'dan oldin bormi?",
        "Qatorlar tartibi to'g'rimi? Keng deny tor permit'dan oldin turmaganmi?",
        "ACL to'g'ri interfeys va yo'nalishga qo'llanganmi? (show ip interface g0/0 — «Inbound access list is ...»)",
        "Wildcard to'g'rimi? (0.0.0.255 o'rniga 255.255.255.0 yozilmaganmi?)",
      ],
    },
    {
      type: "quiz",
      question: "ACL: «10 deny ip 192.168.20.0 0.0.0.255 any», «20 permit tcp host 192.168.20.5 any eq 443». 192.168.20.5 HTTPS'ga chiqa olmayapti. Nega?",
      options: [
        "443 port yopiq",
        "10-qator butun subnetni oldinroq taqiqlaydi; 20-qatorgacha navbat kelmaydi",
        "ACL interfeysga qo'llanmagan",
        "host so'zi noto'g'ri",
      ],
      answerIndex: 1,
      explanation: "Birinchi mos kelgan qator bajariladi. Aniq permit keng deny'dan OLDIN turishi kerak.",
    },
    {
      type: "learn",
      title: "NAT nosozliklari",
      body: "NAT ishlamasa, odatda shu to'rttadan biri.",
      points: [
        "ip nat inside va ip nat outside joylari almashib ketgan.",
        "ACL ichki tarmoqni qamrab olmaydi (noto'g'ri wildcard yoki subnet).",
        "Router'da internetga default route yo'q.",
        "show ip nat translations bo'sh bo'lsa — tarjima umuman sodir bo'lmayapti; avval inside/outside'ni tekshiring.",
      ],
    },
    {
      type: "quiz",
      question: "PAT sozlangan, lekin show ip nat translations bo'sh va kompyuterlar internetga chiqmaydi. Birinchi nimani tekshirasiz?",
      options: [
        "Interfeyslarda ip nat inside va ip nat outside to'g'ri joylashganini",
        "DNS serverni",
        "Kompyuterlarning brauzerini",
        "VLAN raqamlarini",
      ],
      answerIndex: 0,
      explanation: "Jadval bo'sh — tarjima boshlanmagan. Eng ko'p uchraydigan sabab — inside/outside yo'qligi yoki almashib ketgani.",
    },
    {
      type: "quiz",
      question: "Ssenariy: filial kompyuterlari 169.254.x.x oldi. DHCP server markazda (10.10.20.10), filial router'ida ip helper-address 10.10.20.10 bor, server pool'i ham bor. Yana nimani tekshirish kerak?",
      options: [
        "Markaziy router'da filial subnetiga qaytish marshruti (server javobi qaytishi uchun)",
        "Filialdagi kabel toifasini",
        "Wi-Fi kanalini",
        "NAT pool'ini",
      ],
      answerIndex: 0,
      explanation: "Server Offer'ni relay manziliga (filial gateway'i) yuboradi. Markazda bu subnetga yo'l bo'lmasa, javob yo'qoladi.",
    },
    {
      type: "practice",
      title: "Nosozlik qaydnomasi",
      instructions: [
        "Ushbu darsdagi 4 ta muammo turi (marshrut o'rnatilmagan, halqa, ACL tartibi, NAT inside/outside) uchun bir sahifalik qaydnoma tuzing.",
        "Har biri uchun: belgi, tekshirish buyrug'i, odatiy sabab, yechim.",
        "Qaydnomani ish joyida stol ustida turadigan shpargalkaga aylantiring.",
      ],
    },
    {
      type: "lab",
      title: "Packet Tracer: uch router'da buzish va tuzatish",
      tasks: [
        "OSPF laboratoriyangizga NAT (chegaradagi router) va mehmonlar ACL'ini qo'shing.",
        "Kimdir sizga 3 ta xato kiritsin: statik marshrutda noto'g'ri next-hop, ACL qatorlari tartibi, NAT inside/outside almashtirilgan.",
        "Paket yo'li bo'ylab fikrlab, har birini toping va tuzating.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "traceroute 192.168.2.10", note: "Paket qayergacha boradi va qayerda to'xtaydi?" },
          { command: "show ip route", note: "Yo'l bormi, next-hop to'g'rimi?" },
          { command: "show access-lists", note: "Qaysi qator hisoblagichi o'smoqda?" },
          { command: "show ip nat translations", note: "Tarjima bormi?" },
        ],
      },
      expected: "Uchala xato topilib tuzatilgan; har biri uchun ishlatilgan buyruq va sabab yozilgan.",
    },
  ],
};
