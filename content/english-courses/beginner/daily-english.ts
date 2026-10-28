import type { Lesson } from "../../network-courses/types";

export const presentSimpleLesson: Lesson = {
  id: "english-present-simple",
  title: "Present Simple: odatlar va doimiy haqiqat",
  summary: "Har kuni qiladigan ishlaringizni gapirish: fe'lga -s qo'shish qoidasi va inkor shakllari.",
  estimatedMinutes: 35,
  goals: [
    "I/you/we/they va he/she/it uchun fe'l shaklini to'g'ri tanlaysiz",
    "Inkor gap tuzasiz: do not va does not bilan",
    "Kundalik odatlaringizni 5 ta gapda tasvirlaysiz",
  ],
  recap: [
    "I, you, we, they bilan fe'l o'zgarmaydi: I read, they work.",
    "He, she, it bilan fe'lga -s (yoki -es): she reads, it works, he watches.",
    "Inkor: I do not / he does not — fe'l oddiy shaklda qoladi: she does not like.",
  ],
  steps: [
    {
      type: "learn",
      title: "Present Simple nima uchun",
      body: "Bu zamon odatlar, muntazam ishlar va doimiy haqiqatlar uchun ishlatiladi. «Hozir shu daqiqada nima bo'layapti» uchun boshqa zamon (Present Continuous) bor, u keyingi bosqichda.",
      points: [
        "I read books every night. — har kecha (odat).",
        "Water boils at 100 degrees. — doimiy haqiqat.",
        "The office opens at 9. — muntazam jadval.",
      ],
    },
    {
      type: "learn",
      title: "-s qoidasi",
      body: "Gap ega he, she yoki it bo'lsa, fe'lga -s qo'shiladi. Boshqa egalar bilan fe'l o'zgarmaydi. Bu eng ko'p xato qilinadigan joy.",
      terminal: [
        "I      read      we      read",
        "you    read      they    work",
        "he     reads     she     works",
        "it     works     Ali     studies",
      ],
    },
    {
      type: "quiz",
      question: "«He ___ football on weekends.» (play) — qaysi shakl?",
      options: ["play", "plays", "playing", "is play"],
      answerIndex: 1,
      explanation: "He bilan fe'lga -s qo'shiladi: plays. Hafta oxiri — muntazam odat.",
    },
    {
      type: "input",
      question: "Bo'sh joyni to'ldiring: «She ___ code every day.» (code)",
      answers: ["codes"],
      hint: "She — uchinchi shaxs. Fe'lga nima qo'shiladi?",
      explanation: "She codes every day. Undosh bilan tugagan fe'lga -s qo'shiladi.",
      placeholder: "Fe'l shakli",
    },
    {
      type: "input",
      question: "Bo'sh joyni to'ldiring: «It ___ fast.» (go — boradi, harakat qiladi)",
      answers: ["goes"],
      hint: "o bilan tugagan fe'lga -es qo'shiladi.",
      explanation: "go → goes. O, s, x, ch, sh bilan tugagan fe'llarga -es qo'shiladi.",
      placeholder: "Fe'l shakli",
    },
    {
      type: "learn",
      title: "Inkor: do not va does not",
      body: "Inkor gapda asosiy fe'l o'zgarmaydi, uning oldiga yordamchi fe'l qo'yiladi. I, you, we, they bilan — do not (don't). He, she, it bilan — does not (doesn't).",
      points: [
        "I don't like noise. (Men shovqinni yoqtirmayman.)",
        "She doesn't drink coffee. (U qahva ichmaydi.)",
        "Qoida: does bilan fe'lga -s qo'shilmaydi — she does not likes ✗, she does not like ✓.",
      ],
    },
    {
      type: "quiz",
      question: "Qaysi gap to'g'ri?",
      options: [
        "She does not likes coffee.",
        "She not like coffee.",
        "She does not like coffee.",
        "She doesn't likes coffee.",
      ],
      answerIndex: 2,
      explanation: "Does bilan fe'l oddiy shaklda bo'ladi: does not like. -s yordamchi fe'lga o'tadi.",
    },
    {
      type: "type",
      title: "Qo'l xotirasi: inkor shakli",
      prompt: "«U dasturlashni yoqtirmaydi» gapini ingliz tilida yozing (nuqtasiz, qisqa shakl bilan).",
      options: [
        { command: "She doesn't like programming", os: "Qisqa" },
        { command: "She does not like programming", os: "To'liq" },
      ],
      reps: 3,
    },
    {
      type: "practice",
      title: "Kunlik odatlaringiz",
      instructions: [
        "Yozing: I wake up at ..., I work on ..., I read ... Har biriga aniq vaqt yoki kun qo'shing.",
        "Yana 2 ta inkor gap yozing: I don't watch TV. I don't drink coffee.",
        "Hammasini ovoz chiqarib ayting. -s ni eshitishga harakat qiling: he wakes up, she works.",
      ],
    },
  ],
};

