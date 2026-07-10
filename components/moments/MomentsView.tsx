"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { compressImage } from "@/lib/upload";
import type { MomentsRole } from "@/lib/moments-auth";
import { RomanticBackground } from "./RomanticBackground";
import { MusicBoxCouple } from "./MusicBoxCouple";

interface MomentEntry {
  entry_date: string;
  content: string;
  image_url: string | null;
}

const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];
const WEEKDAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// A 401/403 here means the session cookie expired or was never valid -
// reload so the server component re-checks getMomentsRole() and shows
// PasswordGate again, instead of leaving the stale owner UI up with a
// cryptic "Ruxsat yo'q" error on every action.
function isAuthFailure(status: number): boolean {
  return status === 401 || status === 403;
}

function buildMonthCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export function MomentsView({ role, startDate }: { role: MomentsRole; startDate: string }) {
  const [entries, setEntries] = useState<Record<string, MomentEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const start = useMemo(() => (startDate ? startOfDay(parseDateKey(startDate)) : today), [startDate, today]);
  const [viewYear, setViewYear] = useState(() => today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => today.getMonth());

  const dayCount = startDate ? Math.floor((today.getTime() - start.getTime()) / 86400000) + 1 : null;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/moments/entries");
        if (isAuthFailure(res.status)) {
          window.location.reload();
          return;
        }
        const result = await res.json();
        if (!cancelled && result.success) {
          const map: Record<string, MomentEntry> = {};
          for (const entry of result.data as MomentEntry[]) {
            map[entry.entry_date] = entry;
          }
          setEntries(map);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cells = useMemo(() => buildMonthCells(viewYear, viewMonth), [viewYear, viewMonth]);
  const canGoPrev = !startDate || viewYear > start.getFullYear() || (viewYear === start.getFullYear() && viewMonth > start.getMonth());
  const canGoNext = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const openDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const key = toDateKey(date);
    setSelectedDateKey(key);
    const existing = entries[key];
    setFormContent(existing?.content || "");
    setFormImage(existing?.image_url || null);
    setFormError(null);
    setIsEditing(role === "owner" && !existing);
  };

  const closeDay = () => {
    setSelectedDateKey(null);
    setIsEditing(false);
    setFormContent("");
    setFormImage(null);
    setFormError(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setFormError(null);
    try {
      const compressed = await compressImage(file, 1200, 0.85);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/moments/upload", { method: "POST", body: formData });
      if (isAuthFailure(res.status)) {
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) setFormImage(result.url);
      else setFormError(result.error || "Rasm yuklanmadi");
    } catch {
      setFormError("Rasm yuklanmadi");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const saveEntry = async () => {
    if (!selectedDateKey || !formContent.trim()) return;
    setIsSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/moments/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDateKey, content: formContent.trim(), image_url: formImage }),
      });
      if (isAuthFailure(res.status)) {
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setEntries((prev) => ({ ...prev, [selectedDateKey]: result.data }));
        setIsEditing(false);
      } else {
        setFormError(result.error || "Saqlashda xatolik yuz berdi");
      }
    } catch {
      setFormError("Saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEntry = async () => {
    if (!selectedDateKey) return;
    if (!confirm("Bu hotirani o'chirishni xohlaysizmi?")) return;
    const res = await fetch(`/api/moments/entries?date=${selectedDateKey}`, { method: "DELETE" });
    if (isAuthFailure(res.status)) {
      window.location.reload();
      return;
    }
    const result = await res.json();
    if (result.success) {
      setEntries((prev) => {
        const next = { ...prev };
        delete next[selectedDateKey];
        return next;
      });
      closeDay();
    }
  };

  const generateLink = async () => {
    setIsGeneratingLink(true);
    setLinkCopied(false);
    try {
      const res = await fetch("/api/moments/share", { method: "POST" });
      if (isAuthFailure(res.status)) {
        window.location.reload();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setShareLink(`${window.location.origin}/moments?token=${result.token}`);
      }
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard unavailable - the link is still visible to copy manually.
    }
  };

  const lock = async () => {
    await fetch("/api/moments/lock", { method: "POST" });
    window.location.href = "/moments";
  };

  const selectedEntry = selectedDateKey ? entries[selectedDateKey] : null;
  const selectedIsFuture = selectedDateKey ? parseDateKey(selectedDateKey).getTime() > today.getTime() : false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#170a10] pb-16 text-rose-50">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.14),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(251,191,36,0.06),transparent_40%)]"
        aria-hidden="true"
      />
      <RomanticBackground />

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-rose-200/40">
          {role === "guest" ? "Mehmon" : "Xush kelibsiz"}
        </span>
        <button
          type="button"
          onClick={lock}
          className="rounded-full border border-rose-400/20 px-3 py-1.5 text-xs font-semibold text-rose-200/60 transition-colors hover:border-rose-400/40 hover:text-rose-100"
        >
          Yopish
        </button>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-rose-400/15 bg-gradient-to-b from-white/[0.03] to-transparent p-8 shadow-xl shadow-black/20 ring-1 ring-white/[0.02]"
        >
          <div className="moments-aura pointer-events-none absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.16),transparent_70%)] blur-2xl" aria-hidden="true" />
          <div className="moments-aura moments-aura-delay pointer-events-none absolute right-4 top-24 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12),transparent_70%)] blur-2xl" aria-hidden="true" />

          <div className="relative flex flex-col items-center text-center">
            <MusicBoxCouple />
            <span className="animate-heartbeat mt-2 text-6xl" aria-hidden="true">
              ❤️‍🔥
            </span>

            {dayCount !== null && (
              <>
                <p className="moments-shimmer mt-6 bg-clip-text text-6xl font-black leading-none text-transparent sm:text-7xl">
                  {dayCount}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-rose-200/60">
                  kun birga
                </p>
              </>
            )}

            <p className="mt-4 text-sm text-rose-200/40">
              {start.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              {"'"}dan beri
            </p>
          </div>
        </motion.div>

        {role === "owner" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-2xl border border-rose-400/15 bg-white/[0.02] p-4"
          >
            {shareLink ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  readOnly
                  value={shareLink}
                  className="min-w-0 flex-1 rounded-xl border border-rose-400/20 bg-black/20 px-3 py-2 text-xs text-rose-100"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="shrink-0 rounded-xl bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-100 transition-colors hover:bg-rose-500/30"
                >
                  {linkCopied ? "Nusxalandi!" : "Nusxalash"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={generateLink}
                disabled={isGeneratingLink}
                className="w-full rounded-xl bg-rose-500/15 py-2.5 text-xs font-bold uppercase tracking-wide text-rose-200 transition-colors hover:bg-rose-500/25 disabled:opacity-50"
              >
                {isGeneratingLink ? "Yaratilmoqda..." : "Bir martalik havola yaratish"}
              </button>
            )}
            <p className="mt-2 text-center text-[11px] text-rose-200/35">
              Havola faqat bir marta ochiladi va faqat ko&apos;rish uchun
            </p>
          </motion.div>
        )}

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-8 overflow-hidden rounded-3xl border border-rose-400/15 bg-white/[0.02] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.02] sm:p-6"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goPrevMonth}
              disabled={!canGoPrev}
              aria-label="Oldingi oy"
              className="grid h-8 w-8 place-items-center rounded-full text-rose-200/60 transition-colors hover:bg-white/5 disabled:opacity-20"
            >
              ‹
            </button>
            <p className="text-sm font-bold text-rose-100">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </p>
            <button
              type="button"
              onClick={goNextMonth}
              disabled={!canGoNext}
              aria-label="Keyingi oy"
              className="grid h-8 w-8 place-items-center rounded-full text-rose-200/60 transition-colors hover:bg-white/5 disabled:opacity-20"
            >
              ›
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-rose-200/30">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {isLoading
              ? Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-white/[0.02]" />
                ))
              : cells.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const date = new Date(viewYear, viewMonth, day);
                  const key = toDateKey(date);
                  const hasEntry = Boolean(entries[key]);
                  const isToday = date.getTime() === today.getTime();
                  const isStart = key === startDate;
                  const isFuture = date.getTime() > today.getTime();
                  const isBeforeStart = date.getTime() < start.getTime();

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => (!isFuture || role === "owner") && !isBeforeStart && openDay(day)}
                      disabled={isBeforeStart}
                      className={`relative aspect-square rounded-lg text-xs font-semibold transition-all duration-200 ${
                        isBeforeStart
                          ? "cursor-not-allowed text-rose-200/10"
                          : hasEntry
                            ? "moments-has-entry bg-gradient-to-br from-rose-500/30 to-amber-400/20 text-rose-50 hover:scale-110 hover:from-rose-500/40 hover:to-amber-400/30"
                            : "text-rose-200/50 hover:scale-105 hover:bg-white/5"
                      } ${isToday ? "ring-1 ring-rose-300/60 shadow-[0_0_10px_rgba(251,113,133,0.35)]" : ""} ${isStart ? "ring-1 ring-amber-300/60" : ""}`}
                    >
                      {day}
                      {hasEntry && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px]" aria-hidden="true">
                          ❤️
                        </span>
                      )}
                    </button>
                  );
                })}
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedDateKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeDay}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-3xl border border-rose-400/20 bg-[#1f0f16] p-6 shadow-2xl ring-1 ring-white/[0.03]"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-rose-100">
                {parseDateKey(selectedDateKey).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <button
                type="button"
                onClick={closeDay}
                className="grid h-7 w-7 place-items-center rounded-full text-rose-200/40 transition-all hover:rotate-90 hover:bg-white/5 hover:text-rose-100"
                aria-label="Yopish"
              >
                ✕
              </button>
            </div>

            {role === "owner" && isEditing ? (
              <div className="mt-4 space-y-3">
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Bu kun haqida yozing..."
                  rows={5}
                  className="w-full rounded-xl border border-rose-400/20 bg-black/20 px-3 py-2.5 text-sm text-rose-50 placeholder-rose-200/25 outline-none focus:border-rose-400/50"
                />

                {formImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formImage} alt="" className="max-h-48 w-full rounded-xl object-cover" />
                )}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-rose-400/25 py-2.5 text-xs font-semibold text-rose-200/60 transition-colors hover:border-rose-400/50 hover:text-rose-100">
                  {isUploadingImage ? "Yuklanmoqda..." : formImage ? "Rasmni almashtirish" : "Rasm qo'shish (ixtiyoriy)"}
                  <input type="file" accept="image/*" onChange={handleImageChange} disabled={isUploadingImage} className="hidden" />
                </label>

                {formError && <p className="text-xs text-rose-400">{formError}</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeDay}
                    className="flex-1 rounded-xl border border-rose-400/20 py-2.5 text-xs font-bold text-rose-200/60 transition-colors hover:text-rose-100"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={saveEntry}
                    disabled={isSaving || !formContent.trim()}
                    className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 py-2.5 text-xs font-bold text-rose-950 disabled:opacity-50"
                  >
                    {isSaving ? "..." : "Saqlash"}
                  </button>
                </div>
              </div>
            ) : selectedEntry ? (
              <div className="mt-4 space-y-3">
                {selectedEntry.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedEntry.image_url} alt="" className="max-h-56 w-full rounded-xl object-cover" />
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-rose-100/90">{selectedEntry.content}</p>

                {role === "owner" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 rounded-xl border border-rose-400/20 py-2 text-xs font-bold text-rose-200/70 transition-colors hover:text-rose-100"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={deleteEntry}
                      className="flex-1 rounded-xl border border-rose-400/20 py-2 text-xs font-bold text-rose-400/70 transition-colors hover:text-rose-300"
                    >
                      O&apos;chirish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-sm text-rose-200/40">
                  {selectedIsFuture ? "Bu kun hali kelmagan" : "Bu kunga hotira yozilmagan"}
                </p>
                {role === "owner" && !selectedIsFuture && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="mt-4 rounded-xl bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-200 transition-colors hover:bg-rose-500/25"
                  >
                    Hotira qo&apos;shish
                  </button>
                )}
              </div>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
