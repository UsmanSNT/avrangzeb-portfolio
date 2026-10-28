import type { Lesson } from "../types";

export const stp: Lesson = {
  id: "stp",
  title: "STP: halqalardan himoya",
  summary: "Zaxira kabellar halqa hosil qilganda nima bo'ladi va Spanning Tree uni qanday to'xtatadi.",
  estimatedMinutes: 60,
  goals: [
    "Kommutatsiya halqasi va broadcast bo'ronini tushuntirasiz",
    "Root bridge saylovi va port rollarini aniqlaysiz",
    "PortFast, BPDU Guard va root bridge'ni sozlaysiz",
  ],
  requires: "Cisco Packet Tracer",
  recap: [
    "Ethernet kadrida TTL yo'q: halqada broadcast cheksiz aylanadi.",
    "Root bridge — eng kichik Bridge ID (priority + MAC). Ortiqcha portlar bloklanadi.",
    "PortFast faqat oxirgi qurilma portlariga; BPDU Guard bilan birga.",
  ],
  steps: [
    {
      type: "learn",
      title: "Zaxira kabel — yaxshi niyat",
      body: "Bitta kabel uzilsa tarmoq to'xtamasligi uchun switch'lar ikki yo'l bilan ulanadi. Lekin bu halqa (loop) hosil qiladi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "s1", label: "SW1", icon: "switch" },
          { id: "s2", label: "SW2", icon: "switch" },
          { id: "s3", label: "SW3", icon: "switch" },
        ],
        links: [
          ["s1", "s2"],
          ["s1", "s3"],
          ["s2", "s3"],
        ],
      },
    },
    {
      type: "learn",
      title: "Halqada nima bo'ladi?",
      body: "IP paketda TTL bor, Ethernet kadrida esa yo'q. Halqaga tushgan broadcast to'xtamasdan aylanadi va har aylanishda ko'payadi.",
      points: [
        "Broadcast bo'roni — kanal to'lib, tarmoq qotadi.",
        "MAC jadval beqarorligi — bitta MAC turli portlarda ko'rinaveradi.",
        "Takroriy kadrlar — qurilma bir kadrni bir necha marta oladi.",
      ],
    },
    {
      type: "quiz",
      question: "Nega halqa Ethernet tarmog'i uchun shunchalik xavfli?",
      options: [
        "Kabellar qiziydi",
        "Ethernet kadrida TTL yo'q, broadcast cheksiz aylanadi",
        "Router'lar o'chadi",
        "IP manzillar tugaydi",
      ],
      answerIndex: 1,
      explanation: "TTL bo'lmagani uchun kadr hech qachon «o'lmaydi». STP aynan shu muammoni hal qiladi.",
    },
    {
      type: "learn",
      title: "STP g'oyasi",
      body: "Spanning Tree Protocol tarmoqni daraxtga aylantiradi: ortiqcha portlarni mantiqan bloklaydi. Faol yo'l uzilsa, bloklangan port avtomatik ochiladi. Switch'lar bir-biriga BPDU xabarlarini yuborib kelishadi.",
    },
    {
      type: "learn",
      title: "Root bridge saylovi",
      body: "Avval daraxt markazi — root bridge tanlanadi. Eng kichik Bridge ID yutadi.",
      points: [
        "Bridge ID = priority + MAC manzil.",
        "Standart priority 32768. PVST+ da unga VLAN raqami qo'shiladi: VLAN 10 uchun 32778.",
        "Priority teng bo'lsa — eng kichik MAC yutadi.",
        "Priority faqat 4096 ga karrali qiymatlarda o'zgartiriladi.",
      ],
    },
    {
      type: "input",
      question: "PVST+ da VLAN 10 uchun standart bridge priority qancha bo'ladi? (32768 + VLAN ID)",
      answers: ["32778"],
      hint: "32768 + 10.",
      explanation: "32768 + 10 = 32778. show spanning-tree natijasida aynan shu son ko'rinadi.",
      placeholder: "Son",
    },
    {
      type: "quiz",
      question: "SW1: priority 32768, MAC 0000.0000.000A. SW2: priority 4096, MAC 0000.0000.00FF. SW3: priority 32768, MAC 0000.0000.0001. Root bridge kim?",
      options: ["SW1", "SW2", "SW3", "Hech kim"],
      answerIndex: 1,
      explanation: "Avval priority solishtiriladi: 4096 eng kichik, shuning uchun SW2. MAC faqat priority teng bo'lsa hisobga olinadi.",
    },
    {
      type: "learn",
      title: "Port rollari va narx",
      body: "Root tanlangach, har port rol oladi. Yo'l «narxi» port tezligiga bog'liq: tezroq — arzonroq.",
      points: [
        "Root port — root'gacha eng arzon yo'l (har root bo'lmagan switch'da bitta).",
        "Designated port — har segmentda trafikni uzatuvchi port.",
        "Alternate (bloklangan) port — zaxira, kadr uzatmaydi.",
        "Narx: 10 Gbit/s = 2, 1 Gbit/s = 4, 100 Mbit/s = 19, 10 Mbit/s = 100.",
      ],
    },
    {
      type: "learn",
      title: "Root port'ni hisoblash",
      body: "Root bo'lmagan switch root'gacha bo'lgan barcha yo'llar narxini yig'adi va eng arzonini root port qiladi. Misol: SW3 root'ga bevosita 100 Mbit/s kanal bilan (19) ulangan, shuningdek SW2 orqali ikkita 1 Gbit/s kanal bilan (4 + 4).",
      terminal: ["Bevosita:      19", "SW2 orqali:    4 + 4 = 8   ← arzonroq", "Root port — SW2 tomonga qaragan port"],
    },
    {
      type: "input",
      question: "SW4 root'ga ikki yo'l bilan bog'langan: A — uchta 1 Gbit/s kanal orqali, B — bitta 100 Mbit/s kanal orqali. A yo'lining umumiy narxi qancha?",
      answers: ["12"],
      hint: "1 Gbit/s narxi 4.",
      explanation: "4 + 4 + 4 = 12 — bu B yo'lidan (19) arzon, shuning uchun root port A tomonda.",
      placeholder: "Son",
    },
    {
      type: "learn",
      title: "Port holatlari",
      body: "Klassik STP (802.1D) da port forwarding'gacha bir necha bosqichdan o'tadi — bu 30–50 soniyagacha cho'ziladi. Rapid PVST+ (802.1w) buni bir necha soniyagacha qisqartiradi.",
      visual: {
        kind: "stack",
        layers: [
          { label: "Blocking", note: "Faqat BPDU tinglaydi" },
          { label: "Listening", note: "Rolni aniqlaydi" },
          { label: "Learning", note: "MAC'larni o'rganadi, uzatmaydi", accent: true },
          { label: "Forwarding", note: "Kadrlarni uzatadi", accent: true },
        ],
      },
    },
    {
      type: "order",
      title: "Holatlarni tartiblang",
      prompt: "Klassik STP port holatlarini yoqilgandan forwarding'gacha tartiblang.",
      items: ["Blocking", "Listening", "Learning", "Forwarding"],
    },
    {
      type: "learn",
      title: "Rapid PVST+ rollari va qo'shimcha himoya",
      body: "Zamonaviy tarmoqlarda RSTP (Rapid PVST+) ishlatiladi. Unda holatlar uchta: discarding, learning, forwarding. Rollar: root, designated, alternate (root'ga zaxira yo'l) va backup.",
      points: [
        "Root Guard — taqsimlovchi switch'ning pastga qaragan portlariga: u yerdan «yaxshiroq» BPDU kelsa, port bloklanadi va root o'z joyida qoladi.",
        "Loop Guard — BPDU kelishi to'xtagan bloklangan port o'z-o'zidan forwarding'ga o'tib ketmasligi uchun.",
      ],
    },
    {
      type: "learn",
      title: "PortFast va BPDU Guard",
      body: "Kompyuter ulangan port halqa hosil qilmaydi, uni kutishga majburlash shart emas. PortFast portni darhol forwarding'ga o'tkazadi. BPDU Guard esa shu portga switch ulansa (BPDU kelsa), portni o'chirib qo'yadi.",
      points: ["PortFast — faqat access portlarga (kompyuter, printer).", "Switch'lararo portlarga hech qachon PortFast qo'ymang."],
    },
    {
      type: "cli",
      title: "SW1 ni root qiling va access portlarni himoyalang",
      scenario: "SW1 tarmoq markazida turibdi. Uni VLAN 10 uchun root bridge qiling, Rapid PVST+ ga o'tkazing va Fa0/1 (kompyuter porti) ni himoyalang.",
      lines: [
        { prompt: "SW1>", task: "Imtiyozli rejimga o'ting.", accept: ["enable"], explain: "SW1#." },
        { prompt: "SW1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "SW1(config)#." },
        { prompt: "SW1(config)#", task: "STP rejimini Rapid PVST+ ga o'zgartiring.", accept: ["spanning-tree mode rapid-pvst"], explain: "Endi tarmoq uzilishdan bir necha soniyada tiklanadi." },
        {
          prompt: "SW1(config)#",
          task: "SW1 ni VLAN 10 uchun asosiy root bridge qiling.",
          accept: ["spanning-tree vlan 10 root primary"],
          explain: "IOS SW1 priority'sini 24576 ga (yoki zarur bo'lsa undan ham kichikroq) tushirdi: endi u root.",
        },
        { prompt: "SW1(config)#", task: "FastEthernet0/1 interfeysiga kiring.", accept: ["interface fastEthernet0/1"], explain: "Kompyuter ulangan port." },
        { prompt: "SW1(config-if)#", task: "PortFast'ni yoqing.", accept: ["spanning-tree portfast"], explain: "Port darhol forwarding'ga o'tadi: kompyuter IP'ni tezroq oladi." },
        { prompt: "SW1(config-if)#", task: "BPDU Guard'ni yoqing.", accept: ["spanning-tree bpduguard enable"], explain: "Bu portga switch ulansa, port err-disabled holatiga o'tadi." },
        { prompt: "SW1(config-if)#", task: "Imtiyozli rejimga qayting.", accept: ["end"], explain: "SW1#." },
        {
          prompt: "SW1#",
          task: "VLAN 10 uchun STP holatini ko'ring.",
          accept: ["show spanning-tree vlan 10"],
          explain: "«This bridge is the root» — SW1 root bo'ldi.",
          output: [
            "VLAN0010",
            "  Spanning tree enabled protocol rstp",
            "  Root ID    Priority    24586",
            "             This bridge is the root",
          ],
        },
      ],
    },
    {
      type: "quiz",
      question: "PortFast qaysi portlarga yoqiladi?",
      options: ["Switch'lararo portlarga", "Faqat kompyuter va printer ulangan access portlarga", "Trunk portlarga", "Barcha portlarga"],
      answerIndex: 1,
      explanation: "PortFast STP kutishini o'tkazib yuboradi. Switch'lararo portda bu halqa xavfini tug'diradi.",
    },
    {
      type: "lab",
      title: "Packet Tracer: halqani kuzating",
      tasks: [
        "3 ta 2960 switch'ni uchburchak qilib ulang (har biri qolgan ikkitasiga).",
        "Har switch'da show spanning-tree bajaring: root kim, qaysi port bloklangan (PT'da to'q sariq chiroq)?",
        "Boshqa switch'ni root qiling va bloklangan port qanday o'zgarganini kuzating.",
        "Faol kabellardan birini o'chiring va zaxira port ochilishini kuzating.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "show spanning-tree", note: "Root ID, o'z Bridge ID'si va har portning roli/holati." },
          { command: "spanning-tree vlan 1 root primary", note: "Shu switch'ni VLAN 1 uchun root qiladi." },
          { command: "show spanning-tree", note: "Qaysi port endi Altn (bloklangan) ekanini qayta tekshiring." },
        ],
      },
      expected: "Root o'zgarganda bloklangan port boshqa joyga ko'chadi. Kabel uzilganda bloklangan port forwarding'ga o'tadi.",
    },
    {
      type: "practice",
      title: "Qog'ozda STP",
      instructions: [
        "3 switch'li uchburchak chizing. Har biriga priority va MAC yozing (o'zingiz o'ylab toping).",
        "Root bridge'ni aniqlang.",
        "Har root bo'lmagan switch'da root portni, so'ng bloklanadigan portni belgilang.",
      ],
    },
  ],
};
