import type { Lesson } from "../../network-courses/types";

export const courseHowItWorks: Lesson = {
  id: "english-how-it-works",
  title: "Kurs qanday ishlaydi",
  summary: "Ingliz tilini tizim sifatida o'rganish: qoida, misol, o'z gapingiz va ovoz chiqarib mashq. INTP uchun mo'ljallangan usul.",
  estimatedMinutes: 15,
  goals: [
    "Kursning 3 bosqichi va har dars tuzilishini bilasiz",
    "Har bir qoidani «nima uchun» va «qanday» tarzida o'qishni o'rganasiz",
    "Har kuni qancha vaqt va qanday mashq qilishni rejalashtirasiz",
  ],
  recap: [
    "Qoida → misol → o'z gapingiz → ovoz chiqarib mashq: har darsning asosiy zanjiri.",
    "Gapirish — ko'nikma. U kitobdan emas, takroriy mashqdan o'sadi.",
    "Har kuni 20 daqiqa ko'proq samara beradi, haftada 3 soat bilan solishtirganda.",
  ],
  steps: [
    {
      type: "learn",
      title: "Bu kurs kimga va nima uchun",
      body: "Kurs IT sohasida ishlaydigan, o'qishni yaxshi ko'radigan va gapirishda biroz tortinadigan odamlar uchun yozilgan. Maqsad — 0 dan boshlab, taxminan 50% erkin muloqotga yetish: ishda texnik gaplashish, sayohatda o'zini tushuntirish va yangi odamlar bilan oddiy suhbat qurish.",
      points: [
        "Uch bosqich: boshlang'ich, o'rta-boshlang'ich (pre-intermediate) va o'rta daraja (intermediate).",
        "Har bosqichda darslar, qisqa testlar va yakuniy imtihon bor.",
        "Imtihondan o'tmaguncha keyingi bosqich ochilmaydi — bu bilimdagi teshiklarni yopadi.",
      ],
    },
    {
      type: "learn",
      title: "INTP uchun usul: tizim avval, gapirish keyin",
      body: "Tizimli fikrlaydigan odam qoidani tushunmaguncha gapira olmaydi, lekin ortiqcha nazariyada ham to'xtab qolmasligi kerak. Shu sababli har qoida uch qadamda beriladi.",
      points: [
        "1. Nima uchun: qoida qanday mantiqqa asoslanadi.",
        "2. Qolip: gap qanday tuzilishini ko'rasiz.",
        "3. O'z gapingiz: o'zingiz haqingizda gap tuzasiz — bu tayyorlanish imkoniyati, qo'rquvni kamaytiradi.",
      ],
    },
    {
      type: "learn",
      title: "Har kuni qanday mashq qilish kerak",
      body: "Kundalik rejim qisqa, ammo muntazam bo'lishi kerak. Bitta uzun seans o'rniga uchta qisqa seans samaraliroq.",
      points: [
        "Ertalab 5 daqiqa: avvalgi kun darsidagi 3 ta gapni ovoz chiqarib ayting.",
        "Tushlikda 10 daqiqa: bitta darsni qayta o'qing va test savollarini yechib chiqing.",
        "Kechqurun 5 daqiqa: bugun nima qilganingizni 5 ta ingliz gap bilan yozing.",
      ],
    },
    {
      type: "learn",
      title: "Gap qolipi: ega, fe'l, to'ldiruvchi",
      body: "Ingliz tilida oddiy gap odatda shu tartibda keladi: kim → nima qiladi → nimani. Bu tartib deyarli o'zgarmaydi, shuning uchun bitta qolipni o'zlashtirsangiz, minglab gapni tuza olasiz.",
      terminal: ["I        read       books", "ega      fe'l       to'ldiruvchi"],
    },
    {
      type: "quiz",
      question: "«She writes code» gapida fe'l qaysi so'z?",
      options: ["She", "writes", "code", "She writes"],
      answerIndex: 1,
      explanation: "writes — fe'l («yozadi»). She — ega, code — to'ldiruvchi. Ega va fe'l orasida boshqa so'z bo'lmaydi.",
    },
    {
      type: "order",
      title: "Gapni tuzing",
      prompt: "«Men kitob o'qiyman» gapini ingliz tilida tuzing: so'zlarni to'g'ri tartibda bosing.",
      items: ["I", "read", "books"],
    },
    {
      type: "quiz",
      question: "Qaysi gap to'g'ri tuzilgan?",
      options: ["Books I read.", "I read books.", "Read I books.", "I books read."],
      answerIndex: 1,
      explanation: "Ega (I) birinchi, fe'l (read) ikkinchi, to'ldiruvchi (books) uchinchi. Ingliz tilida gap tartibi bu qolipdan chetga chiqmaydi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: «Men dasturlayman»",
      prompt: "«Men dasturlayman» gapini ingliz tilida yozing. Nuqta va bosh harf shart emas.",
      options: [
        { command: "I code", os: "Qisqa" },
        { command: "I write code", os: "Aniqroq" },
        { command: "I program", os: "Rasmiy" },
      ],
      reps: 2,
    },
    {
      type: "learn",
      title: "O'z gapingizni tuzing",
      body: "Qolip tayyor bo'lsa, o'zingiz haqingizdagi gaplarni yasash osonlashadi. Bu INTP uchun eng kuchli usul: gap hech kimnikiga o'xshamaydi, shuning uchun uni yodlash shart emas — faqat qolipni eslash kifoya.",
      points: [
        "I read technical books. (Men texnik kitoblar o'qiyman.)",
        "I write code every day. (Men har kuni kod yozaman.)",
        "I like traveling. (Men sayohat qilishni yoqtiraman.)",
      ],
    },
    {
      type: "practice",
      title: "Ovoz chiqarib mashq",
      instructions: [
        "Quyidagi 4 ta gapni ovoz chiqarib ayting. Har birini 2 marta, sekin va aniq: I read books. / I write code. / I like traveling. / I have a laptop.",
        "Keyin o'zingiz haqingizda 3 ta gap yozing va ularni ham ayting.",
        "Ovozingizni telefonga yozib oling va tinglang: qaysi so'zda to'xtab qoldingiz?",
      ],
      seconds: 150,
    },
  ],
};

