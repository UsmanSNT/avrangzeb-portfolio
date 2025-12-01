import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Portfolio API - Abdujalilov Avrangzeb haqida ma'lumot
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "uz";
  const section = searchParams.get("section");

  // Fetch data from Supabase
  const [bookQuotesRes, galleryRes, notesRes] = await Promise.all([
    supabase.from('portfolio_book_quotes').select('*').order('created_at', { ascending: false }),
    supabase.from('portfolio_gallery').select('*').order('created_at', { ascending: false }),
    supabase.from('portfolio_notes').select('*').order('created_at', { ascending: false }),
  ]);

  const translations = {
    uz: {
      meta: {
        title: "Abdujalilov Avrangzeb - Portfolio API",
        description: "Tarmoq va Axborot xavfsizligi bo'yicha portfolio ma'lumotlari",
        version: "2.0.0",
        lastUpdated: new Date().toISOString(),
        database: "Supabase",
      },
      personal: {
        name: "Abdujalilov Avrangzeb",
        title: "Axborot Xavfsizligi & Tarmoq Mutaxassisi",
        location: "Jeonju, Janubiy Koreya 🇰🇷",
        email: "avrangzeb@example.com",
        phone: "+998 90 123 45 67",
        bio: "Janubiy Koreya, Woosuk Universiteti (Jeonju filiali) Axborot xavfsizligi yo'nalishi bitiruvchi kursi talabasi.",
      },
      education: {
        university: "Woosuk Universiteti (우석대학교)",
        faculty: "Axborot xavfsizligi yo'nalishi",
        location: "Jeonju, Janubiy Koreya",
        status: "Bitiruvchi kurs",
      },
      goal: "Zamonaviy texnologiyalar asosida tarmoq va AI integratsiyasida mutaxassis bo'lish",
      skills: {
        technical: [
          { name: "Cisco Networking", level: 85 },
          { name: "Linux Server", level: 80 },
          { name: "Windows Server", level: 75 },
          { name: "Kiberxavfsizlik", level: 70 },
          { name: "Cloud Computing", level: 65 },
          { name: "Python Scripting", level: 60 },
        ],
        technologies: [
          "TCP/IP", "DNS", "DHCP", "Active Directory", "VMware", "Docker",
          "Ansible", "Git", "Bash", "PowerShell", "Wireshark", "Nmap",
          "pfSense", "MikroTik", "Ubiquiti", "AWS", "Azure"
        ],
      },
      certifications: [
        { name: "네트워크 관리사 2급", status: "preparing" },
        { name: "CCNA", status: "preparing" },
        { name: "CompTIA Network+", status: "preparing" },
        { name: "LPIC-1", status: "preparing" },
      ],
      bookQuotes: bookQuotesRes.data || [],
      gallery: galleryRes.data || [],
      notes: notesRes.data || [],
      stats: {
        bookQuotes: bookQuotesRes.data?.length || 0,
        galleryItems: galleryRes.data?.length || 0,
        notes: notesRes.data?.length || 0,
      },
    },
    en: {
      meta: {
        title: "Abdujalilov Avrangzeb - Portfolio API",
        description: "Portfolio information about Network and Information Security",
        version: "2.0.0",
        lastUpdated: new Date().toISOString(),
        database: "Supabase",
      },
      personal: {
        name: "Abdujalilov Avrangzeb",
        title: "Information Security & Network Specialist",
        location: "Jeonju, South Korea 🇰🇷",
        email: "avrangzeb@example.com",
        phone: "+998 90 123 45 67",
        bio: "Senior student at Woosuk University (Jeonju campus), South Korea, majoring in Information Security.",
      },
      education: {
        university: "Woosuk University (우석대학교)",
        faculty: "Information Security Major",
        location: "Jeonju, South Korea",
        status: "Senior Year",
      },
      goal: "To become a specialist in network and AI integration based on modern technologies",
      skills: {
        technical: [
          { name: "Cisco Networking", level: 85 },
          { name: "Linux Server", level: 80 },
          { name: "Windows Server", level: 75 },
          { name: "Cybersecurity", level: 70 },
          { name: "Cloud Computing", level: 65 },
          { name: "Python Scripting", level: 60 },
        ],
        technologies: [
          "TCP/IP", "DNS", "DHCP", "Active Directory", "VMware", "Docker",
          "Ansible", "Git", "Bash", "PowerShell", "Wireshark", "Nmap",
          "pfSense", "MikroTik", "Ubiquiti", "AWS", "Azure"
        ],
      },
      certifications: [
        { name: "Network Administrator Level 2", status: "preparing" },
        { name: "CCNA", status: "preparing" },
        { name: "CompTIA Network+", status: "preparing" },
        { name: "LPIC-1", status: "preparing" },
      ],
      bookQuotes: bookQuotesRes.data || [],
      gallery: galleryRes.data || [],
      notes: notesRes.data || [],
      stats: {
        bookQuotes: bookQuotesRes.data?.length || 0,
        galleryItems: galleryRes.data?.length || 0,
        notes: notesRes.data?.length || 0,
      },
    },
    ko: {
      meta: {
        title: "압두잘릴로프 아브랑제브 - 포트폴리오 API",
        description: "네트워크 및 정보보안 포트폴리오 정보",
        version: "2.0.0",
        lastUpdated: new Date().toISOString(),
        database: "Supabase",
      },
      personal: {
        name: "압두잘릴로프 아브랑제브",
        title: "정보보안 & 네트워크 전문가",
        location: "전주, 대한민국 🇰🇷",
        email: "avrangzeb@example.com",
        phone: "+998 90 123 45 67",
        bio: "대한민국 전주 우석대학교 정보보안학과 졸업예정 학생입니다.",
      },
      education: {
        university: "우석대학교 (Woosuk University)",
        faculty: "정보보안학과",
        location: "전주, 대한민국",
        status: "졸업예정",
      },
      goal: "현대 기술을 기반으로 네트워크와 AI 통합 분야의 전문가가 되는 것",
      skills: {
        technical: [
          { name: "Cisco Networking", level: 85 },
          { name: "Linux Server", level: 80 },
          { name: "Windows Server", level: 75 },
          { name: "사이버 보안", level: 70 },
          { name: "Cloud Computing", level: 65 },
          { name: "Python Scripting", level: 60 },
        ],
        technologies: [
          "TCP/IP", "DNS", "DHCP", "Active Directory", "VMware", "Docker",
          "Ansible", "Git", "Bash", "PowerShell", "Wireshark", "Nmap",
          "pfSense", "MikroTik", "Ubiquiti", "AWS", "Azure"
        ],
      },
      certifications: [
        { name: "네트워크 관리사 2급", status: "preparing" },
        { name: "CCNA", status: "preparing" },
        { name: "CompTIA Network+", status: "preparing" },
        { name: "LPIC-1", status: "preparing" },
      ],
      bookQuotes: bookQuotesRes.data || [],
      gallery: galleryRes.data || [],
      notes: notesRes.data || [],
      stats: {
        bookQuotes: bookQuotesRes.data?.length || 0,
        galleryItems: galleryRes.data?.length || 0,
        notes: notesRes.data?.length || 0,
      },
    },
  };

  const data = translations[lang as keyof typeof translations] || translations.uz;

  // If section is specified, return only that section
  if (section && section in data) {
    return NextResponse.json({
      success: true,
      language: lang,
      section: section,
      data: data[section as keyof typeof data],
    });
  }

  return NextResponse.json({
    success: true,
    language: lang,
    availableLanguages: ["uz", "en", "ko"],
    availableSections: Object.keys(data),
    endpoints: {
      bookQuotes: "/api/book-quotes",
      gallery: "/api/gallery",
      notes: "/api/notes",
    },
    data: data,
  });
}

