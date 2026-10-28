import type { Lesson } from "../types";

export const ethernetIpv4Headers: Lesson = {
  id: "ethernet-ipv4-headers",
  title: "Ethernet kadri va IPv4 sarlavhasi",
  summary: "Paketning ichiga qaraymiz: kadr maydonlari, IPv4 sarlavhasi, TTL va router'dan o'tganda nima o'zgarishi. Wireshark bilan.",
  estimatedMinutes: 70,
  goals: [
    "Ethernet kadri va IPv4 sarlavhasining asosiy maydonlarini taniysiz",
    "Router'dan o'tganda qaysi maydonlar o'zgarishini tushuntirasiz",
    "Wireshark'da filtr bilan kerakli paketni topib, o'qiysiz",
  ],
  requires: "Wireshark (wireshark.org)",
  recap: [
    "Kadr: Destination MAC, Source MAC, EtherType, ma'lumot (46–1500 bayt), FCS.",
    "IPv4: TTL, Protocol (1 ICMP, 6 TCP, 17 UDP), manba va manzil IP.",
    "Har router'da MAC manzillar qayta yoziladi va TTL kamayadi; IP manzillar (NAT bo'lmasa) o'zgarmaydi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Paketni ochib ko'ramiz",
      body: "Oldingi darslarda qatlamlarni nazariy o'rgandingiz. Endi bitta haqiqiy ping paketini Wireshark'dagidek ochamiz. Har qator — bitta maydon, har blok — bitta qatlam sarlavhasi.",
      visual: {
        kind: "packet",
        layers: [
          {
            name: "Ethernet II",
            fields: [
              { name: "Destination", value: "aa:bb:cc:11:22:33 (router)" },
              { name: "Source", value: "00:1a:2b:3c:4d:5e (kompyuter)" },
              { name: "Type", value: "IPv4 (0x0800)", highlight: true },
            ],
          },
          {
            name: "Internet Protocol Version 4",
            fields: [
              { name: "Version", value: "4" },
              { name: "Header Length", value: "20 bytes" },
              { name: "Total Length", value: "84" },
              { name: "Time to Live", value: "64", highlight: true },
              { name: "Protocol", value: "ICMP (1)", highlight: true },
              { name: "Source Address", value: "192.168.1.20" },
              { name: "Destination Address", value: "8.8.8.8" },
            ],
          },
          {
            name: "Internet Control Message Protocol",
            fields: [
              { name: "Type", value: "8 (Echo (ping) request)" },
              { name: "Code", value: "0" },
              { name: "Sequence Number", value: "1" },
            ],
          },
        ],
      },
    },
    {
      type: "learn",
      title: "Ethernet kadri",
      body: "2-qatlam kadri bir xil tuzilishga ega. EtherType ichida qaysi protokol borligini aytadi.",
      points: [
        "Destination MAC (6 bayt) va Source MAC (6 bayt).",
        "EtherType: 0x0800 — IPv4, 0x0806 — ARP, 0x86DD — IPv6, 0x8100 — VLAN tegi.",
        "Ma'lumot: 46–1500 bayt (1500 — Ethernet MTU).",
        "FCS (4 bayt) — xato tekshiruvi; buzilgan kadr tashlanadi (CRC xatosi).",
      ],
    },
    {
      type: "quiz",
      question: "Kadrdagi EtherType 0x0806 bo'lsa, ichida nima bor?",
      options: ["IPv4 paket", "ARP xabari", "IPv6 paket", "VLAN tegi"],
      answerIndex: 1,
      explanation: "0x0806 — ARP. IPv4 — 0x0800, IPv6 — 0x86DD.",
    },
    {
      type: "input",
      question: "Standart Ethernet kadrida ma'lumot qismining maksimal hajmi (MTU) necha bayt?",
      answers: ["1500"],
      hint: "Tunnel darsida ham shu son tilga olinadi.",
      explanation: "1500 bayt. Undan katta IP paketlar bo'linadi (fragmentatsiya) yoki tashlanadi.",
      placeholder: "Bayt",
    },
    {
      type: "learn",
      title: "IPv4 sarlavhasi",
      body: "IPv4 sarlavhasi kamida 20 bayt. Eng ko'p kerak bo'ladiganlari:",
      points: [
        "TTL — har router'da 1 ga kamayadi; 0 bo'lsa paket tashlanadi va ICMP «Time Exceeded» qaytadi.",
        "Protocol — ichidagi protokol: 1 — ICMP, 6 — TCP, 17 — UDP, 89 — OSPF.",
        "Source / Destination — manba va manzil IP.",
        "Flags (DF — bo'lmasin) va Fragment Offset — katta paketlarni bo'lish uchun.",
        "Header Checksum — sarlavha butunligi.",
      ],
    },
    {
      type: "quiz",
      question: "IPv4 sarlavhasida Protocol = 6. Ichida nima bor?",
      options: ["ICMP", "TCP", "UDP", "OSPF"],
      answerIndex: 1,
      explanation: "6 — TCP, 17 — UDP, 1 — ICMP, 89 — OSPF.",
    },
    {
      type: "learn",
      title: "TTL boshlang'ich qiymatlari",
      body: "Har operatsion tizim paketni o'z TTL qiymati bilan yuboradi. Javobdagi TTL'ga qarab, manba qanday tizim ekanini va qancha router o'tilganini taxmin qilish mumkin.",
      terminal: ["Linux / macOS  — 64", "Windows        — 128", "Cisco IOS      — 255", "", "Javob TTL=117 → ehtimol 128 dan boshlangan, 11 ta router o'tgan"],
    },
    {
      type: "input",
      question: "Linux serverdan kelgan javobda TTL=58. Paket yo'lda nechta router'dan o'tgan?",
      answers: ["6"],
      hint: "Linux 64 dan boshlaydi.",
      explanation: "64 − 58 = 6 ta router.",
      placeholder: "Son",
    },
    {
      type: "learn",
      title: "Router'dan o'tganda nima o'zgaradi?",
      body: "Bu — eng muhim tushunchalardan biri. Har router kadrni ochadi, IP paketni ko'radi va yangi kadrga solib keyingi qo'shniga yuboradi.",
      points: [
        "Manba va manzil MAC — har qadamda yangi (shu kanaldagi qurilmalarniki).",
        "TTL — 1 ga kamayadi, shu sababli checksum qayta hisoblanadi.",
        "Manba va manzil IP — o'zgarmaydi (NAT bo'lmasa).",
      ],
    },
    {
      type: "quiz",
      question: "Paket uchta router'dan o'tib serverga yetdi (NAT yo'q). Server ko'rgan paketning manba MAC manzili kimniki?",
      options: ["Dastlabki kompyuterniki", "Oxirgi router'ning serverga qaragan interfeysiniki", "Birinchi router'niki", "Serverning o'ziniki"],
      answerIndex: 1,
      explanation: "MAC manzil faqat bitta kanal ichida ma'noga ega. Server oxirgi router interfeysining MAC manzilini ko'radi, IP esa hamon kompyuterniki.",
    },
    {
      type: "quiz",
      question: "Shu paketda manba IP manzili kimniki?",
      options: ["Dastlabki kompyuterniki", "Oxirgi router'niki", "Birinchi router'niki", "DNS server'niki"],
      answerIndex: 0,
      explanation: "IP manzillar butun yo'l davomida o'zgarmaydi (NAT bo'lmasa). Shu sababli server kimga javob berishni biladi.",
    },
    {
      type: "lab",
      title: "Wireshark: filtrlash va o'qish",
      tasks: [
        "Wireshark'da tarmoq interfeysingizni tanlab, yozuvni boshlang.",
        "Terminalda ping 8.8.8.8 va nslookup example.com ni bajaring.",
        "Quyidagi filtrlarni navbat bilan yozib, har birida bitta paketni ochib o'qing.",
        "ICMP paketida TTL, Protocol va MAC manzillarni toping; javob paketidagi TTL bilan solishtiring.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "icmp", note: "Faqat ping (echo request/reply) paketlari." },
          { command: "arp", note: "ARP so'rov va javoblari: kim gateway MAC'ini so'radi." },
          { command: "dns", note: "DNS so'rov va javobi: so'ralgan nom va qaytgan IP." },
          { command: "ip.addr == 8.8.8.8", note: "Shu manzil qatnashgan barcha paketlar." },
          { command: "tcp.port == 443", note: "HTTPS trafiki (brauzerda biror sayt oching)." },
        ],
      },
      expected: "Har filtr bo'yicha kamida bitta paket ochilgan; ping javobida TTL so'rovdagidan farq qiladi.",
    },
    {
      type: "practice",
      title: "Sarlavhani yoddan chizing",
      instructions: [
        "Qog'ozga Ethernet kadri va IPv4 sarlavhasining maydonlarini yoddan chizing.",
        "Router'dan o'tganda o'zgaradigan maydonlarni qizil bilan belgilang.",
        "Protocol raqamlari (1, 6, 17, 89) va EtherType'larni (0x0800, 0x0806, 0x86DD) yoniga yozing.",
      ],
      seconds: 180,
    },
  ],
};