export const questionsLesson: Lesson = {
  id: "english-questions",
  title: "Savollar: do, does va have",
  summary: "Ha/yo'q savollarini tuzish, have fe'li va javob berish: suhbatning eng asosiy ko'nikmasi.",
  estimatedMinutes: 35,
  goals: [
    "Do yoki does bilan ha/yo'q savol tuzasiz",
    "Have va has fe'lini to'g'ri ishlatasiz",
    "Savolga qisqa javob berasiz: Yes, I do. / No, she doesn't.",
  ],
  recap: [
    "Savol: Do/Does + ega + fe'l? — Do you read? Does she work here?",
    "Javob qisqa bo'ladi: Yes, I do. No, she doesn't.",
    "Have: I have, he has — egalikni bildiradi: I have a laptop. She has a cat.",
  ],
  steps: [
    {
      type: "learn",
      title: "Ha/yo'q savollar",
      body: "Gapning boshiga do yoki does qo'yiladi. Ega he, she, it bo'lsa does, aks holda do. Savoldagi fe'l oddiy shaklda turadi.",
      terminal: ["Do you read books?", "Do they travel a lot?", "Does she work here?", "Does it run on Linux?"],
    },
    {
      type: "quiz",
      question: "«Siz kod yozasizmi?» — to'g'ri savol?",
      options: ["Do you write code?", "You write code?", "Are you write code?", "Does you write code?"],
      answerIndex: 0,
      explanation: "You bilan do, fe'l oddiy shaklda: Do you write code?",
    },
    {
      type: "order",
      title: "Savolni tuzing",
      prompt: "«U shu yerda ishlaydimi?» savolini tuzing: so'zlarni to'g'ri tartibda bosing.",
      items: ["Does", "she", "work", "here?"],
    },
    {
      type: "input",
      question: "Javobni to'ldiring: «Do you like music?» — «Yes, I ___.»",
      answers: ["do"],
      hint: "Savoldagi yordamchi fe'l javobda ham takrorlanadi.",
      explanation: "Yes, I do. Ingliz tilida javob ko'pincha savoldagi yordamchi fe'lni qaytaradi.",
      placeholder: "Yordamchi fe'l",
    },
    {
      type: "learn",
      title: "Have: egalik va tajriba",
      body: "Have «bor» yoki «ega bo'lmoq» ma'nosida. He, she, it bilan shakli has bo'ladi. Savol va inkorda do/does bilan — have fe'li oddiy shaklda turadi.",
      points: [
        "I have a laptop. (Menda noutbuk bor.)",
        "She has a cat. (Uning mushugi bor.)",
        "Do you have a minute? (Bir daqiqangiz bormi?)",
        "He doesn't have time. (Unda vaqt yo'q.)",
      ],
    },
    {
      type: "quiz",
      question: "«She ___ a new laptop.» — bo'sh joy uchun qaysi shakl?",
      options: ["have", "has", "is", "do"],
      answerIndex: 1,
      explanation: "She bilan has. Have fe'li ham uchinchi shaxsda o'zgaradi.",
    },
    {
      type: "quiz",
      question: "«Do they travel a lot?» savoliga to'g'ri qisqa javob?",
      options: ["Yes, they do.", "Yes, they are.", "Yes, they does.", "Yes, I travel."],
      answerIndex: 0,
      explanation: "Savoldagi do ni javobda ham ishlatamiz: Yes, they do. Ikkinchi javob to be bilan — bu yerda mos emas.",
    },
    {
      type: "practice",
      title: "Savol-javob",
      instructions: [
        "O'zingizga 5 ta ha/yo'q savol yozing: Do you ...? Does your friend ...?",
        "Har savolga ovoz chiqarib Yes yoki No bilan javob bering va qisqa shaklda: Yes, I do. No, I don't.",
        "Bir savolga javobni 2 jumla bilan kengaytiring: Yes, I do. I read every evening.",
      ],
    },
  ],
};

