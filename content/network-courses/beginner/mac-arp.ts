import type { Lesson } from "../types";

export const macArp: Lesson = {
  id: "mac-arp",
  title: "MAC manzil, Ethernet va ARP",
  summary: "Bir tarmoq ichida qurilmalar bir-birini qanday topadi. ARP jadvalini o'z ko'zingiz bilan ko'rasiz.",
  estimatedMinutes: 25,
  goals: [
    "MAC manzil nima ekanini va qanday ko'rinishini bilasiz",
    "ARP so'rov va javobining ishlashini tushuntirib bera olasiz",
    "arp -a bilan ARP jadvalini o'qiy olasiz",
  ],
  requires: "Terminal",
  recap: [
    "MAC — kartaning 48 bitli jismoniy manzili, LAN ichida ishlatiladi.",
    "ARP IP manzilni MAC ga aylantiradi: so'rov broadcast, javob unicast.",
    "FF:FF:FF:FF:FF:FF — broadcast MAC manzili.",
  ],
  steps: [
    {
      type: "learn",
      title: "MAC — kartaning «pasport raqami»",
      body: "IP manzil o'zgarishi mumkin (uy, ofis, kafe). MAC manzil esa tarmoq kartasiga ishlab chiqarishda yoziladi. U bitta LAN ichida kadrlarni to'g'ri qurilmaga yetkazish uchun ishlatiladi.",
    },
    {
      type: "learn",
      title: "MAC manzil ko'rinishi",
      body: "48 bit, ya'ni 6 bayt. O'n oltilik raqamlar bilan juft-juft yoziladi. Dastlabki 3 juftlik ishlab chiqaruvchini bildiradi (OUI).",
      terminal: ["00:1A:2B:3C:4D:5E", "|OUI  | qurilma|"],
    },
    {
      type: "quiz",
      question: "MAC manzil necha bitdan iborat?",
      options: ["32", "48", "64", "128"],
      answerIndex: 1,
      explanation: "MAC manzil 48 bit (6 bayt). 32 bit IPv4 ga, 128 bit IPv6 ga tegishli.",
    },
    {
      type: "learn",
      title: "Muammo: IP bor, MAC yo'q",
      body: "A kompyuter B ga paket yubormoqchi. U B ning IP manzilini biladi, lekin kadr yuborish uchun MAC manzil kerak. Buni ARP (Address Resolution Protocol) hal qiladi.",
      visual: {
        kind: "sequence",
        actors: ["A · 192.168.1.10", "B · 192.168.1.20"],
        messages: [
          { from: 0, to: 1, label: "ARP so'rov (broadcast): 192.168.1.20 kimniki?" },
          { from: 1, to: 0, label: "ARP javob (unicast): Men, MAC = BB:BB:BB:BB:BB:BB" },
        ],
      },
    },
    {
      type: "quiz",
      question: "ARP so'rovi qanday yuboriladi?",
      options: ["Unicast", "Broadcast", "Faqat routerga", "Internet serveriga"],
      answerIndex: 1,
      explanation: "So'rov egasi noma'lum bo'lgani uchun hammaga (broadcast) yuboriladi. Javob esa faqat so'ragan qurilmaga (unicast) qaytadi.",
    },
    {
      type: "learn",
      title: "ARP keshi",
      body: "Olingan javoblar ARP jadvalida (keshda) bir muddat saqlanadi, shuning uchun har paketda so'rov takrorlanmaydi. Jadvalni terminalda ko'rish mumkin.",
      terminal: ["> arp -a", "Interface: 192.168.1.10", "  Internet Address   Physical Address", "  192.168.1.1        aa-bb-cc-11-22-33   dynamic"],
    },
    {
      type: "input",
      question: "Broadcast MAC manzilini yozing (hamma bit 1).",
      answers: ["ff:ff:ff:ff:ff:ff", "ff-ff-ff-ff-ff-ff", "ffff.ffff.ffff"],
      hint: "Har bayt 11111111 = FF. Jami 6 bayt.",
      explanation: "FF:FF:FF:FF:FF:FF — broadcast: kadr tarmoqdagi barcha hostlarga yuboriladi.",
      placeholder: "Masalan: 00:11:22:33:44:55",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: ARP jadvali",
      prompt: "ARP jadvalini ko'rsatadigan buyruqni yozing (Windows yoki Linux).",
      options: [
        { command: "arp -a", os: "Windows, macOS, Linux" },
        { command: "ip neigh", os: "Linux" },
      ],
      reps: 3,
    },
    {
      type: "lab",
      title: "ARP jadvalini kuzating",
      tasks: [
        "arp -a ni bajarib, hozirgi yozuvlarni ko'ring.",
        "Routeringizga ping qiling (gateway manzilini 1-darsdan oling).",
        "arp -a ni yana bajaring va gateway yozuvini toping.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "arp -a", note: "ARP jadvalidagi hozirgi yozuvlarni ko'rsatadi. Linux'da muqobili: ip neigh." },
          { command: "ping <gateway IP>", note: "Routerga paket yuboradi; shu paytda ARP jadvaliga router yozuvi tushadi. <gateway IP> o'rniga 1-darsdagi manzilni yozing." },
          { command: "arp -a", note: "Jadvalni qayta ko'rsatadi. Endi gateway IP'si va uning MAC manzili ko'rinadi." },
        ],
      },
      expected: "Gateway IP manzili yonida uning MAC manzili paydo bo'ladi yoki yangilanadi.",
    },
    {
      type: "practice",
      title: "ARP ni qog'ozda chizing",
      instructions: [
        "A va B kompyuterni chizing, orasida switch qo'ying.",
        "ARP so'rovini (broadcast) va javobini (unicast) strelkalar bilan ko'rsating.",
        "Har strelka yoniga «kim → kimga» deb yozing.",
      ],
    },
  ],
};
