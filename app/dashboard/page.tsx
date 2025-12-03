"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/auth";

interface Stats {
  notes: number;
  gallery: number;
  quotes: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [stats, setStats] = useState<Stats>({ notes: 0, gallery: 0, quotes: 0 });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Qaydlar soni
      const notesRes = await fetch('/api/notes');
      const notesData = await notesRes.json();
      
      // Galereya soni
      const galleryRes = await fetch('/api/gallery');
      const galleryData = await galleryRes.json();
      
      // Kitob fikrlari soni
      const quotesRes = await fetch('/api/book-quotes');
      const quotesData = await quotesRes.json();

      setStats({
        notes: (notesData?.success && Array.isArray(notesData.data)) ? notesData.data.length : (Array.isArray(notesData) ? notesData.length : 0),
        gallery: (galleryData?.success && Array.isArray(galleryData.data)) ? galleryData.data.length : (Array.isArray(galleryData) ? galleryData.length : 0),
        quotes: (quotesData?.success && Array.isArray(quotesData.data)) ? quotesData.data.length : (Array.isArray(quotesData) ? quotesData.length : 0),
      });
    } catch (error) {
      console.error('Stats load error:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch(`/api/auth/profile?userId=${authUser.id}`);
      const profile = await res.json();

      // Agar profil topilmasa yoki xato bo'lsa
      if (profile.error || !profile.id) {
        // Yangi profil yaratish
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          full_name: null,
          avatar_url: null,
          role: 'user',
          created_at: new Date().toISOString()
        });
        setIsLoading(false);
        return;
      }

      // Admin yoki super_admin bo'lsa admin panelga yo'naltirish
      if (profile.role === 'admin' || profile.role === 'super_admin') {
        router.push('/admin');
        return;
      }

      setUser(profile);
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      
      if (result.success) {
        setAvatarUrl(result.data.url);
        // Avtomatik saqlash
        await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            avatar_url: result.data.url
          })
        });
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          full_name: fullName,
          avatar_url: avatarUrl
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mening Profilim</h1>
                <p className="text-xs text-slate-400">Shaxsiy kabinet</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                Bosh sahifa
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Chiqish"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-violet-600/20 rounded-2xl p-6 sm:p-8 mb-8 border border-cyan-500/30">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user?.full_name || 'Avatar'} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white border-2 border-cyan-500">
                  {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full cursor-pointer hover:bg-cyan-600 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                  {isUploadingAvatar ? (
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </label>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                Xush kelibsiz, {user?.full_name || 'Foydalanuvchi'}!
              </h2>
              <p className="text-slate-400 mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Faol hisob
              </span>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Profil ma&apos;lumotlari</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Tahrirlash
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user?.full_name || '');
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50 text-sm"
                  >
                    {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">To&apos;liq ism</label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              ) : (
                <p className="text-white text-lg">{user?.full_name || 'Kiritilmagan'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Email</label>
              <p className="text-white text-lg">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Hisob turi</label>
              <p className="text-white text-lg">
                {user?.role === 'super_admin' ? '👑 Super Admin' : 
                 user?.role === 'admin' ? '🔧 Admin' : 
                 '👤 Oddiy foydalanuvchi'}
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Ro&apos;yxatdan o&apos;tgan sana</label>
              <p className="text-white text-lg">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Noma\'lum'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.quotes}</div>
            <p className="text-sm text-slate-400">Kitob fikrlari</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-violet-400 mb-1">{stats.gallery}</div>
            <p className="text-sm text-slate-400">Galereya</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{stats.notes}</div>
            <p className="text-sm text-slate-400">Qaydlar</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/"
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-1">Portfolio</h4>
            <p className="text-sm text-slate-400">Bosh sahifani ko&apos;ring</p>
          </Link>

          <Link
            href="/notes"
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-1">Qaydlar</h4>
            <p className="text-sm text-slate-400">Qaydlaringizni ko&apos;ring</p>
          </Link>

          <Link
            href="/#gallery"
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-1">Galereya</h4>
            <p className="text-sm text-slate-400">Rasmlarni ko&apos;ring</p>
          </Link>

          <Link
            href="/auth/change-password"
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-1">Parolni o&apos;zgartirish</h4>
            <p className="text-sm text-slate-400">Yangi parol o&apos;rnating</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


