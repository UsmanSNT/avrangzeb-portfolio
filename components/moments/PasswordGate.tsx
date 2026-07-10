"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RomanticBackground } from "./RomanticBackground";
import { MoonlitSkyline } from "./MoonlitSkyline";
import { MusicBoxCouple } from "./MusicBoxCouple";

export function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/moments/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();

      if (result.success) {
        window.location.reload();
        return;
      }

      setError(result.error || "Parol noto'g'ri");
    } catch {
      setError("Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
      setPassword("");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#170a10] px-4 pb-10 pt-14 sm:pt-20">
      <MoonlitSkyline />
      <RomanticBackground />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-sm text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-200/50">
          Har lahza, abadiyatimiz
        </p>
        <h1 className="mt-3 font-serif text-4xl italic leading-tight text-rose-50 [text-shadow:0_2px_6px_rgba(0,0,0,0.9),0_6px_28px_rgba(0,0,0,0.75)] sm:text-5xl">
          Doim <span className="moments-shimmer bg-clip-text text-transparent">sen</span> bo&apos;lgansan
        </h1>
      </motion.div>

      <div className="relative z-10 mt-10 flex flex-1 items-center">
        <motion.form
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-3xl border border-rose-400/20 bg-gradient-to-b from-[#241019]/90 to-[#1a0c12]/90 p-8 shadow-2xl shadow-black/60 ring-1 ring-white/[0.03] backdrop-blur-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <MusicBoxCouple />
            <span className="animate-heartbeat mt-2 text-5xl" aria-hidden="true">
              ❤️‍🔥
            </span>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium tracking-wide text-rose-200/70">
              <span className="moments-sparkle text-amber-200/70" aria-hidden="true">✦</span>
              Bu maxfiy sahifa
              <span className="moments-sparkle moments-sparkle-delay text-amber-200/70" aria-hidden="true">✦</span>
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              autoFocus
              className="mt-6 w-full rounded-2xl border border-rose-400/20 bg-black/30 px-4 py-3 text-center text-rose-50 placeholder-rose-200/30 outline-none transition-all focus:border-rose-400/50 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
            />

            {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="group relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 py-3 text-sm font-bold text-rose-950 transition-all hover:shadow-lg hover:shadow-rose-500/30 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">{isSubmitting ? "..." : "Ochish"}</span>
              <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
