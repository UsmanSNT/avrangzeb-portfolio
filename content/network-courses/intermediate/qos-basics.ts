import type { Lesson } from "../types";

export const qosBasics: Lesson = {
  id: "qos-basics",
  title: "QoS asoslari",
  summary: "Kanal tiqilganda ovoz va video nega buziladi va QoS qanday yordam beradi: tasniflash, belgilash, navbatlar, policing va shaping.",
  estimatedMinutes: 50,
  goals: [
    "Ovoz va video uchun kechikish, jitter va yo'qotish talablarini bilasiz",
    "DSCP/CoS belgilash va ishonch chegarasini tushuntirasiz",
    "LLQ, policing va shaping farqini bilasiz va oddiy siyosatni o'qiysiz",
  ],
  requires: "1-bosqich: Ethernet va IPv4 sarlavhasi darsi",
  recap: [
    "QoS tezlik qo'shmaydi — tiqilishda kimni birinchi o'tkazishni hal qiladi.",
    "Ovoz: DSCP EF (46), LLQ (ustuvor navbat). Belgilash ishonch chegarasida (telefon/access switch) qilinadi.",
    "Policing ortiqchasini tashlaydi (yoki qayta belgilaydi), shaping navbatda ushlab, kechiktiradi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Muammo: tiqilish",
      body: "100 Mbit/s kanalga bir vaqtda katta fayl yuklanmoqda va video qo'ng'iroq ketmoqda. Router'ning chiqish navbati to'ladi: paketlar kutadi yoki tashlanadi. Fayl uchun bu sezilmaydi (TCP qayta yuboradi), ovoz esa uziladi va robotdek eshitiladi.",
    },
    {
      type: "learn",
      title: "Real vaqt trafigi talablari",
      body: "Ovoz uchun keng tarqalgan mo'ljallar (Cisco va ITU tavsiyalari asosida):",
      points: ["Bir tomonlama kechikish — 150 ms dan kam.", "Jitter — 30 ms dan kam.", "Paket yo'qotish — 1% dan kam.", "Video ham shunga yaqin talab qiladi, lekin ko'proq o'tkazuvchanlik oladi."],
    },
    {
      type: "learn",
      title: "QoS vositalari",
      body: "QoS bir necha qismdan iborat, ular zanjir bo'lib ishlaydi.",
      visual: {
        kind: "stack",
        layers: [
          { label: "Tasniflash (classification)", note: "Bu qanday trafik? (ovoz, video, veb...)" },
          { label: "Belgilash (marking)", note: "Sarlavhaga DSCP yoki CoS yoziladi", accent: true },
          { label: "Navbatlar (queuing)", note: "Ovoz — ustuvor navbat (LLQ), qolganlar — ulush bo'yicha", accent: true },
          { label: "Policing / shaping", note: "Tezlikni cheklash" },
          { label: "Tiqilishdan qochish (WRED)", note: "Navbat to'lmasdan oldin ba'zi TCP paketlarni erta tashlash" },
        ],
      },
    },
    {
      type: "learn",
      title: "Belgilash: DSCP va CoS",
      body: "Trafik bir marta tasniflanib belgilanadi, keyingi qurilmalar esa faqat belgiga qaraydi.",
      points: [
        "DSCP — IPv4 sarlavhasidagi 6 bit (0–63). Ovoz uchun EF = 46; AF sinflari — biznes ilovalari uchun.",
        "CoS — 802.1Q tegidagi 3 bit (0–7), faqat trunk'da. Ovoz uchun odatda CoS 5.",
        "Ishonch chegarasi (trust boundary) — belgiga ishonila boshlanadigan joy: odatda IP telefon yoki access switch porti. Foydalanuvchi kompyuteri qo'ygan belgiga ishonilmaydi.",
      ],
    },
    {
      type: "input",
      question: "Ovoz trafigi uchun standart DSCP qiymati (EF) o'nlikda nechaga teng?",
      answers: ["46"],
      hint: "EF — Expedited Forwarding.",
      explanation: "EF = 46 (ikkilikda 101110).",
      placeholder: "Son",
    },
    {
      type: "quiz",
      question: "Nega foydalanuvchi kompyuteridan kelgan DSCP belgisiga ishonilmaydi?",
      options: [
        "Kompyuter DSCP qo'ya olmaydi",
        "Har kim o'z trafigini EF deb belgilab, ustuvorlikni egallab olishi mumkin",
        "DSCP faqat Wi-Fi'da ishlaydi",
        "Bu IOS cheklovi",
      ],
      answerIndex: 1,
      explanation: "Shuning uchun ishonch chegarasi telefon yoki access switch'da: belgini tarmoq o'zi qo'yadi yoki tekshiradi.",
    },
    {
      type: "learn",
      title: "Navbatlar va LLQ",
      body: "CBWFQ har trafik sinfiga kanaldan kafolatlangan ulush beradi. LLQ unga bitta qat'iy ustuvor navbat qo'shadi: ovoz paketlari har doim birinchi chiqadi, lekin bu navbatga cheklov qo'yiladi — u boshqa trafikni butunlay «yeb qo'ymasligi» uchun.",
    },
    {
      type: "learn",
      title: "Policing va shaping",
      body: "Ikkalasi ham tezlikni cheklaydi, lekin ortiqcha trafik bilan har xil munosabatda bo'ladi.",
      points: [
        "Policing — chegaradan oshgan paketlarni darhol tashlaydi yoki pastroq belgi bilan qayta belgilaydi. Kechikish qo'shmaydi. Provayderlar mijoz trafigini shunday cheklaydi.",
        "Shaping — ortiqcha paketlarni navbatda ushlab, keyinroq yuboradi. Tashlash kamroq, lekin kechikish qo'shiladi. Mijoz provayder tezligiga moslash uchun ishlatadi.",
      ],
    },
    {
      type: "quiz",
      question: "Provayder shartnomasi 50 Mbit/s, port esa 1 Gbit/s. Provayder ortiqchasini tashlamasligi uchun mijoz router'ida nima qilinadi?",
      options: ["Policing", "Shaping", "NAT", "WRED o'chiriladi"],
      answerIndex: 1,
      explanation: "Shaping trafikni 50 Mbit/s ga silliq moslaydi: provayder policer'i tashlaydigan ortiqcha bo'lmaydi.",
    },
    {
      type: "cli",
      title: "Oddiy LLQ siyosati (MQC)",
      scenario: "Filial router'ining WAN interfeysi (Gi0/1) tiqilmoqda. DSCP EF bilan belgilangan ovozga kanalning 30% igacha ustuvorlik bering.",
      lines: [
        { prompt: "R1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "(config)#." },
        { prompt: "R1(config)#", task: "VOICE nomli class-map yarating (istalgan shart mos kelsa).", accept: ["class-map match-any VOICE"], explain: "(config-cmap)# — trafik sinfi." },
        { prompt: "R1(config-cmap)#", task: "Sinfga DSCP EF bilan belgilangan paketlar kirsin.", accept: ["match dscp ef"], explain: "Tasniflash: ovoz paketlari shu sinfga tushadi." },
        { prompt: "R1(config-cmap)#", task: "Global rejimga qayting.", accept: ["exit"], explain: "(config)#." },
        { prompt: "R1(config)#", task: "WAN-EDGE nomli policy-map yarating.", accept: ["policy-map WAN-EDGE"], explain: "(config-pmap)# — siyosat." },
        { prompt: "R1(config-pmap)#", task: "Siyosatda VOICE sinfini oching.", accept: ["class VOICE"], explain: "(config-pmap-c)# — shu sinf uchun harakat." },
        { prompt: "R1(config-pmap-c)#", task: "Unga kanalning 30% igacha ustuvor navbat bering.", accept: ["priority percent 30"], explain: "LLQ: ovoz birinchi chiqadi, lekin 30% dan oshmaydi." },
        { prompt: "R1(config-pmap-c)#", task: "Imtiyozli rejimga qayting.", accept: ["end"], explain: "R1#. Siyosat tayyor — endi uni interfeysga qo'llaymiz." },
        { prompt: "R1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "(config)#." },
        { prompt: "R1(config)#", task: "WAN interfeysi Gi0/1 ga kiring.", accept: ["interface gigabitEthernet0/1"], explain: "Tiqilish shu yerda." },
        { prompt: "R1(config-if)#", task: "Siyosatni chiquvchi trafikka qo'llang.", accept: ["service-policy output WAN-EDGE"], explain: "QoS chiqish navbatida ishlaydi — shuning uchun output." },
      ],
    },
    {
      type: "practice",
      title: "Trafik sinflari rejasi",
      instructions: [
        "Kichik ofis uchun 4 ta sinf rejasini yozing: ovoz, video, biznes ilovalari, qolganlar.",
        "Har biri uchun DSCP belgisi va kanaldan ulush (%) bering.",
        "Ishonch chegarasi qayerda bo'lishini va nega ekanini yozing.",
      ],
    },
  ],
};
