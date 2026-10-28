import type { Lesson } from "../types";

export const tcpUdpDeep: Lesson = {
  id: "tcp-udp-deep",
  title: "TCP, UDP va ICMP chuqurroq",
  summary: "Portlar va soketlar, TCP sarlavhasi, seq/ack raqamlari, oqimni boshqarish, ulanishni yopish va ICMP turlari.",
  estimatedMinutes: 70,
  goals: [
    "Ulanishni 5 qismli identifikator (5-tuple) bilan tushuntirasiz",
    "TCP qo'l siqishini seq/ack raqamlari bilan kuzatasiz",
    "ICMP turlarini va ularning diagnostikadagi o'rnini bilasiz",
  ],
  requires: "Wireshark; terminal",
  recap: [
    "Ulanish = protokol + manba IP:port + manzil IP:port.",
    "TCP ishonchli: seq/ack, qayta yuborish, oyna (window). UDP — 8 baytli sarlavha, kafolatsiz.",
    "ICMP: 8 — echo request, 0 — echo reply, 3 — destination unreachable, 11 — time exceeded.",
  ],
  steps: [
    {
      type: "learn",
      title: "Port diapazonlari",
      body: "Port raqami 16 bit: 0 dan 65535 gacha. Server xizmatlari doimiy portlarda turadi, klient esa har ulanish uchun vaqtinchalik (ephemeral) port tanlaydi.",
      points: [
        "0–1023 — taniqli (well-known) portlar: 22, 53, 80, 443...",
        "1024–49151 — ro'yxatdan o'tgan portlar (masalan, 3389 RDP).",
        "49152–65535 — dinamik/vaqtinchalik portlar (aniq diapazon OS'ga qarab farq qiladi).",
      ],
    },
    {
      type: "learn",
      title: "Soket va 5-tuple",
      body: "Bitta kompyuterdan bir vaqtda bir saytga 10 ta tab ochsangiz ham, har ulanish alohida. Ularni 5 ta qiymat ajratadi: protokol, manba IP, manba port, manzil IP, manzil port.",
      terminal: [
        "TCP  192.168.1.20:51514  →  93.184.216.34:443",
        "TCP  192.168.1.20:51515  →  93.184.216.34:443",
        "     faqat manba port farq qiladi — ikki alohida ulanish",
      ],
    },
    {
      type: "quiz",
      question: "Brauzer HTTPS saytga ulandi. Klient tomondagi port odatda qanday bo'ladi?",
      options: ["443", "80", "Vaqtinchalik (masalan, 51514)", "22"],
      answerIndex: 2,
      explanation: "443 — server porti. Klient o'z tomonida vaqtinchalik portdan foydalanadi.",
    },
    {
      type: "learn",
      title: "TCP sarlavhasi",
      body: "TCP ishonchliligi sarlavhadagi maydonlarga asoslangan.",
      visual: {
        kind: "packet",
        layers: [
          {
            name: "Transmission Control Protocol",
            fields: [
              { name: "Source Port", value: "51514" },
              { name: "Destination Port", value: "443" },
              { name: "Sequence Number", value: "100", highlight: true },
              { name: "Acknowledgment Number", value: "0", highlight: true },
              { name: "Flags", value: "SYN", highlight: true },
              { name: "Window", value: "64240" },
              { name: "Checksum", value: "0x1a2b" },
            ],
          },
        ],
      },
    },
    {
      type: "learn",
      title: "Bayroqlar (flags)",
      body: "Bayroqlar segment vazifasini bildiradi.",
      points: [
        "SYN — ulanishni boshlash.",
        "ACK — qabul qilinganini tasdiqlash.",
        "FIN — ulanishni tartibli yopish.",
        "RST — ulanishni keskin uzish (masalan, port yopiq).",
        "PSH — ma'lumotni darhol ilovaga berish.",
      ],
    },
    {
      type: "learn",
      title: "Qo'l siqish raqamlar bilan",
      body: "Har tomon o'zining boshlang'ich tartib raqamini (seq) tanlaydi. ACK raqami — «keyingi kutilayotgan bayt»: qabul qilingan seq + 1.",
      visual: {
        kind: "sequence",
        actors: ["Klient", "Server"],
        messages: [
          { from: 0, to: 1, label: "SYN  seq=100" },
          { from: 1, to: 0, label: "SYN-ACK  seq=300  ack=101" },
          { from: 0, to: 1, label: "ACK  seq=101  ack=301" },
        ],
      },
    },
    {
      type: "input",
      question: "Server SYN-ACK'da seq=700 yubordi. Klientning javob ACK'idagi ack raqami qanday bo'ladi?",
      answers: ["701"],
      hint: "ack = qabul qilingan seq + 1.",
      explanation: "SYN bitta tartib raqamini egallaydi, shuning uchun klient 701 ni kutadi.",
      placeholder: "Son",
    },
    {
      type: "learn",
      title: "Ishonchlilik va oqimni boshqarish",
      body: "TCP har segment uchun tasdiq kutadi. Tasdiq kelmasa, segment qayta yuboriladi. Seq raqamlari bo'yicha segmentlar to'g'ri tartibda yig'iladi. Window maydoni qabul qiluvchi hozir qancha ma'lumot qabul qila olishini bildiradi — sekin qurilma tezkorini «sekinlashtiradi». Bundan tashqari, TCP tarmoq tirbandligini sezib, tezlikni o'zi kamaytiradi.",
    },
    {
      type: "learn",
      title: "Ulanishni yopish",
      body: "Tartibli yopish to'rt xabardan iborat: har tomon o'z yo'nalishini FIN bilan yopadi va boshqasi ACK bilan tasdiqlaydi. Agar klient yopiq portga ulanmoqchi bo'lsa, server RST bilan javob beradi.",
      visual: {
        kind: "sequence",
        actors: ["Klient", "Server"],
        messages: [
          { from: 0, to: 1, label: "FIN" },
          { from: 1, to: 0, label: "ACK" },
          { from: 1, to: 0, label: "FIN" },
          { from: 0, to: 1, label: "ACK" },
        ],
      },
    },
    {
      type: "quiz",
      question: "Klient serverning yopiq TCP portiga SYN yubordi. Server qanday javob beradi?",
      options: ["SYN-ACK", "RST", "FIN", "Hech qanday javob bermaydi — har doim"],
      answerIndex: 1,
      explanation: "Yopiq port RST qaytaradi. Firewall esa ko'pincha javob bermasdan tashlaydi — shuning uchun «javob yo'q» va «rad etildi» farqli belgilar.",
    },
    {
      type: "learn",
      title: "UDP",
      body: "UDP sarlavhasi atigi 8 bayt: manba port, manzil port, uzunlik, checksum. Qo'l siqish, tasdiq va qayta yuborish yo'q. Kafolat kerak bo'lsa, uni ilovaning o'zi bajaradi.",
      points: ["DNS so'rovlari, DHCP, VoIP va video qo'ng'iroqlar (RTP), Syslog, SNMP, TFTP.", "Kechikkan ovoz paketini qayta yuborishdan foyda yo'q — shuning uchun real vaqt trafiki UDP'da."],
    },
    {
      type: "quiz",
      question: "Nega video qo'ng'iroqlar odatda UDP'dan foydalanadi?",
      options: [
        "UDP shifrlangan",
        "Kechikkan paketni qayta yuborish foydasiz; past kechikish muhimroq",
        "UDP ko'proq ma'lumot tashiydi",
        "TCP video'ni qo'llab-quvvatlamaydi",
      ],
      answerIndex: 1,
      explanation: "Real vaqt trafikida bir necha yo'qolgan paket qayta yuborish kutishidan yaxshiroq.",
    },
    {
      type: "learn",
      title: "ICMP — tarmoqning xizmat xabarlari",
      body: "ICMP ma'lumot tashimaydi, balki xatolar va diagnostika haqida xabar beradi. ping va traceroute aynan ICMP'ga tayanadi.",
      points: [
        "Type 8 — Echo request (ping so'rovi), Type 0 — Echo reply (javob).",
        "Type 3 — Destination unreachable (masalan, 3/3 — UDP porti yopiq).",
        "Type 11 — Time exceeded: TTL tugadi (traceroute shu xabarlardan yo'lni tuzadi).",
      ],
    },
    {
      type: "quiz",
      question: "traceroute natijasidagi har bir router qatori qaysi ICMP xabari tufayli paydo bo'ladi?",
      options: ["Echo reply (0)", "Time exceeded (11)", "Destination unreachable (3)", "Redirect (5)"],
      answerIndex: 1,
      explanation: "TTL tugagan router «Time exceeded» qaytaradi va o'z manzilini ko'rsatib qo'yadi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: faol ulanishlar",
      prompt: "Kompyuterdagi faol TCP ulanishlarini (manba va manzil portlari bilan) ko'rsatadigan buyruqni yozing.",
      options: [
        { command: "netstat -an", os: "Windows" },
        { command: "ss -tan", os: "Linux" },
      ],
      reps: 3,
    },
    {
      type: "lab",
      title: "Wireshark: TCP ulanishini kuzating",
      tasks: [
        "Wireshark'da yozuvni boshlang va brauzerda biror http yoki https saytni oching.",
        "tcp.flags.syn == 1 filtri bilan qo'l siqishning boshini toping.",
        "Shu paketni o'ng tugma → Follow → TCP Stream bilan oching: butun suhbat ketma-ket ko'rinadi.",
        "Statistics → Conversations oynasida ulanishlar ro'yxatini va portlarni ko'ring.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "tcp.flags.syn == 1", note: "Faqat SYN va SYN-ACK segmentlari." },
          { command: "tcp.flags.reset == 1", note: "RST segmentlari: rad etilgan ulanishlar." },
          { command: "udp.port == 53", note: "DNS so'rovlari — UDP ekanini ko'ring." },
        ],
      },
      expected: "SYN → SYN-ACK → ACK ketma-ketligi va seq/ack raqamlari ko'rinadi; DNS so'rovlari UDP 53 orqali.",
    },
    {
      type: "practice",
      title: "Qo'l siqishni chizing",
      instructions: [
        "Qog'ozda klient va serverni chizing; o'zingiz tanlagan seq raqamlari bilan 3 qadamli qo'l siqishni yozing.",
        "So'ng klient 500 bayt yuborganini va server uni tasdiqlaganini (ack raqami bilan) qo'shing.",
        "Oxirida 4 qadamli yopishni chizing.",
      ],
    },
  ],
};
