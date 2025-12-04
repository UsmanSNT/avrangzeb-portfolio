"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Language types
type Language = "uz" | "en" | "ko";

// Translations
const translations = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      about: "Men haqimda",
      skills: "Ko'nikmalar",
      projects: "Maqsadlar",
      books: "Kitob fikrlari",
      gallery: "Galereya",
      myProjects: "Loyihalar",
      notes: "Qaydlar",
      contact: "Aloqa",
    },
    hero: {
      title: "Abdujalilov Avrangzeb",
      subtitle: "Axborot Xavfsizligi & Tarmoq Mutaxassisi",
      description: "Janubiy Koreya, Woosuk Universiteti (Jeonju) Axborot xavfsizligi yo'nalishi bitiruvchi kursi talabasi. Tarmoq va AI integratsiyasi sohasida ixtisoslashmoqda.",
      viewProjects: "Maqsadlarimni ko'rish",
      contact: "Bog'lanish",
      terminal: {
        whoami: "security_student_korea",
        skills: "Cisco, Linux, Windows Server, AI, Security...",
        status: "Yangi imkoniyatlarga ochiq! 🚀",
      },
    },
    about: {
      title: "Men haqimda",
      greeting: "Salom! Men",
      intro: "Janubiy Koreya, Woosuk Universiteti (Jeonju filiali) Axborot xavfsizligi yo'nalishi bitiruvchi kursi talabasi.",
      passion: "Hozirda Network Administrator 2-daraja imtihoniga tayyorgarlik ko'rmoqdaman. Shuningdek, CCNA, CompTIA Network+ va LPIC-1 sertifikatlarini olish ustida ishlamoqdaman.",
      goal: "Maqsadim - zamonaviy texnologiyalar asosida tarmoq va AI integratsiyasida mutaxassis bo'lish.",
      education: "Ta'lim",
      university: "Woosuk Universiteti (우석대학교)",
      faculty: "Axborot xavfsizligi yo'nalishi",
      years: "Jeonju, Janubiy Koreya • Bitiruvchi kurs",
      certificates: "Tayyorlanayotgan sertifikatlar",
      preparingCerts: "Hozirda tayyorgarlik ko'rilmoqda",
      stats: {
        projects: "Maqsadlar",
        certificates: "Tayyorlanmoqda",
        experience: "Boshlanish",
      },
    },
    skills: {
      title: "Texnik ko'nikmalar",
      additional: "Qo'shimcha texnologiyalar",
      cybersecurity: "Kiberxavfsizlik",
    },
    projects: {
      title: "Maqsadlarim",
      completed: "Maqsad",
      inProgress: "Ustida ishlamoqda",
      projectsList: [
        {
          title: "Network Administrator 2-daraja sertifikati",
          description: "Tarmoq administratori sertifikatini olish va professional darajada tarmoqlarni boshqarish ko'nikmalarini egallash.",
        },
        {
          title: "CCNA sertifikatini olish",
          description: "Cisco Certified Network Associate sertifikatini olish orqali tarmoq texnologiyalarida chuqur bilim olish.",
        },
        {
          title: "AI va Tarmoq integratsiyasi",
          description: "Sun'iy intellekt texnologiyalarini tarmoq xavfsizligi va boshqaruviga qo'llash bo'yicha mutaxassis bo'lish.",
        },
        {
          title: "Xalqaro IT kompaniyasida ishlash",
          description: "O'rganilgan bilimlarni amalda qo'llash uchun xalqaro IT kompaniyasida tajriba orttirish.",
        },
      ],
    },
    books: {
      title: "Kitoblardan olingan fikirlar",
      subtitle: "O'qigan kitoblarimdan ilhomlantiruvchi fikirlar va xulosalar",
      addNew: "Yangi fikr qo'shish",
      noQuotes: "Hali fikrlar yo'q",
      addFirst: "Birinchi fikrni qo'shing",
      viewAll: "Barchasini ko'rish",
      bookTitle: "Kitob nomi",
      bookTitlePlaceholder: "Masalan: Atomik odatlar",
      author: "Muallif",
      authorPlaceholder: "Masalan: James Clear",
      quote: "Fikr / Xulosa",
      quotePlaceholder: "Kitobdan olingan fikr yoki xulosani yozing...",
      imageLabel: "Rasm (ixtiyoriy)",
      uploadImage: "Rasm yuklash",
      changeImage: "Rasmni o'zgartirish",
      cancel: "Bekor qilish",
      save: "Saqlash",
      add: "Qo'shish",
      editTitle: "Fikrni tahrirlash",
      addTitle: "Yangi fikr qo'shish",
      confirmDelete: "Bu fikrni o'chirishni xohlaysizmi?",
      likes: "yoqdi",
      from: "dan",
    },
    gallery: {
      title: "Galereya",
      subtitle: "Esdalik rasmlar, sertifikatlar va muhim lahzalar",
      addNew: "Yangi galereya qo'shish",
      noItems: "Hali galereya yo'q",
      addFirst: "Birinchi galereyani qo'shing",
      itemTitle: "Sarlavha",
      itemTitlePlaceholder: "Masalan: CCNA sertifikati",
      itemDescription: "Tavsif",
      itemDescriptionPlaceholder: "Bu rasm/sertifikat haqida ma'lumot yozing...",
      itemCategory: "Kategoriya",
      categories: {
        certificate: "Sertifikat",
        event: "Tadbir",
        memory: "Esdalik",
        achievement: "Yutuq",
        other: "Boshqa",
      },
      images: "Rasmlar (1-5 ta)",
      uploadImages: "Rasmlarni yuklash",
      addMore: "Yana qo'shish",
      maxImages: "Maksimum 5 ta rasm",
      cancel: "Bekor qilish",
      save: "Saqlash",
      add: "Qo'shish",
      editTitle: "Galereyani tahrirlash",
      addTitle: "Yangi galereya qo'shish",
      confirmDelete: "Bu galereyani o'chirishni xohlaysizmi?",
      viewAll: "Barchasini ko'rish",
      close: "Yopish",
    },
    myProjects: {
      title: "Loyihalarim",
      subtitle: "Men yaratgan web loyihalar",
      viewProject: "Loyihani ko'rish",
      technologies: "Texnologiyalar",
      projects: [
        {
          id: 1,
          title: "Bir Ilm",
          description: "Ilm-fan platformasi - o'qilgan kitoblar taqrizi, Pomodoro taymer, foydalanuvchi tizimi. Bilimlarni ulashish va kitob muhokamalarini o'tkazish uchun jamoa platformasi.",
          image: "/images/bir-ilm.png",
          link: "https://bir-ilm.vercel.app",
          technologies: ["HTML", "CSS", "JavaScript"],
          color: "from-emerald-500 to-teal-500",
        },
        {
          id: 2,
          title: "Uz Travel",
          description: "Sayyohlar uchun O'zbekiston haqida ma'lumot - turli shaharlar, xizmatlar, galereya. O'zbekistondagi sayohat joylarini tanlash va ma'lumot olish platformasi.",
          image: "/images/uz-travel.png",
          link: "http://woosuk.izerone.co.kr:8090/~s120211616/",
          technologies: ["HTML", "CSS", "JavaScript"],
          color: "from-cyan-500 to-blue-500",
        },
      ],
    },
    contact: {
      title: "Bog'lanish",
      subtitle: "Men bilan bog'laning",
      description: "Yangi loyihalar, hamkorlik yoki ish takliflari bo'yicha men bilan bog'lanishingiz mumkin.",
      email: "Email",
      phone: "Telefon",
      location: "Manzil",
      locationValue: "Jeonju, Janubiy Koreya 🇰🇷",
      sendMessage: "Xabar yuborish",
      form: {
        name: "Ismingiz",
        namePlaceholder: "Ismingizni kiriting",
        email: "Email",
        message: "Xabar",
        messagePlaceholder: "Xabaringizni yozing...",
        send: "Yuborish",
      },
    },
    footer: "Barcha huquqlar himoyalangan.",
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Goals",
      books: "Book Quotes",
      gallery: "Gallery",
      myProjects: "Projects",
      notes: "Notes",
      contact: "Contact",
    },
    hero: {
      title: "Abdujalilov Avrangzeb",
      subtitle: "Information Security & Network Specialist",
      description: "Senior student at Woosuk University (Jeonju), South Korea, majoring in Information Security. Specializing in network and AI integration.",
      viewProjects: "View My Goals",
      contact: "Contact Me",
      terminal: {
        whoami: "security_student_korea",
        skills: "Cisco, Linux, Windows Server, AI, Security...",
        status: "Open to new opportunities! 🚀",
      },
    },
    about: {
      title: "About Me",
      greeting: "Hello! I'm",
      intro: "A senior student at Woosuk University (Jeonju campus), South Korea, majoring in Information Security.",
      passion: "Currently preparing for the Network Administrator Level 2 certification exam. Also working on obtaining CCNA, CompTIA Network+, and LPIC-1 certifications.",
      goal: "My goal is to become a specialist in network and AI integration based on modern technologies.",
      education: "Education",
      university: "Woosuk University (우석대학교)",
      faculty: "Information Security Major",
      years: "Jeonju, South Korea • Senior Year",
      certificates: "Certifications in Progress",
      preparingCerts: "Currently preparing",
      stats: {
        projects: "Goals",
        certificates: "In Progress",
        experience: "Starting",
      },
    },
    skills: {
      title: "Technical Skills",
      additional: "Additional Technologies",
      cybersecurity: "Cybersecurity",
    },
    projects: {
      title: "My Goals",
      completed: "Goal",
      inProgress: "Working on",
      projectsList: [
        {
          title: "Network Administrator Level 2 Certification",
          description: "Obtain the Network Administrator certification and master professional network management skills.",
        },
        {
          title: "Obtain CCNA Certification",
          description: "Gain deep knowledge in network technologies through Cisco Certified Network Associate certification.",
        },
        {
          title: "AI and Network Integration",
          description: "Become a specialist in applying artificial intelligence technologies to network security and management.",
        },
        {
          title: "Work at International IT Company",
          description: "Gain experience at an international IT company to apply learned knowledge in practice.",
        },
      ],
    },
    books: {
      title: "Book Quotes",
      subtitle: "Inspiring thoughts and conclusions from books I've read",
      addNew: "Add New Quote",
      noQuotes: "No quotes yet",
      viewAll: "View All",
      addFirst: "Add your first quote",
      bookTitle: "Book Title",
      bookTitlePlaceholder: "e.g., Atomic Habits",
      author: "Author",
      authorPlaceholder: "e.g., James Clear",
      quote: "Quote / Thought",
      quotePlaceholder: "Write a quote or thought from the book...",
      imageLabel: "Image (optional)",
      uploadImage: "Upload Image",
      changeImage: "Change Image",
      cancel: "Cancel",
      save: "Save",
      add: "Add",
      editTitle: "Edit Quote",
      addTitle: "Add New Quote",
      confirmDelete: "Are you sure you want to delete this quote?",
      likes: "likes",
      from: "from",
    },
    gallery: {
      title: "Gallery",
      subtitle: "Memorable photos, certificates and important moments",
      addNew: "Add New Gallery",
      noItems: "No gallery items yet",
      addFirst: "Add your first gallery",
      itemTitle: "Title",
      itemTitlePlaceholder: "e.g., CCNA Certificate",
      itemDescription: "Description",
      itemDescriptionPlaceholder: "Write about this photo/certificate...",
      itemCategory: "Category",
      categories: {
        certificate: "Certificate",
        event: "Event",
        memory: "Memory",
        achievement: "Achievement",
        other: "Other",
      },
      images: "Images (1-5)",
      uploadImages: "Upload Images",
      addMore: "Add More",
      maxImages: "Maximum 5 images",
      cancel: "Cancel",
      save: "Save",
      add: "Add",
      editTitle: "Edit Gallery",
      addTitle: "Add New Gallery",
      confirmDelete: "Are you sure you want to delete this gallery?",
      viewAll: "View All",
      close: "Close",
    },
    myProjects: {
      title: "My Projects",
      subtitle: "Web projects I've created",
      viewProject: "View Project",
      technologies: "Technologies",
      projects: [
        {
          id: 1,
          title: "Bir Ilm",
          description: "Educational platform - book reviews, Pomodoro timer, user system. A community platform for sharing knowledge and conducting book discussions.",
          image: "/images/bir-ilm.png",
          link: "https://bir-ilm.vercel.app",
          technologies: ["HTML", "CSS", "JavaScript"],
          color: "from-emerald-500 to-teal-500",
        },
        {
          id: 2,
          title: "Uz Travel",
          description: "Information about Uzbekistan for tourists - various cities, services, gallery. A platform for selecting travel destinations and getting information about Uzbekistan.",
          image: "/images/uz-travel.png",
          link: "http://woosuk.izerone.co.kr:8090/~s120211616/",
          technologies: ["HTML", "CSS", "JavaScript"],
          color: "from-cyan-500 to-blue-500",
        },
      ],
    },
    contact: {
      title: "Contact",
      subtitle: "Get in Touch",
      description: "Feel free to contact me for new projects, collaboration, or job opportunities.",
      email: "Email",
      phone: "Phone",
      location: "Location",
      locationValue: "Jeonju, South Korea 🇰🇷",
      sendMessage: "Send Message",
      form: {
        name: "Your Name",
        namePlaceholder: "Enter your name",
        email: "Email",
        message: "Message",
        messagePlaceholder: "Write your message...",
        send: "Send",
      },
    },
    footer: "All rights reserved.",
  },
  ko: {
    nav: {
      home: "홈",
      about: "소개",
      skills: "기술",
      projects: "목표",
      books: "책 인용구",
      gallery: "갤러리",
      myProjects: "프로젝트",
      notes: "노트",
      contact: "연락처",
    },
    hero: {
      title: "압두잘릴로프 아브랑제브",
      subtitle: "정보보안 & 네트워크 전문가",
      description: "대한민국 전주 우석대학교 정보보안학과 졸업예정. 네트워크와 AI 통합 분야 전문화 중.",
      viewProjects: "목표 보기",
      contact: "연락하기",
      terminal: {
        whoami: "security_student_korea",
        skills: "Cisco, Linux, Windows Server, AI, Security...",
        status: "새로운 기회를 찾고 있습니다! 🚀",
      },
    },
    about: {
      title: "소개",
      greeting: "안녕하세요! 저는",
      intro: "대한민국 전주 우석대학교 정보보안학과 졸업예정 학생입니다.",
      passion: "현재 네트워크 관리사 2급 자격증 시험을 준비하고 있습니다. 또한 CCNA, CompTIA Network+, LPIC-1 자격증 취득을 위해 노력하고 있습니다.",
      goal: "제 목표는 현대 기술을 기반으로 네트워크와 AI 통합 분야의 전문가가 되는 것입니다.",
      education: "학력",
      university: "우석대학교 (Woosuk University)",
      faculty: "정보보안학과",
      years: "전주, 대한민국 • 졸업예정",
      certificates: "준비 중인 자격증",
      preparingCerts: "현재 준비 중",
      stats: {
        projects: "목표",
        certificates: "준비 중",
        experience: "시작",
      },
    },
    skills: {
      title: "기술 스킬",
      additional: "추가 기술",
      cybersecurity: "사이버 보안",
    },
    projects: {
      title: "목표",
      completed: "목표",
      inProgress: "진행 중",
      projectsList: [
        {
          title: "네트워크 관리사 2급 자격증",
          description: "네트워크 관리사 자격증을 취득하고 전문적인 네트워크 관리 기술을 습득합니다.",
        },
        {
          title: "CCNA 자격증 취득",
          description: "Cisco Certified Network Associate 자격증을 통해 네트워크 기술에 대한 깊은 지식을 습득합니다.",
        },
        {
          title: "AI와 네트워크 통합",
          description: "인공지능 기술을 네트워크 보안 및 관리에 적용하는 전문가가 됩니다.",
        },
        {
          title: "글로벌 IT 기업 취업",
          description: "배운 지식을 실무에 적용하기 위해 글로벌 IT 기업에서 경험을 쌓습니다.",
        },
      ],
    },
    books: {
      title: "책 인용구",
      subtitle: "읽은 책에서 영감을 주는 생각과 결론",
      addNew: "새 인용구 추가",
      noQuotes: "아직 인용구가 없습니다",
      viewAll: "모두 보기",
      addFirst: "첫 번째 인용구를 추가하세요",
      bookTitle: "책 제목",
      bookTitlePlaceholder: "예: 아주 작은 습관의 힘",
      author: "저자",
      authorPlaceholder: "예: 제임스 클리어",
      quote: "인용구 / 생각",
      quotePlaceholder: "책에서 인용구나 생각을 작성하세요...",
      imageLabel: "이미지 (선택사항)",
      uploadImage: "이미지 업로드",
      changeImage: "이미지 변경",
      cancel: "취소",
      save: "저장",
      add: "추가",
      editTitle: "인용구 편집",
      addTitle: "새 인용구 추가",
      confirmDelete: "이 인용구를 삭제하시겠습니까?",
      likes: "좋아요",
      from: "에서",
    },
    gallery: {
      title: "갤러리",
      subtitle: "추억의 사진, 자격증 및 중요한 순간들",
      addNew: "새 갤러리 추가",
      noItems: "아직 갤러리가 없습니다",
      addFirst: "첫 번째 갤러리를 추가하세요",
      itemTitle: "제목",
      itemTitlePlaceholder: "예: CCNA 자격증",
      itemDescription: "설명",
      itemDescriptionPlaceholder: "이 사진/자격증에 대해 작성하세요...",
      itemCategory: "카테고리",
      categories: {
        certificate: "자격증",
        event: "이벤트",
        memory: "추억",
        achievement: "성취",
        other: "기타",
      },
      images: "이미지 (1-5개)",
      uploadImages: "이미지 업로드",
      addMore: "더 추가",
      maxImages: "최대 5개 이미지",
      cancel: "취소",
      save: "저장",
      add: "추가",
      editTitle: "갤러리 편집",
      addTitle: "새 갤러리 추가",
      confirmDelete: "이 갤러리를 삭제하시겠습니까?",
      viewAll: "모두 보기",
      close: "닫기",
    },
    myProjects: {
      title: "내 프로젝트",
      subtitle: "내가 만든 웹 프로젝트",
      viewProject: "프로젝트 보기",
      technologies: "기술 스택",
      projects: [
        {
          id: 1,
          title: "Bir Ilm",
          description: "교육 플랫폼 - 도서 리뷰, 뽀모도로 타이머, 사용자 시스템. 지식 공유와 도서 토론을 위한 커뮤니티 플랫폼입니다.",
          image: "/images/bir-ilm.png",
          link: "https://bir-ilm.vercel.app",
          technologies: ["HTML", "CSS", "JavaScript"],
          color: "from-emerald-500 to-teal-500",
        },
        {
          id: 2,
          title: "Uz Travel",
          description: "관광객을 위한 우즈베키스탄 정보 - 다양한 도시, 서비스, 갤러리. 우즈베키스탄의 여행지 선택과 정보 제공 플랫폼입니다.",
          image: "/images/uz-travel.png",
          link: "http://woosuk.izerone.co.kr:8090/~s120211616/",
          technologies: ["HTML", "CSS", "JavaScript"],
          color: "from-cyan-500 to-blue-500",
        },
      ],
    },
    contact: {
      title: "연락처",
      subtitle: "연락하기",
      description: "새로운 프로젝트, 협업 또는 채용 제안에 대해 연락해 주세요.",
      email: "이메일",
      phone: "전화",
      location: "위치",
      locationValue: "전주, 대한민국 🇰🇷",
      sendMessage: "메시지 보내기",
      form: {
        name: "이름",
        namePlaceholder: "이름을 입력하세요",
        email: "이메일",
        message: "메시지",
        messagePlaceholder: "메시지를 입력하세요...",
        send: "보내기",
      },
    },
    footer: "모든 권리 보유.",
  },
};

