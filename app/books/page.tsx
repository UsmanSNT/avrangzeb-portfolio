"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Language = "uz" | "en" | "ko";

const translations = {
  uz: {
    title: "Kitoblardan olingan fikirlar",
    subtitle: "O'qigan kitoblarimdan ilhomlantiruvchi fikirlar va xulosalar",
    addNew: "Yangi fikr qo'shish",
    noQuotes: "Hali fikrlar yo'q",
    addFirst: "Birinchi fikrni qo'shing",
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
    back: "Orqaga",
    readMore: "Ko'proq o'qish",
    readLess: "Yopish",
    total: "Jami",
    items: "ta fikr",
  },
  en: {
    title: "Book Quotes",
    subtitle: "Inspiring thoughts and conclusions from books I've read",
    addNew: "Add New Quote",
    noQuotes: "No quotes yet",
    addFirst: "Add the first quote",
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
    confirmDelete: "Do you want to delete this quote?",
    likes: "likes",
    from: "from",
    back: "Back",
    readMore: "Read more",
    readLess: "Show less",
    total: "Total",
    items: "quotes",
  },
  ko: {
    title: "책 인용구",
    subtitle: "읽은 책에서 영감을 주는 생각과 결론",
    addNew: "새 인용구 추가",
    noQuotes: "아직 인용구가 없습니다",
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
    back: "뒤로",
    readMore: "더 읽기",
    readLess: "접기",
    total: "총",
    items: "개 인용구",
  },
};

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