export const soundsLesson: Lesson = {
  id: "english-sounds",
  title: "Tovushlar: o'zbek tilida yo'q bo'lganlar",
  summary: "th, v/w, r, ing va qisqa a tovushlari: ularni qanday hosil qilish va nima uchun eshitish qiyin.",
  estimatedMinutes: 25,
  goals: [
    "Ingliz tilidagi eng qiyin 5 tovushni ajratasiz",
    "Har tovushni og'iz va til holati bilan tasvirlay olasiz",
    "10 ta so'zni ovoz chiqarib aniq talaffuz qilasiz",
  ],
  recap: [
    "th — tilni tishlar orasiga qo'yasiz: think, this.",
    "v — pastki lab tishga tegadi; w — lablar yumaloq: very va we farqi shu.",
    "ing — oxirida n bor, g yo'q; r — tilning uchi hech narsaga tegmaydi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Nega tovush muhim",
      body: "Gap grammatik jihatdan to'g'ri bo'lsa ham, tovush noto'g'ri bo'lsa, suhbatdosh so'zni boshqacha tushunishi mumkin. Lekin ingliz tilida hamma tovushni mukammal aytish shart emas: asosiy farqlarni to'g'ri qilish yetarli.",
      points: [
        "Uzbek tilida th tovushi yo'q: odatda uni s yoki t bilan almashtiramiz.",
        "v va w ikkalasi ham «v» kabi eshitiladi — lekin ingliz tilida ular farqli.",
        "Qisqa a (cat) va cho'ziq a (car) ham aralashib ketadi.",
      ],
    },
    {
      type: "learn",
      title: "th: tilni tishlar orasiga qo'ying",
      body: "Ikki xil th bor: think (ovozsiz) va this (ovozli). Ikkalasida ham til tishlar orasida turadi va havo chiqadi.",
      points: [
        "think — ovozsiz: til tishga tegadi, ovoz chiqmaydi, faqat havo.",
        "this — ovozli: xuddi shu holat, lekin tomoq ham tebranadi.",
        "Xato: think o'rniga «sink» (s) yoki «tink» (t) deyish — suhbatdosh boshqa so'z deb tushunadi.",
      ],
    },
    {
      type: "quiz",
      question: "think so'zining boshidagi tovush qanday hosil bo'ladi?",
      options: ["s kabi — tilni tishlar orqasida", "t kabi — tilni tanglayga urib", "Tilni tishlar orasiga qo'yib, havo chiqarib", "f kabi — pastki lab tishga tegib"],
      answerIndex: 2,
      explanation: "th tovushida til tishlar orasida turadi. Bu o'zbek tilida yo'q, shuning uchun uni alohida mashq qilish kerak.",
    },
    {
      type: "learn",
      title: "v va w: lablar farqi",
      body: "Ikkalasi ham o'zbekcha v ga o'xshab eshitiladi, lekin ingliz tilida farqli.",
      points: [
        "v (very, vest) — pastki lab yuqori tishlarga tegadi.",
        "w (we, west) — lablar yumaloq bo'ladi, hech narsaga tegmaydi, xuddi «u» deyayotgandek.",
      ],
    },
    {
      type: "quiz",
      question: "very va we so'zlaridagi asosiy farq nimada?",
      options: [
        "very — pastki lab tishga tegadi (v); we — lablar yumaloq (w)",
        "Ikkalasi bir xil talaffuz qilinadi",
        "we — pastki lab tishga tegadi; very — lablar yumaloq",
        "Faqat yozilishi farq qiladi",
      ],
      answerIndex: 0,
      explanation: "v va w ni farqlash uchun lablaringizni ko'zgu oldida kuzating: v da tish lab bilan tegadi, w da lablar cho'chqa lab kabi yumaloq.",
    },
    {
      type: "learn",
      title: "ing va r",
      body: "Ikki tovush ko'p xatoga sabab bo'ladi.",
      points: [
        "ing (working, reading): oxirida faqat n bor, g tovushi yo'q. «Working» — «workin» deb ayting.",
        "r (red, read): tilning uchi hech narsaga tegmaydi, lekin orqaga biroz tortiladi. O'zbekcha r dagi tilni urish kerak emas.",
      ],
    },
    {
      type: "input",
      question: "think so'zining boshidagi ikki harfli tovush yozuvini yozing (lotin harfida).",
      answers: ["th"],
      hint: "s yoki t emas — tilni tishlar orasiga qo'yasiz.",
      explanation: "th — ovozsiz tish tovushi. Yozuvda ikki harf bo'lsa ham, bitta tovush.",
      placeholder: "Harflar",
    },
    {
      type: "quiz",
      question: "Qaysi so'zda r tovushi to'g'ri hosil bo'lgan?",
      options: [
        "Tilning uchi tanglayga tegib, ikki marta uriladi",
        "Tilning uchi hech narsaga tegmaydi, lab biroz yumaloq",
        "Lablar to'liq yopiladi",
        "Tishlar orasida havo chiqadi",
      ],
      answerIndex: 1,
      explanation: "Ingliz r tovushida til orqaga biroz tortiladi, lekin uchi tegmaydi. Bu o'zbek r idan farq qiladi.",
    },
    {
      type: "practice",
      title: "Ovozli mashq: 10 so'z",
      instructions: [
        "think, thank, three, thirty, both — har birini 3 marta. Tilni tishlar orasida ushlab turing.",
        "this, that, they, mother, there — ovozli th. Tomoqqa qo'lingizni qo'yib tebranishni his qiling.",
        "very, vest, vote — pastki lab tishga. we, west, wine — lablar yumaloq. Ikki ustunni navbat bilan ayting.",
        "Har so'zni yozib oling va eng qiyin 2 tasini belgilang.",
      ],
      seconds: 300,
    },
  ],
};