// Icons as components
const NetworkIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const ServerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CloudIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

// Logo Component
const Logo = () => (
  <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="8" fill="url(#logoGradient)" />
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">
      AA
    </text>
    <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.5)" />
    <circle cx="32" cy="32" r="2" fill="rgba(255,255,255,0.5)" />
    <path d="M8 8 L32 32" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2,2" />
  </svg>
);

const skillsData = [
  { name: "Cisco Networking", level: 85, icon: <NetworkIcon /> },
  { name: "Linux Server", level: 80, icon: <ServerIcon /> },
  { name: "Windows Server", level: 75, icon: <ServerIcon /> },
  { name: "Cybersecurity", level: 70, icon: <ShieldIcon /> },
  { name: "Cloud Computing", level: 65, icon: <CloudIcon /> },
  { name: "Python Scripting", level: 60, icon: <CodeIcon /> },
];

const projectTags = [
  ["Network", "Certification", "2024"],
  ["Cisco", "CCNA", "Routing"],
  ["AI", "Security", "Innovation"],
  ["Career", "Global", "Experience"],
];

const projectStatuses = [false, false, false, false]; // All goals are in progress

const certifications = [
  { name: "네트워크 관리사 2급 (Network Administrator Level 2)", status: "preparing" },
  { name: "CCNA - Cisco Certified Network Associate", status: "preparing" },
  { name: "CompTIA Network+", status: "preparing" },
  { name: "Linux Professional Institute (LPIC-1)", status: "preparing" },
];

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseMenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Book Quote interface
interface BookQuote {
  id: number;
  bookTitle: string;
  author: string;
  quote: string;
  image: string | null;
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
}

