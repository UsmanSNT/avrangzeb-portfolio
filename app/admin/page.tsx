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
  const [activeTab, setActiveTab] = useState<'users' | 'quotes' | 'gallery' | 'notes'>('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuotes: 0,
    totalGallery: 0,
    totalNotes: 0
  });

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

      if (profile.role !== 'admin') {
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
    
    setUsers(usersData || []);

    // Statistika
    const { count: quotesCount } = await supabase
      .from('portfolio_book_quotes')
      .select('*', { count: 'exact', head: true });

    const { count: galleryCount } = await supabase
      .from('portfolio_gallery')
      .select('*', { count: 'exact', head: true });

    const { count: notesCount } = await supabase
      .from('portfolio_notes')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalUsers: usersData?.length || 0,
      totalQuotes: quotesCount || 0,
      totalGallery: galleryCount || 0,
      totalNotes: notesCount || 0
    });
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-slate-400">Boshqaruv paneli</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                Saytga qaytish
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.full_name || 'Admin'}</p>
                  <p className="text-xs text-red-400">Administrator</p>
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
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'users', label: 'Foydalanuvchilar', icon: '👥' },
            { id: 'quotes', label: 'Iqtiboslar', icon: '📚' },
            { id: 'gallery', label: 'Galereya', icon: '🖼️' },
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
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Foydalanuvchi</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Sana</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-700/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold">
                            {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="text-white font-medium">{u.full_name || 'Nomsiz'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          u.role === 'admin' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(u.created_at).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="px-6 py-4">
                        {u.id !== user?.id && (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as 'admin' | 'user')}
                            className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:border-cyan-500"
                          >
                            <option value="user">Foydalanuvchi</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
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
                <Link href="/#book-quotes" className="text-cyan-400 hover:text-cyan-300 text-sm">
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
      </div>
    </div>
  );
}


