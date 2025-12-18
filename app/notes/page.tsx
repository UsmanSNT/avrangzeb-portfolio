"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Language types
type Language = "uz" | "en" | "ko";

// Translations
const translations = {
  uz: {
    nav: {
      notes: "Qaydlar",
      home: "Bosh sahifa",
      newNote: "Yangi qayd",
    },
    header: {
      title: "📚 O'rganish qaydlari",
      description: "Tarmoq administratsiyasi bo'yicha kunlik qaydlar, o'rganilgan mavzular va foydali ma'lumotlar. Yangi qayd qo'shish uchun \"Yangi qayd\" tugmasini bosing!",
    },
    search: {
      placeholder: "Qaydlarni qidirish...",
    },
    categories: {
      all: "Barchasi",
      networking: "Tarmoq asoslari",
      linux: "Linux",
      cisco: "Cisco",
      devops: "DevOps",
      security: "Xavfsizlik",
      other: "Boshqa",
    },
    notes: {
      noNotes: "Qaydlar topilmadi",
      addNew: "Yangi qayd qo'shish",
      selectNote: "Qaydni tanlang yoki yangi qayd qo'shing",
      back: "Orqaga",
      useful: "Bu qayd boshqalar uchun ham foydali bo'lishi mumkin!",
      confirmDelete: "Bu qaydni o'chirishni xohlaysizmi?",
    },
    modal: {
      addTitle: "Yangi qayd qo'shish",
      editTitle: "Qaydni tahrirlash",
      titleLabel: "Sarlavha *",
      titlePlaceholder: "Masalan: Linux asosiy buyruqlar",
      categoryLabel: "Kategoriya *",
      tagsLabel: "Teglar (vergul bilan ajrating)",
      tagsPlaceholder: "Masalan: CLI, Bash, Commands",
      contentLabel: "Matn *",
      contentPlaceholder: "Qayd matnini yozing... (## Sarlavha uchun, ### Kichik sarlavha uchun, - ro'yxat uchun)",
      contentHint: "Maslahat: ## sarlavha uchun, ### kichik sarlavha uchun, - ro'yxat uchun",
      importantLabel: "⭐ Muhim qayd sifatida belgilash",
      cancel: "Bekor qilish",
      save: "Saqlash",
      add: "Qo'shish",
    },
    info: {
      title: "Bu bo'lim haqida",
      daily: "Kunlik qaydlar",
      dailyDesc: "O'rganilgan mavzular va buyruqlar",
      code: "Kod namunalari",
      codeDesc: "Amaliy misollar va konfiguratsiyalar",
      useful: "Barchaga foydali",
      usefulDesc: "Boshqa talabalar ham foydalanishi mumkin",
    },
    footer: "Barcha huquqlar himoyalangan.",
  },
  en: {
    nav: {
      notes: "Notes",
      home: "Home",
      newNote: "New Note",
    },
    header: {
      title: "📚 Learning Notes",
      description: "Daily notes on network administration, learned topics, and useful information. Click \"New Note\" button to add a new note!",
    },
    search: {
      placeholder: "Search notes...",
    },
    categories: {
      all: "All",
      networking: "Networking",
      linux: "Linux",
      cisco: "Cisco",
      devops: "DevOps",
      security: "Security",
      other: "Other",
    },
    notes: {
      noNotes: "No notes found",
      addNew: "Add new note",
      selectNote: "Select a note or add a new one",
      back: "Back",
      useful: "This note can be useful for others too!",
      confirmDelete: "Are you sure you want to delete this note?",
    },
    modal: {
      addTitle: "Add New Note",
      editTitle: "Edit Note",
      titleLabel: "Title *",
      titlePlaceholder: "e.g., Linux basic commands",
      categoryLabel: "Category *",
      tagsLabel: "Tags (separate with comma)",
      tagsPlaceholder: "e.g., CLI, Bash, Commands",
      contentLabel: "Content *",
      contentPlaceholder: "Write your note... (## for heading, ### for subheading, - for list)",
      contentHint: "Tip: ## for heading, ### for subheading, - for list",
      importantLabel: "⭐ Mark as important note",
      cancel: "Cancel",
      save: "Save",
      add: "Add",
    },
    info: {
      title: "About This Section",
      daily: "Daily Notes",
      dailyDesc: "Learned topics and commands",
      code: "Code Examples",
      codeDesc: "Practical examples and configurations",
      useful: "Useful for Everyone",
      usefulDesc: "Other students can also benefit",
    },
    footer: "All rights reserved.",
  },
  ko: {
    nav: {
      notes: "노트",
      home: "홈",
      newNote: "새 노트",
    },
    header: {
      title: "📚 학습 노트",
      description: "네트워크 관리에 대한 일일 노트, 학습 주제 및 유용한 정보. 새 노트를 추가하려면 \"새 노트\" 버튼을 클릭하세요!",
    },
    search: {
      placeholder: "노트 검색...",
    },
    categories: {
      all: "전체",
      networking: "네트워킹",
      linux: "리눅스",
      cisco: "시스코",
      devops: "데브옵스",
      security: "보안",
      other: "기타",
    },
    notes: {
      noNotes: "노트를 찾을 수 없습니다",
      addNew: "새 노트 추가",
      selectNote: "노트를 선택하거나 새 노트를 추가하세요",
      back: "뒤로",
      useful: "이 노트는 다른 사람들에게도 유용할 수 있습니다!",
      confirmDelete: "이 노트를 삭제하시겠습니까?",
    },
    modal: {
      addTitle: "새 노트 추가",
      editTitle: "노트 편집",
      titleLabel: "제목 *",
      titlePlaceholder: "예: 리눅스 기본 명령어",
      categoryLabel: "카테고리 *",
      tagsLabel: "태그 (쉼표로 구분)",
      tagsPlaceholder: "예: CLI, Bash, Commands",
      contentLabel: "내용 *",
      contentPlaceholder: "노트를 작성하세요... (## 제목, ### 소제목, - 목록)",
      contentHint: "팁: ## 제목용, ### 소제목용, - 목록용",
      importantLabel: "⭐ 중요 노트로 표시",
      cancel: "취소",
      save: "저장",
      add: "추가",
    },
    info: {
      title: "이 섹션에 대해",
      daily: "일일 노트",
      dailyDesc: "학습한 주제와 명령어",
      code: "코드 예제",
      codeDesc: "실용적인 예제와 설정",
      useful: "모두에게 유용",
      usefulDesc: "다른 학생들도 활용 가능",
    },
    footer: "모든 권리 보유.",
  },
};

