"use client";

import { useState } from "react";
import { RomanticBackground } from "./RomanticBackground";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#170a10] px-4">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(244,63,94,0.18),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(251,191,36,0.08),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(251,113,133,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <RomanticBackground />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-rose-400/15 bg-[#1f0f16]/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <MusicBoxCouple />
          <span className="animate-heartbeat mt-2 text-5xl" aria-hidden="true">
            ❤️‍🔥
          </span>
          <p className="mt-5 text-sm font-medium tracking-wide text-rose-200/70">
            Bu maxfiy sahifa
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            autoFocus
            className="mt-6 w-full rounded-2xl border border-rose-400/20 bg-black/30 px-4 py-3 text-center text-rose-50 placeholder-rose-200/30 outline-none transition-colors focus:border-rose-400/50"
          />

          {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 py-3 text-sm font-bold text-rose-950 transition-all hover:shadow-lg hover:shadow-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "..." : "Ochish"}
          </button>
        </div>
      </form>
    </div>
  );
}