export const whQuestionsLesson: Lesson = {
  id: "english-wh-questions",
  title: "So'roq so'zlari: what, where, why",
  summary: "Ochiq savollar: nima, qayerda, nega, qachon, kim va qanday. Suhbatni boshqarishning kaliti.",
  estimatedMinutes: 35,
  goals: [
    "What, where, when, why, who, how so'zlarini farqlaysiz",
    "Ochiq savol tuzib, to'g'ri tartibda aytasiz",
    "Suhbatdoshdan batafsil javob olish uchun savol berasiz",
  ],
  recap: [
    "So'roq so'zi + do/does + ega + fe'l? — Where do you live?",
    "How old, how many, how much — how bilan birga keladi.",
    "Ochiq savol «ha/yo'q» emas, batafsil javob talab qiladi — suhbat shu yerda boshlanadi.",
  ],
  steps: [
    {
      type: "learn",
      title: "So'roq so'zlari",
      body: "Har bir so'roq so'zi aniq savolga javob beradi. Ularni yoddan bilish suhbatning birinchi bosqichi.",
      points: [
        "What — nima? What do you do? (Siz nima ish qilasiz?)",
        "Where — qayerda? Where do you live? (Qayerda yashaysiz?)",
        "When — qachon? When do you start? (Qachon boshlaysiz?)",
        "Why — nega? Why do you learn English? (Nega ingliz tilini o'rganyapsiz?)",
        "Who — kim? Who is your manager? (Rahbaringiz kim?)",
        "How — qanday? How do you work? (Qanday ishlaysiz?)",
      ],
    },
    {
      type: "learn",
      title: "Tuzilish",
      body: "So'roq so'zi gap boshiga chiqadi, keyin do yoki does, keyin ega va fe'l. Be bilan (you are) bo'lsa, u so'roq so'zidan keyin keladi.",
      terminal: ["Where  do  you  work?", "What  does  she  study?", "Where  are  you  from?", "How  old  are  you?"],
    },
    {
      type: "quiz",
      question: "«Qayerda ishlaysiz?» — to'g'ri savol?",
      options: ["Where you work?", "Where do you work?", "Where work you?", "Do where you work?"],
      answerIndex: 1,
      explanation: "Where + do + you + work. So'roq so'zi boshida, do keyin.",
    },
    {
      type: "order",
      title: "Savolni tuzing",
      prompt: "«Qayerda ishlaysiz?» savolini tuzing: so'zlarni to'g'ri tartibda bosing.",
      items: ["Where", "do", "you", "work?"],
    },
    {
      type: "quiz",
      question: "«Yoshingiz nechada?» — bo'sh joy: «How ___ are you?»",
      options: ["old", "young", "many", "much"],
      answerIndex: 0,
      explanation: "How old are you? — yosh so'rash uchun old. Many va much — miqdor uchun.",
    },
    {
      type: "learn",
      title: "Savoldan keyin nima so'rash",
      body: "Ochiq savolga javob olgach, bitta «nega» yoki «qanday» savoli suhbatni davom ettiradi. Bu INTP uchun oddiy: bitta to'g'ri savol — ko'p fikr.",
      points: [
        "What do you read? → Why do you like it?",
        "Where do you travel? → What was your favorite place?",
        "How do you learn programming? → What helps you most?",
      ],
    },
    {
      type: "practice",
      title: "Savol yig'ish",
      instructions: [
        "Yozing: What, Where, When, Why, Who, How bilan bittadan savol. Har biri mavzusi: ish, sayohat, kitob.",
        "Har savolni ovoz chiqarib ayting, keyin o'zingizga javob bering.",
        "Do'stingizga bitta savol berib, javobini tinglang. (Yo'q bo'lsa, savolni yozib qo'ying.)",
      ],
      seconds: 240,
    },
  ],
};

