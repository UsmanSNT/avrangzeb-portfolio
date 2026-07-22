"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const TIMEOUT_MS = 10000;

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let active = true;
    let resolved = false;

    const finishLogin = async (userId: string) => {
      resolved = true;
      try {
        const res = await fetch(`/api/auth/profile?userId=${userId}`);
        const profile = await res.json();
        if (profile.role === "admin" || profile.role === "super_admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/dashboard");
      }
    };

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        resolved = true;
        setError(sessionError.message);
        return;
      }
      if (data.session?.user) {
        finishLogin(data.session.user.id);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "SIGNED_IN" && session?.user) {
        finishLogin(session.user.id);
      }
    });

    const timeout = setTimeout(() => {
      if (active && !resolved) {
        setTimedOut(true);
      }
    }, TIMEOUT_MS);

    return () => {
      active = false;
      clearTimeout(timeout);
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center text-slate-300">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : timedOut ? (
          <div className="space-y-3">
            <p className="text-red-400">Kirish amalga oshmadi. Iltimos, qayta urinib ko&apos;ring.</p>
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Kirish sahifasiga qaytish
            </Link>
          </div>
        ) : (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Kirish amalga oshirilmoqda...
          </span>
        )}
      </div>
    </div>
  );
}