export const toBeLesson: Lesson = {
  id: "english-to-be",
  title: "To be: am, is, are",
  summary: "Ingliz tilidagi eng ko'p ishlatiladigan fe'l: kim yoki qanday ekanligingizni aytish.",
  estimatedMinutes: 30,
  goals: [
    "I, you, he/she/it, we, they uchun to'g'ri shaklni tanlaysiz",
    "Qisqa shakllarni (I'm, he's) tushunasiz va yozasiz",
    "O'z haqingizda 5 ta to'g'ri gap tuzasiz",
  ],
  recap: [
    "I → am; he, she, it → is; you, we, they → are.",
    "Qisqa shakllar: I'm, you're, he's, we're, they're — og'zaki nutqda ko'proq ishlatiladi.",
    "Savol shakli: fe'l ega oldiga chiqadi — Are you a developer?",
  ],
  steps: [
    {
      type: "learn",
      title: "To be: uchta shakl",
      body: "«Bo'lmoq» ma'nosidagi bu fe'l ega ga qarab o'zgaradi. Bu o'zbek tilidagi «-man, -san, -di» tizimiga o'xshash mantiq.",
      terminal: ["I            am", "you          are", "he / she / it   is", "we / you / they are"],
    },
    {
      type: "learn",
      title: "Qisqa shakllar",
      body: "Gapirganda ikki so'zni birlashtirish odatiy: I am → I'm, he is → he's. Yozma ravishda ham ishlatiladi, lekin rasmiy hujjatlarda to'liq shakl afzal.",
      points: ["I'm a developer. (Men dasturchiman.)", "She's from Tashkent. (U Toshkentdan.)", "We're colleagues. (Biz hamkasbmiz.)"],
    },
    {
      type: "quiz",
      question: "«___ a developer.» — bo'sh joyga qaysi shakl kerak?",
      options: ["am", "is", "are", "be"],
      answerIndex: 0,
      explanation: "I bilan faqat am ishlatiladi: I am a developer.",
    },
    {
      type: "quiz",
      question: "«We ___ students.» — to'g'ri shakl?",
      options: ["am", "is", "are", "be"],
      answerIndex: 2,
      explanation: "We bilan are. Ko'plikdagi ega (we, you, they) bilan ham shu shakl.",
    },
    {
      type: "input",
      question: "Bo'sh joyni to'ldiring: «She ___ from Samarkand.»",
      answers: ["is"],
      hint: "She — he, she, it guruhida.",
      explanation: "She is from Samarkand. Uchinchi shaxs birlikda is ishlatiladi.",
      placeholder: "Fe'l",
    },
    {
      type: "input",
      question: "Bo'sh joyni to'ldiring: «Where ___ you from?» (Qayerdansiz?)",
      answers: ["are"],
      hint: "You bilan qaysi shakl?",
      explanation: "Where are you from? — savolda fe'l ega oldiga chiqadi.",
      placeholder: "Fe'l",
    },
    {
      type: "input",
      question: "«He is» ning qisqa shaklini yozing.",
      answers: ["he's", "he’s"],
      hint: "He va is birlashadi; apostrofni unutmang.",
      explanation: "He's — he is. Apostrof o'rnida harf tushib qolgan.",
      placeholder: "Qisqa shakl",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: o'zingiz haqingizda",
      prompt: "«Men dasturchiman» gapini ingliz tilida yozing (nuqtasiz).",
      options: [
        { command: "I am a developer", os: "To'liq" },
        { command: "I'm a developer", os: "Qisqa" },
      ],
      reps: 3,
    },
    {
      type: "quiz",
      question: "Savol shaklini tanlang: «Siz dasturchimisiz?»",
      options: ["You are a developer?", "Are you a developer?", "Do you are a developer?", "Is you a developer?"],
      answerIndex: 1,
      explanation: "Savolda to be ega oldiga chiqadi: Are you...? Is he...? Am I...?",
    },
    {
      type: "practice",
      title: "5 ta gap: o'zingiz haqingizda",
      instructions: [
        "Yozing: I am ... (kasbingiz), I am from ... (shahringiz), I am ... years old (yoshingiz).",
        "Ikkinchi qatorda shu gaplarning savol shaklini yozing: Are you ...? Where are you from?",
        "Har gapni ovoz chiqarib ayting. Qisqa shakl bilan ham bir marta ayting: I'm, I'm from.",
      ],
    },
  ],
};