export const numbersTimeLesson: Lesson = {
  id: "english-numbers-time",
  title: "Raqamlar, vaqt va sanalar",
  summary: "Narx, vaqt, yosh va sanalarni ingliz tilida aytish va yozish.",
  estimatedMinutes: 25,
  goals: [
    "13–100 oralig'idagi raqamlarni aytasiz",
    "Soatni half past, quarter past bilan aytasiz",
    "Sanani va yilni to'g'ri o'qiysiz",
  ],
  recap: [
    "13–19 da -teen, 20–90 da -ty: thirteen, twenty, ninety.",
    "half past = 30 daqiqa, quarter past = 15, quarter to = 45 (ya'ni 15 kam).",
    "Yilni ikkiga bo'lib o'qing: 2026 — twenty twenty-six.",
  ],
  steps: [
    {
      type: "learn",
      title: "Raqamlar: teen va ty",
      body: "13 dan 19 gacha -teen qo'shiladi, o'nliklar -ty bilan. 13 — thirteen, 30 — thirty. Bu qoida 13 dan 19 gacha va 20, 30, 40 uchun ishlaydi.",
      points: ["13 thirteen · 15 fifteen · 17 seventeen", "20 twenty · 30 thirty · 40 forty · 90 ninety", "21 twenty-one (tire bilan)"],
    },
    {
      type: "quiz",
      question: "17 ingliz tilida qanday yoziladi?",
      options: ["seventeen", "seventy", "seventen", "sixteen"],
      answerIndex: 0,
      explanation: "17 — seventeen. Seventy — 70. Sixteen — 16.",
    },
    {
      type: "learn",
      title: "Vaqt aytish",
      body: "Soat va daqiqa bir-biridan so'ng aytiladi. 30 daqiqa half past bilan, 15 — quarter past, 45 — quarter to (keyingi soatga qadar 15 daqiqa qolgan).",
      terminal: ["7:00   seven o'clock", "7:30   half past seven", "7:15   quarter past seven", "7:45   quarter to eight"],
    },
    {
      type: "input",
      question: "7:30 ni so'z bilan aytilishini yozing: «half past ___».",
      answers: ["seven"],
      hint: "Soat nomi: seven.",
      explanation: "Half past seven — 7:30.",
      placeholder: "Soat",
    },
    {
      type: "quiz",
      question: "Soat 9:45 qanday aytiladi?",
      options: ["quarter past nine", "quarter to ten", "half past nine", "nine forty-five o'clock only"],
      answerIndex: 1,
      explanation: "9:45 — keyingi soatga (10:00) 15 daqiqa qolgan: quarter to ten. «Quarter to nine» esa 8:45 degani.",
    },
    {
      type: "learn",
      title: "Yil va sana",
      body: "Yil ikki qismga bo'linib o'qiladi. 2026 — twenty twenty-six. Sana uchun tartib tartib raqami bilan: the twenty-eighth of October yoki October 28th.",
      points: ["2026 — twenty twenty-six", "1999 — nineteen ninety-nine", "October 28 — October twenty-eighth"],
    },
    {
      type: "input",
      question: "2026 yilni so'z bilan yozing (chiziqcha bilan).",
      answers: ["twenty twenty-six", "twenty twenty six"],
      hint: "Ikki qismga bo'ling: twenty va twenty-six.",
      explanation: "2026 — twenty twenty-six.",
      placeholder: "Yil",
    },
    {
      type: "practice",
      title: "Narx va vaqt",
      instructions: [
        "Quyidagilarni ovoz chiqarib ayting: 15 dollars, 40 minutes, 21 years old, 2026, 98 points.",
        "Soatni 4 xil ko'rinishda ayting: 6:00, 6:15, 6:30, 6:45.",
        "Bugungi sanani ingliz tilida ayting.",
      ],
      seconds: 150,
    },
  ],
};

