"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Language = "uz" | "en" | "ko";

const translations = {
  uz: {
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
    back: "Orqaga",
    total: "Jami",
    items: "ta element",
  },
  en: {
    title: "Gallery",
    subtitle: "Memorable photos, certificates, and important moments",
    addNew: "Add New Gallery",
    noItems: "No gallery items yet",
    addFirst: "Add the first gallery item",
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
    confirmDelete: "Do you want to delete this gallery item?",
    back: "Back",
    total: "Total",
    items: "items",
  },
  ko: {
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
    back: "뒤로",
    total: "총",
    items: "개 항목",
  },
};

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: 'certificate' | 'event' | 'memory' | 'achievement' | 'other';
  images: string[];
  date: string;
}

export default function GalleryPage() {
  const [language, setLanguage] = useState<Language>("uz");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modal states
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryFormTitle, setGalleryFormTitle] = useState("");
  const [galleryFormDescription, setGalleryFormDescription] = useState("");
  const [galleryFormCategory, setGalleryFormCategory] = useState<GalleryItem['category']>("memory");
  const [galleryFormImages, setGalleryFormImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Viewing states
  const [viewingGallery, setViewingGallery] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        const res = await fetch(`/api/auth/profile?userId=${user.id}`);
        const profile = await res.json();
        if (profile && !profile.error) {
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      }
    };
    checkAuth();
  }, []);

  // Fetch gallery
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        const result = await res.json();
        if (result.success && result.data && Array.isArray(result.data)) {
          // Null va undefined qiymatlarni tozalash
          const validItems = result.data.filter((item: any) => item && item.id !== null && item.id !== undefined);
          
          if (validItems.length > 0) {
            const formattedItems = validItems.map((item: any) => ({
              id: item.id || 0,
              title: item.title || '',
              description: item.description || '',
              category: (item.category || 'other') as GalleryItem['category'],
              images: Array.isArray(item.images) ? item.images : [],
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }));
            setGalleryItems(formattedItems);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const getCategoryIcon = (category: GalleryItem['category']) => {
    switch (category) {
      case 'certificate': return '📜';
      case 'event': return '🎉';
      case 'memory': return '📸';
      case 'achievement': return '🏆';
      default: return '📁';
    }
  };

  // Modal functions
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
    if (!files) return;
    
    setIsUploading(true);
    
    for (let i = 0; i < files.length && galleryFormImages.length < 5; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const result = await res.json();
        if (result.success) {
          setGalleryFormImages(prev => [...prev, result.data.url]);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setIsUploading(false);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFormImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormTitle.trim()) return;

    try {
      if (editingGallery) {
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
          // Gallery ma'lumotlarini qayta yuklash
          try {
            const fetchRes = await fetch('/api/gallery');
            const fetchResult = await fetchRes.json();
            if (fetchResult.success && fetchResult.data && Array.isArray(fetchResult.data)) {
              const validItems = fetchResult.data.filter((item: any) => item && item.id !== null && item.id !== undefined);
              if (validItems.length > 0) {
                const formattedItems = validItems.map((item: any) => ({
                  id: item.id || 0,
                  title: item.title || '',
                  description: item.description || '',
                  category: (item.category || 'other') as GalleryItem['category'],
                  images: Array.isArray(item.images) ? item.images : [],
                  date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                }));
                setGalleryItems(formattedItems);
              }
            }
          } catch (fetchError) {
            console.error('Failed to refresh gallery:', fetchError);
            // Optimistic update
            setGalleryItems(galleryItems.map(item =>
              item.id === editingGallery.id
                ? { ...item, title: galleryFormTitle, description: galleryFormDescription, category: galleryFormCategory, images: galleryFormImages }
                : item
            ));
          }
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot yangilanmadi'));
        }
      } else {
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
          // Gallery ma'lumotlarini qayta yuklash
          try {
            const fetchRes = await fetch('/api/gallery');
            const fetchResult = await fetchRes.json();
            if (fetchResult.success && fetchResult.data && Array.isArray(fetchResult.data)) {
              const validItems = fetchResult.data.filter((item: any) => item && item.id !== null && item.id !== undefined);
              if (validItems.length > 0) {
                const formattedItems = validItems.map((item: any) => ({
                  id: item.id || 0,
                  title: item.title || '',
                  description: item.description || '',
                  category: (item.category || 'other') as GalleryItem['category'],
                  images: Array.isArray(item.images) ? item.images : [],
                  date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                }));
                setGalleryItems(formattedItems);
              } else {
                // Optimistic update
                const newItem: GalleryItem = {
                  id: result.data.id || Date.now(),
                  title: galleryFormTitle,
                  description: galleryFormDescription,
                  category: galleryFormCategory,
                  images: galleryFormImages,
                  date: new Date().toISOString().split('T')[0],
                };
                setGalleryItems([newItem, ...galleryItems]);
              }
            }
          } catch (fetchError) {
            console.error('Failed to refresh gallery:', fetchError);
            // Optimistic update
            const newItem: GalleryItem = {
              id: result.data.id || Date.now(),
              title: galleryFormTitle,
              description: galleryFormDescription,
              category: galleryFormCategory,
              images: galleryFormImages,
              date: new Date().toISOString().split('T')[0],
            };
            setGalleryItems([newItem, ...galleryItems]);
          }
        } else {
          alert('Xato: ' + (result.error || 'Ma\'lumot saqlanmadi'));
        }
      }
      closeGalleryModal();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const deleteGalleryItem = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      // Session token olish
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      let accessToken = session?.access_token;
      if (!accessToken && authUser) {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        accessToken = newSession?.access_token;
      }
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const res = await fetch(`/api/gallery?id=${id}`, { 
        method: 'DELETE',
        headers
      });
      const result = await res.json();
      
      if (result.success) {
        // Optimistic update
        setGalleryItems(galleryItems.filter(item => item.id !== id));
        
        // Gallery ma'lumotlarini qayta yuklash
        try {
          const fetchRes = await fetch('/api/gallery');
          const fetchResult = await fetchRes.json();
          if (fetchResult.success && fetchResult.data && Array.isArray(fetchResult.data)) {
            const validItems = fetchResult.data.filter((item: any) => item && item.id !== null && item.id !== undefined);
            if (validItems.length > 0) {
              const formattedItems = validItems.map((item: any) => ({
                id: item.id || 0,
                title: item.title || '',
                description: item.description || '',
                category: (item.category || 'other') as GalleryItem['category'],
                images: Array.isArray(item.images) ? item.images : [],
                date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              }));
              setGalleryItems(formattedItems);
            }
          }
        } catch (fetchError) {
          console.error('Failed to refresh gallery after delete:', fetchError);
        }
      } else {
        alert('Xato: ' + (result.error || 'Ma\'lumot o\'chirilmadi'));
      }
    } catch (error) {
      console.error('Delete error:', error);
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
            <h1 className="text-xl font-bold text-white">🖼️ {t.title}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              🖼️ {t.title}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-4">{t.subtitle}</p>
          <p className="text-slate-500 text-sm">{t.total}: {galleryItems.length} {t.items}</p>
          
          {isAdmin && (
            <button
              onClick={() => openGalleryModal()}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full font-medium text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.addNew}
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-4xl">🖼️</span>
            </div>
            <p className="text-slate-500 mb-4">{t.noItems}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
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
                      {t.categories[item.category]}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span className="text-xs text-slate-500">{item.date}</span>
                    
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openGalleryModal(item)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
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
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">
                {editingGallery ? t.editTitle : t.addTitle}
              </h3>
              <button onClick={closeGalleryModal} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleGallerySubmit} className="p-6 space-y-4">
              {/* Image Previews */}
              {galleryFormImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {galleryFormImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Image Upload */}
              {galleryFormImages.length < 5 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t.images}</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600 border-dashed rounded-xl cursor-pointer hover:border-cyan-500/50 transition-colors">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-400">{isUploading ? 'Yuklanmoqda...' : t.uploadImages}</span>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                  <p className="text-xs text-slate-500 mt-1">{t.maxImages}</p>
                </div>
              )}
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.itemTitle}</label>
                <input
                  type="text"
                  value={galleryFormTitle}
                  onChange={(e) => setGalleryFormTitle(e.target.value)}
                  placeholder={t.itemTitlePlaceholder}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.itemCategory}</label>
                <select
                  value={galleryFormCategory}
                  onChange={(e) => setGalleryFormCategory(e.target.value as GalleryItem['category'])}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="certificate">{t.categories.certificate}</option>
                  <option value="event">{t.categories.event}</option>
                  <option value="memory">{t.categories.memory}</option>
                  <option value="achievement">{t.categories.achievement}</option>
                  <option value="other">{t.categories.other}</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.itemDescription}</label>
                <textarea
                  value={galleryFormDescription}
                  onChange={(e) => setGalleryFormDescription(e.target.value)}
                  placeholder={t.itemDescriptionPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeGalleryModal}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingGallery ? t.save : t.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Viewer Modal */}
      {viewingGallery && viewingGallery.images.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button
            onClick={closeGalleryViewer}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {viewingGallery.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <div className="max-w-4xl w-full">
            <img
              src={viewingGallery.images[currentImageIndex]}
              alt={viewingGallery.title}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">{viewingGallery.title}</h3>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">{viewingGallery.description}</p>
            </div>
            
            {viewingGallery.images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
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
      )}
    </div>
  );
}

