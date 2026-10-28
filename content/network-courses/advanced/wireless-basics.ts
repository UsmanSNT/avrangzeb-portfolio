import type { Lesson } from "../types";

export const wirelessBasics: Lesson = {
  id: "wireless-basics",
  title: "Simsiz tarmoqlar (Wi-Fi)",
  summary: "Diapazonlar, kanallar, xavfsizlik va korporativ Wi-Fi arxitekturasi. Signal va SNR o'lchash, kanal rejalash va Wi-Fi nosozliklari.",
  estimatedMinutes: 65,
  goals: [
    "2,4 / 5 / 6 GHz diapazonlari va kanallar farqini tushuntirasiz",
    "Ofis uchun to'g'ri Wi-Fi xavfsizlik turini tanlaysiz",
    "Signal darajasini o'lchab, kirish nuqtalarini rejalashtirasiz",
  ],
  requires: "Wi-Fi'li kompyuter yoki telefon; Cisco Packet Tracer",
  recap: [
    "2,4 GHz da faqat 3 ta kesishmaydigan kanal bor: 1, 6, 11.",
    "Ofis uchun WPA2/WPA3-Enterprise (802.1X + RADIUS); WEP va TKIP ishlatilmaydi.",
    "Ovoz va video uchun signal kamida −67 dBm atrofida bo'lishi kerak.",
  ],
  steps: [
    {
      type: "learn",
      title: "Wi-Fi avlodlari",
      body: "Ish joyida qurilmalar avlodlar bilan farqlanadi. Ular IEEE 802.11 standartlari asosida.",
      points: [
        "Wi-Fi 4 — 802.11n (2,4 va 5 GHz).",
        "Wi-Fi 5 — 802.11ac (5 GHz).",
        "Wi-Fi 6 / 6E — 802.11ax (6E da 6 GHz ham qo'shiladi).",
        "Wi-Fi 7 — 802.11be.",
      ],
    },
    {
      type: "learn",
      title: "Diapazonlar",
      body: "Har diapazonning o'z afzalligi va kamchiligi bor.",
      points: [
        "2,4 GHz — uzoqqa boradi, devorlardan yaxshi o'tadi, lekin shovqinli va kanallar kam.",
        "5 GHz — kanallar ko'p, tezroq, lekin masofa qisqaroq.",
        "6 GHz (Wi-Fi 6E/7) — eng toza va keng, faqat yangi qurilmalarda.",
      ],
    },
    {
      type: "learn",
      title: "Kanallar kesishmasligi kerak",
      body: "2,4 GHz da kanallar bir-birining ustiga chiqadi. 20 MHz kenglikda faqat uchtasi kesishmaydi: 1, 6 va 11. Qo'shni kirish nuqtalari shu uch kanalni navbatlab ishlatadi.",
      terminal: [
        "Yo'lak bo'ylab joylashgan AP'lar:",
        "[AP1: 1]   [AP2: 6]   [AP3: 11]   [AP4: 1]",
        "Qo'shnilar hech qachon bir kanalda emas.",
      ],
    },
    {
      type: "quiz",
      question: "2,4 GHz da (20 MHz) qaysi kanallar bir-biri bilan kesishmaydi?",
      options: ["1, 2, 3", "1, 6, 11", "1, 5, 9, 13", "Hammasi kesishmaydi"],
      answerIndex: 1,
      explanation: "1, 6 va 11 — kesishmaydigan uchlik. Boshqa kanallar qo'shnilariga shovqin beradi.",
    },
    {
      type: "learn",
      title: "Xavfsizlik turlari",
      body: "Wi-Fi havoda tarqaladi: kim yaqinda bo'lsa, signalni ushlay oladi. Shuning uchun shifrlash shart.",
      points: [
        "Open va WEP — xavfsiz emas, ishlatilmaydi.",
        "WPA2-Personal — umumiy parol (PSK), AES bilan. Uy va kichik ofis.",
        "WPA3-Personal — SAE: parolni taxmin qilish hujumlariga chidamliroq.",
        "WPA2/WPA3-Enterprise — har xodimga alohida login (802.1X + RADIUS server).",
      ],
    },
    {
      type: "quiz",
      question: "200 xodimli ofis. Xodim ishdan ketganda faqat uning kirishini o'chirish kerak. Qaysi tur mos?",
      options: ["Open", "WPA2-Personal", "WPA2/WPA3-Enterprise (802.1X + RADIUS)", "WEP"],
      answerIndex: 2,
      explanation: "Enterprise rejimida har kim o'z login'i bilan kiradi. Umumiy parolni hammaga qayta tarqatish shart emas.",
    },
    {
      type: "learn",
      title: "Korporativ arxitektura",
      body: "Uyda bitta router yetarli. Ofisda o'nlab kirish nuqtalari (AP) markazdan boshqariladi.",
      points: [
        "Avtonom AP — har biri alohida sozlanadi; kichik joylar uchun.",
        "Controller (WLC) + lightweight AP — AP'lar CAPWAP tunneli orqali WLC'ga bog'lanadi, sozlama markazda.",
        "Bulutdan boshqariladigan (masalan, Meraki) — boshqaruv internet orqali.",
        "Roaming — foydalanuvchi AP'dan AP'ga uzilmasdan o'tadi.",
      ],
    },
    {
      type: "quiz",
      question: "CAPWAP qaysi qurilmalar orasida ishlaydi?",
      options: ["Kompyuter va AP", "Lightweight AP va WLC", "Router va ISP", "Ikki switch"],
      answerIndex: 1,
      explanation: "CAPWAP — lightweight AP'larni boshqaruv kontrolleriga (WLC) bog'laydigan tunnel protokoli.",
    },
    {
      type: "learn",
      title: "Signal darajasi (dBm)",
      body: "Signal kuchi manfiy dBm bilan o'lchanadi: 0 ga qanchalik yaqin bo'lsa, shunchalik kuchli. Devorlar, beton, mikroto'lqinli pech va Bluetooth signalni zaiflashtiradi.",
      points: ["−30 dBm — juda kuchli (AP yonida).", "−67 dBm — ovoz va video uchun tavsiya etilgan chegara.", "−70 dBm — oddiy ishlash uchun yetarli.", "−80 dBm — beqaror, deyarli ishlamaydi."],
    },
    {
      type: "input",
      question: "Ovozli qo'ng'iroqlar uchun odatda tavsiya etiladigan signal chegarasi necha dBm? (manfiy son)",
      answers: ["-67", "-67 dbm", "−67", "−67 dbm"],
      hint: "Jadvaldagi «ovoz va video» qatoriga qarang.",
      explanation: "−67 dBm va undan kuchli signal ovoz/video uchun barqaror ishlashni ta'minlaydi.",
      placeholder: "Masalan: -70",
    },
    {
      type: "learn",
      title: "SNR: signal va shovqin",
      body: "Signal kuchli bo'lishi yetarli emas — u shovqindan qanchalik baland ekani muhim. SNR = signal − shovqin (dB). Ovoz va video uchun kamida 25 dB tavsiya etiladi.",
      points: [
        "Signal −65 dBm, shovqin −92 dBm → SNR 27 dB: yaxshi.",
        "Signal −65 dBm, shovqin −75 dBm → SNR 10 dB: yomon, kuchli shovqin.",
      ],
    },
    {
      type: "input",
      question: "Signal −70 dBm, shovqin −95 dBm. SNR necha dB?",
      answers: ["25", "25 db"],
      hint: "SNR = signal − shovqin.",
      explanation: "−70 − (−95) = 25 dB — ovoz uchun chegarada.",
      placeholder: "Son",
    },
    {
      type: "learn",
      title: "5 GHz va kanal kengligi",
      body: "5 GHz da 20 MHz'li kanallar ko'p. Ularni 40, 80 yoki 160 MHz ga birlashtirish tezlikni oshiradi, lekin kesishmaydigan kanallar soni kamayadi. Ko'p AP'li ofisda odatda 20 yoki 40 MHz tanlanadi. Ayrim 5 GHz kanallarida (DFS) AP radar signalini sezsa, kanalni almashtirishi shart.",
    },
    {
      type: "quiz",
      question: "Zich ofisda 30 ta AP 5 GHz da 80 MHz kenglikda ishlamoqda. Foydalanuvchilar «signal kuchli, lekin tezlik past» deydi. Eng ehtimoliy sabab?",
      options: [
        "Qo'shni AP'lar bir xil kanalda (co-channel interference) — kenglikni 20/40 MHz ga tushirish kerak",
        "Kabel toifasi past",
        "DNS sekin",
        "VLAN noto'g'ri",
      ],
      answerIndex: 0,
      explanation: "Keng kanallar kam bo'lgani uchun qo'shni AP'lar bitta kanalni bo'lishib, havoni navbat bilan ishlatadi. Torroq kanallar AP'larni ko'proq kanalga ajratadi.",
    },
    {
      type: "learn",
      title: "Wi-Fi nosozliklari",
      body: "Shikoyatni toifaga ajrating — har birining o'z tekshiruvi bor.",
      points: [
        "Ulanmaydi: SSID va xavfsizlik turi mosmi; Enterprise'da RADIUS loglaridagi rad etish sababi.",
        "Ulandi, lekin IP yo'q: WLAN VLAN'ida DHCP pool, helper-address va trunk'da VLAN.",
        "Signal kuchli, tezlik past: kanal kesishmasi, ko'p klient, eski 2,4 GHz qurilmalar.",
        "Yurganda uziladi: AP qamrovlari kesishmayapti yoki roaming sozlanmagan.",
      ],
    },
    {
      type: "quiz",
      question: "Noutbuk korporativ Wi-Fi'ga ulandi (WPA2-Enterprise muvaffaqiyatli), lekin 169.254.x.x manzil oldi. Muammo qayerda?",
      options: [
        "Parol noto'g'ri",
        "WLAN VLAN'ida DHCP ishlamayapti: pool, helper-address yoki trunk'da VLAN yo'q",
        "Signal zaif",
        "1-kanal band",
      ],
      answerIndex: 1,
      explanation: "Autentifikatsiya o'tgan — radio va xavfsizlik joyida. Endi bu oddiy simli VLAN muammosi: DHCP zanjirini tekshiring.",
    },
    {
      type: "lab",
      title: "O'z Wi-Fi'ingizni o'lchang",
      tasks: [
        "Kompyuteringizda Wi-Fi ulanish ma'lumotlarini chiqaring.",
        "Kanal, diapazon, signal darajasi va standartni yozib oling.",
        "Router yonida, qo'shni xonada va eng uzoq xonada o'lchab, natijalarni solishtiring.",
      ],
      commands: {
        mode: "choose-one",
        items: [
          { command: "netsh wlan show interfaces", note: "Signal (%), kanal, radio turi va SSID.", os: "Windows" },
          { command: "nmcli dev wifi list", note: "Atrofdagi tarmoqlar, kanallar va signal.", os: "Linux" },
          { command: "Option + Wi-Fi belgisi", note: "Menyuda RSSI (dBm), kanal va PHY rejimi ko'rinadi.", os: "macOS" },
        ],
      },
      expected: "Uchta joy uchun signal darajasi yozilgan; uzoqlashgan sari signal pasayishi ko'rinadi.",
    },
    {
      type: "lab",
      title: "Packet Tracer: himoyalangan Wi-Fi",
      tasks: [
        "Home Router (WRT300N) va Laptop qo'ying.",
        "Router'da Wireless bo'limida SSID bering, Wireless Security'da WPA2 Personal va kuchli parol tanlang.",
        "Laptop'ni o'chirib, Physical bo'limida simli kartani olib tashlang va WPC300N simsiz modulini qo'ying.",
        "Laptop'da Desktop → PC Wireless orqali tarmoqqa ulaning va router'ga ping qiling.",
      ],
      expected: "Laptop SSID'ga WPA2 paroli bilan ulanadi va DHCP orqali manzil oladi.",
    },
    {
      type: "practice",
      title: "Kanal rejasini chizing",
      instructions: [
        "Uyingiz yoki ofis rejasini qog'ozga chizing va 4–6 ta AP joylashtiring.",
        "Har AP'ga 2,4 GHz kanalini shunday bering-ki, qo'shnilari bir xil kanalda bo'lmasin (1, 6, 11).",
        "Signal zaif bo'ladigan joylarni (beton devor, lift, oshxona) belgilang.",
      ],
    },
  ],
};