export const smallTalkLesson: Lesson = {
  id: "english-small-talk",
  title: "Kichik suhbat: Ask, Answer, Add",
  summary: "Begona odam bilan oddiy suhbatni boshlash, davom ettirish va sukut bo'lganda chiqish uchun uch qadamli formula.",
  estimatedMinutes: 45,
  goals: [
    "Ask-Answer-Add formulasi bilan suhbatni davom ettirasiz",
    "Tushunmaganingizda aniqlash iboralarini ishlatasiz",
    "Sukut paytida o'zingizni yo'qotmasdan javob berasiz",
  ],
  recap: [
    "Ask: savol bering. Answer: javob bering. Add: bitta fakt qo'shing.",
    "Tushunmasangiz: Could you repeat that, please? / Could you speak a little slower?",
    "Sukutda: Let me think for a second. — bu tabiiy va hech kimni xafa qilmaydi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Kichik suhbat nega qiyin",
      body: "Ko'p odamlar kichik suhbatni «bo'sh gap» deb o'ylaydi, shuning uchun uni tayyorlamaydi. Aslida ingliz tilidagi muloqotning katta qismi shu bo'sh gaplardan iborat. INTP uchun bu formula: tayyor tuzilma, suhbat esa noaniq emas.",
    },
    {
      type: "learn",
      title: "Ask-Answer-Add formulasi",
      body: "Har javob uch qismdan iborat. Bu suhbatni davom ettiradi va sizni passiv tinglovchi bo'lishdan saqlaydi.",
      points: [
        "Ask — suhbatdoshga savol: What do you do?",
        "Answer — qisqa javob: I'm a developer.",
        "Add — bitta fakt yoki sabab: I build web apps for a small company.",
      ],
    },
    {
      type: "learn",
      title: "Namuna suhbat",
      body: "Suhbat shu tarzda davom etadi. Har gap yuqoridagi formula bo'yicha.",
      terminal: [
        "A: What do you do?",
        "B: I'm a developer. I build websites.",
        "A: Nice! What kind of websites?",
        "B: Mostly small business sites. And you?",
      ],
    },
    {
      type: "quiz",
      question: "Suhbatdoshingiz «I like reading» dedi. Keyingi eng yaxshi gap qaysi?",
      options: ["Ok.", "Interesting, what kind of books do you read?", "I don't know.", "Bye."],
      answerIndex: 1,
      explanation: "Bu Ask ga o'xshaydi: savol berib, suhbatni davom ettiradi. Ok va Bye — suhbatni tugatadi.",
    },
    {
      type: "order",
      title: "Formula tartibi",
      prompt: "Suhbat qadamlarini to'g'ri tartibda bosing.",
      items: ["Ask: savol bering", "Answer: qisqa javob bering", "Add: bitta fakt qo'shing", "Return: savolni suhbatdoshga qaytaring"],
    },
    {
      type: "learn",
      title: "Tushunmaganingizda",
      body: "Tushunmasangiz, qochib ketish shart emas. Bir necha tayyor ibora bor, ularning hammasi muloyim va tabiiy eshitiladi.",
      points: [
        "Sorry, could you repeat that, please?",
        "Could you speak a little slower, please?",
        "What does «...» mean? (so'zni so'rash uchun)",
        "How do you say «...» in English? (inglizcha aytish uchun)",
      ],
    },
    {
      type: "quiz",
      question: "Gapni tushunmadingiz. Qaysi javob eng to'g'ri?",
      options: ["What?!", "Could you repeat that, please?", "I know.", "Hello again."],
      answerIndex: 1,
      explanation: "Could you repeat that, please? — muloyim va aniq. «What?!» esa noqulay eshitiladi.",
    },
    {
      type: "learn",
      title: "Sukut bo'lganda",
      body: "Javob o'ylash kerak bo'lsa, sukut normal. Uni to'ldirish shart emas — bitta tayyor ibora yetarli.",
      points: ["Let me think for a second.", "That's a good question. (vaqt sotib olish uchun)", "Hmm, I'm not sure, but I think ..."],
    },
    {
      type: "practice",
      title: "5 daqiqalik monolog",
      instructions: [
        "Bugungi kun haqida 5 daqiqa ovoz chiqarib gapiring: nima qildingiz, nimani o'rgandingiz, ertaga nima rejalashtiryapsiz.",
        "Har gapingizdan keyin bitta «Add» qo'shing: sabab yoki misol.",
        "Telefonga yozib oling va birinchi bo'lagini tinglab, qayerda to'xtab qolganingizni belgilang.",
      ],
      seconds: 300,
    },
  ],
};