// Category mapping for display
const categoryKeys = ["all", "networking", "linux", "cisco", "devops", "security", "other"] as const;
const categoryValues: Record<string, string> = {
  "Barchasi": "all",
  "Tarmoq asoslari": "networking",
  "Linux": "linux",
  "Cisco": "cisco",
  "DevOps": "devops",
  "Xavfsizlik": "security",
  "Boshqa": "other",
  "All": "all",
  "Networking": "networking",
  "Security": "security",
  "Other": "other",
  "전체": "all",
  "네트워킹": "networking",
  "리눅스": "linux",
  "시스코": "cisco",
  "데브옵스": "devops",
  "보안": "security",
  "기타": "other",
};

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

// Icons
const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

// Note type
interface Note {
  id: number;
  title: string;
  date: string;
  categoryKey: string;
  tags: string[];
  content: string;
  important: boolean;
}

// Default notes data
const defaultNotes: Note[] = [
  {
    id: 1,
    title: "OSI modeli va TCP/IP protokollari",
    date: "2024-11-28",
    categoryKey: "networking",
    tags: ["OSI", "TCP/IP", "Protokollar"],
    content: `## OSI modeli - 7 qatlam

1. **Physical (Fizik)** - Kabel, signal, bitlar
2. **Data Link** - MAC manzil, switch
3. **Network** - IP manzil, router
4. **Transport** - TCP/UDP, port
5. **Session** - Ulanishni boshqarish
6. **Presentation** - Shifrlash, siqish
7. **Application** - HTTP, FTP, DNS

## TCP vs UDP

| TCP | UDP |
|-----|-----|
| Ishonchli | Tez |
| Ulanishga asoslangan | Ulanishsiz |
| HTTP, FTP, SSH | DNS, DHCP, VoIP |

### Eslatma:
TCP = "Please Deliver Carefully" 📦
UDP = "Just Throw It" 🏀`,
    important: true,
  },
  {
    id: 2,
    title: "Linux asosiy buyruqlar",
    date: "2024-11-27",
    categoryKey: "linux",
    tags: ["CLI", "Bash", "Commands"],
    content: `## Fayl tizimlari bilan ishlash

\`\`\`bash
ls -la          # Fayllar ro'yxati
cd /path        # Katalogga o'tish
pwd             # Joriy katalog
mkdir folder    # Yangi papka
rm -rf folder   # O'chirish (ehtiyot bo'ling!)
cp source dest  # Nusxalash
mv old new      # Ko'chirish/nomini o'zgartirish
\`\`\`

## Tarmoq buyruqlari

\`\`\`bash
ip addr         # IP manzilni ko'rish
ping google.com # Ulanishni tekshirish
netstat -tulpn  # Ochiq portlar
ss -tulpn       # Zamonaviy netstat
traceroute      # Yo'nalishni kuzatish
\`\`\`

## Foydali maslahat:
\`Tab\` tugmasini bosib buyruqlarni avtomatik to'ldiring!`,
    important: false,
  },
  {
    id: 3,
    title: "Cisco switch konfiguratsiyasi",
    date: "2024-11-26",
    categoryKey: "cisco",
    tags: ["Switch", "VLAN", "IOS"],
    content: `## Asosiy konfiguratsiya

\`\`\`
enable
configure terminal
hostname SW1
enable secret cisco123
\`\`\`

## VLAN yaratish

\`\`\`
vlan 10
name SERVERS
vlan 20
name USERS
exit
\`\`\`

## Portga VLAN biriktirish

\`\`\`
interface FastEthernet0/1
switchport mode access
switchport access vlan 10
no shutdown
\`\`\`

### Muhim:
Har doim \`copy running-config startup-config\` bilan saqlang!`,
    important: true,
  },
  {
    id: 4,
    title: "Subnetting asoslari",
    date: "2024-11-25",
    categoryKey: "networking",
    tags: ["IP", "Subnet", "CIDR"],
    content: `## CIDR notatsiyasi

| CIDR | Subnet Mask | Hostlar soni |
|------|-------------|--------------|
| /24  | 255.255.255.0 | 254 |
| /25  | 255.255.255.128 | 126 |
| /26  | 255.255.255.192 | 62 |
| /27  | 255.255.255.224 | 30 |
| /28  | 255.255.255.240 | 14 |

## Formula:
Hostlar = 2^(32-prefix) - 2

## Misol:
192.168.1.0/26 uchun:
- Network: 192.168.1.0
- Broadcast: 192.168.1.63
- Hostlar: 192.168.1.1 - 192.168.1.62 (62 ta)

### Tez hisoblash:
256 - subnet = increment
Masalan: /26 = 256 - 192 = 64 qadam`,
    important: false,
  },
  {
    id: 5,
    title: "Docker asoslari",
    date: "2024-11-24",
    categoryKey: "devops",
    tags: ["Docker", "Container", "Image"],
    content: `## Asosiy buyruqlar

\`\`\`bash
docker pull nginx           # Image yuklab olish
docker images               # Imagelar ro'yxati
docker run -d -p 80:80 nginx  # Container ishga tushirish
docker ps                   # Ishlab turgan containerlar
docker ps -a                # Barcha containerlar
docker stop container_id    # To'xtatish
docker rm container_id      # O'chirish
\`\`\`

## Dockerfile misoli

\`\`\`dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
\`\`\``,
    important: false,
  },
  {
    id: 6,
    title: "Firewall va xavfsizlik asoslari",
    date: "2024-11-23",
    categoryKey: "security",
    tags: ["Firewall", "iptables", "Security"],
    content: `## Linux iptables

\`\`\`bash
# Barcha INPUT ni bloklash
iptables -P INPUT DROP

# SSH ruxsat berish
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# HTTP/HTTPS ruxsat
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
\`\`\`

## Xavfsizlik tavsiylari

1. ✅ Kuchli parollar ishlating
2. ✅ SSH uchun key authentication
3. ✅ Keraksiz portlarni yoping
4. ✅ Muntazam yangilanishlar
5. ✅ Loglarni kuzating

## Muhim portlar:
- 22: SSH
- 80: HTTP
- 443: HTTPS
- 3306: MySQL
- 5432: PostgreSQL`,
    important: true,
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [language, setLanguage] = useState<Language>("uz");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategoryKey, setFormCategoryKey] = useState("networking");
  const [formTags, setFormTags] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImportant, setFormImportant] = useState(false);

  const t = translations[language];

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("portfolio-language") as Language;
    if (savedLang && ["uz", "en", "ko"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language to localStorage
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("portfolio-language", lang);
    setIsLangMenuOpen(false);
  };

  const languageLabels = {
    uz: { flag: "🇺🇿", name: "O'zbek" },
    en: { flag: "🇺🇸", name: "English" },
    ko: { flag: "🇰🇷", name: "한국어" },
  };

  // Auth state
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser({ id: session.user.id });
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({ id: session.user.id });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Seed default notes to Supabase
  const seedDefaultNotes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        console.log('seedDefaultNotes - No session token');
        return;
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      console.log('seedDefaultNotes - Seeding default notes...');
      const res = await fetch('/api/notes?action=seed', {
        method: 'PUT',
        headers,
      });

      const result = await res.json();
      console.log('seedDefaultNotes - Response:', result);
      
      if (result.success) {
        if (result.skipped) {
          console.log('seedDefaultNotes - Notes already exist, skipped');
        } else {
          console.log(`seedDefaultNotes - Successfully seeded ${result.count} notes`);
          // Refresh notes after seeding
          await fetchNotes();
        }
      }
    } catch (error: any) {
      console.error('seedDefaultNotes - Error:', error);
    }
  };

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    try {
      setIsLoadingNotes(true);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch('/api/notes', {
        method: 'GET',
        headers,
      });
      
      if (!res.ok) {
        console.error('fetchNotes - HTTP error:', res.status, res.statusText);
        const errorText = await res.text();
        console.error('fetchNotes - Error response:', errorText);
        setNotes([]);
        return;
      }

      const result = await res.json();
      
      console.log('fetchNotes - API response:', result);
      console.log('fetchNotes - result.success:', result.success);
      console.log('fetchNotes - result.data:', result.data);
      console.log('fetchNotes - result.data is array:', Array.isArray(result.data));
      console.log('fetchNotes - result.data length:', Array.isArray(result.data) ? result.data.length : 'N/A');
      
      // Agar result.data mavjud va array bo'lsa
      if (result && result.success !== false && result.data && Array.isArray(result.data)) {
        console.log('fetchNotes - Data array received, length:', result.data.length);
        
        if (result.data.length > 0) {
          // Supabase'dan kelgan ma'lumotlarni Note formatiga o'tkazish
          const formattedNotes: Note[] = result.data
            .filter((item: any) => {
              const isValid = item && item.id != null && item.title;
              if (!isValid) {
                console.warn('fetchNotes - Filtered out invalid note:', item);
              }
              return isValid;
            })
            .map((item: any) => ({
              id: Number(item.id), // Ensure it's a number
              title: String(item.title || 'Sarlavhasiz'),
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              categoryKey: String(item.category || 'other'),
              tags: Array.isArray(item.tags) ? item.tags.map((t: any) => String(t)) : (item.tags ? [String(item.tags)] : []),
              content: String(item.content || ''),
              important: Boolean(item.important || false),
            }));
          
          console.log('fetchNotes - Formatted notes:', formattedNotes);
          console.log('fetchNotes - Formatted notes count:', formattedNotes.length);
          
          if (formattedNotes.length > 0) {
            setNotes(formattedNotes);
          } else {
            console.warn('fetchNotes - All notes were filtered out, using defaults');
            setNotes(defaultNotes);
          }
        } else {
          // Agar ma'lumotlar bo'sh bo'lsa, default notes'larni yuklash
          console.warn('fetchNotes - Empty data array received. Seeding default notes...');
          await seedDefaultNotes();
        }
      } else {
        // Agar result.data mavjud emas yoki noto'g'ri format bo'lsa
        console.error('fetchNotes - Invalid response format:', result);
        if (result.error) {
          console.error('fetchNotes - Error:', result.error);
        }
        setNotes(defaultNotes);
      }
    } catch (error: any) {
      console.error('Failed to fetch notes:', error);
      console.error('Error details:', error.message);
      // Xato bo'lsa, default notes'larni ko'rsatish
      setNotes(defaultNotes);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Load notes from Supabase on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategoryKey === "all" || note.categoryKey === selectedCategoryKey;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locales: Record<Language, string> = {
      uz: 'uz-UZ',
      en: 'en-US',
      ko: 'ko-KR',
    };
    return date.toLocaleDateString(locales[language], { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryName = (key: string) => {
    const categories = t.categories as Record<string, string>;
    return categories[key] || key;
  };

  const resetForm = () => {
    setFormTitle("");
    setFormCategoryKey("networking");
    setFormTags("");
    setFormContent("");
    setFormImportant(false);
    setIsEditing(false);
    setEditingNote(null);
  };

  const openModal = (note?: Note) => {
    if (note) {
      setIsEditing(true);
      setEditingNote(note);
      setFormTitle(note.title);
      setFormCategoryKey(note.categoryKey);
      setFormTags(note.tags.join(", "));
      setFormContent(note.content);
      setFormImportant(note.important);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formTags.split(",").map(tag => tag.trim()).filter(tag => tag);
    const today = new Date().toISOString().split('T')[0];

    try {
      if (isEditing && editingNote) {
        // Update note in Supabase
        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch('/api/notes', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingNote.id,
            title: formTitle,
            content: formContent,
            category: formCategoryKey,
            tags: tagsArray,
            important: formImportant,
          }),
        });

        const result = await res.json();
        
        if (result.success) {
          // Refresh notes from Supabase
          await fetchNotes();
          
          // Update selected note if it's the one being edited
          if (selectedNote?.id === editingNote.id) {
            const updatedNote = {
              ...editingNote,
              title: formTitle,
              categoryKey: formCategoryKey,
              tags: tagsArray,
              content: formContent,
              important: formImportant,
            };
            setSelectedNote(updatedNote);
          }
        } else {
          alert('Xato: ' + (result.error || 'Qayd yangilanmadi'));
          return;
        }
      } else {
        // Create new note in Supabase
        if (!currentUser) {
          alert('Iltimos, tizimga kiring');
          return;
        }

        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        if (!token) {
          alert('Iltimos, tizimga kiring');
          return;
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
        
        console.log('handleSubmit - Sending POST request with data:', {
          title: formTitle,
          content: formContent,
          category: formCategoryKey,
          tags: tagsArray,
          important: formImportant,
        });

        const res = await fetch('/api/notes', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            category: formCategoryKey,
            tags: tagsArray,
            important: formImportant,
          }),
        });

        console.log('handleSubmit - Response status:', res.status, res.statusText);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('handleSubmit - HTTP error:', res.status, errorText);
          try {
            const errorResult = JSON.parse(errorText);
            alert('Xato: ' + (errorResult.error || 'Qayd saqlanmadi'));
          } catch {
            alert('Xato: ' + errorText);
          }
          return;
        }

        const result = await res.json();
        
        console.log('handleSubmit - POST response:', result);
        console.log('handleSubmit - result.success:', result.success);
        console.log('handleSubmit - result.data:', result.data);
        
        if (result.success && result.data && result.data.id) {
          console.log('handleSubmit - Note created successfully, refreshing notes...');
          
          // Optimistic update - add new note immediately
          const newNote: Note = {
            id: Number(result.data.id),
            title: String(result.data.title || formTitle),
            date: result.data.created_at ? new Date(result.data.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            categoryKey: String(result.data.category || formCategoryKey),
            tags: Array.isArray(result.data.tags) ? result.data.tags.map((t: any) => String(t)) : tagsArray,
            content: String(result.data.content || formContent),
            important: Boolean(result.data.important !== undefined ? result.data.important : formImportant),
          };
          
          console.log('handleSubmit - Adding optimistic note:', newNote);
          setNotes(prevNotes => [newNote, ...prevNotes]);
          
          // Refresh notes from Supabase to ensure sync
          setTimeout(async () => {
            await fetchNotes();
          }, 500);
        } else {
          console.error('handleSubmit - Failed to create note:', result);
          alert('Xato: ' + (result.error || 'Qayd saqlanmadi. Ma\'lumotlar qaytarilmadi.'));
          return;
        }
      }

      closeModal();
    } catch (error: any) {
      console.error('Failed to save note:', error);
      alert('Xato: ' + (error.message || 'Saqlashda xatolik yuz berdi'));
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!confirm(t.notes.confirmDelete)) return;

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE',
        headers,
      });

      const result = await res.json();
      
      if (result.success) {
        // Refresh notes from Supabase
        await fetchNotes();
        
        // Clear selected note if it was deleted
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
        }
      } else {
        alert('Xato: ' + (result.error || 'Qayd o\'chirilmadi'));
      }
    } catch (error: any) {
      console.error('Failed to delete note:', error);
      alert('Xato: ' + (error.message || 'O\'chirishda xatolik yuz berdi'));
    }
  };

  return (
    <div className="min-h-screen network-bg text-slate-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="animate-pulse-glow rounded-lg">
                  <Logo />
                </div>
                <span className="font-bold text-xl">Avrangzeb</span>
              </Link>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2 text-cyan-400">
                <BookIcon />
                <span className="font-medium">{t.nav.notes}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <PlusIcon />
                <span className="hidden sm:inline">{t.nav.newNote}</span>
              </button>
              
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors"
                >
                  <GlobeIcon />
                  <span className="text-lg">{languageLabels[language].flag}</span>
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
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
              
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeftIcon />
                <span className="hidden sm:inline">{t.nav.home}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t.header.title}</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t.header.description}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t.search.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCategoryKey(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategoryKey === key
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:text-cyan-400 border border-slate-700"
                }`}
              >
                {getCategoryName(key)}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className={`${selectedNote ? 'hidden lg:block' : ''} lg:col-span-1 space-y-4`}>
              {isLoadingNotes ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="text-slate-500 mt-4">Yuklanmoqda...</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="flex justify-center mb-4">
                    <BookIcon />
                  </div>
                  <p>{t.notes.noNotes}</p>
                  <button
                    onClick={() => openModal()}
                    className="mt-4 text-cyan-400 hover:underline"
                  >
                    {t.notes.addNew}
                  </button>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`relative group p-5 rounded-xl border transition-all cursor-pointer ${
                      selectedNote?.id === note.id
                        ? "bg-slate-800 border-cyan-500/50"
                        : "bg-slate-800/50 border-slate-700 hover:border-cyan-500/30"
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(note);
                        }}
                        className="p-1.5 bg-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1.5 bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-2 pr-16">
                      <h3 className="font-semibold text-slate-200 line-clamp-2">
                        {note.important && <span className="text-yellow-400 mr-1">⭐</span>}
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <CalendarIcon />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                        {getCategoryName(note.categoryKey)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note Detail */}
            <div className={`${selectedNote ? 'block' : 'hidden lg:block'} lg:col-span-2`}>
              {selectedNote ? (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 lg:p-8 sticky top-24">
                  {/* Back button for mobile */}
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="lg:hidden flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-4"
                  >
                    <ArrowLeftIcon />
                    <span>{t.notes.back}</span>
                  </button>

                  {/* Note Header */}
                  <div className="mb-6 pb-6 border-b border-slate-700">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-bold text-slate-100">
                        {selectedNote.important && <span className="text-yellow-400 mr-2">⭐</span>}
                        {selectedNote.title}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(selectedNote)}
                          className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteNote(selectedNote.id)}
                          className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon />
                        <span>{formatDate(selectedNote.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TagIcon />
                        <span>{getCategoryName(selectedNote.categoryKey)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Note Content */}
                  <div className="prose prose-invert prose-cyan max-w-none">
                    <div className="note-content text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {selectedNote.content.split('\n').map((line, index) => {
                        if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-bold text-cyan-400 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-semibold text-violet-400 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('```')) {
                          return null;
                        }
                        if (line.match(/^\d+\.\s/)) {
                          return <p key={index} className="ml-4 my-1">{line}</p>;
                        }
                        if (line.startsWith('- ')) {
                          return <p key={index} className="ml-4 my-1">{line}</p>;
                        }
                        if (line.startsWith('|')) {
                          return <p key={index} className="font-mono text-sm bg-slate-700/30 px-2">{line}</p>;
                        }
                        return <p key={index} className="my-1">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <LightbulbIcon />
                      <span>{t.notes.useful}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex h-96 items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="text-center text-slate-500">
                    <div className="flex justify-center mb-4">
                      <BookIcon />
                    </div>
                    <p>{t.notes.selectNote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 p-8 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <LightbulbIcon />
              {t.info.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <CheckIcon />
                </div>
                <div>
                  <h4 className="font-medium text-slate-200">{t.info.daily}</h4>
                  <p className="text-sm text-slate-400">{t.info.dailyDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                  <CodeIcon />
                </div>
                <div>
                  <h4 className="font-medium text-slate-200">{t.info.code}</h4>
                  <p className="text-sm text-slate-400">{t.info.codeDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <BookIcon />
                </div>
                <div>
                  <h4 className="font-medium text-slate-200">{t.info.useful}</h4>
                  <p className="text-sm text-slate-400">{t.info.usefulDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for adding/editing notes */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-slate-100">
                {isEditing ? t.modal.editTitle : t.modal.addTitle}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t.modal.titleLabel}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder={t.modal.titlePlaceholder}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t.modal.categoryLabel}
                </label>
                <select
                  value={formCategoryKey}
                  onChange={(e) => setFormCategoryKey(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {categoryKeys.filter(k => k !== "all").map((key) => (
                    <option key={key} value={key}>
                      {getCategoryName(key)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t.modal.tagsLabel}
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder={t.modal.tagsPlaceholder}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t.modal.contentLabel}
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  required
                  rows={10}
                  placeholder={t.modal.contentPlaceholder}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {t.modal.contentHint}
                </p>
              </div>

              {/* Important checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="important"
                  checked={formImportant}
                  onChange={(e) => setFormImportant(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="important" className="text-sm text-slate-300">
                  {t.modal.importantLabel}
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  {t.modal.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  {isEditing ? t.modal.save : t.modal.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500">
            © 2024 Abdujalilov Avrangzeb. {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