export const introductionLesson: Lesson = {
  id: "english-introduction",
  title: "Tanishuv: tayyor skript",
  summary: "O'zingizni 4 qadamda tanishtirish va suhbatni davom ettirish uchun tayyor skript. Tortinchoqlik uchun eng samarali usul.",
  estimatedMinutes: 35,
  goals: [
    "Tanishuvning 4 qismini tuzasiz va yodlaysiz",
    "Suhbatdoshga javob berib, savol qaytarasiz",
    "O'z tanishuv skriptingizni 30 soniya ichida aytasiz",
  ],
  recap: [
    "Tanishuv skripti: salom → ish → qiziqish → savol.",
    "Tayyor gap tortinchoqlikni kamaytiradi: javobni oldindan bilasiz.",
    "Nice to meet you too. — tanishganda eng tabiiy javob.",
  ],
  steps: [
    {
      type: "learn",
      title: "Nega skript kerak",
      body: "INTP odam yangi odam bilan gaplashishda ko'pincha «nima deyman?» deb o'ylab qoladi. Shu fikr suhbatni to'xtatadi. Yechim — tanishuvni oldindan tayyorlash: bu improvizatsiya emas, rejalashtirilgan gap. Ko'p odamlar tanishuvda bir xil savolni beradi, shuning uchun bu skript ko'p vaziyatda ishlaydi.",
    },
    {
      type: "learn",
      title: "4 qismli skript",
      body: "Har qism bitta fikr. Uzun gap tuzish shart emas.",
      points: [
        "1. Salom va ism: Hi, I'm Avrangzeb.",
        "2. Ish: I work as a developer at a small IT company.",
        "3. Qiziqish: I like reading books and traveling.",
        "4. Savol: What about you?",
      ],
    },
    {
      type: "order",
      title: "Skriptni tartiblang",
      prompt: "Tanishuv skriptining qismlarini to'g'ri tartibda bosing.",
      items: [
        "Hi, I'm Avrangzeb.",
        "I work as a developer at a small IT company.",
        "I like reading books and traveling.",
        "What about you?",
      ],
    },
    {
      type: "quiz",
      question: "Suhbatdoshingiz «Nice to meet you» dedi. Eng tabiiy javob qaysi?",
      options: ["Nice to meet you too.", "Yes, I am.", "Fine, thanks you.", "Goodbye."],
      answerIndex: 0,
      explanation: "Nice to meet you too. — «Men ham tanishganimdan xursandman». Yes, I am. bu savolga javob, bu yerda savol yo'q.",
    },
    {
      type: "input",
      question: "Bo'sh joyni to'ldiring: «I ___ at a small IT company.» (ishlayman)",
      answers: ["work"],
      hint: "I bilan fe'lning oddiy shakli.",
      explanation: "I work — I bilan fe'lga -s qo'shilmaydi. -s faqat he, she, it bilan keladi.",
      placeholder: "Fe'l",
    },
    {
      type: "learn",
      title: "Savol qaytarish",
      body: "Suhbatdosh sizga savol bergach, javobdan keyin uni qaytarish — eng oddiy va kuchli usul. What about you? — «Sizchi?» demakdir.",
      points: [
        "Ask: What do you do?",
        "Answer: I'm a developer.",
        "Return: And you? / What about you?",
      ],
    },
    {
      type: "practice",
      title: "Tanishuv mashqi: 30 soniya",
      instructions: [
        "Skriptingizni oyna oldida, sekundomer bilan 30 soniyada ayting.",
        "Har kuni 3 marta takrorlang: ertalab, tushlikdan keyin va kechqurun.",
        "Oltinchi kundan boshlab uni o'z so'zlaringiz bilan o'zgartiring: ish joyingiz, qiziqishingiz.",
      ],
      seconds: 180,
    },
  ],
};

