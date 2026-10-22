import type { Lesson } from "../types";

export const trunking: Lesson = {
  id: "trunking",
  title: "Trunk va 802.1Q",
  summary: "Bir nechta VLAN'ni bitta kabel orqali switch'lar orasida tashish. Native VLAN va xavfsizlik.",
  estimatedMinutes: 40,
  goals: [
    "Trunk nima uchun kerakligini va 802.1Q tegi qanday ishlashini tushuntirasiz",
    "Trunk port, native VLAN va ruxsat etilgan VLAN'larni sozlaysiz",
    "show interfaces trunk natijasini o'qiysiz",
  ],
  requires: "Cisco Packet Tracer; 2-darsdagi VLAN laboratoriyasi",
  recap: [
    "Trunk bir kabelda ko'p VLAN tashiydi; har kadrga 802.1Q tegi (VLAN ID) qo'shiladi.",
    "Native VLAN kadrlari tegsiz o'tadi; ikki tomonda bir xil bo'lishi shart.",
    "Xavfsizlik: rejimni qo'lda belgilang, native VLAN'ni ishlatilmaydigan VLAN'ga o'zgartiring.",
  ],
  steps: [
    {
      type: "learn",
      title: "Muammo: ikki switch, ko'p VLAN",
      body: "Savdo bo'limi ikki qavatda joylashgan: VLAN 10 ham SW1 da, ham SW2 da bor. Har VLAN uchun switch'lar orasiga alohida kabel tortish — isrof. Trunk bitta kabel orqali barcha VLAN'larni tashiydi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "pc1", label: "PC1 · VLAN 10", icon: "host" },
          { id: "sw1", label: "SW1", icon: "switch" },
          { id: "sw2", label: "SW2", icon: "switch" },
          { id: "pc2", label: "PC2 · VLAN 10", icon: "host" },
        ],
        links: [
          ["pc1", "sw1"],
          ["sw1", "sw2"],
          ["sw2", "pc2"],
        ],
      },
    },
    {
      type: "learn",
      title: "802.1Q tegi",
      body: "Kadr trunk'ga chiqayotganda switch unga 4 baytli teg qo'shadi. Tegda kadr qaysi VLAN'ga tegishli ekani yoziladi. Narigi switch tegni o'qiydi va kadrni o'sha VLAN portiga, tegni olib tashlab, uzatadi.",
      visual: {
        kind: "stack",
        layers: [
          { label: "Destination MAC", note: "6 bayt" },
          { label: "Source MAC", note: "6 bayt" },
          { label: "802.1Q tegi", note: "4 bayt · ichida 12 bitli VLAN ID", accent: true },
          { label: "Type", note: "2 bayt" },
          { label: "Ma'lumot", note: "46–1500 bayt" },
          { label: "FCS", note: "4 bayt · xato tekshiruvi" },
        ],
      },
    },
    {
      type: "input",
      question: "VLAN ID 12 bit. Nechta xil qiymat bo'lishi mumkin? (2^12)",
      answers: ["4096"],
      hint: "2^10 = 1024. 2^12 = 1024 × 4.",
      explanation: "12 bit 4096 xil qiymat beradi (0–4095). 0 va 4095 band, shuning uchun foydalanish mumkin bo'lgan VLAN'lar 1–4094.",
      placeholder: "Son",
    },
    {
      type: "order",
      title: "Kadrning yo'li",
      prompt: "PC1 dan (SW1, VLAN 10) PC2 ga (SW2, VLAN 10) kadr qanday borishini tartiblang.",
      items: [
        "PC1 oddiy, tegsiz kadr yuboradi",
        "SW1 access port bo'yicha kadrni VLAN 10 ga bog'laydi",
        "SW1 kadrni trunk'ga 802.1Q tegi (VLAN 10) bilan chiqaradi",
        "SW2 tegni o'qib, kadrni VLAN 10 portiga yo'naltiradi",
        "SW2 tegni olib tashlab, kadrni PC2 ga yetkazadi",
      ],
    },
    {
      type: "learn",
      title: "Native VLAN",
      body: "Trunk'da bitta VLAN tegsiz o'tadi — u native VLAN deyiladi (standart holatda VLAN 1). Ikki tomonda native VLAN bir xil bo'lishi kerak, aks holda trafik noto'g'ri VLAN'ga tushadi.",
      points: [
        "Native VLAN'ni ishlatilmaydigan VLAN'ga o'zgartiring, masalan 99.",
        "Ikki switch'da ham bir xil qiymat qo'ying.",
      ],
    },
    {
      type: "quiz",
      question: "Native VLAN kadrlari trunk orqali qanday o'tadi?",
      options: ["802.1Q tegi bilan", "Tegsiz", "Shifrlangan holda", "Umuman o'tmaydi"],
      answerIndex: 1,
      explanation: "Native VLAN — trunk'dagi yagona tegsiz VLAN. Shuning uchun uning ikki tomonda bir xil bo'lishi muhim.",
    },
    {
      type: "learn",
      title: "Ruxsat etilgan VLAN'lar va DTP",
      body: "Standart holatda trunk barcha VLAN'larni o'tkazadi. Faqat kerakli VLAN'larga ruxsat bering. Bundan tashqari, switch'lar DTP orqali trunk'ni o'zi kelishib olishi mumkin — bu xavfsizlik teshigi.",
      points: [
        "switchport trunk allowed vlan 10,20,99 — faqat shu VLAN'lar.",
        "switchport mode trunk — rejimni qo'lda, aniq belgilash.",
        "switchport nonegotiate — DTP muzokarasini o'chirish.",
      ],
    },
    {
      type: "cli",
      title: "SW1 da trunk sozlang",
      scenario: "SW1 ning GigabitEthernet0/1 porti SW2 ga ulangan. Uni trunk qiling: native VLAN 99, faqat 10, 20 va 99 VLAN'larga ruxsat.",
      lines: [
        { prompt: "SW1>", task: "Imtiyozli rejimga o'ting.", accept: ["enable"], explain: "SW1#." },
        { prompt: "SW1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "SW1(config)#." },
        { prompt: "SW1(config)#", task: "GigabitEthernet0/1 interfeysiga kiring.", accept: ["interface gigabitEthernet0/1"], explain: "SW2 ga qaragan port tanlandi." },
        { prompt: "SW1(config-if)#", task: "Portni trunk rejimiga o'tkazing.", accept: ["switchport mode trunk"], explain: "Port endi barcha VLAN kadrlarini teg bilan tashiydi." },
        { prompt: "SW1(config-if)#", task: "Native VLAN'ni 99 qiling.", accept: ["switchport trunk native vlan 99"], explain: "Tegsiz trafik endi VLAN 1 emas, ishlatilmaydigan VLAN 99 da." },
        { prompt: "SW1(config-if)#", task: "Faqat 10, 20 va 99 VLAN'larga ruxsat bering.", accept: ["switchport trunk allowed vlan 10,20,99"], explain: "Boshqa VLAN'lar trunk orqali o'tmaydi." },
        { prompt: "SW1(config-if)#", task: "DTP muzokarasini o'chiring.", accept: ["switchport nonegotiate"], explain: "Port trunk'ni o'zi kelishmaydi: begona qurilma trunk ocholmaydi." },
        { prompt: "SW1(config-if)#", task: "Imtiyozli rejimga qayting.", accept: ["end"], explain: "SW1#." },
        {
          prompt: "SW1#",
          task: "Trunk holatini tekshiring.",
          accept: ["show interfaces trunk"],
          explain: "Rejim, inkapsulyatsiya, native VLAN va ruxsat etilgan VLAN'lar ko'rinadi.",
          output: [
            "Port     Mode   Encapsulation  Status    Native vlan",
            "Gig0/1   on     802.1q         trunking  99",
            "",
            "Port     Vlans allowed on trunk",
            "Gig0/1   10,20,99",
          ],
        },
      ],
    },
    {
      type: "quiz",
      question: "SW1 da native VLAN 99, SW2 da esa 1. Nima bo'ladi?",
      options: [
        "Hech narsa, farqi yo'q",
        "Native mismatch: tegsiz trafik noto'g'ri VLAN'ga tushadi",
        "Trunk tezlashadi",
        "Barcha VLAN'lar o'chadi",
      ],
      answerIndex: 1,
      explanation: "Tegsiz kadr SW1 da VLAN 99 ga, SW2 da VLAN 1 ga tegishli deb hisoblanadi. Bu ulanish xatolariga va xavfsizlik muammosiga olib keladi; IOS ogohlantirish chiqaradi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: trunk holati",
      prompt: "Trunk portlarni ko'rsatadigan buyruqni yozing.",
      options: [
        { command: "show interfaces trunk", os: "To'liq" },
        { command: "sh int trunk", os: "Qisqa" },
      ],
      reps: 3,
    },
    {
      type: "lab",
      title: "Packet Tracer: ikki switch, bitta trunk",
      tasks: [
        "2-darsdagi topologiyaga ikkinchi 2960 switch qo'shing va ularni Gig0/1 portlari orqali ulang.",
        "SW2 ga ham 2 ta PC ulang: biri VLAN 10 (192.168.10.13), biri VLAN 20 (192.168.20.13).",
        "Ikkala switch'da VLAN 10, 20, 99 ni yarating va Gig0/1 ni trunk qiling (native 99).",
        "SW1 dagi PC1 dan SW2 dagi VLAN 10 PC'siga ping qiling.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "vlan 99", note: "Native uchun VLAN'ni ikkala switch'da yarating (name NATIVE)." },
          { command: "interface gigabitEthernet0/1", note: "Switch'lararo portni tanlaydi." },
          { command: "switchport mode trunk", note: "Trunk rejimini yoqadi." },
          { command: "switchport trunk native vlan 99", note: "Native VLAN — ikki tomonda bir xil." },
          { command: "show interfaces trunk", note: "Status «trunking» va native 99 ekanini tekshiradi." },
        ],
      },
      expected: "VLAN 10 dagi PC'lar turli switch'larda bo'lsa ham bir-biriga ping qiladi. VLAN 10 dan VLAN 20 ga ping hali ishlamaydi.",
    },
    {
      type: "practice",
      title: "Teglangan kadrni chizing",
      instructions: [
        "Qog'ozga Ethernet kadrini chizing: Destination MAC, Source MAC, Type, ma'lumot, FCS.",
        "802.1Q tegini to'g'ri joyga qo'shing va ichiga VLAN ID ni yozing.",
        "Kadr qayerda teg oladi, qayerda tegini yo'qotadi — strelkalar bilan ko'rsating.",
      ],
    },
  ],
};