export default function BooksPage() {
  const [language, setLanguage] = useState<Language>("uz");
  const [bookQuotes, setBookQuotes] = useState<BookQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<BookQuote | null>(null);
  const [bookFormTitle, setBookFormTitle] = useState("");
  const [bookFormAuthor, setBookFormAuthor] = useState("");
  const [bookFormQuote, setBookFormQuote] = useState("");
  const [bookFormImage, setBookFormImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Viewing states
  const [viewingQuote, setViewingQuote] = useState<BookQuote | null>(null);
  const [expandedQuotes, setExpandedQuotes] = useState<Set<number>>(new Set());

  const t = translations[language];

  // Load language
  useEffect(() => {
    const savedLang = localStorage.getItem("portfolio-language") as Language;
    if (savedLang && ["uz", "en", "ko"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        const res = await fetch(`/api/auth/profile?userId=${user.id}`);
        const profile = await res.json();
        if (profile && !profile.error) {
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      }
    };
    checkAuth();
  }, []);

  // Fetch quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch('/api/book-quotes');
        const result = await res.json();
        if (result.success && result.data) {
          const formattedQuotes = result.data.map((q: any) => ({
            id: q.id,
            bookTitle: q.book_title,
            author: q.author,
            quote: q.quote,
            image: q.image_url,
            likes: q.likes || 0,
            dislikes: typeof q.dislikes === 'string' ? parseInt(q.dislikes) || 0 : (q.dislikes || 0),
            userReaction: null,
          }));
          // Sort by likes (top first)
          formattedQuotes.sort((a: BookQuote, b: BookQuote) => b.likes - a.likes);
          setBookQuotes(formattedQuotes);
        }
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const toggleQuoteExpand = (id: number) => {
    setExpandedQuotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Image upload
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
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.success) {
        setBookFormImage(result.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const compressed = await compressImage(file);
      setBookFormImage(compressed);
    } finally {
      setIsUploading(false);
    }
  };

  // Modal functions
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

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookFormTitle.trim() || !bookFormQuote.trim()) return;

    try {
      if (editingQuote) {
        // Session token olish
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        const res = await fetch('/api/book-quotes', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingQuote.id,
            book_title: bookFormTitle,
            author: bookFormAuthor,
            quote: bookFormQuote,
            image_url: bookFormImage,
          }),
        });
        if (res.ok) {
          setBookQuotes(bookQuotes.map(q =>
            q.id === editingQuote.id
              ? { ...q, bookTitle: bookFormTitle, author: bookFormAuthor, quote: bookFormQuote, image: bookFormImage }
              : q
          ));
        }
      } else {
        // Session token olish
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        const res = await fetch('/api/book-quotes', {
          method: 'POST',
          headers,
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
      console.error('Submit error:', error);
      alert('Xato: ' + (error.message || 'Saqlashda xatolik yuz berdi'));
    }
  };

  const deleteQuote = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      // Session token olish
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const res = await fetch(`/api/book-quotes?id=${id}`, { 
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        setBookQuotes(bookQuotes.filter(q => q.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleReaction = async (id: number, reaction: 'like' | 'dislike') => {
    const quote = bookQuotes.find(q => q.id === id);
    if (!quote) return;

    let newLikes = quote.likes;
    let newDislikes = quote.dislikes;
    let newReaction: 'like' | 'dislike' | null = reaction;

    if (quote.userReaction === reaction) {
      newReaction = null;
      if (reaction === 'like') newLikes--;
      else newDislikes--;
    } else {
      if (quote.userReaction === 'like') newLikes--;
      else if (quote.userReaction === 'dislike') newDislikes--;
      if (reaction === 'like') newLikes++;
      else newDislikes++;
    }

    setBookQuotes(bookQuotes.map(q =>
      q.id === id ? { ...q, likes: newLikes, dislikes: newDislikes, userReaction: newReaction } : q
    ));

    // Update viewing quote if open
    if (viewingQuote?.id === id) {
      setViewingQuote({ ...viewingQuote, likes: newLikes, dislikes: newDislikes, userReaction: newReaction });
    }

    try {
      // Session token olish
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      
      let accessToken = session?.access_token;
      if (!accessToken && authUser) {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        accessToken = newSession?.access_token;
      }
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const res = await fetch('/api/book-quotes', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, likes: newLikes, dislikes: newDislikes }),
      });
      
      const result = await res.json();
      if (!result.success) {
        // Agar xato bo'lsa, optimistik update'ni bekor qilish
        setBookQuotes(bookQuotes.map(q =>
          q.id === id ? { ...q, likes: quote.likes, dislikes: quote.dislikes, userReaction: quote.userReaction } : q
        ));
        if (viewingQuote?.id === id) {
          setViewingQuote({ ...viewingQuote, likes: quote.likes, dislikes: quote.dislikes, userReaction: quote.userReaction });
        }
        console.error('Reaction error:', result.error);
      }
    } catch (error) {
      // Agar xato bo'lsa, optimistik update'ni bekor qilish
      setBookQuotes(bookQuotes.map(q =>
        q.id === id ? { ...q, likes: quote.likes, dislikes: quote.dislikes, userReaction: quote.userReaction } : q
      ));
      if (viewingQuote?.id === id) {
        setViewingQuote({ ...viewingQuote, likes: quote.likes, dislikes: quote.dislikes, userReaction: quote.userReaction });
      }
      console.error('Reaction error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t.back}</span>
            </Link>
            <h1 className="text-xl font-bold text-white">📚 {t.title}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              📚 {t.title}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-4">{t.subtitle}</p>
          <p className="text-slate-500 text-sm">{t.total}: {bookQuotes.length} {t.items}</p>
          
          {isAdmin && (
            <button
              onClick={() => openBookModal()}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.addNew}
            </button>
          )}
        </div>

        {/* Quotes Grid */}
        {bookQuotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
            <p className="text-slate-500 mb-4">{t.noQuotes}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookQuotes.map((quote) => (
              <div
                key={quote.id}
                className="group bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
              >
                {/* Image */}
                {quote.image && (
                  <div 
                    className="relative h-48 cursor-pointer overflow-hidden"
                    onClick={() => setViewingQuote(quote)}
                  >
                    <img
                      src={quote.image}
                      alt={quote.bookTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  </div>
                )}
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{quote.bookTitle}</h3>
                      <p className="text-cyan-400 text-sm">{quote.author}</p>
                    </div>
                    {quote.likes > 0 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                        👍 {quote.likes}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <p className={`text-slate-300 text-sm leading-relaxed ${
                      !expandedQuotes.has(quote.id) && quote.quote.length > 150 ? 'line-clamp-3' : ''
                    }`}>
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    {quote.quote.length > 150 && (
                      <button
                        onClick={() => toggleQuoteExpand(quote.id)}
                        className="mt-2 text-cyan-400 text-sm hover:underline flex items-center gap-1"
                      >
                        {expandedQuotes.has(quote.id) ? t.readLess : t.readMore}
                        <svg className={`w-4 h-4 transition-transform ${expandedQuotes.has(quote.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReaction(quote.id, 'like')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          quote.userReaction === 'like'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700/50 text-slate-400 hover:text-green-400'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={quote.userReaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {quote.likes}
                      </button>
                      <button
                        onClick={() => handleReaction(quote.id, 'dislike')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          quote.userReaction === 'dislike'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-slate-700/50 text-slate-400 hover:text-red-400'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={quote.userReaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        {quote.dislikes}
                      </button>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openBookModal(quote)}
                          className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteQuote(quote.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
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
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">
                {editingQuote ? t.editTitle : t.addTitle}
              </h3>
              <button onClick={closeBookModal} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              {/* Image Preview */}
              {bookFormImage && (
                <div className="relative">
                  <img src={bookFormImage} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setBookFormImage(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.imageLabel}</label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600 border-dashed rounded-xl cursor-pointer hover:border-cyan-500/50 transition-colors">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-400">{isUploading ? 'Yuklanmoqda...' : (bookFormImage ? t.changeImage : t.uploadImage)}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>
              
              {/* Book Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.bookTitle}</label>
                <input
                  type="text"
                  value={bookFormTitle}
                  onChange={(e) => setBookFormTitle(e.target.value)}
                  placeholder={t.bookTitlePlaceholder}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.author}</label>
                <input
                  type="text"
                  value={bookFormAuthor}
                  onChange={(e) => setBookFormAuthor(e.target.value)}
                  placeholder={t.authorPlaceholder}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              {/* Quote */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.quote}</label>
                <textarea
                  value={bookFormQuote}
                  onChange={(e) => setBookFormQuote(e.target.value)}
                  placeholder={t.quotePlaceholder}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeBookModal}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingQuote ? t.save : t.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Quote Modal */}
      {viewingQuote && viewingQuote.image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button
            onClick={() => setViewingQuote(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl">
            <div className="relative">
              <img
                src={viewingQuote.image}
                alt={viewingQuote.bookTitle}
                className="w-full max-h-[60vh] object-contain bg-black"
              />
            </div>
            
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
              
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => handleReaction(viewingQuote.id, 'like')}
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
                  onClick={() => handleReaction(viewingQuote.id, 'dislike')}
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
    </div>
  );
}