export const articlesLesson: Lesson = {
  id: "english-articles",
  title: "Artikllar: a, an, the",
  summary: "Ingliz tilida ot oldidagi a, an va the: qachon qaysi biri kerak va ko'plik shakllari.",
  estimatedMinutes: 30,
  goals: [
    "a va an ni tovushga qarab tanlaysiz",
    "the ni qachon ishlatishni tushuntirasiz",
    "Oddiy ko'plik shakllarini to'g'ri yasaysiz",
  ],
  recap: [
    "a — undosh tovush oldida (a developer); an — unli tovush oldida (an engineer).",
    "Harf emas, tovush muhim: an hour (h jim), an IT (I unli tovush bilan boshlanadi).",
    "the — aniq yoki hammaga ma'lum narsa oldida: the sun, the book on the table.",
  ],
  steps: [
    {
      type: "learn",
      title: "a va an: tovushga qarang",
      body: "Ingliz tilida artikl yozuvga emas, talaffuzga qarab tanlanadi. Agar so'z unli tovush bilan boshlansa — an, undosh bo'lsa — a.",
      points: [
        "a developer, a laptop, a university (you tovushi — undosh).",
        "an engineer, an apple, an hour (h jim — unli tovush).",
        "an IT specialist — IT «ay-ti» deb o'qiladi, unli tovush bilan boshlanadi.",
      ],
    },
    {
      type: "quiz",
      question: "Bo'sh joy uchun qaysi artikl kerak: «I have ___ hour free.»",
      options: ["a", "an", "the", "—"],
      answerIndex: 1,
      explanation: "hour — h jim, shuning uchun unli tovush bilan boshlanadi: an hour.",
    },
    {
      type: "quiz",
      question: "«I have ___ laptop.» — qaysi artikl?",
      options: ["a", "an", "the", "—"],
      answerIndex: 0,
      explanation: "laptop — l undosh tovush bilan boshlanadi: a laptop.",
    },
    {
      type: "learn",
      title: "the: aniq narsa uchun",
      body: "the ishlatiladi, agar gapdirgan va tinglovchi qaysi narsa haqida gapirayotganini bilsa. Shuningdek, yagona narsa (the sun, the Internet) oldida ham.",
      points: [
        "I have a book. — har qanday kitob.",
        "The book on the table is mine. — aniq, ko'rilib turgan kitob.",
        "I use the Internet every day. — yagona narsa.",
      ],
    },
    {
      type: "input",
      question: "Bo'sh joyni to'ldiring: «___ book on the table is mine.» (aniq kitob)",
      answers: ["the"],
      hint: "Gapirgan va tinglovchi qaysi kitob ekanini biladi.",
      explanation: "The book on the table — aniq, ko'rsatilgan kitob.",
      placeholder: "Artikl",
    },
    {
      type: "learn",
      title: "Ko'plik: -s va -es",
      body: "Ko'pchilik otlarga -s qo'shiladi. S, x, ch, sh bilan tugagan so'zlarga -es. Bir nechta istisno bor, ularni yodlash kerak.",
      points: [
        "book → books, laptop → laptops",
        "box → boxes, church → churches, class → classes",
        "child → children, man → men (istisnolar)",
      ],
    },
    {
      type: "quiz",
      question: "box so'zining ko'plik shakli qaysi?",
      options: ["boxs", "boxes", "boxies", "box"],
      answerIndex: 1,
      explanation: "x bilan tugagan so'zlarga -es qo'shiladi: boxes.",
    },
    {
      type: "practice",
      title: "Xonadagi narsalar",
      instructions: [
        "Xonangizdagi 10 ta narsani ayting, har biri oldida a, an yoki the bilan: a chair, a window, the door.",
        "Ularning ko'pligini ayting: two chairs, three windows.",
        "Har bir gapni yozib qo'ying va keyingi kuni tekshiring.",
      ],
      seconds: 150,
    },
  ],
};
