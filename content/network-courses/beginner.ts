import type { CourseLevel } from "./types";

export const beginnerLevel: CourseLevel = {
  id: "beginner",
  order: 1,
  title: "Boshlang'ich bosqich",
  description:
    "Tarmoq qanday ishlashini noldan tushunasiz: manzillar, qatlamlar, switch, router va asosiy protokollar. Har dars kompyuterda bajariladigan amaliy mashq bilan tugaydi.",
  outcome:
    "Bosqich oxirida siz uy yoki kichik ofis tarmog'ida «internet ishlamayapti» muammosini ketma-ket tekshirib, sababni topa olasiz.",
  lessons: [
    {
      id: "net-basics",
      title: "Tarmoq nima va qurilmalar kim",
      summary: "Host, switch, router, paket va protokol tushunchalari. O'z kompyuteringiz tarmoq sozlamalarini topasiz.",
      estimatedMinutes: 30,
      theory: [
        "Kompyuter tarmog'i — ikki yoki undan ortiq qurilmaning ma'lumot almashishi uchun o'zaro bog'langan tizimi. Ma'lumot tarmoqda bir butun holda emas, paket (packet) deb ataluvchi kichik bo'laklarga bo'lingan holda yuboriladi.",
        "Tarmoqdagi oddiy qurilma (kompyuter, telefon, server, printer) host deyiladi. Switch bir tarmoq ichidagi hostlarni bir-biriga ulaydi. Router esa turli tarmoqlarni (masalan, uyingiz tarmog'i va internetni) bir-biriga bog'laydi.",
        "Protokol — qurilmalar o'zaro kelishgan qoidalar to'plami. Ikki qurilma bir xil protokolda «gaplashsa», ular ishlab chiqaruvchisidan qat'i nazar bir-birini tushunadi. Mana shu sababli Cisco, MikroTik va TP-Link qurilmalari bir tarmoqda ishlay oladi.",
        "Tarmoq o'lchamiga qarab nomlanadi: LAN (bitta bino yoki xona), WAN (shaharlar va mamlakatlar o'rtasida), internet esa dunyodagi minglab tarmoqlarning birikmasi.",
      ],
      labs: [
        {
          title: "O'z kompyuteringizning tarmoq kartasini toping",
          steps: [
            "Terminal oching: Windows'da «Win + R» bosib cmd yozing, Linux/macOS'da Terminal'ni oching.",
            "Quyidagi buyruqni qo'lda yozing (nusxa ko'chirmang).",
            "Natijadan IPv4 manzilingiz, subnet mask va default gateway qiymatlarini daftarga yozib oling.",
          ],
          commands: ["ipconfig /all   (Windows)", "ip a   (Linux)", "ifconfig   (macOS)"],
          expected: "Sizning IPv4 manzilingiz (odatda 192.168.x.x yoki 10.x.x.x), subnet mask va gateway manzili ko'rinadi.",
        },
        {
          title: "Tarmoq steki ishlayotganini tekshiring",
          steps: ["Kompyuteringiz o'zini o'zi «chaqirib» ko'ring.", "Natijada yo'qotilgan paketlar 0% ekanini tasdiqlang."],
          commands: ["ping 127.0.0.1"],
          expected: "«Reply from 127.0.0.1» qatorlari va 0% loss. Bu manzil loopback deyiladi, u tarmoq kartasi emas, kompyuterdagi tarmoq dasturiy qismini tekshiradi.",
        },
      ],
      drills: [
        "ipconfig /all yoki ip a buyrug'ini ekranga qaramasdan 10 marta yozing. Maqsad: barmoqlar buyruqni o'zi eslab qolishi.",
        "Daftarga uyingiz tarmog'ini qo'lda chizing: telefon, noutbuk, Wi-Fi router va internet. Har bir qurilma yoniga uning IP manzilini yozing.",
      ],
      checks: [
        {
          question: "Qaysi qurilma turli tarmoqlarni (masalan, uy tarmog'i va internetni) bog'laydi?",
          options: ["Switch", "Router", "Printer", "Kabel"],
          answerIndex: 1,
          explanation: "Router tarmoqlar o'rtasida paketlarni yo'naltiradi. Switch esa bitta tarmoq ichidagi hostlarni ulaydi.",
        },
        {
          question: "127.0.0.1 manzili nimani tekshiradi?",
          options: ["Internet tezligini", "Router ishlashini", "Kompyuterdagi tarmoq stekini", "DNS serverni"],
          answerIndex: 2,
          explanation: "127.0.0.1 — loopback. Paket kompyuterdan chiqmaydi, shu sababli u faqat lokal tarmoq stekining sog'lig'ini ko'rsatadi.",
        },
      ],
    },
    {
      id: "osi-tcpip",
      title: "OSI va TCP/IP modellari",
      summary: "Tarmoqni 7 va 4 qatlamga bo'lib o'ylash. Muammoni qaysi qatlamda qidirishni o'rganasiz.",
      estimatedMinutes: 40,
      theory: [
        "OSI modeli tarmoq jarayonini 7 qatlamga ajratadi. Pastdan yuqoriga: 1) Physical — kabel, signal; 2) Data Link — MAC manzil, switch; 3) Network — IP manzil, router; 4) Transport — TCP/UDP, port; 5) Session — seans boshqaruvi; 6) Presentation — shifrlash, format; 7) Application — brauzer, pochta kabi dasturlar protokollari.",
        "Amalda ko'proq TCP/IP modeli ishlatiladi. U 4 qatlamdan iborat: Application (OSI 5–7), Transport (4), Internet (3) va Network Access (1–2). Internet qatlamida IP, Transport qatlamida TCP va UDP ishlaydi.",
        "Ma'lumot yuborilganda har qatlam o'z sarlavhasini (header) qo'shadi. Bu jarayon encapsulation deyiladi: ma'lumot → segment (Transport) → paket (Network) → kadr (Data Link) → bitlar (Physical). Qabul qiluvchi tomonda teskari jarayon bo'ladi.",
        "Modelning asosiy foydasi diagnostikada: «Sayt ochilmayapti» muammosini kabeldan (1-qatlam) boshlab, DNS yoki brauzergacha (7-qatlam) ketma-ket tekshirish mumkin.",
      ],
      labs: [
        {
          title: "Qatlamlarni qog'ozda ajrating",
          steps: [
            "Ushbu amallarni qaysi OSI qatlamiga tegishli ekanini yozing: kabel uzilishi; MAC manzil bo'yicha kadr yuborish; IP bo'yicha marshrutlash; TCP orqali ulanish o'rnatish; brauzerda HTTPS ochish.",
            "Javoblaringizni tekshiring: 1, 2, 3, 4, 7.",
          ],
          expected: "Besh amal uchun to'g'ri qatlam raqamlari: 1, 2, 3, 4, 7.",
        },
        {
          title: "Paketni ushlab ko'ring (ixtiyoriy)",
          steps: [
            "wireshark.org saytidan Wireshark o'rnating va tarmoq interfeysingizni tanlab yozuvni boshlang.",
            "Boshqa oynada ping 8.8.8.8 ni ishga tushiring, Wireshark'da filtrga icmp yozing.",
            "Birinchi paketni oching va Ethernet (2-qatlam), Internet Protocol (3-qatlam), ICMP bo'limlarini toping.",
          ],
          expected: "Bitta ping paketida bir nechta qatlam sarlavhalari ketma-ket joylashganini ko'rasiz.",
        },
      ],
      drills: [
        "7 qatlamni pastdan yuqoriga 5 marta baland ovozda ayting, so'ng yuqoridan pastga. Yodlash uchun inglizcha ibora: «Please Do Not Throw Sausage Pizza Away» (Physical, Data Link, Network, Transport, Session, Presentation, Application).",
        "Bo'sh qog'ozga 7 qatlam jadvalini yodingizdan chizing va har qatlam yoniga bittadan misol (kabel, switch, router, TCP, ...) yozing.",
      ],
      checks: [
        {
          question: "Router OSI modelining qaysi qatlamida ishlaydi?",
          options: ["1-qatlam (Physical)", "2-qatlam (Data Link)", "3-qatlam (Network)", "7-qatlam (Application)"],
          answerIndex: 2,
          explanation: "Router IP manzillar bo'yicha qaror qabul qiladi, IP esa Network (3) qatlamiga tegishli.",
        },
        {
          question: "Ma'lumot yuborilganda har qatlam o'z sarlavhasini qo'shishi nima deb ataladi?",
          options: ["Decapsulation", "Encapsulation", "Routing", "Fragmentation"],
          answerIndex: 1,
          explanation: "Encapsulation — yuboruvchi tomonda sarlavha qo'shish. Qabul qiluvchi tomonda teskari jarayon decapsulation deyiladi.",
        },
      ],
    },
    {
      id: "ipv4-binary",
      title: "IPv4 manzil va ikkilik sanoq",
      summary: "IP manzil tuzilishi, ikkilik (binary) o'tkazish va barmoq bilan sanash mashqi.",
      estimatedMinutes: 40,
      theory: [
        "IPv4 manzil 32 bitdan iborat va to'rtta 8 bitli qismga (oktet) bo'linadi: masalan, 192.168.1.10. Har oktet 0 dan 255 gacha qiymat oladi, chunki 8 bit 2^8 = 256 xil qiymat beradi.",
        "Kompyuter manzilni ikkilik ko'rinishda ko'radi. Oktetdagi bitlarning og'irligi chapdan o'ngga: 128, 64, 32, 16, 8, 4, 2, 1. Sonni ikkilikka o'tkazish uchun har og'irlikni qo'shish yoki qo'shmaslikni hal qilasiz. Masalan, 168 = 128 + 32 + 8, ya'ni 10101000.",
        "Maxsus (private) diapazonlar internetda marshrutlanmaydi va uy hamda ofis tarmoqlarida ishlatiladi: 10.0.0.0/8, 172.16.0.0/12 va 192.168.0.0/16. Router bu manzillarni NAT orqali bitta ommaviy (public) manzilga aylantiradi.",
        "Boshqa muhim manzillar: 127.0.0.0/8 — loopback; 169.254.0.0/16 — APIPA (DHCP topilmaganda kompyuter o'ziga bergan manzil). Agar kompyuteringiz 169.254.x.x ko'rsatsa, DHCP server bilan muammo bor.",
      ],
      labs: [
        {
          title: "192.168.1.10 ni ikkilikka o'tkazing",
          steps: [
            "Har oktet uchun 128-64-32-16-8-4-2-1 jadvalini chizing.",
            "Har oktetni alohida hisoblang va natijani nuqta bilan ajratib yozing.",
            "Kompyuteringizdagi kalkulyatorni «Programmer» rejimida yoqib, javobingizni tekshiring.",
          ],
          expected: "192.168.1.10 = 11000000.10101000.00000001.00001010",
        },
        {
          title: "O'z IP manzilingizni ikkilikka o'tkazing",
          steps: ["1-darsda yozib olgan IPv4 manzilingizni oling.", "Har oktetini ikkilikka o'tkazing va kalkulyatorda tekshiring."],
          expected: "Barcha to'rt oktet uchun qo'lda hisoblangan natija kalkulyator bilan mos keladi.",
        },
      ],
      drills: [
        "Barmoq bilan sanash: o'ng qo'l 5 barmog'i — 5 bit. Ko'tarilgan barmoq = 1, tushirilgani = 0. 0 dan 31 gacha barmoq bilan ikkilikda sanang.",
        "2 daqiqa ichida 10 ta tasodifiy sonni (0–255) ikkilikka o'tkazing. Har kuni vaqtni qisqartirishga harakat qiling.",
      ],
      checks: [
        {
          question: "IPv4 manzil necha bitdan iborat?",
          options: ["16", "32", "48", "128"],
          answerIndex: 1,
          explanation: "IPv4 — 32 bit (4 oktet × 8 bit). 128 bit IPv6'ga, 48 bit esa MAC manzilga tegishli.",
        },
        {
          question: "Quyidagilardan qaysi biri private IPv4 manzil?",
          options: ["172.32.0.5", "192.169.1.1", "10.20.30.40", "8.8.8.8"],
          answerIndex: 2,
          explanation: "10.0.0.0/8 private diapazon. 172.32.x.x private emas (private diapazon 172.16–172.31), 192.169.x.x ham private emas.",
        },
      ],
    },
    {
      id: "subnet-cidr",
      title: "Subnet mask va CIDR",
      summary: "Manzilning tarmoq va host qismini ajratish, /24, /26, /30 hisoblari.",
      estimatedMinutes: 50,
      theory: [
        "Subnet mask IP manzilning qaysi qismi tarmoqni, qaysi qismi hostni bildirishini aytadi. Maskada 1 lar tarmoq qismi, 0 lar host qismi. 255.255.255.0 ikkilikda 24 ta 1 va 8 ta 0 bo'lgani uchun uni /24 deb yozamiz (CIDR belgilash).",
        "Har subnetda ikkita maxsus manzil bor: birinchisi — tarmoq manzili (network address), oxirgisi — broadcast. Ular hostga berilmaydi. Hostlar soni = 2^(32 − prefiks) − 2. Masalan, /24 da 2^8 − 2 = 254 host, /30 da 2^2 − 2 = 2 host.",
        "Misol: 192.168.10.0/24. Tarmoq manzili 192.168.10.0, broadcast 192.168.10.255, hostlar 192.168.10.1 dan .254 gacha.",
        "Subnetlash: /24 ni 4 ga bo'lsak /26 olamiz (mask 255.255.255.192, blok o'lchami 64). Subnetlar: .0, .64, .128, .192. Har birida 62 ta host. Blok o'lchami = 256 − mask'ning oxirgi oktet qiymati.",
      ],
      labs: [
        {
          title: "172.16.5.130/26 manzilini tahlil qiling",
          steps: [
            "Mask: /26 = 255.255.255.192, blok o'lchami 64. Oxirgi oktetda 130 qaysi blokka tushishini aniqlang (128–191).",
            "Tarmoq manzili, broadcast, birinchi va oxirgi host hamda hostlar sonini yozing.",
          ],
          expected: "Tarmoq 172.16.5.128, broadcast 172.16.5.191, hostlar 172.16.5.129–172.16.5.190, jami 62 ta host.",
        },
        {
          title: "Uy tarmog'ingizni tahlil qiling",
          steps: [
            "1-darsdagi IP va subnet mask'ingizni oling.",
            "Mask'ni prefiksga (/24 kabi) aylantiring, tarmoq va broadcast manzilini hisoblang, kalkulyatordagi natijangiz bilan solishtiring.",
          ],
          expected: "Uy tarmog'ingiz uchun tarmoq manzili, broadcast va hostlar soni qo'lda to'g'ri hisoblangan.",
        },
      ],
      drills: [
        "Jadvalni yodlang: 2^1 = 2, 2^2 = 4, 2^3 = 8, 2^4 = 16, 2^5 = 32, 2^6 = 64, 2^7 = 128, 2^8 = 256. Qog'ozga 1 daqiqada yozing.",
        "/24 dan /30 gacha prefikslar uchun mask va hostlar sonini yodingizdan jadvalga yozing. Har kuni 3 marta takrorlang.",
      ],
      checks: [
        {
          question: "192.168.1.0/27 subnetida nechta host manzili bor?",
          options: ["14", "30", "32", "62"],
          answerIndex: 1,
          explanation: "/27 da host bitlari 5 ta: 2^5 − 2 = 30.",
        },
        {
          question: "255.255.255.192 maskasi qaysi prefiksga to'g'ri keladi?",
          options: ["/24", "/25", "/26", "/27"],
          answerIndex: 2,
          explanation: "192 = 11000000, ya'ni oxirgi oktetda 2 ta bit tarmoqqa tegishli: 24 + 2 = /26.",
        },
      ],
    },
    {
      id: "mac-arp",
      title: "MAC manzil, Ethernet va ARP",
      summary: "Bir tarmoq ichida qurilmalar bir-birini qanday topadi. ARP jadvalini o'z ko'zingiz bilan ko'rasiz.",
      estimatedMinutes: 35,
      theory: [
        "MAC manzil — tarmoq kartasining 48 bitli jismoniy manzili, 6 juft o'n oltilik raqam bilan yoziladi: masalan, 00:1A:2B:3C:4D:5E. U asosan bitta tarmoq (LAN) ichida kadrlarni yetkazish uchun ishlatiladi.",
        "FF:FF:FF:FF:FF:FF — broadcast MAC manzili: kadr tarmoqdagi barcha hostlarga yuboriladi. Standart Ethernet kadrida foydali yuk uchun maksimal o'lcham (MTU) 1500 bayt.",
        "Host boshqa hostga paket yubormoqchi bo'lsa, uning IP manzili ma'lum, lekin MAC manzili noma'lum. ARP (Address Resolution Protocol) shuni hal qiladi: «192.168.1.1 kimniki?» degan so'rov broadcast qilinadi, egasi o'z MAC manzili bilan unicast javob beradi.",
        "Javoblar ARP keshida (jadvalida) bir muddat saqlanadi, shuning uchun har paketda so'rov takrorlanmaydi.",
      ],
      labs: [
        {
          title: "ARP jadvalini kuzating",
          steps: [
            "arp -a buyrug'ini bajarib, hozirgi yozuvlarni ko'ring.",
            "Routeringizga ping yuboring (gateway manzilini 1-darsdan oling).",
            "arp -a ni yana bajaring va gateway yozuvini toping.",
          ],
          commands: ["arp -a", "ping <gateway IP>", "arp -a", "ip neigh   (Linux)"],
          expected: "Gateway IP manzili yonida uning MAC manzili paydo bo'ladi (yoki yangilanadi).",
        },
      ],
      drills: [
        "arp -a ni 10 marta qo'lda yozing, so'ng natijada kamida bitta MAC manzilning birinchi 3 juftligini (ishlab chiqaruvchi kodi OUI) o'qib bering.",
        "Qog'ozda ARP so'rovi va javobini chizing: kim, kimga, broadcast yoki unicast ekanini yozing.",
      ],
      checks: [
        {
          question: "ARP so'rovi qanday yuboriladi?",
          options: ["Unicast", "Broadcast", "Multicast faqat routerlarga", "Internet orqali serverga"],
          answerIndex: 1,
          explanation: "So'rov egasi noma'lum bo'lgani uchun FF:FF:FF:FF:FF:FF manziliga, ya'ni broadcast qilinadi. Javob esa unicast.",
        },
        {
          question: "MAC manzil necha bitdan iborat?",
          options: ["32", "48", "64", "128"],
          answerIndex: 1,
          explanation: "MAC manzil 48 bit, ya'ni 6 bayt.",
        },
      ],
    },
    {
      id: "switching",
      title: "Switch va MAC jadvali",
      summary: "Switch kadrlarni qanday yo'naltiradi, flooding va VLAN haqida dastlabki tushuncha. Packet Tracer'da birinchi lab.",
      estimatedMinutes: 50,
      theory: [
        "Switch 2-qatlam qurilmasi. U kelgan kadrning manba MAC manzilini o'qib, qaysi portda qaysi MAC borligini MAC jadvaliga yozadi (learning).",
        "Nishon MAC jadvalda bo'lsa, kadr faqat shu portga uzatiladi (forwarding). Jadvalda bo'lmasa yoki manzil broadcast bo'lsa, kadr kirgan portdan tashqari barcha portlarga yuboriladi (flooding).",
        "Har switch porti alohida collision domain hosil qiladi. Broadcast domain esa odatda butun switch (barcha portlar) hisoblanadi; uni faqat router yoki VLAN ajratadi.",
        "VLAN — bitta fizik switchni mantiqiy tarmoqlarga bo'lish usuli. Masalan, bir switchda buxgalteriya va mehmonlar uchun alohida VLAN yaratib, ularni bir-biridan ajratish mumkin. Chuqur o'rganish 2-bosqichda.",
      ],
      labs: [
        {
          title: "Packet Tracer'da birinchi tarmoq",
          steps: [
            "Cisco NetAcad saytidan bepul Packet Tracer'ni o'rnating (ro'yxatdan o'tish talab qilinishi mumkin).",
            "2 ta PC va 1 ta Switch qo'ying, ularni Copper Straight-Through kabel bilan ulang.",
            "PC0 ga 192.168.1.10/24, PC1 ga 192.168.1.11/24 bering (Desktop → IP Configuration).",
            "PC0 dagi Command Prompt'da ping 192.168.1.11 ni bajaring.",
            "Switch CLI'ga o'ting va MAC jadvalini ko'ring.",
          ],
          commands: ["enable", "show mac address-table"],
          expected: "Ping muvaffaqiyatli, switch MAC jadvalida ikkala PC ning MAC manzillari va ularning portlari ko'rinadi.",
        },
      ],
      drills: [
        "Qog'ozda 4 portli switch va 4 PC ni chizing. Har bir kadr uchun MAC jadvalini qo'lda to'ldirib boring: A→B, B→A, C→A, A→broadcast.",
        "enable va show mac address-table buyruqlarini Packet Tracer CLI'da ekranga qaramay 10 marta yozing.",
      ],
      checks: [
        {
          question: "Switch nishon MAC manzilni jadvalidan topa olmasa nima qiladi?",
          options: ["Kadrni tashlab yuboradi", "Barcha portlarga (kirishdan tashqari) yuboradi", "Routerga yuboradi", "Faqat birinchi portga yuboradi"],
          answerIndex: 1,
          explanation: "Noma'lum unicast kadr flooding qilinadi. Javob qaytganda switch yangi MAC'ni o'rganadi.",
        },
        {
          question: "Switch MAC jadvalini qanday to'ldiradi?",
          options: ["Nishon MAC'dan", "Manba MAC'dan", "IP manzildan", "DHCP serverdan"],
          answerIndex: 1,
          explanation: "Switch har kelgan kadrning manba MAC manzilini va u kelgan portni yozib oladi.",
        },
      ],
    },
    {
      id: "routing-basics",
      title: "Router, gateway va marshrutlash",
      summary: "Paket boshqa tarmoqqa qanday chiqadi. Marshrut jadvalini o'qishni o'rganasiz.",
      estimatedMinutes: 45,
      theory: [
        "Host paketni avval nishon IP o'z subnetida ekanini tekshiradi. Subnetida bo'lsa to'g'ridan-to'g'ri yuboradi (ARP orqali). Bo'lmasa paket default gateway ga, ya'ni routerga beriladi. Gateway manzili hostning o'z subnetida bo'lishi shart.",
        "Router har paket uchun marshrut jadvalini (routing table) ko'radi va nishon tarmoqqa eng aniq mos (eng uzun prefiks — longest prefix match) yozuvni tanlaydi. Mos yozuv bo'lmasa, default route (0.0.0.0/0) ishlatiladi.",
        "Marshrut turlari: connected (routerning o'z interfeyslari tarmog'i), static (qo'lda kiritilgan) va dynamic (OSPF, BGP kabi protokollar orqali o'rganilgan). Dynamic marshrutlash 2-bosqichda.",
        "Uy routeringiz NAT ham bajaradi: ichki private manzillarni bitta ommaviy manzilga almashtiradi.",
      ],
      labs: [
        {
          title: "Kompyuteringizning marshrut jadvalini o'qing",
          steps: [
            "Marshrut jadvalini chiqaring.",
            "0.0.0.0 (default route) qatorini toping va gateway manzilini 1-darsdagi qiymat bilan solishtiring.",
          ],
          commands: ["route print   (Windows)", "ip route   (Linux)", "netstat -rn   (macOS)"],
          expected: "Default route (0.0.0.0/0 yoki «default via ...») routeringiz IP manziliga ishora qiladi.",
        },
        {
          title: "Packet Tracer: ikki tarmoq va bitta router",
          steps: [
            "Ikki switch, ikkita PC va bitta Router qo'ying. PC'larni 192.168.1.0/24 va 192.168.2.0/24 tarmoqlarga joylashtiring.",
            "Router interfeyslariga 192.168.1.1 va 192.168.2.1 bering va portlarni yoqing (no shutdown).",
            "Har PC'da default gateway ni mos router interfeysiga sozlang.",
            "PC'lar orasida ping qiling va routerda show ip route ni ko'ring.",
          ],
          commands: ["enable", "configure terminal", "interface gigabitEthernet 0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown", "end", "show ip route"],
          expected: "Ikki tarmoq o'rtasida ping ishlaydi, jadvalda ikkala tarmoq «C» (connected) sifatida ko'rinadi. Ikkinchi interfeysni ham xuddi shunday sozlang.",
        },
      ],
      drills: [
        "route print yoki ip route buyrug'ini 10 marta yozing. Har safar default route qatorini darhol toping.",
        "Ichingizda takrorlang: «Nishon o'z subnetimda emas → gateway'ga yuboraman». Qog'ozda 3 ta misolni (o'z subnet / boshqa subnet) hal qiling.",
      ],
      checks: [
        {
          question: "Host nishon IP o'z subnetida emasligini aniqlasa, paketni kimga beradi?",
          options: ["Switchga", "Default gateway'ga", "DNS serverga", "Barcha hostlarga"],
          answerIndex: 1,
          explanation: "Boshqa tarmoqqa yo'l routerdan o'tadi, shuning uchun paket default gateway'ga uzatiladi.",
        },
        {
          question: "Default route qanday yoziladi?",
          options: ["127.0.0.1/8", "0.0.0.0/0", "255.255.255.255/32", "192.168.0.0/16"],
          answerIndex: 1,
          explanation: "0.0.0.0/0 barcha manzillarga mos keladi, shuning uchun u eng kam aniq va faqat boshqa yozuv topilmaganda ishlatiladi.",
        },
      ],
    },
    {
      id: "dns-dhcp-ports",
      title: "DNS, DHCP, TCP/UDP va portlar",
      summary: "Kompyuter manzilni qanday oladi, nomni qanday topadi va ilovalar qanday ajratiladi.",
      estimatedMinutes: 50,
      theory: [
        "DHCP hostlarga avtomatik IP, mask, gateway va DNS beradi. Jarayon DORA: Discover (host broadcast qiladi), Offer (server taklif qiladi), Request (host tanlaydi), Acknowledge (server tasdiqlaydi). DHCP UDP 67 (server) va 68 (klient) portlaridan foydalanadi.",
        "DNS domen nomlarini IP manzilga aylantiradi (masalan, example.com → IP). Odatda UDP 53 port ishlatiladi. Asosiy yozuv turlari: A (IPv4), AAAA (IPv6), CNAME (laqab), MX (pochta).",
        "Port raqami (0–65535) kompyuterdagi qaysi dasturga murojaat qilinayotganini ajratadi. TCP ulanishni oldindan o'rnatadi (three-way handshake: SYN, SYN-ACK, ACK) va ishonchli yetkazadi. UDP ulanishsiz, tezroq, ammo yetkazib berishni kafolatlamaydi (DNS, video qo'ng'iroq).",
        "Muhim portlar: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS. Telnet parolni ochiq matnda yuboradi, shuning uchun uning o'rniga SSH ishlatiladi.",
      ],
      labs: [
        {
          title: "DNS so'rovini ko'ring",
          steps: ["Domen nomini IP manzilga o'giring.", "Qaysi DNS server javob berganini yozib oling."],
          commands: ["nslookup example.com", "dig example.com   (Linux/macOS)"],
          expected: "Domen uchun bir yoki bir nechta IP manzil va javob bergan DNS server manzili ko'rinadi.",
        },
        {
          title: "HTTP javobini qo'lda oling",
          steps: ["Terminalda saytning sarlavhalarini so'rang.", "Birinchi qatordan status kodini toping (200, 301, 404 ...)."],
          commands: ["curl -I https://example.com"],
          expected: "«HTTP/... 200» kabi status qatori va server sarlavhalari ko'rinadi.",
        },
        {
          title: "DHCP ijarasini yangilang",
          steps: ["Eski ijarani qaytarib, yangisini so'rang va IP o'zgarganini yoki saqlanganini kuzating."],
          commands: ["ipconfig /release", "ipconfig /renew   (Windows)", "sudo dhclient -r && sudo dhclient   (Linux, interfeysga qarab)"],
          expected: "Kompyuter DHCP orqali yana IP, mask va gateway oladi. Eslatma: Wi-Fi orqali ishlayotgan bo'lsangiz, ulanish bir necha soniyaga uzilishi mumkin.",
        },
      ],
      drills: [
        "Port jadvalini qog'ozga yodingizdan yozing: 22, 23, 25, 53, 80, 110, 143, 443 va ularning protokollari. Har kuni 3 marta, har gal vaqtni o'lchang.",
        "DORA ni 4 ta varaqda chizing (Discover, Offer, Request, Acknowledge) va tartibda terib chiqing.",
      ],
      checks: [
        {
          question: "DHCP jarayonining to'g'ri tartibi qaysi?",
          options: ["Offer, Discover, Request, Acknowledge", "Discover, Offer, Request, Acknowledge", "Request, Offer, Discover, Acknowledge", "Discover, Request, Offer, Acknowledge"],
          answerIndex: 1,
          explanation: "DORA: Discover → Offer → Request → Acknowledge.",
        },
        {
          question: "HTTPS standart portini ko'rsating.",
          options: ["80", "22", "443", "53"],
          answerIndex: 2,
          explanation: "HTTPS — 443. HTTP 80, SSH 22, DNS 53 portidan foydalanadi.",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Muammoni topish: ping, tracert va ketma-ket diagnostika",
      summary: "Bosqich yakuni: «internet ishlamayapti» muammosini tizimli usulda tahlil qilish.",
      estimatedMinutes: 60,
      theory: [
        "Diagnostika uchun ikki asosiy yondashuv bor: bottom-up (1-qatlamdan boshlab yuqoriga) va top-down (ilovadan pastga). Boshlang'ich bosqichda bottom-up eng ishonchli: avval kabel va Wi-Fi, keyin IP, so'ng marshrutlash va nom aniqlanishi.",
        "Ketma-ketlik: 1) Ulanish bor-yo'qligi (kabel, Wi-Fi); 2) IP sozlamalari to'g'ri-yo'qligi (ipconfig /all); 3) ping 127.0.0.1; 4) ping gateway; 5) ping 8.8.8.8 (nom ishlatmasdan internet bormi); 6) ping example.com (DNS ishlayaptimi).",
        "Natija qaysi qadamda uzilsa, muammo shu qatlamda. Masalan, 8.8.8.8 ga ping ishlaydi, lekin example.com ga ishlamasa — muammo DNS'da.",
        "traceroute (Windows'da tracert) paketning yo'lini ko'rsatadi: har qadam bitta router. U TTL maydonidan foydalanadi. Ba'zi routerlar ICMP'ni bloklagani uchun «* * *» ko'rinishi mumkin va bu har doim xato degani emas.",
      ],
      labs: [
        {
          title: "To'liq diagnostika ketma-ketligi",
          steps: [
            "Quyidagi buyruqlarni tartib bilan bajaring va har birining natijasini daftarga yozing.",
            "Qaysi qadam muvaffaqiyatsiz bo'lganini va nimani anglatishini yozing (hammasi ishlasa ham jarayonni oxirigacha bajaring).",
          ],
          commands: ["ipconfig /all", "ping 127.0.0.1", "ping <gateway IP>", "ping 8.8.8.8", "ping example.com", "tracert example.com   (Linux: traceroute example.com)"],
          expected: "Barcha 6 qadam natijasi daftarda yozilgan. Hammasi ishlasa, har qadamda aynan nima tasdiqlangani yozilgan.",
        },
        {
          title: "Muammoni sun'iy ravishda keltiring",
          steps: [
            "Packet Tracer'da oldingi darsdagi router laboratoriyasini oching.",
            "Biror PC'dagi default gateway'ni xato kiriting va ping qiling.",
            "Qaysi qadamda uzilishini ko'ring, so'ng tuzating.",
          ],
          expected: "Xato gateway bilan o'z subnetga ping ishlaydi, lekin boshqa tarmoqqa ishlamaydi. To'g'ri gateway kiritilgach, aloqa tiklanadi.",
        },
      ],
      drills: [
        "6 qadamli diagnostika ketma-ketligini ekranga qaramay 5 marta yozing va ovoz chiqarib ayting. Vaqtni o'lchang.",
        "Do'stingiz yoki oila a'zosi uchun «ular» muammo yaratsin (Wi-Fi'ni o'chirish, noto'g'ri DNS yozish), siz ketma-ketlik bo'yicha sababini toping.",
      ],
      checks: [
        {
          question: "8.8.8.8 ga ping ishlaydi, lekin example.com ga ishlamaydi. Eng ehtimoliy sabab?",
          options: ["Kabel uzilgan", "DNS muammosi", "Gateway noto'g'ri", "Tarmoq kartasi buzilgan"],
          answerIndex: 1,
          explanation: "IP bo'yicha internet bor (ping ishlayapti), faqat nomni IP'ga aylantirish ishlamayapti — bu DNS muammosi.",
        },
        {
          question: "traceroute paketning yo'lini aniqlash uchun qaysi maydondan foydalanadi?",
          options: ["MAC manzil", "TTL", "Port raqami", "DNS yozuvi"],
          answerIndex: 1,
          explanation: "Har router TTL qiymatini bittaga kamaytiradi. TTL nolga yetganda router xabar qaytaradi va shu bilan yo'l ma'lum bo'ladi.",
        },
      ],
    },
  ],
};
