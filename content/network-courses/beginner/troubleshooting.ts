import type { Lesson } from "../types";

export const troubleshooting: Lesson = {
  id: "troubleshooting",
  title: "Muammoni topish: ping, tracert va diagnostika",
  summary: "Bosqich yakuni: «internet ishlamayapti» muammosini tizimli usulda tahlil qilish.",
  estimatedMinutes: 40,
  goals: [
    "Pastdan yuqoriga diagnostika ketma-ketligini yoddan bilasiz",
    "Ping natijasiga qarab muammo qaysi qatlamda ekanini aniqlaysiz",
    "tracert/traceroute natijasini o'qiy olasiz",
  ],
  requires: "Terminal; Cisco Packet Tracer (oldingi router laboratoriyasi)",
  recap: [
    "Ketma-ketlik: kabel/Wi-Fi → IP sozlamalari → 127.0.0.1 → gateway → 8.8.8.8 → domen.",
    "8.8.8.8 ishlab, domen ishlamasa — DNS muammosi.",
    "tracert paket yo'lini ko'rsatadi (TTL asosida).",
  ],
  steps: [
    {
      type: "learn",
      title: "Muammo — detektiv ishi",
      body: "«Internet ishlamayapti» degan shikoyat ko'p narsani anglatishi mumkin: kabel, Wi-Fi, IP, router, DNS yoki sayt o'zi. Mutaxassis taxmin qilmaydi — bir xil tartibda tekshiradi.",
    },
    {
      type: "learn",
      title: "Pastdan yuqoriga tekshiruv",
      body: "Eng quyi qatlamdan boshlang. Qaysi qadamda uzilish chiqsa, muammo aynan shu yerda.",
      visual: {
        kind: "stack",
        layers: [
          { label: "6 · ping example.com", note: "DNS ishlayaptimi?" },
          { label: "5 · ping 8.8.8.8", note: "Internetga chiqish bormi?" },
          { label: "4 · ping gateway", note: "Router ko'rinyaptimi?" },
          { label: "3 · ping 127.0.0.1", note: "Tarmoq steki sog'lommi?" },
          { label: "2 · ipconfig /all", note: "IP sozlamalari to'g'rimi?", accent: true },
          { label: "1 · Kabel / Wi-Fi", note: "Ulanish bormi?", accent: true },
        ],
      },
    },
    {
      type: "order",
      title: "Tekshiruv tartibini yig'ing",
      prompt: "Qadamlarni pastdan yuqoriga, ya'ni tekshirish tartibida bosing.",
      items: [
        "Kabel / Wi-Fi ulanishi",
        "IP sozlamalari (ipconfig /all)",
        "ping 127.0.0.1",
        "ping gateway",
        "ping 8.8.8.8",
        "ping example.com",
      ],
    },
    {
      type: "quiz",
      question: "8.8.8.8 ga ping ishlaydi, lekin example.com ga ishlamaydi. Eng ehtimoliy sabab?",
      options: ["Kabel uzilgan", "DNS muammosi", "Gateway noto'g'ri", "Tarmoq kartasi buzilgan"],
      answerIndex: 1,
      explanation: "IP bo'yicha internet bor (ping ishlayapti), faqat nomni IP'ga aylantirish ishlamayapti — bu DNS muammosi.",
    },
    {
      type: "quiz",
      question: "ping 127.0.0.1 ishlaydi, lekin gateway'ga ping ishlamaydi. Muammo qayerda?",
      options: [
        "Kompyuterdagi tarmoq stekida",
        "Lokal tarmoqda (kabel, Wi-Fi, IP sozlamasi yoki router)",
        "Internet provayderda",
        "DNS serverda",
      ],
      answerIndex: 1,
      explanation: "Stek sog'lom, lekin router ko'rinmayapti, shuning uchun muammo lokal tarmoqda. Provayderdan oldin shuni tekshiring.",
    },
    {
      type: "quiz",
      question: "ipconfig /all da IP manzil 169.254.x.x ko'rinmoqda. Birinchi qadamingiz?",
      options: [
        "DNS'ni almashtirish",
        "DHCP server (router) bilan aloqani tekshirish",
        "Brauzerni qayta o'rnatish",
        "Saytni boshqa brauzerda ochish",
      ],
      answerIndex: 1,
      explanation: "169.254.x.x — DHCP javob bermagan. Avval kabel/Wi-Fi va routerning DHCP xizmatini tekshiring.",
    },
    {
      type: "learn",
      title: "tracert: paketning yo'li",
      body: "tracert (Linux: traceroute) paket o'tadigan har routerni ko'rsatadi. U TTL maydonidan foydalanadi: har router TTL'ni bittaga kamaytiradi, nolga yetganda xabar qaytaradi. «* * *» har doim xato degani emas, ba'zi routerlar ICMP'ni bloklaydi.",
      terminal: [
        "> tracert example.com",
        "1   <1 ms   192.168.1.1     (uy routeringiz)",
        "2    8 ms   10.20.0.1       (provayder)",
        "3    *      Request timed out.",
        "4   25 ms   93.184.216.34   (maqsad)",
      ],
    },
    {
      type: "quiz",
      question: "traceroute paket yo'lini aniqlash uchun qaysi maydondan foydalanadi?",
      options: ["MAC manzil", "TTL", "Port raqami", "DNS yozuvi"],
      answerIndex: 1,
      explanation: "TTL har routerda kamayadi. Nolga yetganda router xabar qaytaradi va shu bilan yo'l ma'lum bo'ladi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: yo'lni kuzatish",
      prompt: "example.com ga paket yo'lini ko'rsatadigan buyruqni yozing.",
      accept: ["tracert example.com", "traceroute example.com"],
      reps: 3,
    },
    {
      type: "lab",
      title: "To'liq diagnostika ketma-ketligi",
      tasks: [
        "Quyidagi buyruqlarni tartib bilan bajaring va har birining natijasini daftarga yozing.",
        "Qaysi qadam ishlamaganini yoki hamma qadam nimani tasdiqlaganini yozing.",
        "Natijani 1-darsda chizgan tarmoq rasmi bilan solishtiring.",
      ],
      commands: [
        "ipconfig /all",
        "ping 127.0.0.1",
        "ping <gateway IP>",
        "ping 8.8.8.8",
        "ping example.com",
        "tracert example.com   (Linux: traceroute example.com)",
      ],
      expected: "Barcha 6 qadam natijasi daftarda bor. Hamma narsa ishlasa, har qadamda aynan nima tasdiqlangani yozilgan.",
    },
    {
      type: "lab",
      title: "Muammoni sun'iy ravishda keltiring",
      tasks: [
        "Packet Tracer'da oldingi router laboratoriyasini oching.",
        "Biror PC'dagi default gateway'ni noto'g'ri kiriting va ping qiling.",
        "Qaysi qadamda uzilganini toping, so'ng gateway'ni to'g'rilang.",
      ],
      expected: "Noto'g'ri gateway bilan o'z subnetga ping ishlaydi, boshqa tarmoqqa ishlamaydi. To'g'rilangach aloqa tiklanadi.",
    },
    {
      type: "practice",
      title: "Do'stingiz bilan o'yin",
      instructions: [
        "Do'stingiz yoki oila a'zosidan muammo yaratishni so'rang: Wi-Fi o'chirish yoki DNS ga noto'g'ri qiymat yozish.",
        "Siz o'sha 6 qadamli ketma-ketlik bo'yicha sababni toping.",
        "Qaysi qadamda topganingizni aytib bering.",
      ],
    },
  ],
};
