"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { Logo } from "@/app/components/Logo";
import { getHomeDictionary } from "@/content/locales";
import { defaultLocale, isSupportedLocale, languageLabels, languageStorageKey, supportedLocales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/types";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { AboutSection } from "@/components/sections/home/AboutSection";
import { SkillsSection } from "@/components/sections/home/SkillsSection";
import { ProjectsGoalsSection } from "@/components/sections/home/ProjectsGoalsSection";
import { MyProjectsSection } from "@/components/sections/home/MyProjectsSection";
import { FooterSection } from "@/components/sections/home/FooterSection";

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

// IT News interface
interface ITNews {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  views: number;
  created_at: string;
  user_profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

// Default gallery items - kod orqali qo'shiladi
const defaultGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Woosuk Universiteti",
    description: "우석대학교 - Janubiy Koreya, Jeonju shahridagi universitetim. Bu yerda axborot xavfsizligi yo'nalishida ta'lim olmoqdaman.",
    category: "memory",
    images: [],
    date: "2024-01-15",
  },
  // Sertifikatlar - kod orqali qo'shiladi
  {
    id: 2,
    title: "Certificate 1",
    description: "Sertifikat - Certificate 1",
    category: "certificate",
    images: ["/images/Certificate_1.jpg"],
    date: "2024-01-01",
  },
  {
    id: 3,
    title: "Certificate 2",
    description: "Sertifikat - Certificate 2",
    category: "certificate",
    images: ["/images/Certificate_2.jpg"],
    date: "2024-01-01",
  },
  {
    id: 4,
    title: "Certificate 3",
    description: "Sertifikat - Certificate 3",
    category: "certificate",
    images: ["/images/Certificate_3.jpg"],
    date: "2024-01-01",
  },
  {
    id: 5,
    title: "Certificate 4",
    description: "Sertifikat - Certificate 4",
    category: "certificate",
    images: ["/images/Certificate_4.jpg"],
    date: "2024-01-01",
  },
  {
    id: 6,
    title: "Certificate 5",
    description: "Sertifikat - Certificate 5",
    category: "certificate",
    images: ["/images/Certificate_5.jpg"],
    date: "2024-01-01",
  },
  {
    id: 7,
    title: "Certificate 6",
    description: "Sertifikat - Certificate 6",
    category: "certificate",
    images: ["/images/Certificate_6.jpg"],
    date: "2024-01-01",
  },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [language, setLanguage] = useState<Locale>(defaultLocale);
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

  // IT News state
  const [itNews, setItNews] = useState<ITNews[]>([]);
  const [isITNewsModalOpen, setIsITNewsModalOpen] = useState(false);
  const [editingITNews, setEditingITNews] = useState<ITNews | null>(null);
  const [itNewsFormTitle, setItNewsFormTitle] = useState("");
  const [itNewsFormContent, setItNewsFormContent] = useState("");
  const [itNewsFormImage, setItNewsFormImage] = useState<string | null>(null);
  const [isLoadingITNews, setIsLoadingITNews] = useState(true);
  const [viewingNews, setViewingNews] = useState<ITNews | null>(null);

  // CV state
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(true);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

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

  const t = getHomeDictionary(language);

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem(languageStorageKey);
    if (isSupportedLocale(savedLang)) {
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
  const shouldReduceMotion = useReducedMotion();

  // Contact form submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSending(true);
    setContactError("");
    setContactSuccess(false);

    // Validation
    if (!contactName.trim()) {
      setContactError("Ism maydoni to'ldirilishi kerak");
      setIsContactSending(false);
      return;
    }

    if (!contactMessage.trim()) {
      setContactError("Xabar maydoni to'ldirilishi kerak");
      setIsContactSending(false);
      return;
    }

    try {
      console.log('Sending contact form:', { name: contactName, telegram: contactTelegram });
      
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          telegram: contactTelegram.trim(),
          message: contactMessage.trim()
        })
      });

      const data = await res.json();
      console.log('Contact form response:', data);

      if (res.ok && data.success) {
        setContactSuccess(true);
        setContactName("");
        setContactTelegram("");
        setContactMessage("");
        // 5 soniyadan keyin success xabarini o'chirish
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        setContactError(data.error || "Xabar yuborishda xatolik yuz berdi");
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setContactError(error.message || "Xabar yuborishda xatolik yuz berdi");
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
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
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

  // Book quotes ma'lumotlarini yuklash funksiyasi
  const fetchBookQuotes = async () => {
    try {
      setIsLoadingQuotes(true);
      console.log('Fetching book quotes...');
      
      // Authentication token olish (user reaction'larini olish uchun)
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      let accessToken = session?.access_token;
      if (!accessToken) {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        accessToken = newSession?.access_token;
      }
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const res = await fetch('/api/book-quotes', {
        headers,
      });
      
      if (!res.ok) {
        console.error('Failed to fetch book quotes - response not ok:', res.status, res.statusText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Book quotes API response:', result);
      console.log('Book quotes API response - success:', result.success);
      console.log('Book quotes API response - data:', result.data);
      console.log('Book quotes API response - data length:', result.data?.length || 0);
      
      if (result.success && result.data && Array.isArray(result.data)) {
        // NULL ID'larni filter qilish va formatlash
        const formattedQuotes = result.data
          .filter((q: any) => {
            // NULL yoki undefined ID'larni o'chirish
            if (!q || q.id === null || q.id === undefined || q.id === '') {
              console.log('Filtering out quote with invalid ID:', q);
              return false;
            }
            // ID'ni number ga o'zgartirish mumkinligini tekshirish
            const idNum = Number(q.id);
            if (isNaN(idNum) || idNum <= 0) {
              console.log('Filtering out quote with invalid ID number:', q.id);
              return false;
            }
            return true;
          })
          .map((q: { id: number; book_title: string; author: string; quote: string; image_url: string | null; likes: number; dislikes: string | number; userReaction?: 'like' | 'dislike' | null }) => {
            try {
              const idNum = Number(q.id);
              const likesNum = Number(q.likes) || 0;
              // dislikes ni to'g'ri parse qilish - agar string bo'lsa va "-1" kabi bo'lsa
              let dislikesNum = 0;
              if (typeof q.dislikes === 'string') {
                const parsed = parseInt(q.dislikes);
                dislikesNum = isNaN(parsed) ? 0 : Math.max(0, parsed); // Manfiy sonlarni 0 ga o'zgartirish
              } else {
                dislikesNum = Number(q.dislikes) || 0;
                if (dislikesNum < 0) dislikesNum = 0;
              }
              
              // API'dan kelgan userReaction'ni ishlatish
              const userReaction = (q.userReaction === 'like' || q.userReaction === 'dislike') ? q.userReaction : null;
              
              const formatted = {
                id: idNum,
                bookTitle: q.book_title || '',
                author: q.author || '',
                quote: q.quote || '',
                image: null,
                likes: likesNum,
                dislikes: dislikesNum,
                userReaction: userReaction, // API'dan kelgan userReaction'ni ishlatish
              };
              
              console.log('Formatted quote:', formatted);
              return formatted;
            } catch (error) {
              console.error('Error formatting quote:', q, error);
              return null;
            }
          })
          .filter((q: any) => q !== null); // null qiymatlarni o'chirish
        
        console.log('Formatted quotes count:', formattedQuotes.length);
        console.log('Formatted quotes:', formattedQuotes);
        
        if (formattedQuotes.length > 0) {
          console.log('Setting book quotes:', formattedQuotes);
          setBookQuotes(formattedQuotes);
        } else {
          console.log('No valid quotes found after filtering, using defaults');
          setBookQuotes(defaultBookQuotes);
        }
      } else {
        console.log('API response not successful or no data, using defaults');
        console.log('Result:', result);
        setBookQuotes(defaultBookQuotes);
      }
    } catch (error: any) {
      console.error('Failed to fetch book quotes:', error);
      console.error('Error details:', error.message, error.stack);
      setBookQuotes(defaultBookQuotes);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // Load book quotes from API on mount
  useEffect(() => {
    fetchBookQuotes();
  }, []);

  // Gallery ma'lumotlarini yuklash funksiyasi
  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const result = await res.json();
      console.log('Gallery API response:', result);
      
      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        const formattedItems = result.data.map((item: { id: number; title: string; description: string; category: string; images: string[] | null; created_at: string }) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
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

  // Load gallery items from API on mount
  useEffect(() => {
    fetchGallery();
  }, []);

  // IT News ma'lumotlarini yuklash funksiyasi
  const fetchITNews = async () => {
    try {
      setIsLoadingITNews(true);
      console.log('Fetching IT News...');
      
      const res = await fetch('/api/it-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Cache'ni o'chirish
      });
      
      console.log('IT News Response status:', res.status);
      console.log('IT News Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch IT news: HTTP', res.status, errorText);
        setItNews([]);
        return;
      }
      
      const result = await res.json();
      console.log('IT News API response type:', typeof result);
      console.log('IT News API response:', result);
      console.log('IT News API response is array:', Array.isArray(result));
      console.log('IT News API response length:', Array.isArray(result) ? result.length : 'N/A');
      
      // API array qaytaradi, lekin error bo'lsa object bo'lishi mumkin
      if (result && result.error) {
        console.error('API error:', result.error);
        setItNews([]);
        return;
      }
      
      // Agar result array bo'lsa
      if (Array.isArray(result)) {
        console.log('Processing array with', result.length, 'items');
        const formattedNews = result
          .filter((item: any) => {
            const isValid = item && item.id != null;
            if (!isValid) {
              console.warn('Filtered out invalid item:', item);
            }
            return isValid;
          })
          .map((item: any) => {
            const formatted = {
              id: Number(item.id),
              title: item.title || '',
              content: item.content || '',
              image_url: item.image_url || null,
              views: Number(item.views) || 0,
              created_at: item.created_at || new Date().toISOString(),
              user_profiles: item.user_profiles || null,
            };
            console.log('Formatted item:', formatted);
            return formatted;
          });
        console.log('Formatted IT News count:', formattedNews.length);
        console.log('Formatted IT News:', formattedNews);
        setItNews(formattedNews);
      } else {
        console.warn('Unexpected API response format:', result);
        console.warn('Response type:', typeof result);
        setItNews([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch IT news:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setItNews([]);
    } finally {
      setIsLoadingITNews(false);
      console.log('IT News fetch completed');
    }
  };

  // Load IT News from API on mount
  useEffect(() => {
    fetchITNews();
  }, []);

  // CV fayl URL - public papkadagi fayl
  const staticCvUrl = '/cv/Avrangzeb_CV.pdf';

  // Fetch CV (agar Supabase'dan kerak bo'lsa)
  const fetchCV = async () => {
    try {
      setIsLoadingCv(true);
      // Avval static faylni tekshiramiz
      const staticExists = await fetch(staticCvUrl, { method: 'HEAD' }).then(res => res.ok).catch(() => false);
      
      if (staticExists) {
        setCvUrl(staticCvUrl);
        setIsLoadingCv(false);
        return;
      }

      // Agar static fayl bo'lmasa, API'dan olamiz
      const res = await fetch('/api/cv');
      const data = await res.json();
      
      if (data.success && data.cv_url) {
        setCvUrl(data.cv_url);
      } else {
        setCvUrl(null);
      }
    } catch (error) {
      console.error('Failed to fetch CV:', error);
      setCvUrl(null);
    } finally {
      setIsLoadingCv(false);
    }
  };

  // Load CV on mount
  useEffect(() => {
    // Static faylni darhol ko'rsatamiz
    setCvUrl(staticCvUrl);
    setIsLoadingCv(false);
    // Background'da API'dan ham tekshiramiz
    fetchCV();
  }, []);

  // CV yuklash
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type tekshirish
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt || '')) {
      alert(t.cv.fileTypes);
      return;
    }

    // File size tekshirish (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(t.cv.maxSize);
      return;
    }

    try {
      setIsUploadingCv(true);
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCvUrl(data.cv_url);
        alert(t.cv.uploadSuccess);
        await fetchCV(); // Refresh
      } else {
        alert(data.error || t.cv.uploadError);
      }
    } catch (error) {
      console.error('CV upload error:', error);
      alert(t.cv.uploadError);
    } finally {
      setIsUploadingCv(false);
      // Reset input
      e.target.value = '';
    }
  };

  // CV o'chirish
  const handleCVDelete = async () => {
    if (!confirm(t.cv.deleteConfirm)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/cv', {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCvUrl(null);
        alert(t.cv.deleteSuccess);
      } else {
        alert(data.error || t.cv.deleteError);
      }
    } catch (error) {
      console.error('CV delete error:', error);
      alert(t.cv.deleteError);
    }
  };

  // ESC tugmasi bilan news viewer'ni yopish
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingNews) {
        closeNewsViewer();
      }
    };

    if (viewingNews) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [viewingNews]);

  // ESC tugmasi bilan boshqa modal/viewer'larni yopish
  useEffect(() => {
    const handleEscapeAll = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isBookModalOpen) closeBookModal();
      else if (isGalleryModalOpen) closeGalleryModal();
      else if (isITNewsModalOpen) closeITNewsModal();
      else if (viewingGallery) closeGalleryViewer();
      else if (viewingQuote) setViewingQuote(null);
    };

    if (isBookModalOpen || isGalleryModalOpen || isITNewsModalOpen || viewingGallery || viewingQuote) {
      document.addEventListener('keydown', handleEscapeAll);
      return () => {
        document.removeEventListener('keydown', handleEscapeAll);
      };
    }
  }, [isBookModalOpen, isGalleryModalOpen, isITNewsModalOpen, viewingGallery, viewingQuote]);

  // Save language to localStorage
  const changeLanguage = (lang: Locale) => {
    setLanguage(lang);
    localStorage.setItem(languageStorageKey, lang);
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
      setBookFormImage(null); // Rasmlarni olib tashladik
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

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
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
      // Session token olish
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        alert('Xato: Ma\'lumot saqlash uchun tizimga kiring');
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
      
      if (editingQuote && editingQuote.id !== null && editingQuote.id !== undefined) {
        // Update existing quote
        console.log('Updating quote with ID:', editingQuote.id);
        const res = await fetch('/api/book-quotes', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingQuote.id,
            book_title: bookFormTitle,
            author: bookFormAuthor,
            quote: bookFormQuote,
            image_url: null, // Rasmlarni olib tashladik
          }),
        });
        const result = await res.json();
        console.log('PUT response:', result);
        
        if (result.success) {
          console.log('Quote updated successfully:', result.data);
          // Modal'ni yopish
          closeBookModal();
          // Kichik kechikish - ma'lumotlar database'ga yozilishini kutish
          await new Promise(resolve => setTimeout(resolve, 500));
          // Ma'lumotlarni qayta yuklash
          await fetchBookQuotes();
        } else {
          console.error('Failed to update quote:', result);
          alert('Xato: ' + (result.error || 'Ma\'lumot yangilanmadi'));
        }
      } else {
        // Create new quote
        console.log('Creating new quote:', { book_title: bookFormTitle, author: bookFormAuthor, quote: bookFormQuote });
        const res = await fetch('/api/book-quotes', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            book_title: bookFormTitle,
            author: bookFormAuthor,
            quote: bookFormQuote,
            image_url: null, // Rasmlarni olib tashladik
          }),
        });
        const result = await res.json();
        console.log('POST response:', result);
        
        if (result.success) {
          console.log('Quote created successfully:', result.data);
          
          // Agar data bo'lsa, optimistik yangilanish
          if (result.data && result.data.id) {
            const newQuote = {
              id: Number(result.data.id),
              bookTitle: result.data.book_title || bookFormTitle,
              author: result.data.author || bookFormAuthor,
              quote: result.data.quote || bookFormQuote,
              image: null,
              likes: Number(result.data.likes) || 0,
              dislikes: typeof result.data.dislikes === 'string' ? parseInt(result.data.dislikes) || 0 : (Number(result.data.dislikes) || 0),
              userReaction: null,
            };
            
            // State'ga to'g'ridan-to'g'ri qo'shish
            setBookQuotes(prev => [newQuote, ...prev]);
            console.log('Quote added to state:', newQuote);
          }
          
          // Modal'ni yopish
          closeBookModal();
          
          // Ma'lumotlarni qayta yuklash (database'dan to'liq ma'lumot olish uchun)
          await new Promise(resolve => setTimeout(resolve, 300));
          await fetchBookQuotes();
        } else {
          console.error('Failed to create quote:', result);
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
        // Session token olish
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          alert('Xato: Ma\'lumot o\'chirish uchun tizimga kiring');
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
        
        const res = await fetch(`/api/book-quotes?id=${id}`, {
          method: 'DELETE',
          headers,
        });
        const result = await res.json();
        
        if (result.success) {
          console.log('Quote deleted successfully');
          // Kichik kechikish - ma'lumotlar database'dan o'chirilishini kutish
          await new Promise(resolve => setTimeout(resolve, 300));
          // Ma'lumotlarni qayta yuklash
          await fetchBookQuotes();
        } else {
          console.error('Failed to delete quote:', result);
          alert('Xato: ' + (result.error || 'Ma\'lumot o\'chirilmadi'));
        }
      } catch (error) {
        console.error('Failed to delete book quote:', error);
        alert('Xato: Ma\'lumot o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleReaction = async (id: number, reaction: 'like' | 'dislike') => {
    const quote = bookQuotes.find(q => q.id === id);
    if (!quote) return;
    
    // Agar user tizimga kirmagan bo'lsa, reaction berish mumkin emas
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      alert('Reaksiya berish uchun tizimga kiring');
      return;
    }
    
    // Agar bir xil reaction bosilgan bo'lsa, o'chirish
    let newReaction: 'like' | 'dislike' | null = reaction;
    if (quote.userReaction === reaction) {
      newReaction = null; // Reaction o'chirish
    }
    
    // Optimistic update
    const updatedQuotes = bookQuotes.map(q => {
      if (q.id === id) {
        // Reaction count'larni hisoblash
        let newLikes = q.likes;
        let newDislikes = q.dislikes;
        
        // Eski reaction'ni olib tashlash
        if (q.userReaction === 'like') newLikes--;
        else if (q.userReaction === 'dislike') newDislikes--;
        
        // Yangi reaction'ni qo'shish
        if (newReaction === 'like') newLikes++;
        else if (newReaction === 'dislike') newDislikes++;
        
        return { ...q, likes: newLikes, dislikes: newDislikes, userReaction: newReaction };
      }
      return q;
    });
    
    setBookQuotes(updatedQuotes);

    // Update in database
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      
      let accessToken = session?.access_token;
      if (!accessToken) {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        accessToken = newSession?.access_token;
      }
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const res = await fetch('/api/book-quotes', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id,
          reaction: newReaction, // Reaction type'ni yuborish
        }),
      });
      
      const result = await res.json();
      
      if (result.success && result.data) {
        // Database'dan kelgan to'g'ri ma'lumotlar bilan yangilash
        setBookQuotes(bookQuotes.map(q => 
          q.id === id 
            ? {
                ...q,
                likes: result.data.likes || q.likes,
                dislikes: result.data.dislikes || q.dislikes,
                userReaction: result.data.userReaction || null,
              }
            : q
        ));
      } else {
        // Xato bo'lsa, eski holatga qaytarish
        setBookQuotes(bookQuotes);
        alert('Xato: ' + (result.error || 'Reaksiya yangilanmadi'));
      }
    } catch (error: any) {
      console.error('Failed to update reaction:', error);
      // Xato bo'lsa, eski holatga qaytarish
      setBookQuotes(bookQuotes);
      alert('Xato: Reaksiya yangilanmadi');
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

          const { data: { session } } = await supabase.auth.getSession();
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
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
          // Ma'lumotlarni qayta yuklash
          const refreshRes = await fetch('/api/gallery');
          const refreshResult = await refreshRes.json();
          if (refreshResult.success && refreshResult.data && Array.isArray(refreshResult.data) && refreshResult.data.length > 0) {
            const formattedItems = refreshResult.data.map((item: { id: number; title: string; description: string; category: string; images: string[] | null; created_at: string }) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              category: item.category as GalleryItem['category'],
              images: Array.isArray(item.images) ? item.images : [],
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }));
            setGalleryItems(formattedItems);
          }
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
          // Ma'lumotlarni qayta yuklash
          await fetchGallery();
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
        // Session token olish
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          alert('Xato: Ma\'lumot o\'chirish uchun tizimga kiring');
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
        
        const res = await fetch(`/api/gallery?id=${id}`, {
          method: 'DELETE',
          headers,
        });
        const result = await res.json();
        
        if (result.success) {
          // Ma'lumotlarni qayta yuklash
          await fetchGallery();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot o\'chirilmadi'));
        }
      } catch (error) {
        console.error('Failed to delete gallery item:', error);
        alert('Xato: Ma\'lumot o\'chirishda xatolik yuz berdi');
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
      case 'memory': return '📷';
      case 'achievement': return '🏆';
      default: return '📁';
    }
  };

  // IT News functions
  const openITNewsModal = (news?: ITNews) => {
    if (news) {
      setEditingITNews(news);
      setItNewsFormTitle(news.title);
      setItNewsFormContent(news.content);
      setItNewsFormImage(news.image_url);
    } else {
      setEditingITNews(null);
      setItNewsFormTitle("");
      setItNewsFormContent("");
      setItNewsFormImage(null);
    }
    setIsITNewsModalOpen(true);
  };

  const closeITNewsModal = () => {
    setIsITNewsModalOpen(false);
    setEditingITNews(null);
    setItNewsFormTitle("");
    setItNewsFormContent("");
    setItNewsFormImage(null);
  };

  const handleITNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressedBase64 = await compressImage(file, 1200, 0.7);
        const arr = compressedBase64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const compressedFile = new File([u8arr], file.name, { type: mime });
        
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('folder', 'it-news');

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
          body: formData,
        });
        const result = await res.json();
        
        if (result.success) {
          setItNewsFormImage(result.data.url);
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

  const handleITNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itNewsFormTitle.trim() || !itNewsFormContent.trim()) {
      alert('Sarlavha va mazmunni kiriting!');
      return;
    }
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        alert('Xato: Ma\'lumot saqlash uchun tizimga kiring');
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
      
      if (editingITNews && editingITNews.id) {
        // Update existing news
        const res = await fetch('/api/it-news', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingITNews.id,
            title: itNewsFormTitle.trim(),
            content: itNewsFormContent.trim(),
            image_url: itNewsFormImage?.trim() || null,
          }),
        });
        const result = await res.json();
        
        if (result.id) {
          closeITNewsModal();
          await new Promise(resolve => setTimeout(resolve, 300));
          await fetchITNews();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot yangilanmadi'));
        }
      } else {
        // Create new news
        const res = await fetch('/api/it-news', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: itNewsFormTitle.trim(),
            content: itNewsFormContent.trim(),
            image_url: itNewsFormImage?.trim() || null,
          }),
        });
        const result = await res.json();
        
        if (result.id) {
          closeITNewsModal();
          await new Promise(resolve => setTimeout(resolve, 300));
          await fetchITNews();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot saqlanmadi'));
        }
      }
    } catch (error: any) {
      console.error('Failed to save IT news:', error);
      alert('Xato: ' + (error.message || 'Saqlashda xatolik yuz berdi'));
    }
  };

  const deleteITNews = async (id: number) => {
    if (confirm(t.itNews.confirmDelete)) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          alert('Xato: Ma\'lumot o\'chirish uchun tizimga kiring');
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
        
        const res = await fetch(`/api/it-news?id=${id}`, {
          method: 'DELETE',
          headers,
        });
        const result = await res.json();
        
        if (result.success) {
          await new Promise(resolve => setTimeout(resolve, 300));
          await fetchITNews();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot o\'chirilmadi'));
        }
      } catch (error) {
        console.error('Failed to delete IT news:', error);
        alert('Xato: Ma\'lumot o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const incrementNewsViews = async (id: number) => {
    try {
      // GET request'da incrementViews=true query parametri bilan yuborish
      const res = await fetch(`/api/it-news?id=${id}&incrementViews=true`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        // API'dan kelgan yangi views sonini to'g'ri yangilash
        if (data && data.views !== undefined) {
          setItNews(prevNews => 
            prevNews.map(news => 
              news.id === id 
                ? { ...news, views: data.views }
                : news
            )
          );
        } else {
          // Agar views kelmasa, optimistic update
          setItNews(prevNews => 
            prevNews.map(news => 
              news.id === id 
                ? { ...news, views: (news.views || 0) + 1 }
                : news
            )
          );
        }
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
      // Optimistic update xato bo'lsa ham
      setItNews(prevNews => 
        prevNews.map(news => 
          news.id === id 
            ? { ...news, views: (news.views || 0) + 1 }
            : news
        )
      );
    }
  };

  const shareITNews = async (news: ITNews) => {
    try {
      // Yangilikning to'g'ri havolasi - aynan usha yangilikka boradi
      const newsUrl = `${window.location.origin}/#it-news-${news.id}`;
      
      // Asosiy mazmunning yarmigacha yuborish
      const contentLength = news.content.length;
      const halfContent = news.content.substring(0, Math.floor(contentLength / 2));
      
      // Formatlangan shablon - mazmun yarimigacha
      const shareText = `📰 ${news.title}\n\n${halfContent}...\n\n🔗 Davomi: ${newsUrl}`;
      
      // Telegram share linki
      const telegramShareText = `📰 ${news.title}\n\n${halfContent}...\n\n🔗 [Davomi...](${newsUrl})`;
      const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(newsUrl)}&text=${encodeURIComponent(telegramShareText)}`;
      
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: shareText,
          url: newsUrl,
        });
      } else {
        // Fallback: Telegram linkini ochish yoki clipboard'ga nusxalash
        const useTelegram = confirm('Telegram orqali yuborishni xohlaysizmi?');
        if (useTelegram) {
          window.open(telegramShareLink, '_blank');
        } else {
          await navigator.clipboard.writeText(shareText);
          alert(t.itNews.shared);
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        // Telegram linkini ochish
        const newsUrl = `${window.location.origin}/#it-news-${news.id}`;
        const contentLength = news.content.length;
        const halfContent = news.content.substring(0, Math.floor(contentLength / 2));
        const telegramShareText = `📰 ${news.title}\n\n${halfContent}...\n\n🔗 [Davomi...](${newsUrl})`;
        const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(newsUrl)}&text=${encodeURIComponent(telegramShareText)}`;
        window.open(telegramShareLink, '_blank');
      }
    }
  };

  // IT News Viewer functions
  const openNewsViewer = async (news: ITNews) => {
    setViewingNews(news);
    // Ko'rishlar sonini oshirish
    await incrementNewsViews(news.id);
    // Scroll to top va body overflow'ni o'chirish
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
  };

  const closeNewsViewer = () => {
    setViewingNews(null);
    document.body.style.overflow = '';
  };

  const credentialPreviewItems = galleryItems.filter((item) => item.category === "certificate").slice(0, 3);

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-200">
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
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#05070d]/78 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
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
                { id: "projects", label: t.nav.projects },
                { id: "my-projects", label: t.nav.myProjects },
                { id: "about", label: t.about.title },
                { id: "skills", label: t.nav.skills },
                { id: "gallery", label: t.nav.gallery },
                { id: "books", label: t.nav.books },
                { id: "it-news", label: t.nav.itNews },
                { id: "contact", label: t.contact.title },
                { id: "notes", label: t.nav.notes, isLink: true, href: "/notes" },
              ].map((item) => (
                item.isLink ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className="rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-cyan-100"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors hover:bg-white/[0.05] hover:text-cyan-100 ${
                      activeSection === item.id ? "bg-cyan-300/10 text-cyan-100" : "text-slate-400"
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
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 transition-colors hover:border-cyan-300/40 sm:gap-2 sm:px-3"
                >
                  <GlobeIcon />
                  <span className="text-lg">{languageLabels[language].flag}</span>
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl">
                    {supportedLocales.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors ${
                          language === lang ? "bg-cyan-500/20 text-cyan-200" : "text-slate-300"
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
                  className="hidden items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-100 sm:flex"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {currentUser?.full_name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  {isAdmin ? t.auth.admin : t.auth.profile}
                </a>
              ) : (
                <a
                  href="/auth/login"
                  className="hidden items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-100 sm:flex"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t.auth.login}
                </a>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition-colors hover:text-cyan-100 md:hidden"
              >
                {isMobileMenuOpen ? <CloseMenuIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 border-t border-white/10 pb-4 pt-4 md:hidden">
              <div className="flex flex-col gap-2">
                {[
                  { id: "projects", label: t.nav.projects },
                  { id: "my-projects", label: t.nav.myProjects },
                  { id: "about", label: t.about.title },
                  { id: "skills", label: t.nav.skills },
                  { id: "gallery", label: t.nav.gallery },
                  { id: "books", label: t.nav.books },
                  { id: "it-news", label: t.nav.itNews },
                  { id: "contact", label: t.contact.title },
                  { id: "notes", label: t.nav.notes, isLink: true, href: "/notes" },
                ].map((item) => (
                  item.isLink ? (
                    <a
                      key={item.id}
                      href={item.href}
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
                    {isAdmin ? t.auth.adminPanel : t.auth.myProfile}
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
                    {t.auth.loginRegister}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <HeroSection
        t={t}
        scrollToSection={scrollToSection}
        cvUrl={cvUrl}
        staticCvUrl={staticCvUrl}
        shouldReduceMotion={shouldReduceMotion}
      />

      <ProjectsGoalsSection t={t} />

      <MyProjectsSection t={t} />

      <AboutSection t={t} />

      <SkillsSection t={t} />

      {/* Gallery Preview */}
      <section id="gallery" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[#060913]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.1),transparent_34%,rgba(139,92,246,0.1)_78%,transparent),linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100">
                {t.gallery.title}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                {t.gallery.subtitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base lg:justify-self-end">
              {t.about.certificates}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {credentialPreviewItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openGalleryViewer(item)}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] text-left shadow-2xl shadow-slate-950/25 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-emerald-300/40"
              >
                {item.images[0] ? (
                  <img src={item.images[0]} alt={item.title} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="grid h-40 place-items-center bg-white/[0.04] text-lg font-black text-slate-400">{t.about.certificates}</div>
                )}
                <div className="p-4">
                  <p className="line-clamp-1 text-base font-black text-white">{item.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/gallery" className="inline-flex items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100 transition-colors hover:border-emerald-200/60 hover:bg-emerald-300/15">
              {t.gallery.viewAll}
            </a>
            {isAdmin && (
              <button onClick={() => openGalleryModal()} className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-white/[0.08]">
                {t.gallery.addNew}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Books Preview */}
      <section id="books" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[#05070d]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.08),transparent_36%,rgba(16,185,129,0.08)_76%,transparent),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">
                {t.books.title}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                {t.books.subtitle}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base lg:justify-self-end">
              {t.nav.notes}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {bookQuotes.slice(0, 3).map((quote) => (
              <button key={quote.id} type="button" onClick={() => setViewingQuote(quote)} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left shadow-2xl shadow-slate-950/25 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-cyan-300/40">
                <p className="line-clamp-5 text-sm leading-6 text-slate-300">&quot;{quote.quote}&quot;</p>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="line-clamp-1 text-sm font-black text-white">{quote.bookTitle}</p>
                  <p className="mt-1 text-xs font-bold text-cyan-100">{quote.author}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/books" className="inline-flex items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition-colors hover:border-cyan-200/60 hover:bg-cyan-300/15">
              {t.books.viewAll}
            </a>
            {isAdmin && (
              <button onClick={() => openBookModal()} className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-white/[0.08]">
                {t.books.addNew}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* IT News Preview */}
      <section id="it-news" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[#060913]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(139,92,246,0.1),transparent_35%,rgba(34,211,238,0.08)_78%,transparent),linear-gradient(180deg,rgba(2,6,23,0.28),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-violet-100">
                {t.itNews.title}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                {t.itNews.subtitle}
              </h2>
            </div>
            {isAdmin && (
              <button onClick={() => openITNewsModal()} className="justify-self-start rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-white/[0.08] lg:justify-self-end">
                {t.itNews.addNew}
              </button>
            )}
          </div>

          {itNews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {itNews.slice(0, 3).map((news, index) => (
                <button key={news.id} id={`it-news-${news.id}`} type="button" onClick={() => openNewsViewer(news)} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left shadow-2xl shadow-slate-950/25 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-violet-300/40">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-violet-300/20 bg-violet-300/10 font-mono text-xs font-black text-violet-100">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{news.views} {t.itNews.views}</span>
                  </div>
                  <p className="line-clamp-2 text-base font-black leading-tight text-white group-hover:text-violet-100">{news.title}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{news.content}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 text-center text-sm text-slate-400">
              {t.itNews.noNews}
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <a href="#it-news" className="inline-flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10 px-5 py-3 text-sm font-black text-violet-100 transition-colors hover:border-violet-200/60 hover:bg-violet-300/15">
              {t.books.viewAll} {t.itNews.title}
            </a>
          </div>
        </div>
      </section>

      {/* Book Quotes Section */}
      <section id="legacy-books" className="hidden">
        <div className="absolute inset-0 bg-[#060913]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.2),rgba(2,6,23,0.9))]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">
                {t.books.title}
              </p>
              <h2 className="mt-5 text-4xl sm:text-5xl font-black leading-[0.98] tracking-normal text-white">
                {t.books.subtitle}
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mb-5 leading-7">
              {t.books.subtitle}
            </p>
            {isAdmin && (
              <button
                onClick={() => openBookModal()}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-950 rounded-lg font-black hover:bg-cyan-50 transition-all text-sm sm:text-base shadow-xl shadow-cyan-500/15"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.books.addNew}
              </button>
            )}
            </div>
          </div>

          {bookQuotes.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-cyan-300/[0.08] border border-cyan-300/20 flex items-center justify-center">
                <span className="text-4xl" aria-hidden="true">B</span>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* TOP 5 - sorted by likes */}
              {[...bookQuotes].sort((a, b) => b.likes - a.likes).slice(0, 5).map((quote) => {
                const isExpanded = expandedQuotes.has(quote.id);
                const isLongQuote = quote.quote.length > 200;
                
                return (
                <div
                  key={quote.id}
                  className="group bg-white/[0.045] rounded-2xl border border-white/10 overflow-hidden hover:-translate-y-1 hover:border-cyan-300/35 transition-all duration-300 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl"
                >
                  {/* Image - kattaroq va bosiladigan */}
                  {quote.image && (
                    <div 
                      className="relative h-52 sm:h-64 overflow-hidden cursor-pointer bg-slate-950"
                      onClick={() => setViewingQuote(quote)}
                    >
                      <img
                        src={quote.image}
                        alt={quote.bookTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
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
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
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
                            aria-label="Edit quote"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteBookQuote(quote.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                            aria-label="Delete quote"
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-slate-200 hover:text-white hover:border-cyan-300/40 transition-all backdrop-blur-xl"
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
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="p-4 sm:p-6 space-y-4">
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
      <section id="legacy-gallery" className="hidden">
        <div className="absolute inset-0 bg-[#080b14]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.14),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.88))]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-violet-100">
                {t.gallery.title}
              </p>
              <h2 className="mt-5 text-4xl sm:text-5xl font-black leading-[0.98] tracking-normal text-white">
                {t.gallery.subtitle}
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mb-5 leading-7">
              {t.gallery.subtitle}
            </p>
            {isAdmin && (
              <button
                onClick={() => openGalleryModal()}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-950 rounded-lg font-black hover:bg-violet-50 transition-all text-sm sm:text-base shadow-xl shadow-violet-500/15"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.gallery.addNew}
              </button>
            )}
            </div>
          </div>

          {galleryItems.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-violet-300/[0.08] border border-violet-300/20 flex items-center justify-center">
                <span className="text-4xl" aria-hidden="true">G</span>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* TOP 5 gallery items */}
              {galleryItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="group bg-white/[0.045] rounded-2xl border border-white/10 overflow-hidden hover:-translate-y-1 hover:border-violet-300/35 transition-all duration-300 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl"
                >
                  {/* Images Preview */}
                  {item.images.length > 0 ? (
                    <div 
                      className="relative h-48 sm:h-56 cursor-pointer overflow-hidden bg-slate-950"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 sm:h-56 bg-slate-950/60 flex items-center justify-center">
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
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
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
                              aria-label="Edit gallery item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteGalleryItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete"
                              aria-label="Delete gallery item"
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-slate-200 hover:text-white hover:border-violet-300/40 transition-all backdrop-blur-xl"
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
                aria-label="Close dialog"
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
            aria-label="Close image viewer"
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
                aria-label="Previous image"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Next image"
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

      {/* CV Section */}
      <section id="legacy-cv" className="hidden">
        <div className="absolute inset-0 bg-[#070a12]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(34,211,238,0.12),transparent_34%,rgba(16,185,129,0.1)_72%,transparent),linear-gradient(180deg,rgba(2,6,23,0.2),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100">
                {t.cv.title}
              </p>
              <h2 className="mt-5 text-4xl font-black leading-[0.98] text-white sm:text-5xl">
                {t.cv.title}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:justify-self-end">
              {t.cv.subtitle}
            </p>
          </div>

          {isLoadingCv ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            </div>
          ) : cvUrl ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-300/[0.12] text-cyan-100">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-1">
                      CV mavjud
                    </h3>
                    <p className="text-sm text-slate-400">
                      CV'ni yuklab olish uchun tugmani bosing
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={cvUrl || staticCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Avrangzeb_CV.pdf"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-100"
                    onClick={(e) => {
                      // Yangi tab'da ochilishini ta'minlash
                      e.preventDefault();
                      window.open(cvUrl || staticCvUrl, '_blank');
                      // Yuklab olish uchun
                      const link = document.createElement('a');
                      link.href = cvUrl || staticCvUrl;
                      link.download = 'Avrangzeb_CV.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.cv.download}
                  </a>
                  {isAdmin && (
                    <>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-slate-300 transition-all hover:bg-white/[0.08]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {isUploadingCv ? t.cv.uploading : t.cv.uploadNew}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleCVUpload}
                          className="hidden"
                          disabled={isUploadingCv}
                        />
                      </label>
                      <button
                        onClick={handleCVDelete}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/50 px-6 py-3 font-semibold text-red-300 transition-all hover:bg-red-500/10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        O'chirish
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {/* Static CV mavjud bo'lsa, uni ko'rsatish */}
              <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-300/[0.12] text-cyan-100">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-1">
                      CV mavjud
                    </h3>
                    <p className="text-sm text-slate-400">
                      CV'ni yuklab olish uchun tugmani bosing
                    </p>
                  </div>
                </div>
                <a
                  href={staticCvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Avrangzeb_CV.pdf"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-100"
                  onClick={(e) => {
                    // Yangi tab'da ochilishini ta'minlash
                    e.preventDefault();
                    window.open(staticCvUrl, '_blank');
                    // Yuklab olish uchun
                    const link = document.createElement('a');
                    link.href = staticCvUrl;
                    link.download = 'Avrangzeb_CV.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t.cv.download}
                </a>
                {isAdmin && (
                  <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-slate-300 transition-all hover:bg-white/[0.08]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {isUploadingCv ? t.cv.uploading : t.cv.uploadNew}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleCVUpload}
                      className="hidden"
                      disabled={isUploadingCv}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* IT News Section */}
      <section id="legacy-it-news" className="hidden">
        <div className="absolute inset-0 bg-[#060913]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(139,92,246,0.12),transparent_35%,rgba(34,211,238,0.1)_78%,transparent),linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-violet-100">
                {t.itNews.title}
              </p>
              <h2 className="mt-5 text-4xl font-black leading-[0.98] text-white sm:text-5xl">
                {t.itNews.title}
              </h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-7 text-slate-300 sm:text-lg">
              {t.itNews.subtitle}
            </p>
            {isAdmin && (
              <button
                onClick={() => openITNewsModal()}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-100 sm:px-6 sm:py-3 sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.itNews.addNew}
              </button>
            )}
            </div>
          </div>

          {isLoadingITNews ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            </div>
          ) : itNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <span className="text-2xl font-black text-slate-300">N</span>
              </div>
              <p className="text-slate-500 mb-4">{t.itNews.noNews}</p>
              {isAdmin && (
                <button
                  onClick={() => openITNewsModal()}
                  className="text-cyan-400 hover:underline"
                >
                  {t.itNews.addFirst}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {itNews.map((news) => (
                <div
                  key={news.id}
                  id={`it-news-${news.id}`}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-slate-950/25 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-cyan-300/40"
                  onClick={() => {
                    openNewsViewer(news);
                  }}
                >
                  {/* Image */}
                  {news.image_url && (
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-slate-200 text-base sm:text-lg mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                      {news.content}
                    </p>
                    
                    {/* Meta info */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{news.views} {t.itNews.views}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareITNews(news);
                          }}
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition-all hover:bg-cyan-500/10 hover:text-cyan-300"
                          title={t.itNews.share}
                          aria-label={t.itNews.share}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                        
                        {/* Edit/Delete - faqat admin uchun */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openITNewsModal(news);
                              }}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                              title="Edit"
                              aria-label="Edit news"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteITNews(news.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete"
                              aria-label="Delete news"
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
          )}
        </div>
      </section>

      {/* IT News Modal */}
      {isITNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                {editingITNews ? t.itNews.editTitle : t.itNews.addTitle}
              </h3>
              <button
                onClick={closeITNewsModal}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleITNewsSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Image Upload */}
              {itNewsFormImage && (
                <div className="relative">
                  <img src={itNewsFormImage} alt="IT news cover image preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setItNewsFormImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {!itNewsFormImage && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    {t.itNews.imageLabel}
                  </label>
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-cyan-500/50 rounded-xl bg-slate-700/30">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mb-1"></div>
                      <span className="text-xs text-cyan-400">Yuklanmoqda...</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-cyan-500/50 transition-colors">
                      <svg className="w-6 h-6 text-slate-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-slate-500">{t.itNews.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleITNewsImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.itNews.newsTitle} *
                </label>
                <input
                  type="text"
                  value={itNewsFormTitle}
                  onChange={(e) => setItNewsFormTitle(e.target.value)}
                  required
                  placeholder={t.itNews.newsTitlePlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  {t.itNews.newsContent} *
                </label>
                <textarea
                  value={itNewsFormContent}
                  onChange={(e) => setItNewsFormContent(e.target.value)}
                  required
                  rows={6}
                  placeholder={t.itNews.newsContentPlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none text-sm sm:text-base"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeITNewsModal}
                  className="flex-1 py-2.5 sm:py-3 px-4 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors text-sm sm:text-base"
                >
                  {t.itNews.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base"
                >
                  {editingITNews ? t.itNews.save : t.itNews.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IT News Viewer Modal - O'qish uchun */}
      {viewingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-4 sm:p-6 flex items-center justify-between z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 pr-4">
                {viewingNews.title}
              </h2>
              <div className="flex items-center gap-2">
                {/* Share button */}
                <button
                  onClick={() => shareITNews(viewingNews)}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  title={t.itNews.share}
                  aria-label={t.itNews.share}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                {/* Edit button - faqat admin uchun */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      closeNewsViewer();
                      setTimeout(() => openITNewsModal(viewingNews), 100);
                    }}
                    className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Edit"
                    aria-label="Edit news"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {/* Close button */}
                <button
                  onClick={closeNewsViewer}
                  className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Close"
                  aria-label="Close article"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Image */}
              {viewingNews.image_url && (
                <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
                  <img
                    src={viewingNews.image_url}
                    alt={viewingNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* News Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Meta info */}
                <div className="flex items-center gap-4 mb-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{viewingNews.views} {t.itNews.views}</span>
                  </div>
                  {viewingNews.created_at && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(viewingNews.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Content text */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {viewingNews.content}
                  </div>
                </div>
              </div>
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
            aria-label="Close quote viewer"
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

      {/* Contact Section */}
      <section id="contact" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[#05070d]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.13),transparent_35%,rgba(139,92,246,0.12)_78%,transparent),linear-gradient(180deg,rgba(2,6,23,0.22),rgba(2,6,23,0.95))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8">
            <div>
              <p className="inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">
                {t.contact.title}
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
                {t.contact.subtitle}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4">
                <a
                  href="mailto:avrangzebabdujalilov@gmail.com"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-colors hover:border-cyan-300/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <MailIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.email}</p>
                    <p className="truncate text-sm text-slate-200 transition-colors group-hover:text-cyan-200 sm:text-base">avrangzebabdujalilov@gmail.com</p>
                  </div>
                </a>
                
                <a
                  href="https://t.me/Avrangzeb_99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-colors hover:border-cyan-300/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <TelegramIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.telegram}</p>
                    <p className="truncate text-sm text-slate-200 transition-colors group-hover:text-cyan-200 sm:text-base">@Avrangzeb_99</p>
                  </div>
                </a>

                <a
                  href="tel:+821023492777"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-colors hover:border-cyan-300/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <PhoneIcon />
        </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.phone}</p>
                    <p className="text-sm text-slate-200 transition-colors group-hover:text-cyan-200 sm:text-base">+82 10-2349-2777</p>
                  </div>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/avrangzeb-abdujalilov-365b5221a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-colors hover:border-cyan-300/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <LinkedInIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.linkedin}</p>
                    <p className="truncate text-sm text-slate-200 transition-colors group-hover:text-cyan-200 sm:text-base">avrangzeb-abdujalilov</p>
                  </div>
                </a>

                <a
                  href="https://github.com/UsmanSNT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-colors hover:border-cyan-300/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <GitHubIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500">{t.contact.github}</p>
                    <p className="truncate text-sm text-slate-200 transition-colors group-hover:text-cyan-200 sm:text-base">UsmanSNT</p>
                  </div>
                </a>
            </div>
            
            {/* Contact Form */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-4 sm:mb-6">
                {t.contact.sendMessage}
              </h3>
              
              {contactSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                  {t.contact.successMessage}
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
                    className="w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-cyan-300 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      {t.contact.form.telegram}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={contactTelegram}
                    onChange={(e) => setContactTelegram(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-cyan-300 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                    placeholder={t.contact.form.telegramPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-slate-400 mb-2">{t.contact.form.message}</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full resize-none rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-cyan-300 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                    placeholder={t.contact.form.messagePlaceholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isContactSending}
                  className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
                >
                  {isContactSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t.contact.form.sending}
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

      <FooterSection t={t} />
    </div>
  );
}



