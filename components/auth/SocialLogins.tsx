"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithTelegram, type TelegramAuthUser } from "@/lib/auth";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthUser) => void;
  }
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.89c2.28-2.1 3.57-5.2 3.57-8.81z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.89-3.01c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.27v3.1C3.25 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.28A7.19 7.19 0 014.9 12c0-.79.14-1.56.38-2.28V6.62H1.27A11.98 11.98 0 000 12c0 1.93.46 3.76 1.27 5.38l4.01-3.1z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z" />
  </svg>
);

interface SocialLoginsProps {
  onError: (message: string) => void;
}

export function SocialLogins({ onError }: SocialLoginsProps) {
  const router = useRouter();
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  const telegramContainerRef = useRef<HTMLDivElement>(null);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);

  useEffect(() => {
    if (!botUsername) return;

    window.onTelegramAuth = async (telegramUser: TelegramAuthUser) => {
      setIsTelegramLoading(true);
      try {
        const { user } = await signInWithTelegram(telegramUser);
        if (user) {
          const res = await fetch(`/api/auth/profile?userId=${user.id}`);
          const profile = await res.json();
          if (profile.role === "admin" || profile.role === "super_admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : "Telegram orqali kirish xatosi");
      } finally {
        setIsTelegramLoading(false);
      }
    };

    const container = telegramContainerRef.current;
    if (container) {
      container.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", botUsername);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      container.appendChild(script);
    }

    return () => {
      delete window.onTelegramAuth;
    };
  }, [botUsername, router, onError]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Google orqali kirish xatosi");
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-700" />
        <span className="text-xs text-slate-500">yoki</span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 bg-white text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-colors"
      >
        <GoogleIcon />
        Google orqali davom etish
      </button>

      {botUsername && (
        <div className="flex flex-col items-center gap-2">
          <div ref={telegramContainerRef} />
          {isTelegramLoading && <span className="text-xs text-slate-500">Kirish amalga oshirilmoqda...</span>}
        </div>
      )}
    </div>
  );
}
