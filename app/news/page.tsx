"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/app/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SectionsDropdown } from "@/components/SectionsDropdown";
import { supabase } from "@/lib/supabase";
import { getHomeDictionary } from "@/content/locales";
import { defaultLocale, isSupportedLocale, languageLabels, languageStorageKey, supportedLocales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/types";

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

export default function NewsPage() {
  const [language, setLanguage] = useState<Locale>(defaultLocale);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = getHomeDictionary(language);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // News state
  const [news, setNews] = useState<ITNews[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Modal state
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<ITNews | null>(null);
  const [newsFormTitle, setNewsFormTitle] = useState("");
  const [newsFormContent, setNewsFormContent] = useState("");
  const [newsFormImage, setNewsFormImage] = useState<string | null>(null);

  // Viewer state
  const [viewingNews, setViewingNews] = useState<ITNews | null>(null);
  const newsAppliedFromUrl = useRef(false);

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
        const res = await fetch(`/api/auth/profile?userId=${user.id}`);
        const profile = await res.json();
        if (profile && !profile.error) {
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch news
  const fetchNews = async () => {
    try {
      setIsLoadingNews(true);
      const res = await fetch('/api/it-news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('Failed to fetch IT news: HTTP', res.status);
        setNews([]);
        return;
      }

      const result = await res.json();

      if (result && result.error) {
        console.error('API error:', result.error);
        setNews([]);
        return;
      }

      if (Array.isArray(result)) {
        const formattedNews = result
          .filter((item: any) => item && item.id != null)
          .map((item: any) => ({
            id: Number(item.id),
            title: item.title || '',
            content: item.content || '',
            image_url: item.image_url || null,
            views: Number(item.views) || 0,
            created_at: item.created_at || new Date().toISOString(),
            user_profiles: item.user_profiles || null,
          }));
        setNews(formattedNews);
      } else {
        console.warn('Unexpected API response format:', result);
        setNews([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch IT news:', error);
      setNews([]);
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Open the article referenced by ?id=<id> in the URL, once news is loaded
  useEffect(() => {
    if (newsAppliedFromUrl.current || news.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get("id");
    if (!newsId) return;
    const target = news.find((n) => String(n.id) === newsId);
    if (target) {
      openNewsViewer(target);
    }
    newsAppliedFromUrl.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news]);

  // Compress image before upload
  const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.7): Promise<string> => {
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

  // Modal functions
  const openNewsModal = (item?: ITNews) => {
    if (item) {
      setEditingNews(item);
      setNewsFormTitle(item.title);
      setNewsFormContent(item.content);
      setNewsFormImage(item.image_url);
    } else {
      setEditingNews(null);
      setNewsFormTitle("");
      setNewsFormContent("");
      setNewsFormImage(null);
    }
    setIsNewsModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsNewsModalOpen(false);
    setEditingNews(null);
    setNewsFormTitle("");
    setNewsFormContent("");
    setNewsFormImage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setNewsFormImage(result.data.url);
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

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsFormTitle.trim() || !newsFormContent.trim()) {
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

      if (editingNews && editingNews.id) {
        const res = await fetch('/api/it-news', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingNews.id,
            title: newsFormTitle.trim(),
            content: newsFormContent.trim(),
            image_url: newsFormImage?.trim() || null,
          }),
        });
        const result = await res.json();

        if (result.id) {
          closeNewsModal();
          await new Promise(resolve => setTimeout(resolve, 300));
          await fetchNews();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot yangilanmadi'));
        }
      } else {
        const res = await fetch('/api/it-news', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: newsFormTitle.trim(),
            content: newsFormContent.trim(),
            image_url: newsFormImage?.trim() || null,
          }),
        });
        const result = await res.json();

        if (result.id) {
          closeNewsModal();
          await new Promise(resolve => setTimeout(resolve, 300));
          await fetchNews();
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot saqlanmadi'));
        }
      }
    } catch (error: any) {
      console.error('Failed to save IT news:', error);
      alert('Xato: ' + (error.message || 'Saqlashda xatolik yuz berdi'));
    }
  };

  const deleteNews = async (id: number) => {
    if (!confirm(t.itNews.confirmDelete)) return;
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
        await fetchNews();
      } else {
        alert('Xato: ' + (result.error || 'Ma\'lumot o\'chirilmadi'));
      }
    } catch (error) {
      console.error('Failed to delete IT news:', error);
      alert('Xato: Ma\'lumot o\'chirishda xatolik yuz berdi');
    }
  };

  const incrementNewsViews = async (id: number) => {
    try {
      const res = await fetch(`/api/it-news?id=${id}&incrementViews=true`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.views !== undefined) {
          setNews(prevNews =>
            prevNews.map(item =>
              item.id === id ? { ...item, views: data.views } : item
            )
          );
        } else {
          setNews(prevNews =>
            prevNews.map(item =>
              item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
            )
          );
        }
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
      setNews(prevNews =>
        prevNews.map(item =>
          item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
        )
      );
    }
  };

  const shareNews = async (item: ITNews) => {
    try {
      const newsUrl = `${window.location.origin}/news?id=${item.id}`;
      const contentLength = item.content.length;
      const halfContent = item.content.substring(0, Math.floor(contentLength / 2));

      const shareText = `📰 ${item.title}\n\n${halfContent}...\n\n🔗 Davomi: ${newsUrl}`;
      const telegramShareText = `📰 ${item.title}\n\n${halfContent}...\n\n🔗 [Davomi...](${newsUrl})`;
      const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(newsUrl)}&text=${encodeURIComponent(telegramShareText)}`;

      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: newsUrl,
        });
      } else {
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
        const newsUrl = `${window.location.origin}/news?id=${item.id}`;
        const contentLength = item.content.length;
        const halfContent = item.content.substring(0, Math.floor(contentLength / 2));
        const telegramShareText = `📰 ${item.title}\n\n${halfContent}...\n\n🔗 [Davomi...](${newsUrl})`;
        const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(newsUrl)}&text=${encodeURIComponent(telegramShareText)}`;
        window.open(telegramShareLink, '_blank');
      }
    }
  };

  const openNewsViewer = async (item: ITNews) => {
    setViewingNews(item);
    await incrementNewsViews(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
  };

  const closeNewsViewer = () => {
    setViewingNews(null);
    document.body.style.overflow = '';
  };

  // Close viewer on Escape
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-line bg-background/78 shadow-2xl shadow-elevation/20 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo />
              <span className="font-bold text-lg sm:text-xl">Avrangzeb</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <SectionsDropdown locale={language} />
              <ThemeToggle />

              {/* Compact Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="rounded-lg border border-line bg-hover/[0.09] px-2 py-1.5 text-xs font-bold text-cyan-text transition-colors hover:border-accent-cyan/40"
                >
                  {languageLabels[language].flag}
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-background/95 shadow-2xl shadow-elevation/40 backdrop-blur-2xl">
                    {supportedLocales.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          localStorage.setItem(languageStorageKey, lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2/50 transition-colors ${
                          language === lang ? "bg-accent-cyan/20 text-cyan-text" : "text-secondary"
                        }`}
                      >
                        <span className="text-xl">{languageLabels[lang].flag}</span>
                        <span>{languageLabels[lang].name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-surface" aria-hidden="true" />
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[linear-gradient(125deg,rgba(47,226,138,0.12),transparent_35%,rgba(34,211,238,0.1)_78%,transparent),linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-accent-green/20 bg-accent-green/[0.14] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-green-text">
                {t.itNews.title}
              </p>
              <h1 className="mt-5 text-4xl font-black leading-[0.98] text-foreground sm:text-5xl">
                {t.itNews.title}
              </h1>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-7 text-secondary sm:text-lg">
                {t.itNews.subtitle}
              </p>
              {isAdmin && (
                <button
                  onClick={() => openNewsModal()}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm font-bold text-inverse transition-colors hover:bg-accent-cyan sm:px-6 sm:py-3 sm:text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t.itNews.addNew}
                </button>
              )}
            </div>
          </div>

          {isLoadingNews ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto"></div>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-xl border border-line bg-hover/[0.08]">
                <span className="text-2xl font-black text-secondary">N</span>
              </div>
              <p className="text-subtle mb-4">{t.itNews.noNews}</p>
              {isAdmin && (
                <button
                  onClick={() => openNewsModal()}
                  className="text-cyan-text hover:underline"
                >
                  {t.itNews.addFirst}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  id={`it-news-${item.id}`}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-line bg-hover/[0.045] shadow-2xl shadow-elevation/25 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-accent-cyan/40"
                  onClick={() => {
                    openNewsViewer(item);
                  }}
                >
                  {/* Image */}
                  {item.image_url && (
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-muted text-sm line-clamp-3 mb-4">
                      {item.content}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between border-t border-line pt-3">
                      <div className="flex items-center gap-2 text-xs text-subtle">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{item.views} {t.itNews.views}</span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareNews(item);
                          }}
                          className="rounded-lg border border-line bg-hover/[0.08] p-2 text-secondary transition-all hover:bg-accent-cyan/10 hover:text-cyan-text"
                          title={t.itNews.share}
                          aria-label={t.itNews.share}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openNewsModal(item);
                              }}
                              className="p-1.5 text-muted hover:text-cyan-text transition-colors"
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
                                deleteNews(item.id);
                              }}
                              className="p-1.5 text-muted hover:text-red-400 transition-colors"
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
      </main>

      {/* Add/Edit Modal */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-line shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-line">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                {editingNews ? t.itNews.editTitle : t.itNews.addTitle}
              </h3>
              <button
                onClick={closeNewsModal}
                className="p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleNewsSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Image Upload */}
              {newsFormImage && (
                <div className="relative">
                  <img src={newsFormImage} alt="IT news cover image preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setNewsFormImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-foreground hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {!newsFormImage && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                    {t.itNews.imageLabel}
                  </label>
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-accent-cyan/50 rounded-xl bg-surface-2/30">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-cyan mb-1"></div>
                      <span className="text-xs text-cyan-text">Yuklanmoqda...</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-line rounded-xl cursor-pointer hover:border-accent-cyan/50 transition-colors">
                      <svg className="w-6 h-6 text-subtle mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-subtle">{t.itNews.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                  {t.itNews.newsTitle} *
                </label>
                <input
                  type="text"
                  value={newsFormTitle}
                  onChange={(e) => setNewsFormTitle(e.target.value)}
                  required
                  placeholder={t.itNews.newsTitlePlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface/50 border border-line rounded-xl text-foreground placeholder-subtle focus:outline-none focus:border-accent-cyan transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                  {t.itNews.newsContent} *
                </label>
                <textarea
                  value={newsFormContent}
                  onChange={(e) => setNewsFormContent(e.target.value)}
                  required
                  rows={6}
                  placeholder={t.itNews.newsContentPlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface/50 border border-line rounded-xl text-foreground placeholder-subtle focus:outline-none focus:border-accent-cyan transition-colors resize-none text-sm sm:text-base"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeNewsModal}
                  className="flex-1 py-2.5 sm:py-3 px-4 border border-line rounded-xl text-secondary hover:bg-surface-2/50 transition-colors text-sm sm:text-base"
                >
                  {t.itNews.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-accent-cyan to-accent-green rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-accent-cyan/30 transition-all text-sm sm:text-base"
                >
                  {editingNews ? t.itNews.save : t.itNews.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IT News Viewer Modal */}
      {viewingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-card rounded-2xl border border-line shadow-2xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-line p-4 sm:p-6 flex items-center justify-between z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground pr-4">
                {viewingNews.title}
              </h2>
              <div className="flex items-center gap-2">
                {/* Share button */}
                <button
                  onClick={() => shareNews(viewingNews)}
                  className="p-2 rounded-lg bg-surface-2/50 text-secondary hover:text-cyan-text hover:bg-accent-cyan/10 transition-all"
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
                      setTimeout(() => openNewsModal(viewingNews), 100);
                    }}
                    className="p-2 text-muted hover:text-cyan-text transition-colors"
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
                  className="p-2 text-muted hover:text-foreground transition-colors"
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
                <div className="flex items-center gap-4 mb-6 text-sm text-muted">
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
                  <div className="text-secondary text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {viewingNews.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
