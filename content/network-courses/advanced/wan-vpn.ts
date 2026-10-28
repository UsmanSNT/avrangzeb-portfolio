import type { Lesson } from "../types";

export const wanVpn: Lesson = {
  id: "wan-vpn",
  title: "WAN, VPN va tunnellar",
  summary: "Filiallarni bog'lash: WAN turlari, site-to-site va remote-access VPN, IPsec va GRE tunnel.",
  estimatedMinutes: 50,
  goals: [
    "WAN ulanish turlari va SD-WAN g'oyasini tushuntirasiz",
    "IPsec VPN qanday quralishini bilasiz",
    "GRE tunnel sozlab, uning ustidan OSPF ishlatasiz",
  ],
  requires: "Cisco Packet Tracer; 2-bosqichdagi OSPF darsi",
  recap: [
    "Site-to-site VPN — ofisni ofisga, remote-access — xodimni ofisga ulaydi.",
    "IPsec: IKE 1-faza xavfsiz kanal quradi, 2-faza ma'lumot uchun SA'larni kelishadi.",
    "GRE shifrlamaydi; amalda u IPsec ichida ishlatiladi.",
  ],
  steps: [
    {
      type: "learn",
      title: "WAN — uzoq masofadagi bog'lanish",
      body: "Kompaniyaning Toshkentdagi bosh ofisi va Samarqanddagi filiali bitta tarmoqdek ishlashi kerak. Ularni bog'lashning bir necha yo'li bor.",
      points: [
        "Internet (optika, kabel) — arzon, lekin sifat kafolatsiz.",
        "Ajratilgan kanal yoki MPLS — provayderning yopiq tarmog'i, sifat kafolatli, qimmat.",
        "4G/5G — zaxira kanal sifatida.",
        "SD-WAN — bir nechta kanalni birlashtirib, trafikni markazdan siyosat bo'yicha boshqaradi.",
      ],
    },
    {
      type: "quiz",
      question: "SD-WAN nima qiladi?",
      options: [
        "Faqat Wi-Fi'ni boshqaradi",
        "Bir nechta WAN kanallarini birlashtirib, trafikni markaziy siyosat bo'yicha yo'naltiradi",
        "VLAN'larni yaratadi",
        "DNS'ni almashtiradi",
      ],
      answerIndex: 1,
      explanation: "SD-WAN internet, MPLS va LTE kabi kanallarni birga ishlatadi: masalan, video qo'ng'iroqni eng sifatli kanalga yuboradi.",
    },
    {
      type: "learn",
      title: "VPN turlari",
      body: "VPN — internet ustidan shifrlangan tunnel. Uning ikki asosiy turi bor.",
      points: [
        "Site-to-site — ofis router'i/firewall'i boshqa ofis bilan doimiy tunnel quradi. Foydalanuvchi buni sezmaydi.",
        "Remote-access — xodim noutbukidagi dastur orqali uydan ofisga ulanadi.",
      ],
    },
    {
      type: "quiz",
      question: "Xodim uydan turib ofis serveriga xavfsiz ulanishi kerak. Qaysi VPN?",
      options: ["Site-to-site", "Remote-access", "GRE", "VLAN"],
      answerIndex: 1,
      explanation: "Bitta foydalanuvchi qurilmasi ofisga ulanadi — bu remote-access VPN.",
    },
    {
      type: "learn",
      title: "IPsec qanday himoya qiladi",
      body: "IPsec to'rt narsani ta'minlaydi: maxfiylik (shifrlash, masalan AES), yaxlitlik (xesh, masalan SHA), autentifikatsiya (umumiy kalit yoki sertifikat) va qayta yuborishdan himoya. Kalitlarni IKE protokoli kelishadi.",
    },
    {
      type: "order",
      title: "IPsec tunnel qanday quriladi",
      prompt: "Bosqichlarni tartiblang.",
      items: [
        "IKE 1-faza: tomonlar bir-birini autentifikatsiya qilib, xavfsiz boshqaruv kanalini quradi",
        "IKE 2-faza: ma'lumotlar uchun IPsec SA'lar kelishiladi",
        "Trafik shifrlanib, tunnel orqali yuboriladi",
        "Muddat tugaganda kalitlar yangilanadi",
      ],
    },
    {
      type: "learn",
      title: "GRE tunnel",
      body: "GRE — sodda tunnel: bir paketni boshqasining ichiga soladi. U multicast'ni ham tashiydi, shuning uchun uning ustidan OSPF ishlaydi. Lekin GRE shifrlamaydi — amalda «GRE over IPsec» ishlatiladi.",
      visual: {
        kind: "topology",
        nodes: [
          { id: "hq", label: "HQ-R1 · 172.16.0.1", icon: "router" },
          { id: "net", label: "Internet", icon: "cloud" },
          { id: "br", label: "BR-R1 · 172.16.0.2", icon: "router" },
        ],
        links: [
          ["hq", "net"],
          ["net", "br"],
        ],
      },
    },
    {
      type: "quiz",
      question: "GRE tunnel trafikni shifrlaydimi?",
      options: ["Ha, AES bilan", "Yo'q, shuning uchun IPsec bilan birga ishlatiladi", "Faqat TCP'ni", "Faqat OSPF'ni"],
      answerIndex: 1,
      explanation: "GRE faqat inkapsulyatsiya qiladi. Maxfiylik uchun uni IPsec ichiga olish kerak.",
    },
    {
      type: "cli",
      title: "HQ da GRE tunnel va OSPF",
      scenario: "HQ-R1 ning ommaviy manzili Gi0/1 da 203.0.113.2, filial router'iniki 198.51.100.2. Tunnel tarmog'i 172.16.0.0/30. Default marshrut allaqachon sozlangan.",
      lines: [
        { prompt: "HQ-R1#", task: "Global sozlash rejimiga o'ting.", accept: ["configure terminal"], explain: "(config)#." },
        { prompt: "HQ-R1(config)#", task: "Tunnel0 interfeysini yarating.", accept: ["interface Tunnel0"], explain: "Virtual interfeys yaratildi." },
        { prompt: "HQ-R1(config-if)#", task: "Tunnelga 172.16.0.1/30 manzilini bering.", accept: ["ip address 172.16.0.1 255.255.255.252"], explain: "Tunnel ikki uchi — xuddi /30 kanaldek." },
        { prompt: "HQ-R1(config-if)#", task: "Tunnel manbasi Gi0/1 bo'lsin.", accept: ["tunnel source gigabitEthernet0/1"], explain: "Tashqi paketlar shu interfeys manzilidan (203.0.113.2) chiqadi." },
        { prompt: "HQ-R1(config-if)#", task: "Tunnel manzili filialning 198.51.100.2 manzili bo'lsin.", accept: ["tunnel destination 198.51.100.2"], explain: "Ikkinchi uch ko'rsatildi; filialda xuddi shu sozlama teskari beriladi." },
        { prompt: "HQ-R1(config-if)#", task: "OSPF 1 jarayoniga o'ting.", accept: ["router ospf 1"], explain: "(config-router)#." },
        {
          prompt: "HQ-R1(config-router)#",
          task: "Tunnel tarmog'ini area 0 ga qo'shing.",
          accept: ["network 172.16.0.0 0.0.0.3 area 0"],
          explain: "OSPF qo'shnichiligi tunnel ichida quriladi. Ommaviy 203.0.113.0 tarmog'ini OSPF'ga qo'shmang — aks holda tunnel o'z-o'ziga marshrut izlab, uzilib qoladi.",
        },
        { prompt: "HQ-R1(config-router)#", task: "Imtiyozli rejimga qayting.", accept: ["end"], explain: "HQ-R1#." },
        {
          prompt: "HQ-R1#",
          task: "Tunnel interfeysi holatini ko'ring.",
          accept: ["show interfaces Tunnel0"],
          explain: "Tunnel up/up, transport — GRE/IP.",
          output: [
            "Tunnel0 is up, line protocol is up",
            "  Internet address is 172.16.0.1/30",
            "  Tunnel source 203.0.113.2 (GigabitEthernet0/1), destination 198.51.100.2",
            "  Tunnel protocol/transport GRE/IP",
          ],
        },
      ],
    },
    {
      type: "learn",
      title: "Amaliy maslahat: MTU",
      body: "Tunnel har paketga qo'shimcha sarlavha qo'shadi (GRE — 24 bayt, IPsec bilan undan ham ko'p). Katta paketlar bo'linib ketmasligi uchun tunnel interfeysida odatda MTU kamaytiriladi.",
      terminal: ["HQ-R1(config-if)# ip mtu 1400", "HQ-R1(config-if)# ip tcp adjust-mss 1360"],
    },
    {
      type: "lab",
      title: "Packet Tracer: ikki ofis tunnel orqali",
      tasks: [
        "HQ-R1 — ISP — BR-R1 zanjirini quring. Har ofis router'ida LAN va default marshrut ISP'ga.",
        "Ikkala router'da Tunnel0 sozlang (manzillar teskari).",
        "OSPF'ni faqat LAN va tunnel tarmoqlari uchun yoqing.",
        "HQ kompyuteridan filial kompyuteriga ping va tracert qiling.",
      ],
      commands: {
        mode: "sequence",
        items: [
          { command: "show ip ospf neighbor", note: "Qo'shni Tunnel0 interfeysi orqali FULL bo'lishi kerak." },
          { command: "show ip route ospf", note: "Filial LAN'i «O ... via 172.16.0.2, Tunnel0» ko'rinishida." },
          { command: "tracert 10.20.40.10", note: "HQ kompyuteridan: yo'lda faqat tunnel uchlari ko'rinadi, ISP router'lari ko'rinmaydi.", ifFails: "Tunnel up/up ekanini va ikki tomonda source/destination teskari ekanini tekshiring." },
        ],
      },
      expected: "Ofislar o'rtasida ping ishlaydi; tracert natijasida provayder router'lari yashiringan.",
    },
    {
      type: "practice",
      title: "Qaror jadvali",
      instructions: [
        "Uch holat uchun eng mos yechimni yozing: 1) 30 ta xodim uydan ishlaydi; 2) 5 ta filial bitta tarmoqdek ishlashi kerak; 3) filialda video qo'ng'iroqlar sifatsiz.",
        "Har javob yoniga sababini bir jumlada yozing.",
      ],
    },
  ],
};
