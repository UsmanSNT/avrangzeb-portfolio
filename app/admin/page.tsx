"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'quotes' | 'gallery' | 'notes' | 'it-news'>('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuotes: 0,
    totalGallery: 0,
    totalNotes: 0,
    totalITNews: 0
  });

  // Check if current user is super_admin
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    checkAuth();
  }, []);

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
        router.push('/dashboard');
        return;
      }

      // Admin yoki super_admin bo'lishi kerak
      if (profile.role !== 'admin' && profile.role !== 'super_admin') {
        router.push('/dashboard');
        return;
      }

      setUser(profile);
      await loadData();
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    }
  };

  const loadData = async () => {
    // Foydalanuvchilarni yuklash
    const { data: usersData } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Super admin'larni birinchi o'ringa qo'yish
    const sortedUsers = (usersData || []).sort((a, b) => {
      if (a.role === 'super_admin' && b.role !== 'super_admin') return -1;
      if (a.role !== 'super_admin' && b.role === 'super_admin') return 1;
      if (a.role === 'admin' && b.role === 'user') return -1;
      if (a.role === 'user' && b.role === 'admin') return 1;
      return 0;
    });
    
    setUsers(sortedUsers);

    // Statistika
    const { count: quotesCount } = await supabase
      .from('portfolio_book_quotes_rows')
      .select('*', { count: 'exact', head: true });

    const { count: galleryCount } = await supabase
      .from('portfolio_gallery_rows')
      .select('*', { count: 'exact', head: true });

    const { count: notesCount } = await supabase
      .from('portfolio_notes_rows')
      .select('*', { count: 'exact', head: true });

    const { count: itNewsCount } = await supabase
      .from('portfolio_it_news')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalUsers: usersData?.length || 0,
      totalQuotes: quotesCount || 0,
      totalGallery: galleryCount || 0,
      totalNotes: notesCount || 0,
      totalITNews: itNewsCount || 0
    });
  };

  // Faqat super_admin rol o'zgartira oladi
  const [roleChangeLoading, setRoleChangeLoading] = useState<string | null>(null);
  const [roleChangeMessage, setRoleChangeMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    // Xavfsizlik: faqat super_admin rol o'zgartira oladi
    if (!isSuperAdmin) {
      setRoleChangeMessage({ type: 'error', text: "Sizda rol o'zgartirish huquqi yo'q!" });
      return;
    }

    setRoleChangeLoading(userId);
    setRoleChangeMessage(null);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Role update error:', error);
        setRoleChangeMessage({ type: 'error', text: `Xato: ${error.message}` });
      } else if (data) {
        // Ma'lumotlarni yangilash
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setRoleChangeMessage({ type: 'success', text: `Rol muvaffaqiyatli o'zgartirildi!` });
        
        // 3 soniyadan keyin xabarni o'chirish
        setTimeout(() => setRoleChangeMessage(null), 3000);
      }
    } catch (err) {
      console.error('Role change error:', err);
      setRoleChangeMessage({ type: 'error', text: 'Kutilmagan xato yuz berdi' });
    } finally {
      setRoleChangeLoading(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Rol ko'rsatish funksiyasi
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Asosiy Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'Foydalanuvchi';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'admin':
        return 'bg-slate-400/20 text-slate-300';
      default:
        return 'bg-green-500/20 text-green-400';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                isSuperAdmin 
                  ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/50' 
                  : 'bg-gradient-to-br from-red-500 to-orange-600'
              }`}>
                {isSuperAdmin && (
                  <>
                    <span className="text-xl">👑</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  </>
                )}
                {!isSuperAdmin && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className={`text-xl font-bold flex items-center gap-2 ${
                  isSuperAdmin ? 'text-yellow-300' : 'text-white'
                }`}>
                  {isSuperAdmin && <span className="text-2xl animate-pulse">👑</span>}
                  Admin Panel
                </h1>
                <p className={`text-xs ${
                  isSuperAdmin ? 'text-yellow-400/80' : 'text-slate-400'
                }`}>
                  {isSuperAdmin ? '👑 Asosiy boshqaruv paneli (Super Admin)' : 'Boshqaruv paneli'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Shaxsiy kabinet
              </Link>
              <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                Saytga qaytish
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-sm font-medium flex items-center gap-1 ${
                    isSuperAdmin ? 'text-yellow-300' : 'text-white'
                  }`}>
                    {isSuperAdmin && <span className="text-base animate-pulse">👑</span>}
                    {user?.full_name || 'Admin'}
                  </p>
                  <p className={`text-xs font-medium flex items-center gap-1 ${
                    isSuperAdmin ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {isSuperAdmin ? (
                      <>
                        <span className="text-sm">👑</span>
                        <span>Super Admin</span>
                      </>
                    ) : (
                      'Administrator'
                    )}
                  </p>
                </div>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Super Admin Notice */}
        {isSuperAdmin && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <p className="text-yellow-400 font-medium">Asosiy Admin sifatida kirgansiz</p>
              <p className="text-yellow-400/70 text-sm">Siz boshqa foydalanuvchilarga admin huquqini berishingiz mumkin</p>
            </div>
          </div>
        )}

        {/* Admin Notice (not super) */}
        {!isSuperAdmin && (
          <div className="mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <p className="text-cyan-400 font-medium">Admin sifatida kirgansiz</p>
              <p className="text-cyan-400/70 text-sm">Siz sayt ma&apos;lumotlarini o&apos;zgartirishingiz mumkin, lekin boshqalarga admin bera olmaysiz</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-sm text-slate-400">Foydalanuvchilar</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalQuotes}</p>
                <p className="text-sm text-slate-400">Iqtiboslar</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalGallery}</p>
                <p className="text-sm text-slate-400">Galereya</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalNotes}</p>
                <p className="text-sm text-slate-400">Qaydlar</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalITNews}</p>
                <p className="text-sm text-slate-400">IT News</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'users', label: 'Foydalanuvchilar', icon: '👥' },
            { id: 'quotes', label: 'Iqtiboslar', icon: '📚' },
            { id: 'gallery', label: 'Galereya', icon: '🖼️' },
            { id: 'it-news', label: 'IT News', icon: '📰' },
            { id: 'notes', label: 'Qaydlar', icon: '📝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              {/* Role change message */}
              {roleChangeMessage && (
                <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
                  roleChangeMessage.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}>
                  {roleChangeMessage.type === 'success' ? '✅' : '❌'} {roleChangeMessage.text}
                </div>
              )}
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Foydalanuvchi</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Sana</th>
                    {isSuperAdmin && (
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Amallar</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {users.map((u) => (
                    <tr 
                      key={u.id} 
                      className={`hover:bg-slate-700/20 transition-colors ${
                        u.role === 'super_admin' ? 'bg-yellow-500/5 border-l-2 border-yellow-500' : 
                        u.role === 'admin' ? 'bg-slate-400/5 border-l-2 border-slate-400' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold relative ${
                            u.role === 'super_admin' 
                              ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/50'
                              : u.role === 'admin'
                              ? 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 shadow-lg shadow-slate-400/50'
                              : 'bg-gradient-to-br from-cyan-500 to-violet-600'
                          }`}>
                            {u.role === 'super_admin' && (
                              <>
                                <span className="text-xl animate-pulse">👑</span>
                                {/* Toj animatsiyasi */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                              </>
                            )}
                            {u.role === 'admin' && (
                              <>
                                <span className="text-xl animate-pulse text-slate-200">👑</span>
                                {/* Kumush toj animatsiyasi */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-300 rounded-full animate-ping"></div>
                              </>
                            )}
                            {u.role !== 'super_admin' && u.role !== 'admin' && (u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?')}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-white font-medium flex items-center gap-2 ${
                              u.role === 'super_admin' ? 'text-yellow-300' : 
                              u.role === 'admin' ? 'text-slate-300' : ''
                            }`}>
                              {u.full_name || 'Nomsiz'}
                              {u.role === 'super_admin' && (
                                <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                                  SUPER ADMIN
                                </span>
                              )}
                              {u.role === 'admin' && (
                                <span className="text-xs px-1.5 py-0.5 bg-slate-400/20 text-slate-300 rounded border border-slate-400/30">
                                  ADMIN
                                </span>
                              )}
                            </span>
                            {u.role === 'super_admin' && (
                              <span className="text-xs text-yellow-400/70">Asosiy boshqaruvchi</span>
                            )}
                            {u.role === 'admin' && (
                              <span className="text-xs text-slate-300/70">Ikkinchi darajali admin</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          u.role === 'super_admin' ? 'text-yellow-300/90' : 
                          u.role === 'admin' ? 'text-slate-300/90' : 
                          'text-slate-400'
                        }>
                          {u.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${getRoleColor(u.role)} ${
                          u.role === 'super_admin' ? 'shadow-lg shadow-yellow-500/30' : 
                          u.role === 'admin' ? 'shadow-lg shadow-slate-400/30' : ''
                        }`}>
                          {u.role === 'super_admin' && (
                            <span className="text-base animate-pulse">👑</span>
                          )}
                          {u.role === 'admin' && (
                            <span className="text-base animate-pulse text-slate-200">👑</span>
                          )}
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(u.created_at).toLocaleDateString('uz-UZ')}
                      </td>
                      {isSuperAdmin && (
                        <td className="px-6 py-4">
                          {/* Super admin o'zini va boshqa super_adminlarni o'zgartira olmaydi */}
                          {u.id !== user?.id && u.role !== 'super_admin' && (
                            <div className="flex items-center gap-2">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as 'admin' | 'user')}
                                disabled={roleChangeLoading === u.id}
                                className={`bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:border-yellow-500 transition-colors ${
                                  roleChangeLoading === u.id ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-500/50'
                                }`}
                                title="Adminlik berish"
                              >
                                <option value="user">Foydalanuvchi</option>
                                <option value="admin">Admin</option>
                              </select>
                              {roleChangeLoading === u.id && (
                                <svg className="animate-spin h-4 w-4 text-yellow-400" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              )}
                            </div>
                          )}
                          {u.id === user?.id && (
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400 text-sm font-medium flex items-center gap-1">
                                <span className="text-base">👑</span>
                                Siz (Super Admin)
                              </span>
                            </div>
                          )}
                          {u.role === 'super_admin' && u.id !== user?.id && (
                            <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                              <span className="text-base">👑</span>
                              Asosiy Admin
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  Hozircha foydalanuvchilar yo&apos;q
                </div>
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Kitob iqtiboslari</h3>
                <Link href="/#books" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Barchasini ko&apos;rish →
                </Link>
              </div>
              <p className="text-slate-400">Jami {stats.totalQuotes} ta iqtibos mavjud. Bosh sahifadan boshqarishingiz mumkin.</p>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Galereya</h3>
                <Link href="/#gallery" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Barchasini ko&apos;rish →
                </Link>
              </div>
              <p className="text-slate-400">Jami {stats.totalGallery} ta galereya elementi mavjud. Bosh sahifadan boshqarishingiz mumkin.</p>
            </div>
          )}

          {activeTab === 'it-news' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">IT News</h3>
                <Link href="/#it-news" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Barchasini ko&apos;rish →
                </Link>
              </div>
              <p className="text-slate-400">Jami {stats.totalITNews} ta IT News mavjud. Bosh sahifadan boshqarishingiz mumkin.</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Qaydlar</h3>
                <Link href="/notes" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Barchasini ko&apos;rish →
                </Link>
              </div>
              <p className="text-slate-400">Jami {stats.totalNotes} ta qayd mavjud. Qaydlar sahifasidan boshqarishingiz mumkin.</p>
            </div>
          )}
        </div>

        {/* Role Permissions Info */}
        <div className="mt-8 bg-slate-800/30 rounded-2xl border border-slate-700/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Rol huquqlari</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👑</span>
                <span className="font-medium text-yellow-400">Asosiy Admin (Super Admin)</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✅ Barcha ma&apos;lumotlarni o&apos;zgartirish</li>
                <li>✅ Boshqalarga admin berish</li>
                <li>✅ Adminlikni olib tashlash</li>
                <li>✅ Faqat 1 ta bo&apos;ladi (Siz)</li>
              </ul>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔧</span>
                <span className="font-medium text-red-400">Admin</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✅ Barcha ma&apos;lumotlarni o&apos;zgartirish</li>
                <li>✅ Kitob fikrlari, galereya, qaydlar</li>
                <li>❌ Boshqalarga admin bera olmaydi</li>
                <li>❌ Rollarni o&apos;zgartira olmaydi</li>
              </ul>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👤</span>
                <span className="font-medium text-green-400">Oddiy Foydalanuvchi</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✅ Ma&apos;lumotlarni ko&apos;rish</li>
                <li>✅ Reaksiya bildirish (like/dislike)</li>
                <li>❌ Ma&apos;lumot qo&apos;sha olmaydi</li>
                <li>❌ Ma&apos;lumot o&apos;zgartira olmaydi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