// API haqida ma'lumot
export async function OPTIONS() {
  return NextResponse.json({
    name: "Abdujalilov Avrangzeb Portfolio API",
    version: "2.0.0",
    database: "Supabase (PostgreSQL)",
    description: "Portfolio ma'lumotlarini olish va boshqarish uchun API",
    endpoints: {
      "GET /api/portfolio": "Barcha portfolio ma'lumotlarini olish",
      "GET /api/portfolio?lang=en": "Ingliz tilida",
      "GET /api/portfolio?section=skills": "Faqat skills bo'limini olish",
      "GET /api/book-quotes": "Kitob fikrlarini olish",
      "POST /api/book-quotes": "Yangi kitob fikri qo'shish",
      "PUT /api/book-quotes": "Kitob fikrni yangilash",
      "DELETE /api/book-quotes?id=1": "Kitob fikrni o'chirish",
      "GET /api/gallery": "Galereya elementlarini olish",
      "POST /api/gallery": "Yangi galereya elementi qo'shish",
      "PUT /api/gallery": "Galereya elementini yangilash",
      "DELETE /api/gallery?id=1": "Galereya elementini o'chirish",
      "GET /api/notes": "Qaydlarni olish",
      "POST /api/notes": "Yangi qayd qo'shish",
      "PUT /api/notes": "Qaydni yangilash",
      "DELETE /api/notes?id=1": "Qaydni o'chirish",
    },
  });
}
