import type { Lesson } from "../types";

export const dnsDhcpPorts: Lesson = {
  id: "dns-dhcp-ports",
  title: "DNS, DHCP, TCP/UDP va portlar",
  summary: "Kompyuter manzilni qanday oladi, nomni qanday topadi va ilovalar qanday ajratiladi.",
  estimatedMinutes: 40,
  goals: [
    "DHCP jarayonini (DORA) tartib bilan ayta olasiz",
    "DNS nima qilishini tushuntirib bera olasiz",
    "Asosiy portlar va TCP bilan UDP farqini bilasiz",
  ],
  requires: "Terminal",
  recap: [
    "DHCP: Discover → Offer → Request → Acknowledge.",
    "DNS domen nomini IP manzilga aylantiradi.",
    "Portlar: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS. TCP ishonchli, UDP tez.",
  ],
  steps: [
    {
      type: "learn",
      title: "DHCP: manzilni kim beradi?",
      body: "Kompyuter tarmoqqa ulanganda IP manzilni qo'lda kiritmaydi. DHCP server unga avtomatik IP, maska, gateway va DNS beradi. Odatda bu uy routeringizning vazifasi.",
    },
    {
      type: "learn",
      title: "DORA: to'rt qadam",
      body: "Jarayon to'rt xabardan iborat: Discover, Offer, Request, Acknowledge.",
      visual: {
        kind: "sequence",
        actors: ["Klient", "DHCP server"],
        messages: [
          { from: 0, to: 1, label: "Discover (broadcast): kim IP beradi?" },
          { from: 1, to: 0, label: "Offer: manzil 192.168.1.10 ni taklif qilaman" },
          { from: 0, to: 1, label: "Request: shu manzilni olaman" },
          { from: 1, to: 0, label: "Acknowledge: tasdiqlandi" },
        ],
      },
    },
    {
      type: "order",
      title: "DORA tartibini yig'ing",
      prompt: "DHCP xabarlarini to'g'ri tartibda bosing.",
      items: ["Discover", "Offer", "Request", "Acknowledge"],
    },
    {
      type: "learn",
      title: "DNS: nomdan manzilga",
      body: "Odamlar example.com ni eslab qoladi, kompyuterlar esa IP bilan ishlaydi. DNS server nomni IP manzilga aylantiradi, shuning uchun u internetning «telefon kitobi» deyiladi.",
      visual: {
        kind: "sequence",
        actors: ["Brauzer", "DNS server"],
        messages: [
          { from: 0, to: 1, label: "example.com ning IP manzili qanday?" },
          { from: 1, to: 0, label: "93.184.216.34" },
        ],
      },
    },
    {
      type: "quiz",
      question: "DNS nima qiladi?",
      options: [
        "Domen nomini IP manzilga aylantiradi",
        "Kompyuterga IP manzil beradi",
        "Trafikni shifrlaydi",
        "MAC manzilni topadi",
      ],
      answerIndex: 0,
      explanation: "DNS nomni IP'ga aylantiradi. Manzil berish — DHCP, MAC'ni topish — ARP vazifasi.",
    },
    {
      type: "learn",
      title: "Port: xona raqami",
      body: "IP manzil — bino manzili bo'lsa, port — undagi xona raqami. Port (0–65535) kompyuterdagi qaysi dasturga murojaat qilinayotganini ko'rsatadi.",
    },
    {
      type: "learn",
      title: "Eng muhim portlar",
      body: "Quyidagilarni yodlash sizni ko'p muammodan qutqaradi.",
      points: [
        "22 SSH · 23 Telnet · 25 SMTP",
        "53 DNS",
        "80 HTTP · 443 HTTPS",
        "110 POP3 · 143 IMAP · 20/21 FTP",
      ],
    },
    {
      type: "quiz",
      question: "HTTPS standart portini ko'rsating.",
      options: ["80", "22", "443", "53"],
      answerIndex: 2,
      explanation: "HTTPS — 443. HTTP 80, SSH 22, DNS 53 portidan foydalanadi.",
    },
    {
      type: "learn",
      title: "TCP va UDP",
      body: "TCP ulanishni oldindan o'rnatadi va yetkazishni kafolatlaydi (veb, pochta). UDP ulanishsiz, tezroq, lekin kafolatsiz (DNS, video qo'ng'iroq). TCP ulanishi uch qadamli qo'l siqish bilan boshlanadi.",
      visual: {
        kind: "sequence",
        actors: ["Klient", "Server"],
        messages: [
          { from: 0, to: 1, label: "SYN" },
          { from: 1, to: 0, label: "SYN-ACK" },
          { from: 0, to: 1, label: "ACK" },
        ],
      },
    },
    {
      type: "quiz",
      question: "Parolni ochiq matnda yuboradigan Telnet o'rniga qaysi xavfsiz protokol ishlatiladi?",
      options: ["FTP", "SSH", "HTTP", "SMTP"],
      answerIndex: 1,
      explanation: "SSH (22-port) trafikni shifrlaydi, Telnet (23) esa shifrlamaydi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: DNS so'rovi",
      prompt: "example.com uchun DNS so'rovini yuboradigan buyruqni yozing.",
      accept: ["nslookup example.com", "dig example.com"],
      reps: 3,
    },
    {
      type: "lab",
      title: "DNS va HTTP javobini ko'ring",
      tasks: [
        "nslookup example.com ni bajaring va qaysi DNS server javob berganini yozib oling.",
        "curl -I https://example.com bilan saytning sarlavhalarini so'rang.",
        "Birinchi qatordan HTTP status kodini toping (200, 301, 404 ...).",
      ],
      commands: ["nslookup example.com", "curl -I https://example.com"],
      expected: "Domen uchun IP manzil va javob bergan DNS server hamda «HTTP/... 200» kabi status qatori ko'rinadi.",
    },
    {
      type: "practice",
      title: "Portlar jadvalini yodlang",
      instructions: [
        "Qog'ozga yodingizdan yozing: 22, 23, 25, 53, 80, 110, 143, 443 va ularning protokollari.",
        "Xatolarni tuzating, yana yozing.",
        "Har kuni 3 marta, har gal vaqtni o'lchang.",
      ],
      seconds: 90,
    },
  ],
};