export const beginnerExam: Lesson = {
  id: "english-beginner-exam",
  title: "Boshlang'ich bosqich imtihoni",
  summary: "Bosqich yakuni: 25 ta aralash savol. Gap tuzilishi, to be, artikllar, Present Simple, savollar, raqamlar va suhbat. O'tish uchun kamida 70%.",
  estimatedMinutes: 40,
  goals: [
    "Bosqichdagi grammatika va suhbat qoidalarini aralash savollarda tekshirasiz",
    "Qaysi mavzu zaif ekanini aniqlaysiz",
    "Keyingi bosqichga o'tish uchun tayyorligingizni baholaysiz",
  ],
  recap: [
    "70% dan past bo'lsa, ko'rsatilgan mavzuni qayta o'qing va qayta topshiring.",
    "Imtihon oldidan har kuni tanishuv skriptini ovoz chiqarib ayting.",
    "Imtihondan o'tish — o'rta-boshlang'ich bosqichga tayyorlik belgisi.",
  ],
  steps: [
    {
      type: "learn",
      title: "Imtihon qoidalari",
      body: "Savollar tasodifiy tartibda chiqadi. Har savolga bitta urinish bor. Natija oxirida mavzu bo'yicha ko'rsatiladi.",
    },
    {
      type: "exam",
      title: "Boshlang'ich bosqich yakuniy imtihoni",
      intro: "Savollar to be, artikllar, Present Simple, savollar, raqamlar, tovushlar va kichik suhbatni qamrab oladi.",
      passPercent: 70,
      questions: [
        { question: "She ___ a doctor.", options: ["am", "is", "are", "be"], answerIndex: 1, explanation: "She bilan is.", topic: "To be" },
        { question: "We ___ from Uzbekistan.", options: ["am", "is", "are", "be"], answerIndex: 2, explanation: "We bilan are.", topic: "To be" },
        { question: "I ___ a developer.", options: ["am", "is", "are", "be"], answerIndex: 0, explanation: "I bilan am.", topic: "To be" },
        { question: "This is ___ apple.", options: ["a", "an", "the", "—"], answerIndex: 1, explanation: "Apple unli tovush bilan boshlanadi: an apple.", topic: "Artikllar" },
        { question: "___ sun is hot today.", options: ["A", "An", "The", "—"], answerIndex: 2, explanation: "Yagona narsa (quyosh) oldida the.", topic: "Artikllar" },
        { question: "He ___ books every night.", options: ["read", "reads", "reading", "is read"], answerIndex: 1, explanation: "He bilan -s: reads.", topic: "Present Simple" },
        { question: "They ___ English at school.", options: ["study", "studies", "studying", "are study"], answerIndex: 0, explanation: "They bilan fe'l o'zgarmaydi: study.", topic: "Present Simple" },
        { question: "She ___ work on Monday.", options: ["does not", "do not", "is not", "not"], answerIndex: 0, explanation: "She bilan does not, keyin fe'l oddiy shaklda: does not work.", topic: "Present Simple" },
        { question: "___ you like coffee?", options: ["Are", "Do", "Does", "Is"], answerIndex: 1, explanation: "You bilan do.", topic: "Savollar" },
        { question: "___ does she live?", options: ["Where", "What", "Who", "Why"], answerIndex: 0, explanation: "Qayerda yashaydi? — Where does she live?", topic: "Savollar" },
        { question: "How ___ brothers do you have?", options: ["many", "much", "old", "long"], answerIndex: 0, explanation: "Sanaladigan narsa (brothers) uchun many.", topic: "Savollar" },
        { question: "What is the plural of «child»?", options: ["childs", "childes", "children", "childrens"], answerIndex: 2, explanation: "child → children — istisno.", topic: "Ko'plik" },
        { question: "Qaysi gap to'g'ri?", options: ["I has a laptop.", "I have a laptop.", "I am have a laptop.", "I haves a laptop."], answerIndex: 1, explanation: "I bilan have.", topic: "Have" },
        { question: "Soat 7:30 qanday aytiladi?", options: ["quarter past seven", "half past seven", "quarter to seven", "seven thirty six"], answerIndex: 1, explanation: "30 daqiqa — half past.", topic: "Vaqt" },
        { question: "Qaysi so'z th tovushi bilan boshlanadi (tilni tishlar orasida)?", options: ["tree", "think", "time", "tea"], answerIndex: 1, explanation: "think — th. Qolganlari t bilan boshlanadi.", topic: "Tovushlar" },
        { question: "Suhbatdoshingiz «Nice to meet you» dedi. Javob?", options: ["Nice to meet you too.", "Yes, I am.", "Bye!", "Fine, thanks you."], answerIndex: 0, explanation: "Tanishganda tabiiy javob.", topic: "Tanishuv" },
        { question: "«Siz qayerda ishlaysiz?» — to'g'ri savol?", options: ["Where you work?", "Where do you work?", "Where work you?", "Do where you work?"], answerIndex: 1, explanation: "Where + do + you + work?", topic: "Savollar" },
        { question: "Suhbatda javob o'ylash uchun qaysi ibora?", options: ["Let me think for a second.", "Shut up.", "Hmm, what?", "Whatever."], answerIndex: 0, explanation: "Muloyim va tabiiy.", topic: "Suhbat" },
        { question: "Suhbatdoshingiz «I like reading» dedi. Keyingi savol?", options: ["What do you read lately?", "Me too.", "Okay.", "Bye."], answerIndex: 0, explanation: "Ask qismi: savol berib davom ettirish.", topic: "Suhbat" },
        { question: "«I ___ at an IT company.» — ishlayman (fe'l)", options: ["work", "works", "working", "am work"], answerIndex: 0, explanation: "I bilan fe'lning oddiy shakli.", topic: "Present Simple" },
        { question: "«Does she ___ coffee?» — bo'sh joyga qaysi fe'l?", options: ["drink", "drinks", "drinking", "drank"], answerIndex: 0, explanation: "Does bilan fe'l oddiy shaklda.", topic: "Present Simple" },
        { question: "«They ___ TV in the evening.» (watch) — inkor shakl?", options: ["don't watch", "doesn't watch", "isn't watch", "not watches"], answerIndex: 0, explanation: "They bilan don't watch.", topic: "Present Simple" },
        { question: "«The» qachon ishlatiladi?", options: ["Har qanday ot oldida", "Aniq yoki hammaga ma'lum narsa oldida", "Faqat ko'plikda", "Faqat fe'l oldida"], answerIndex: 1, explanation: "the — aniq narsa uchun.", topic: "Artikllar" },
        { question: "21 ingliz tilida qanday yoziladi?", options: ["twenty-one", "twelve-one", "twenty-ten", "twenty-two"], answerIndex: 0, explanation: "21 — twenty-one (tire bilan).", topic: "Raqamlar" },
        { question: "Bo'sh joy: «Where ___ you from?» (be)", options: ["am", "is", "are", "be"], answerIndex: 2, explanation: "You bilan are.", topic: "To be" },
      ],
    },
    {
      type: "practice",
      title: "Natija bo'yicha reja",
      instructions: [
        "Zaif mavzu bo'yicha darsni qayta o'qing va ovoz chiqarib mashq qiling.",
        "Tanishuv skriptini har kuni ayting, va bir hafta ichida imtihonni qayta topshiring.",
        "Maqsad: 85% dan yuqori natija, keyingi bosqichga o'tishdan oldin.",
      ],
    },
  ],
};