// Default book quotes
const defaultBookQuotes: BookQuote[] = [
  {
    id: 1,
    bookTitle: "Atomic Habits",
    author: "James Clear",
    quote: "Siz maqsadlaringiz darajasiga ko'tarilmaysiz. Siz tizimlaringiz darajasiga tushib qolasiz. / You do not rise to the level of your goals. You fall to the level of your systems.",
    image: null,
    likes: 5,
    dislikes: 0,
    userReaction: null,
  },
  {
    id: 2,
    bookTitle: "Deep Work",
    author: "Cal Newport",
    quote: "Chuqur ish - bu professional faoliyatni bilishni talab qiladigan holda, chalg'imasdan bajariladigan ish. Bu turdagi harakat yangi qiymat yaratadi, mahoratingizni oshiradi va takrorlash qiyin. / Deep work is professional activity performed in a state of distraction-free concentration.",
    image: null,
    likes: 3,
    dislikes: 0,
    userReaction: null,
  },
];

// Gallery interface
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: 'certificate' | 'event' | 'memory' | 'achievement' | 'other';
  images: string[];
  date: string;
}

// Default gallery items
const defaultGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Woosuk Universiteti",
    description: "우석대학교 - Janubiy Koreya, Jeonju shahridagi universitetim. Bu yerda axborot xavfsizligi yo'nalishida ta'lim olmoqdaman.",
    category: "memory",
    images: [],
    date: "2024-01-15",
  },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [language, setLanguage] = useState<Language>("uz");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; full_name: string | null } | null>(null);
  
  // Book quotes state
  const [bookQuotes, setBookQuotes] = useState<BookQuote[]>([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<BookQuote | null>(null);
  const [bookFormTitle, setBookFormTitle] = useState("");
  const [bookFormAuthor, setBookFormAuthor] = useState("");
  const [bookFormQuote, setBookFormQuote] = useState("");
  const [bookFormImage, setBookFormImage] = useState<string | null>(null);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryFormTitle, setGalleryFormTitle] = useState("");
  const [galleryFormDescription, setGalleryFormDescription] = useState("");
  const [galleryFormCategory, setGalleryFormCategory] = useState<GalleryItem['category']>("memory");
  const [galleryFormImages, setGalleryFormImages] = useState<string[]>([]);
  const [viewingGallery, setViewingGallery] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Book quote viewing state
  const [viewingQuote, setViewingQuote] = useState<BookQuote | null>(null);
  const [expandedQuotes, setExpandedQuotes] = useState<Set<number>>(new Set());

  const toggleQuoteExpand = (id: number) => {
    setExpandedQuotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const t = translations[language];

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("portfolio-language") as Language;
    if (savedLang && ["uz", "en", "ko"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        
        // Get user profile
        const res = await fetch(`/api/auth/profile?userId=${user.id}`);
        const profile = await res.json();
        
        if (profile && !profile.error) {
          setCurrentUser({
            email: profile.email,
            full_name: profile.full_name
          });
          // Admin yoki super_admin bo'lsa ma'lumotlarni o'zgartira oladi
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Auth holati o'zgarganda yangilash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAuth();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Loading states
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactTelegram, setContactTelegram] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isContactSending, setIsContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  // Contact form submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSending(true);
    setContactError("");
    setContactSuccess(false);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          telegram: contactTelegram,
          message: contactMessage
        })
      });

      if (res.ok) {
        setContactSuccess(true);
        setContactName("");
        setContactTelegram("");
        setContactMessage("");
        // 3 soniyadan keyin success xabarini o'chirish
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        const data = await res.json();
        setContactError(data.error || "Xabar yuborishda xatolik");
      }
    } catch (error) {
      setContactError("Xabar yuborishda xatolik yuz berdi");
    } finally {
      setIsContactSending(false);
    }
  };
  const [isMigrating, setIsMigrating] = useState(false);

  // Base64 ni File ga aylantirish funksiyasi
  const base64ToFile = (base64: string, filename: string): File | null => {
    try {
      if (!base64 || !base64.includes(',')) return null;
      const arr = base64.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch {
      return null;
    }
  };

  // Rasmni Supabase Storage ga yuklash
  const uploadBase64Image = async (base64: string, folder: string): Promise<string | null> => {
    const file = base64ToFile(base64, `migrated-${Date.now()}.jpg`);
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      return result.success ? result.data.url : null;
    } catch {
      return null;
    }
  };

  // localStorage dan eski ma'lumotlarni ko'chirish
  useEffect(() => {
    const migrateOldData = async () => {
      const migrated = localStorage.getItem('portfolio-migrated-to-supabase');
      if (migrated === 'true') return;

      const oldBookQuotes = localStorage.getItem('portfolio-book-quotes');
      const oldGallery = localStorage.getItem('portfolio-gallery');

      if (!oldBookQuotes && !oldGallery) {
        localStorage.setItem('portfolio-migrated-to-supabase', 'true');
        return;
      }

      setIsMigrating(true);
      console.log('Eski ma\'lumotlar ko\'chirilmoqda...');

      try {
        // Book quotes ko'chirish
        if (oldBookQuotes) {
          const quotes = JSON.parse(oldBookQuotes);
          for (const quote of quotes) {
            let imageUrl = null;
            
            // Agar rasm base64 bo'lsa, yuklash
            if (quote.image && quote.image.startsWith('data:')) {
              imageUrl = await uploadBase64Image(quote.image, 'book-quotes');
            }
            
            // Bazaga saqlash
            await fetch('/api/book-quotes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                book_title: quote.bookTitle,
                author: quote.author,
                quote: quote.quote,
                image_url: imageUrl,
              }),
            });
          }
          console.log('Kitob fikrlari ko\'chirildi');
        }

        // Gallery ko'chirish
        if (oldGallery) {
          const items = JSON.parse(oldGallery);
          for (const item of items) {
            const uploadedImages: string[] = [];
            
            // Har bir rasmni yuklash
            if (item.images && item.images.length > 0) {
              for (const img of item.images) {
                if (img && img.startsWith('data:')) {
                  const url = await uploadBase64Image(img, 'gallery');
                  if (url) uploadedImages.push(url);
                } else if (img && img.startsWith('http')) {
                  uploadedImages.push(img);
                }
              }
            }
            
            // Bazaga saqlash
            await fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: item.title,
                description: item.description,
                category: item.category,
                images: uploadedImages,
              }),
            });
          }
          console.log('Galereya ko\'chirildi');
        }

        // Muvaffaqiyatli ko'chirilgandan so'ng belgilash
        localStorage.setItem('portfolio-migrated-to-supabase', 'true');
        // Eski ma'lumotlarni o'chirish
        localStorage.removeItem('portfolio-book-quotes');
        localStorage.removeItem('portfolio-gallery');
        
        console.log('Ko\'chirish muvaffaqiyatli yakunlandi!');
        // Sahifani yangilash
        window.location.reload();
      } catch (error) {
        console.error('Ko\'chirishda xatolik:', error);
      } finally {
        setIsMigrating(false);
      }
    };

    migrateOldData();
  }, []);

  // Load book quotes from API
  useEffect(() => {
    const fetchBookQuotes = async () => {
      try {
        const res = await fetch('/api/book-quotes');
        const result = await res.json();
        console.log('Book quotes API response:', result);
        
        if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
          const formattedQuotes = result.data.map((q: { id: number; book_title: string; author: string; quote: string; image_url: string | null; likes: number; dislikes: string | number }) => ({
            id: q.id,
            bookTitle: q.book_title,
            author: q.author,
            quote: q.quote,
            image: q.image_url,
            likes: q.likes || 0,
            dislikes: typeof q.dislikes === 'string' ? parseInt(q.dislikes) || 0 : (q.dislikes || 0),
            userReaction: null,
          }));
          console.log('Formatted quotes:', formattedQuotes);
          setBookQuotes(formattedQuotes);
        } else {
          console.log('No quotes found, using defaults');
          setBookQuotes(defaultBookQuotes);
        }
      } catch (error) {
        console.error('Failed to fetch book quotes:', error);
        setBookQuotes(defaultBookQuotes);
      } finally {
        setIsLoadingQuotes(false);
      }
    };
    fetchBookQuotes();
  }, []);

  // Load gallery items from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        const result = await res.json();
        console.log('Gallery API response:', result);
        
        if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
          const formattedItems = result.data.map((item: { id: number; title: string; description: string; category: string; images: string[] | null; created_at: string }) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category as GalleryItem['category'],
            images: Array.isArray(item.images) ? item.images : [],
            date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }));
          console.log('Formatted gallery items:', formattedItems);
          setGalleryItems(formattedItems);
        } else {
          console.log('No gallery items found, using defaults');
          setGalleryItems(defaultGalleryItems);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        setGalleryItems(defaultGalleryItems);
      } finally {
        setIsLoadingGallery(false);
      }
    };
    fetchGallery();
  }, []);

  // Save language to localStorage
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("portfolio-language", lang);
    setIsLangMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // Book quotes functions
  const openBookModal = (quote?: BookQuote) => {
    if (quote) {
      setEditingQuote(quote);
      setBookFormTitle(quote.bookTitle);
      setBookFormAuthor(quote.author);
      setBookFormQuote(quote.quote);
      setBookFormImage(quote.image);
    } else {
      setEditingQuote(null);
      setBookFormTitle("");
      setBookFormAuthor("");
      setBookFormQuote("");
      setBookFormImage(null);
    }
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setEditingQuote(null);
    setBookFormTitle("");
    setBookFormAuthor("");
    setBookFormQuote("");
    setBookFormImage(null);
  };

  // Compress image function
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Rasmni siqish
        const compressedBase64 = await compressImage(file, 800, 0.7);
        
        // Base64 ni File ga aylantirish
        const arr = compressedBase64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const compressedFile = new File([u8arr], file.name, { type: mime });
        
        // Supabase Storage ga yuklash
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('folder', 'book-quotes');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        
        if (result.success) {
          setBookFormImage(result.data.url);
        } else {
          alert('Rasm yuklanmadi: ' + result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Rasm yuklashda xatolik yuz berdi');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookFormTitle.trim() || !bookFormQuote.trim()) {
      alert('Kitob nomi va fikrni kiriting!');
      return;
    }
    
    try {
      if (editingQuote) {
        // Update existing quote
        const res = await fetch('/api/book-quotes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingQuote.id,
            book_title: bookFormTitle,
            author: bookFormAuthor,
            quote: bookFormQuote,
            image_url: bookFormImage,
          }),
        });
        const result = await res.json();
        
        if (result.success) {
          setBookQuotes(bookQuotes.map(q => 
            q.id === editingQuote.id 
              ? { ...q, bookTitle: bookFormTitle, author: bookFormAuthor, quote: bookFormQuote, image: bookFormImage }
              : q
          ));
          closeBookModal();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot yangilanmadi'));
        }
      } else {
        // Create new quote
        const res = await fetch('/api/book-quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_title: bookFormTitle,
            author: bookFormAuthor,
            quote: bookFormQuote,
            image_url: bookFormImage,
          }),
        });
        const result = await res.json();
        
        if (result.success && result.data) {
          const newQuote: BookQuote = {
            id: result.data.id,
            bookTitle: bookFormTitle,
            author: bookFormAuthor,
            quote: bookFormQuote,
            image: bookFormImage,
            likes: 0,
            dislikes: 0,
            userReaction: null,
          };
          setBookQuotes([newQuote, ...bookQuotes]);
          closeBookModal();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot saqlanmadi'));
        }
      }
    } catch (error: any) {
      console.error('Failed to save book quote:', error);
      alert('Xato: ' + (error.message || 'Saqlashda xatolik yuz berdi'));
    }
  };

  const deleteBookQuote = async (id: number) => {
    if (confirm(t.books.confirmDelete)) {
      try {
        const res = await fetch(`/api/book-quotes?id=${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        
        if (result.success) {
          setBookQuotes(bookQuotes.filter(q => q.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete book quote:', error);
      }
    }
  };

  const handleReaction = async (id: number, reaction: 'like' | 'dislike') => {
    const quote = bookQuotes.find(q => q.id === id);
    if (!quote) return;
    
    let newLikes = quote.likes;
    let newDislikes = quote.dislikes;
    let newReaction: 'like' | 'dislike' | null = reaction;

    // If clicking the same reaction, remove it
    if (quote.userReaction === reaction) {
      if (reaction === 'like') newLikes--;
      else newDislikes--;
      newReaction = null;
    } else {
      // Remove old reaction if exists
      if (quote.userReaction === 'like') newLikes--;
      else if (quote.userReaction === 'dislike') newDislikes--;
      
      // Add new reaction
      if (reaction === 'like') newLikes++;
      else newDislikes++;
    }

    // Optimistic update
    setBookQuotes(bookQuotes.map(q => 
      q.id === id 
        ? { ...q, likes: newLikes, dislikes: newDislikes, userReaction: newReaction }
        : q
    ));

    // Update in database
    try {
      await fetch('/api/book-quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          likes: newLikes,
          dislikes: newDislikes,
        }),
      });
    } catch (error) {
      console.error('Failed to update reaction:', error);
    }
  };

  // Gallery functions
  const openGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setEditingGallery(item);
      setGalleryFormTitle(item.title);
      setGalleryFormDescription(item.description);
      setGalleryFormCategory(item.category);
      setGalleryFormImages(item.images);
    } else {
      setEditingGallery(null);
      setGalleryFormTitle("");
      setGalleryFormDescription("");
      setGalleryFormCategory("memory");
      setGalleryFormImages([]);
    }
    setIsGalleryModalOpen(true);
  };

  const closeGalleryModal = () => {
    setIsGalleryModalOpen(false);
    setEditingGallery(null);
    setGalleryFormTitle("");
    setGalleryFormDescription("");
    setGalleryFormCategory("memory");
    setGalleryFormImages([]);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 5 - galleryFormImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      
      setIsUploading(true);
      try {
        for (const file of filesToProcess) {
          // Rasmni siqish
          const compressedBase64 = await compressImage(file, 1200, 0.7);
          
          // Base64 ni File ga aylantirish
          const arr = compressedBase64.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const compressedFile = new File([u8arr], file.name, { type: mime });
          
          // Supabase Storage ga yuklash
          const formData = new FormData();
          formData.append('file', compressedFile);
          formData.append('folder', 'gallery');
          
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const result = await res.json();
          
          if (result.success) {
            setGalleryFormImages(prev => [...prev, result.data.url]);
          } else {
            console.error('Upload failed:', result.error);
          }
        }
      } catch (error) {
        console.error('Gallery upload error:', error);
        alert('Rasmlar yuklashda xatolik yuz berdi');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFormImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      if (editingGallery) {
        // Update existing gallery item
        // Session token olish
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          alert('Xato: Ma\'lumot yangilash uchun tizimga kiring');
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        
        let accessToken = session?.access_token;
        if (!accessToken) {
          const { data: { session: newSession } } = await supabase.auth.getSession();
          accessToken = newSession?.access_token;
        }
        
        if (!accessToken) {
          alert('Xato: Session topilmadi. Iltimos, tizimga qayta kiring.');
          return;
        }
        
        headers['Authorization'] = `Bearer ${accessToken}`;
        
        const res = await fetch('/api/gallery', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingGallery.id,
            title: galleryFormTitle,
            description: galleryFormDescription,
            category: galleryFormCategory,
            images: galleryFormImages,
          }),
        });
        const result = await res.json();
        
        if (result.success) {
          setGalleryItems(galleryItems.map(item => 
            item.id === editingGallery.id 
              ? { ...item, title: galleryFormTitle, description: galleryFormDescription, category: galleryFormCategory, images: galleryFormImages }
              : item
          ));
          closeGalleryModal();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot yangilanmadi'));
        }
      } else {
        // Create new gallery item
        // Session token olish
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          alert('Xato: Ma\'lumot qo\'shish uchun tizimga kiring');
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        
        let accessToken = session?.access_token;
        if (!accessToken) {
          const { data: { session: newSession } } = await supabase.auth.getSession();
          accessToken = newSession?.access_token;
        }
        
        if (!accessToken) {
          alert('Xato: Session topilmadi. Iltimos, tizimga qayta kiring.');
          return;
        }
        
        headers['Authorization'] = `Bearer ${accessToken}`;
        
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: galleryFormTitle,
            description: galleryFormDescription,
            category: galleryFormCategory,
            images: galleryFormImages,
          }),
        });
        const result = await res.json();
        
        if (result.success && result.data) {
          const newItem: GalleryItem = {
            id: result.data.id,
            title: galleryFormTitle,
            description: galleryFormDescription,
            category: galleryFormCategory,
            images: galleryFormImages,
            date: today,
          };
          setGalleryItems([newItem, ...galleryItems]);
          closeGalleryModal();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot saqlanmadi'));
        }
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      alert('Saqlashda xatolik yuz berdi');
    }
  };

  const deleteGalleryItem = async (id: number) => {
    if (confirm(t.gallery.confirmDelete)) {
      try {
        const res = await fetch(`/api/gallery?id=${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        
        if (result.success) {
          setGalleryItems(galleryItems.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete gallery item:', error);
      }
    }
  };

  const openGalleryViewer = (item: GalleryItem, imageIndex: number = 0) => {
    setViewingGallery(item);
    setCurrentImageIndex(imageIndex);
  };

  const closeGalleryViewer = () => {
    setViewingGallery(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (viewingGallery) {
      setCurrentImageIndex((prev) => (prev + 1) % viewingGallery.images.length);
    }
  };

  const prevImage = () => {
    if (viewingGallery) {
      setCurrentImageIndex((prev) => (prev - 1 + viewingGallery.images.length) % viewingGallery.images.length);
    }
  };

  const getCategoryIcon = (category: GalleryItem['category']) => {
    switch (category) {
      case 'certificate': return '📜';
      case 'event': return '🎉';
      case 'memory': return '📸';
      case 'achievement': return '🏆';
      default: return '📁';
    }
  };

  const languageLabels = {
    uz: { flag: "🇺🇿", name: "O'zbek" },
    en: { flag: "🇺🇸", name: "English" },
    ko: { flag: "🇰🇷", name: "한국어" },
  };

  return (
    <div className="min-h-screen network-bg text-slate-200">
      {/* Migration Loading Overlay */}
      {isMigrating && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Ma&apos;lumotlar ko&apos;chirilmoqda...</h2>
            <p className="text-slate-400">Eski rasmlar Supabase ga yuklanmoqda</p>
            <p className="text-slate-500 text-sm mt-2">Iltimos, kutib turing...</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - bosh sahifaga havola */}
            <button 
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="animate-pulse-glow rounded-lg">
                <Logo />
              </div>
              <span className="font-bold text-lg sm:text-xl">Avrangzeb</span>
            </button>
            
            {/* Desktop Navigation - faqat asosiy bo'limlar */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {[
                { id: "books", label: t.nav.books },
                { id: "gallery", label: t.nav.gallery },
                { id: "my-projects", label: t.nav.myProjects },
                { id: "notes", label: t.nav.notes, isLink: true },
              ].map((item) => (
                item.id === "notes" ? (
                  <a
                    key={item.id}
                    href="/notes"
                    className="text-sm font-medium transition-colors hover:text-cyan-400 text-slate-400"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                      activeSection === item.id ? "text-cyan-400" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors"
                >
                  <GlobeIcon />
                  <span className="text-lg">{languageLabels[language].flag}</span>
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                    {(Object.keys(languageLabels) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors ${
                          language === lang ? "bg-cyan-500/20 text-cyan-400" : "text-slate-300"
                        }`}
                      >
                        <span className="text-xl">{languageLabels[lang].flag}</span>
                        <span>{languageLabels[lang].name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Login/Profile Button */}
              {isLoggedIn ? (
                <a
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {currentUser?.full_name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  {isAdmin ? (language === 'uz' ? 'Admin' : language === 'ko' ? '관리자' : 'Admin') : (language === 'uz' ? 'Profil' : language === 'ko' ? '프로필' : 'Profile')}
                </a>
              ) : (
                <a
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {language === 'uz' ? 'Kirish' : language === 'ko' ? '로그인' : 'Login'}
                </a>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {isMobileMenuOpen ? <CloseMenuIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4">
              <div className="flex flex-col gap-2">
                {[
                  { id: "books", label: t.nav.books },
                  { id: "gallery", label: t.nav.gallery },
                  { id: "my-projects", label: t.nav.myProjects },
                  { id: "notes", label: t.nav.notes, isLink: true },
                ].map((item) => (
                  item.id === "notes" ? (
                    <a
                      key={item.id}
                      href="/notes"
                      className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left text-base font-medium rounded-lg transition-colors ${
                        activeSection === item.id 
                          ? "text-cyan-400 bg-cyan-500/10" 
                          : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                ))}
                
                {/* Mobile Login/Profile Button */}
                {isLoggedIn ? (
                  <a
                    href={isAdmin ? "/admin" : "/dashboard"}
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                      {currentUser?.full_name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    {isAdmin ? (language === 'uz' ? 'Admin Panel' : language === 'ko' ? '관리자 패널' : 'Admin Panel') : (language === 'uz' ? 'Mening Profilim' : language === 'ko' ? '내 프로필' : 'My Profile')}
                  </a>
                ) : (
                  <a
                    href="/auth/login"
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {language === 'uz' ? 'Kirish / Ro\'yxatdan o\'tish' : language === 'ko' ? '로그인 / 회원가입' : 'Login / Register'}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 animate-float">
            <div className="w-28 h-28 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 p-1 animate-pulse-glow">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/profile.jpg"
                  alt="Abdujalilov Avrangzeb"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span class="text-4xl sm:text-5xl flex items-center justify-center w-full h-full bg-slate-900">👨‍💻</span>';
                  }}
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">{t.hero.title}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-3 sm:mb-4">
            {t.hero.subtitle}
          </p>
          <p className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <button
              onClick={() => scrollToSection("projects")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              {t.hero.viewProjects}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-6 sm:px-8 py-3 sm:py-4 border border-cyan-500/50 rounded-full font-semibold text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm sm:text-base"
            >
              {t.hero.contact}
            </button>
          </div>
          
          {/* Terminal Animation */}
          <div className="mt-10 sm:mt-16 max-w-xl mx-auto px-2 sm:px-0">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-slate-500">terminal</span>
              </div>
              <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-left">
                <p className="text-green-400">$ whoami</p>
                <p className="text-slate-300 mb-2 break-all">{t.hero.terminal.whoami}</p>
                <p className="text-green-400">$ cat skills.txt</p>
                <p className="text-slate-300 mb-2 break-all">{t.hero.terminal.skills}</p>
                <p className="text-green-400">$ echo $STATUS</p>
                <p className="text-cyan-400">{t.hero.terminal.status}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
            <span className="gradient-text">{t.about.title}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {t.about.greeting} <span className="text-cyan-400 font-semibold">Abdujalilov Avrangzeb</span>, 
                {t.about.intro}
              </p>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {t.about.passion}
              </p>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {t.about.goal}
              </p>
              
              {/* Education */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-3 sm:mb-4">📚 {t.about.education}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-200 text-sm sm:text-base">{t.about.university}</p>
                    <p className="text-slate-400 text-sm sm:text-base">{t.about.faculty}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{t.about.years}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certifications */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-4 sm:mb-6">🎯 {t.about.certificates}</h3>
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-5 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-200 text-sm sm:text-base break-words">{cert.name}</h4>
                      <p className="text-xs sm:text-sm text-yellow-400 mt-1 flex items-center gap-1">
                        <span>⏳</span> {t.about.preparingCerts || "Preparing"}
                      </p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <ShieldIcon />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
                <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-2xl sm:text-3xl font-bold text-cyan-400">4</p>
                  <p className="text-xs sm:text-sm text-slate-500">{t.about.stats.projects}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-400">4</p>
                  <p className="text-xs sm:text-sm text-slate-500">{t.about.stats.certificates}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">🚀</p>
                  <p className="text-xs sm:text-sm text-slate-500">{t.about.stats.experience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
            <span className="gradient-text">{t.skills.title}</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            {skillsData.map((skill, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 text-sm sm:text-base">{skill.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-500">{skill.level}%</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Skills */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-8 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-4 sm:mb-6">🛠 {t.skills.additional}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                "TCP/IP", "DNS", "DHCP", "Active Directory", "VMware", "Docker",
                "Ansible", "Git", "Bash", "PowerShell", "Wireshark", "Nmap",
                "pfSense", "MikroTik", "Ubiquiti", "AWS", "Azure"
              ].map((tech, index) => (
                <span
                  key={index}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 rounded-full text-xs sm:text-sm text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects/Goals Section */}
      <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
            <span className="gradient-text">{t.projects.title}</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            {t.projects.projectsList.map((project, index) => (
              <div
                key={index}
                className="group p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all hover:transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-xl font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                      projectStatuses[index]
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {projectStatuses[index] ? t.projects.completed : t.projects.inProgress}
                  </span>
                </div>
                <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {projectTags[index].map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 sm:px-3 py-1 bg-slate-700/50 rounded-full text-xs text-cyan-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Quotes Section */}
      <section id="books" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">📖 {t.books.title}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
              {t.books.subtitle}
            </p>
            {isAdmin && (
              <button
                onClick={() => openBookModal()}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.books.addNew}
              </button>
            )}
          </div>

          {bookQuotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <p className="text-slate-500 mb-4">{t.books.noQuotes}</p>
              {isAdmin && (
                <button
                  onClick={() => openBookModal()}
                  className="text-cyan-400 hover:underline"
                >
                  {t.books.addFirst}
                </button>
              )}
            </div>
          ) : (
            <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* TOP 5 - sorted by likes */}
              {[...bookQuotes].sort((a, b) => b.likes - a.likes).slice(0, 5).map((quote) => {
                const isExpanded = expandedQuotes.has(quote.id);
                const isLongQuote = quote.quote.length > 200;
                
                return (
                <div
                  key={quote.id}
                  className="group bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all"
                >
                  {/* Image - kattaroq va bosiladigan */}
                  {quote.image && (
                    <div 
                      className="relative h-52 sm:h-64 overflow-hidden cursor-pointer"
                      onClick={() => setViewingQuote(quote)}
                    >
                      <img
                        src={quote.image}
                        alt={quote.bookTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      {/* Zoom icon */}
                      <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      {/* Book title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white text-base sm:text-lg drop-shadow-lg">{quote.bookTitle}</h3>
                        <p className="text-cyan-300 text-sm">{quote.author}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    {/* Book info - agar rasm bo'lmasa */}
                    {!quote.image && (
                      <div className="mb-3">
                        <h3 className="font-semibold text-slate-200 text-sm sm:text-base">{quote.bookTitle}</h3>
                        <p className="text-xs sm:text-sm text-cyan-400">{t.books.from} {quote.author}</p>
                      </div>
                    )}
                    
                    {/* Quote - kengaytiriladigan */}
                    <div className="mb-4">
                      <p className={`text-slate-300 text-sm leading-relaxed ${!isExpanded && isLongQuote ? 'line-clamp-4' : ''}`}>
                        &ldquo;{quote.quote}&rdquo;
                      </p>
                      {isLongQuote && (
                        <button
                          onClick={() => toggleQuoteExpand(quote.id)}
                          className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <span>Yopish</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span>Ko&apos;proq o&apos;qish</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                      {/* Reactions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleReaction(quote.id, 'like')}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                            quote.userReaction === 'like'
                              ? 'bg-green-500/20 text-green-400'
                              : 'text-slate-400 hover:text-green-400 hover:bg-slate-700/50'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={quote.userReaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span className="text-xs">{quote.likes}</span>
                        </button>
                        <button
                          onClick={() => handleReaction(quote.id, 'dislike')}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                            quote.userReaction === 'dislike'
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-slate-400 hover:text-red-400 hover:bg-slate-700/50'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={quote.userReaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                          <span className="text-xs">{quote.dislikes}</span>
                        </button>
                      </div>
                      
                      {/* Edit/Delete - faqat admin uchun */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openBookModal(quote)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteBookQuote(quote.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
            
            {/* View All Button */}
            {bookQuotes.length > 5 && (
              <div className="text-center mt-8">
                <a
                  href="/books"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all"
                >
                  {t.books.viewAll} ({bookQuotes.length})
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            )}
            </>
          )}
        </div>
      </section>

      {/* Book Quote Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                {editingQuote ? t.books.editTitle : t.books.addTitle}
              </h3>
              <button
                onClick={closeBookModal}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.books.imageLabel}
                </label>
                <div className="relative">
                  {bookFormImage ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={bookFormImage}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBookFormImage(null)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : isUploading ? (
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-cyan-500/50 rounded-xl bg-slate-700/30">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-2"></div>
                      <span className="text-sm text-cyan-400">Yuklanmoqda...</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-cyan-500/50 transition-colors">
                      <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-slate-500">{t.books.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Book Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.books.bookTitle} *
                </label>
                <input
                  type="text"
                  value={bookFormTitle}
                  onChange={(e) => setBookFormTitle(e.target.value)}
                  required
                  placeholder={t.books.bookTitlePlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.books.author} *
                </label>
                <input
                  type="text"
                  value={bookFormAuthor}
                  onChange={(e) => setBookFormAuthor(e.target.value)}
                  required
                  placeholder={t.books.authorPlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.books.quote} *
                </label>
                <textarea
                  value={bookFormQuote}
                  onChange={(e) => setBookFormQuote(e.target.value)}
                  required
                  rows={4}
                  placeholder={t.books.quotePlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none text-sm sm:text-base"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeBookModal}
                  className="flex-1 py-2.5 sm:py-3 px-4 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors text-sm sm:text-base"
                >
                  {t.books.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base"
                >
                  {editingQuote ? t.books.save : t.books.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Section */}
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">🖼️ {t.gallery.title}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
              {t.gallery.subtitle}
            </p>
            {isAdmin && (
              <button
                onClick={() => openGalleryModal()}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.gallery.addNew}
              </button>
            )}
          </div>

          {galleryItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-4xl">🖼️</span>
              </div>
              <p className="text-slate-500 mb-4">{t.gallery.noItems}</p>
              {isAdmin && (
                <button
                  onClick={() => openGalleryModal()}
                  className="text-cyan-400 hover:underline"
                >
                  {t.gallery.addFirst}
                </button>
              )}
            </div>
          ) : (
            <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* TOP 5 gallery items */}
              {galleryItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="group bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all"
                >
                  {/* Images Preview */}
                  {item.images.length > 0 ? (
                    <div 
                      className="relative h-48 sm:h-56 cursor-pointer overflow-hidden"
                      onClick={() => openGalleryViewer(item, 0)}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-xs text-white flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          +{item.images.length - 1}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 sm:h-56 bg-slate-700/30 flex items-center justify-center">
                      <span className="text-6xl opacity-30">{getCategoryIcon(item.category)}</span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-200 text-sm sm:text-base line-clamp-1">{item.title}</h3>
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs whitespace-nowrap">
                        {t.gallery.categories[item.category]}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    
                    {/* Date and Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                      <span className="text-xs text-slate-500">{item.date}</span>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.images.length > 0 && (
                          <button
                            onClick={() => openGalleryViewer(item, 0)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        )}
                        {/* Edit/Delete - faqat admin uchun */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => openGalleryModal(item)}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteGalleryItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            {galleryItems.length > 5 && (
              <div className="text-center mt-8">
                <a
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all"
                >
                  {t.gallery.viewAll} ({galleryItems.length})
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            )}
            </>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                {editingGallery ? t.gallery.editTitle : t.gallery.addTitle}
              </h3>
              <button
                onClick={closeGalleryModal}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleGallerySubmit} className="p-4 sm:p-6 space-y-4">
              {/* Images Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.gallery.images}
                </label>
                
                {/* Image Previews */}
                {galleryFormImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {galleryFormImages.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {galleryFormImages.length < 5 && (
                  isUploading ? (
                    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-cyan-500/50 rounded-xl bg-slate-700/30">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mb-1"></div>
                      <span className="text-xs text-cyan-400">Yuklanmoqda...</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-cyan-500/50 transition-colors">
                      <svg className="w-6 h-6 text-slate-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-slate-500">
                        {galleryFormImages.length > 0 ? t.gallery.addMore : t.gallery.uploadImages}
                      </span>
                      <span className="text-xs text-slate-600 mt-1">
                        ({galleryFormImages.length}/5)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                    </label>
                  )
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.gallery.itemTitle} *
                </label>
                <input
                  type="text"
                  value={galleryFormTitle}
                  onChange={(e) => setGalleryFormTitle(e.target.value)}
                  required
                  placeholder={t.gallery.itemTitlePlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.gallery.itemCategory}
                </label>
                <select
                  value={galleryFormCategory}
                  onChange={(e) => setGalleryFormCategory(e.target.value as GalleryItem['category'])}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                >
                  <option value="certificate">{getCategoryIcon('certificate')} {t.gallery.categories.certificate}</option>
                  <option value="event">{getCategoryIcon('event')} {t.gallery.categories.event}</option>
                  <option value="memory">{getCategoryIcon('memory')} {t.gallery.categories.memory}</option>
                  <option value="achievement">{getCategoryIcon('achievement')} {t.gallery.categories.achievement}</option>
                  <option value="other">{getCategoryIcon('other')} {t.gallery.categories.other}</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.gallery.itemDescription} *
                </label>
                <textarea
                  value={galleryFormDescription}
                  onChange={(e) => setGalleryFormDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder={t.gallery.itemDescriptionPlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none text-sm sm:text-base"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeGalleryModal}
                  className="flex-1 py-2.5 sm:py-3 px-4 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors text-sm sm:text-base"
                >
                  {t.gallery.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base"
                >
                  {editingGallery ? t.gallery.save : t.gallery.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Viewer Modal */}
      {viewingGallery && viewingGallery.images.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Close button */}
          <button
            onClick={closeGalleryViewer}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Navigation arrows */}
          {viewingGallery.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image */}
          <div className="max-w-4xl max-h-[80vh] mx-4">
            <img
              src={viewingGallery.images[currentImageIndex]}
              alt={viewingGallery.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            
            {/* Info */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">{viewingGallery.title}</h3>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">{viewingGallery.description}</p>
              
              {/* Image counter */}
              {viewingGallery.images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {viewingGallery.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-cyan-400' : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book Quote Viewer Modal */}
      {viewingQuote && viewingQuote.image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          {/* Close button */}
          <button
            onClick={() => setViewingQuote(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl">
            {/* Full Image */}
            <div className="relative">
              <img
                src={viewingQuote.image}
                alt={viewingQuote.bookTitle}
                className="w-full max-h-[60vh] object-contain bg-black"
              />
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-1">{viewingQuote.bookTitle}</h3>
                <p className="text-cyan-400">{viewingQuote.author}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border-l-4 border-cyan-500">
                <p className="text-slate-200 text-lg leading-relaxed italic">
                  &ldquo;{viewingQuote.quote}&rdquo;
                </p>
              </div>
              
              {/* Reactions */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => {
                    handleReaction(viewingQuote.id, 'like');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    viewingQuote.userReaction === 'like'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-800 text-slate-400 hover:text-green-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill={viewingQuote.userReaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{viewingQuote.likes}</span>
                </button>
                <button
                  onClick={() => {
                    handleReaction(viewingQuote.id, 'dislike');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    viewingQuote.userReaction === 'dislike'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-slate-800 text-slate-400 hover:text-red-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill={viewingQuote.userReaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  <span>{viewingQuote.dislikes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Projects Section */}
      <section id="my-projects" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">🚀 {t.myProjects.title}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              {t.myProjects.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {t.myProjects.projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Project Image/Preview */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}>
                        {project.id === 1 ? (
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{project.title}</h3>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative p-5 sm:p-6">
                  <p className="text-slate-400 text-sm sm:text-base mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">{t.myProjects.technologies}:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Project Button */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${project.color} rounded-lg text-white font-medium text-sm hover:shadow-lg transition-all duration-300`}
                  >
                    {t.myProjects.viewProject}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-16">
            <span className="gradient-text">{t.contact.title}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-4 sm:mb-6">
                {t.contact.subtitle}
              </h3>
              <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
                {t.contact.description}
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="mailto:avrangzebabdujalilov@gmail.com"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <MailIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.email}</p>
                    <p className="text-slate-200 group-hover:text-cyan-400 transition-colors text-sm sm:text-base truncate">avrangzebabdujalilov@gmail.com</p>
                  </div>
                </a>
                
                <a
                  href="tel:+821023492777"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <PhoneIcon />
        </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.phone}</p>
                    <p className="text-slate-200 group-hover:text-cyan-400 transition-colors text-sm sm:text-base">+82 10-2349-2777</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <LocationIcon />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.location}</p>
                    <p className="text-slate-200 text-sm sm:text-base">{t.contact.locationValue}</p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
                <a
                  href="https://t.me/Avrangzeb_Abdujalilov"
            target="_blank"
            rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                  title="Telegram"
                >
                  <TelegramIcon />
          </a>
          <a
                  href="https://www.linkedin.com/in/avrangzeb-abdujalilov-365b5221a/"
            target="_blank"
            rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://github.com/UsmanSNT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                  title="GitHub"
                >
                  <GitHubIcon />
          </a>
        </div>
            </div>
            
            {/* Contact Form */}
            <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-4 sm:mb-6">
                {t.contact.sendMessage}
              </h3>
              
              {contactSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                  ✅ Xabaringiz muvaffaqiyatli yuborildi! Tez orada javob beramiz.
                </div>
              )}
              
              {contactError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {contactError}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">{t.contact.form.name}</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram username
                    </span>
                  </label>
                  <input
                    type="text"
                    value={contactTelegram}
                    onChange={(e) => setContactTelegram(e.target.value)}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">{t.contact.form.message}</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none text-sm sm:text-base"
                    placeholder={t.contact.form.messagePlaceholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isContactSending}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContactSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Yuborilmoqda...
                    </span>
                  ) : (
                    t.contact.form.send
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm sm:text-base">
            © 2024 Abdujalilov Avrangzeb. {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}

