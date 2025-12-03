"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { user } = await signIn(email, password);
      
      if (user) {
        // Profil ma'lumotlarini olish va yo'naltirish
        const res = await fetch(`/api/auth/profile?userId=${user.id}`);
        const profile = await res.json();
        
        // Admin yoki super_admin bo'lsa admin panelga yo'naltirish
        if (profile.role === 'admin' || profile.role === 'super_admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirish xatosi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Kirish</h1>
          <p className="text-slate-400 mt-2">Hisobingizga kiring</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/50">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Parol
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Kirish...
              </span>
            ) : (
              "Kirish"
            )}
          </button>

          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
              Parolni unutdingizmi?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Hisobingiz yo&apos;qmi?{" "}
              <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Ro&apos;yxatdan o&apos;ting
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
              ← Bosh sahifaga qaytish
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

