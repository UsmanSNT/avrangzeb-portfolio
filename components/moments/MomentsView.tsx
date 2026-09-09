"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Camera, Music, Music2, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, Calendar, Share2, LogOut, X } from "lucide-react";
import { compressImage } from "@/lib/upload";
import type { MomentsRole } from "@/lib/moments-auth";

interface MomentEntry {
  entry_date: string;
  content: string;
  image_url: string | null;
}

type PageData =
  | { type: "cover" }
  | { type: "inside-cover" }
  | { type: "story-left" }
  | { type: "story-right" }
  | { type: "memory"; data: MomentEntry; index: number }
  | { type: "empty" };

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

function formatBeautifulDate(key: string): string {
  return parseDateKey(key).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

// A 401/403 here means the session cookie expired or was never valid -
// reload so the server component re-checks getMomentsRole() and shows
// PasswordGate again, instead of leaving the stale UI up with a cryptic
// "Ruxsat yo'q" error on every action.
function isAuthFailure(status: number): boolean {
  return status === 401 || status === 403;
}

// Decorative botanical corner flourish reused across paper pages.
function FloralCorner({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={`pointer-events-none absolute h-24 w-24 text-[#a39081] opacity-60 ${className}`} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10,10 Q30,10 40,30 T60,60" strokeLinecap="round" />
      <path d="M10,10 Q10,30 30,40 T60,60" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3" fill="currentColor" />
      <path d="M25,18 Q35,15 40,25" />
      <path d="M18,25 Q15,35 25,40" />
      <path d="M45,40 Q55,35 60,45" />
    </svg>
  );
}

function LineDivider() {
  return (
    <svg viewBox="0 0 200 20" className="my-4 h-4 w-full text-[#B8955A] opacity-50" fill="none" aria-hidden="true">
      <path d="M0,10 L80,10" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="10" r="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="90" cy="10" r="1.5" fill="currentColor" />
      <circle cx="110" cy="10" r="1.5" fill="currentColor" />
      <path d="M120,10 L200,10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function FloralPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center text-[#B8955A] opacity-80">
      <svg viewBox="0 0 100 100" className="book-animate-breathe mb-3 h-20 w-20" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M50,25 Q65,5 75,25 T50,60 Q25,5 35,25 T50,25" fill="rgba(184, 149, 90, 0.15)" />
        <path d="M50,55 Q75,40 75,65 T50,90 Q25,40 25,65 T50,55" fill="rgba(184, 149, 90, 0.15)" />
        <path d="M50,90 L50,100" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </svg>
      <span className="book-font-serif px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em]">
        Bizning
        <br />
        hikoyamiz
      </span>
    </div>
  );
}

function CoverFace({
  startLabel,
  dayCount,
  coverImageUrl,
  isOwner,
  isUploadingCover,
  onUploadCover,
}: {
  startLabel: string;
  dayCount: number | null;
  coverImageUrl: string | null;
  isOwner: boolean;
  isUploadingCover: boolean;
  onUploadCover: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="book-cover-modern relative flex h-full w-full flex-col items-center overflow-hidden rounded-r-lg px-7 py-9">
      {/* Soft watercolor brush-stroke accents, top and bottom corners */}
      <div
        className="pointer-events-none absolute -right-6 top-10 h-16 w-40 rotate-[-8deg] bg-[#B8637F]/25 blur-md"
        style={{ borderRadius: "50% 50% 45% 55% / 60% 40% 60% 40%" }}
      />
      <div
        className="pointer-events-none absolute -left-8 bottom-24 h-14 w-36 rotate-[6deg] bg-[#B8637F]/20 blur-md"
        style={{ borderRadius: "45% 55% 50% 50% / 40% 60% 40% 60%" }}
      />

      <div className="z-10 flex w-full flex-col items-center text-center">
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8A4F63]">
          <Heart size={10} className="fill-[#B8637F] text-[#B8637F]" />
          Bizning
          <Heart size={10} className="fill-[#B8637F] text-[#B8637F]" />
        </span>
        <h1 className="book-font-serif mt-2 whitespace-nowrap text-[2rem] font-medium tracking-tight text-[#5A2E3D]">
          Hayot Daftarimiz
        </h1>
        <p className="book-font-poetic -mt-1 text-lg tracking-wide text-[#B8637F]">
          bizning sevgi kundaligimiz
        </p>
      </div>

      <div className="book-animate-breathe z-10 relative mt-5 flex items-center gap-3">
        {/* Floral sprig, tucked behind the photo's left edge */}
        <svg viewBox="0 0 60 100" className="pointer-events-none absolute -left-9 bottom-4 h-24 w-16 text-[#B8637F]" fill="none" aria-hidden="true">
          <path d="M30,95 Q28,60 32,30" stroke="#8A4F63" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="28" r="6" fill="#f3c9d6" />
          <circle cx="22" cy="38" r="5" fill="#eeb4c8" />
          <circle cx="24" cy="52" r="5.5" fill="#f3c9d6" />
          <circle cx="18" cy="20" r="4.5" fill="#eeb4c8" />
        </svg>

        <div className="relative flex h-60 w-44 items-center justify-center overflow-hidden rounded-md bg-white/40 shadow-[0_20px_35px_rgba(90,46,61,0.3)]">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="h-full w-full object-cover object-center" />
          ) : (
            <FloralPlaceholder />
          )}

          {/* Washi-tape corners, as if the photo were taped onto the page */}
          <div className="pointer-events-none absolute -top-2 -left-3 h-5 w-12 -rotate-45 bg-white/50 shadow-sm" />
          <div className="pointer-events-none absolute -bottom-2 -right-3 h-5 w-12 -rotate-45 bg-white/50 shadow-sm" />
        </div>

        <span className="book-font-poetic flex flex-col items-center gap-1 text-sm leading-tight text-[#8A4F63]">
          <span>Good</span>
          <span>People</span>
          <span>Good</span>
          <span>Memories</span>
          <Heart size={11} className="mt-1 text-[#8A4F63]" />
        </span>

        {/* Always-visible (not hover-gated, since touch devices have no
            hover state) small upload badge, tucked into the frame's corner. */}
        {isOwner && (
          <label
            className="book-font-serif absolute -bottom-2 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border-2 border-white bg-[#5A2E3D] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_5px_15px_rgba(90,46,61,0.5)] transition-all hover:scale-105 hover:bg-[#6f3a4e]"
            aria-label={coverImageUrl ? "Muqova rasmini almashtirish" : "Muqovaga surat qo'yish"}
          >
            <Camera size={14} />
            {isUploadingCover && <span>...</span>}
            <input type="file" accept="image/*" className="hidden" onChange={onUploadCover} disabled={isUploadingCover} />
          </label>
        )}
      </div>

      <div className="z-10 mt-8 flex w-full flex-col items-center px-4 text-center">
        <p className="book-font-serif mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8A4F63]">
          Tanishgan kunimizdan boshlangan hikoya
        </p>
        <div className="rounded-full border border-[#B8637F]/40 bg-white/50 px-6 py-2 shadow-sm">
          <span className="book-font-serif text-sm font-medium tracking-[0.15em] text-[#5A2E3D]">{startLabel}</span>
        </div>
        {dayCount !== null && (
          <p className="book-font-serif mt-3 flex items-center gap-1 text-xs font-medium tracking-[0.15em] text-[#8A4F63]">
            {dayCount} kun birga <Heart size={11} className="fill-[#B8637F] text-[#B8637F]" />
          </p>
        )}
      </div>

      {/* Bookmark ribbon, hanging off the bottom edge */}
      <div
        className="pointer-events-none absolute bottom-0 left-10 h-10 w-4 bg-[#B8637F]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)" }}
      />
    </div>
  );
}

function InsideCover() {
  return (
    <div className="book-paper-texture flex h-full w-full items-center justify-center rounded-l-lg border-r border-[#dcd0c0] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)]">
      <div className="text-center opacity-30">
        <Heart size={48} className="mx-auto mb-4 text-[#a39081]" />
        <p className="book-font-script text-3xl text-[#a39081]">Har bir varag&apos;i sevgi bilan yozilgan...</p>
      </div>
    </div>
  );
}

function StoryPageLeft({ startLabel, dayCount }: { startLabel: string; dayCount: number | null }) {
  return (
    <div className="book-paper-texture book-aged-edges relative h-full w-full p-10">
      <FloralCorner className="left-4 top-4" />
      <FloralCorner className="bottom-4 left-4" style={{ transform: "rotate(-90deg)" }} />

      <div className="flex h-full flex-col justify-center">
        <h2 className="book-font-script mb-6 text-center text-5xl text-[var(--book-primary-text)]">Bizning Hikoyamiz</h2>

        <div className="book-font-serif space-y-6 text-lg leading-relaxed text-[#5a4a40]">
          <p className="first-letter:mr-1 first-letter:book-font-script first-letter:text-5xl first-letter:text-[#8b2e3e]">
            Har bir sahifa - birga o&apos;tkazgan kunlarimizning bir bo&apos;lagi. Bu daftar shu kunlarni asrab qoladi.
          </p>

          <div className="relative my-6 rounded-sm border border-[#e8d5cc] bg-[#f5f0e6] p-6 shadow-sm">
            <div className="absolute -left-3 -top-3 text-[#d4a373]">
              <Heart size={24} fill="currentColor" />
            </div>
            <ul className="book-font-serif space-y-3">
              <li className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-[#a39081]" />
                <span className="mr-2 font-semibold">Boshlangan sana:</span> {startLabel}
              </li>
              {dayCount !== null && (
                <li className="flex items-center">
                  <Heart className="mr-3 h-5 w-5 text-[#a39081]" />
                  <span className="mr-2 font-semibold">Birga:</span> {dayCount} kun
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryPageRight({ isOwner, onAddMemory }: { isOwner: boolean; onAddMemory: () => void }) {
  return (
    <div className="book-paper-texture book-aged-edges relative flex h-full w-full flex-col items-center justify-center border-l border-[#e0d5c1] p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.03)]">
      <FloralCorner className="right-4 top-4" style={{ transform: "rotate(90deg)" }} />
      <FloralCorner className="bottom-4 right-4" style={{ transform: "rotate(180deg)" }} />

      <div className="relative aspect-[3/4] w-[80%] rotate-2 transform bg-white p-4 pb-12 shadow-md">
        <div className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 transform rounded-full bg-red-800 shadow-sm shadow-black/50">
          <div className="absolute left-1 top-1 h-1 w-1 rounded-full bg-white/50" />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-sm border border-[#e8d5cc] bg-[#f5f0e6] p-4">
          <Camera className="mb-3 h-16 w-16 text-[#c8b4a0]" />
          <p className="book-font-script text-center text-xl text-[#a39081]">Bu yerda xotira yashaydi</p>
        </div>
      </div>

      {isOwner ? (
        <button
          type="button"
          onClick={onAddMemory}
          className="book-font-serif mt-12 flex items-center space-x-2 rounded-full border border-[#a39081] bg-transparent px-6 py-2 text-[#7a6b5e] transition-all duration-300 hover:bg-[#a39081] hover:text-white"
        >
          <Plus size={18} />
          <span>Yangi xotira qo&apos;shish</span>
        </button>
      ) : (
        <p className="book-font-script mt-12 text-center text-xl text-[#a39081]">Yangi xotiralar shu yerda paydo bo&apos;ladi</p>
      )}
    </div>
  );
}

function EmptyPage({ isLeft }: { isLeft: boolean }) {
  return (
    <div
      className={`book-paper-texture book-aged-edges relative flex h-full w-full flex-col items-center justify-center p-10 ${
        !isLeft ? "border-l border-[#e0d5c1] shadow-[inset_10px_0_20px_rgba(0,0,0,0.03)]" : ""
      }`}
    >
      <FloralCorner className={isLeft ? "left-4 top-4" : "right-4 top-4"} style={{ transform: isLeft ? "none" : "rotate(90deg)" }} />
      <FloralCorner
        className={isLeft ? "bottom-4 left-4" : "bottom-4 right-4"}
        style={{ transform: isLeft ? "rotate(-90deg)" : "rotate(180deg)" }}
      />
      <div className="text-center opacity-30">
        <p className="book-font-script mb-4 text-3xl text-[#a39081]">Keyingi sahifa...</p>
        <p className="book-font-serif text-[#7a6b5e]">Bu yerda yangi xotiralar yozilishi kutilmoqda</p>
      </div>
    </div>
  );
}

function MemoryPage({
  entry,
  index,
  isLeft,
  isOwner,
  onEdit,
  onDelete,
}: {
  entry: MomentEntry;
  index: number;
  isLeft: boolean;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const randomRotate = index % 2 === 0 ? "rotate-1" : "rotate-[-2deg]";

  return (
    <div
      className={`book-paper-texture book-aged-edges relative flex h-full w-full flex-col p-8 ${
        !isLeft ? "border-l border-[#e0d5c1] shadow-[inset_10px_0_20px_rgba(0,0,0,0.03)]" : ""
      }`}
    >
      <FloralCorner className={isLeft ? "left-3 top-3" : "right-3 top-3"} style={{ transform: isLeft ? "none" : "rotate(90deg)" }} />

      {isOwner && (
        <div className="absolute right-6 top-6 z-10 flex space-x-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <button type="button" onClick={onEdit} className="rounded-full bg-white/80 p-2 text-blue-600 shadow hover:bg-white" aria-label="Tahrirlash">
            <Edit3 size={16} />
          </button>
          <button type="button" onClick={onDelete} className="rounded-full bg-white/80 p-2 text-red-600 shadow hover:bg-white" aria-label="O'chirish">
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="mb-4 mt-2 text-center">
        <h3 className="book-font-script text-4xl text-[var(--book-primary-text)]">{formatBeautifulDate(entry.entry_date)}</h3>
        <LineDivider />
      </div>

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-2">
        {entry.image_url ? (
          <>
            <div className={`relative mb-6 w-[90%] transform bg-white p-3 pb-8 shadow-md transition-transform hover:rotate-0 ${randomRotate}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.image_url} alt="" className="h-44 w-full rounded-sm object-cover" />
            </div>
            <div className="book-font-serif w-full space-y-4 px-2 text-justify text-lg leading-relaxed text-[#5a4a40]">
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </div>
          </>
        ) : (
          <div className="relative flex w-full flex-1 flex-col items-center justify-center py-4">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#8b2e3e] opacity-[0.05]">
              <Heart size={200} fill="currentColor" />
            </div>
            <div className="book-font-serif z-10 w-full space-y-6 px-4 text-center text-2xl leading-relaxed text-[#4a3b32]">
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </div>
          </div>
        )}
      </div>

      <FloralCorner className={isLeft ? "bottom-3 left-3" : "bottom-3 right-3"} style={{ transform: isLeft ? "rotate(-90deg)" : "rotate(180deg)" }} />
    </div>
  );
}

const WEEKDAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

/** Month-grid calendar: pick any day to add or edit that day's memory directly. */
function CalendarModal({
  isOpen,
  onClose,
  onSelectDate,
  entries,
  minDate,
  maxDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dateKey: string) => void;
  entries: Record<string, MomentEntry>;
  minDate?: string;
  maxDate: string;
}) {
  const maxDateObj = useMemo(() => parseDateKey(maxDate), [maxDate]);
  const minDateObj = useMemo(() => (minDate ? parseDateKey(minDate) : null), [minDate]);
  const [viewMonth, setViewMonth] = useState(() => new Date(maxDateObj.getFullYear(), maxDateObj.getMonth(), 1));

  useEffect(() => {
    if (isOpen) setViewMonth(new Date(maxDateObj.getFullYear(), maxDateObj.getMonth(), 1));
  }, [isOpen, maxDateObj]);

  if (!isOpen) return null;

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(firstDayIndex).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];

  const canGoPrev = !minDateObj || new Date(year, month, 0) >= new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1);
  const canGoNext = new Date(year, month + 1, 1) <= maxDateObj;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-xl border border-[#e8d5cc] bg-[#fdfbf7] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e8d5cc] bg-[#f5f0e6] px-6 py-4">
          <h2 className="book-font-serif text-xl text-[var(--book-primary-text)]">Kalendar</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month - 1, 1))}
              disabled={!canGoPrev}
              aria-label="Oldingi oy"
              className="rounded-full p-1.5 text-[#7a6b5e] hover:bg-[#e8d5cc] disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="book-font-serif text-sm font-semibold text-[var(--book-primary-text)]">
              {viewMonth.toLocaleDateString("uz-UZ", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month + 1, 1))}
              disabled={!canGoNext}
              aria-label="Keyingi oy"
              className="rounded-full p-1.5 text-[#7a6b5e] hover:bg-[#e8d5cc] disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="book-font-serif py-1 text-[10px] uppercase tracking-wide text-[#a39081]">
                {label}
              </span>
            ))}
            {cells.map((day, i) => {
              if (!day) return <span key={i} />;
              const key = toDateKey(day);
              const hasEntry = Boolean(entries[key]);
              const outOfRange = day > maxDateObj || (minDateObj && day < minDateObj);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={Boolean(outOfRange)}
                  onClick={() => onSelectDate(key)}
                  className={`relative aspect-square rounded-full text-sm transition-colors ${
                    outOfRange
                      ? "cursor-not-allowed text-gray-300"
                      : hasEntry
                      ? "bg-[#8b2e3e] font-semibold text-white hover:bg-[#6e2330]"
                      : "text-[#4a3b32] hover:bg-[#e8d5cc]"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <p className="book-font-serif mt-4 text-center text-[11px] text-[#a39081]">
            Sana tanlang - xotira qo&apos;shish yoki tahrirlash uchun
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function MemoryModal({
  isOpen,
  onClose,
  onSave,
  entry,
  defaultDate,
  minDate,
  maxDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, content: string, imageUrl: string | null) => Promise<string | null>;
  entry: MomentEntry | null;
  defaultDate: string;
  minDate?: string;
  maxDate: string;
}) {
  const [date, setDate] = useState(defaultDate);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDate(entry?.entry_date || defaultDate);
    setContent(entry?.content || "");
    setImageUrl(entry?.image_url || null);
    setError(null);
  }, [isOpen, entry, defaultDate]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    setError(null);
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
      if (result.success) setImageUrl(result.url);
      else setError(result.error || "Rasm yuklanmadi");
    } catch {
      setError("Rasm yuklanmadi");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !content.trim()) return;
    setIsSaving(true);
    setError(null);
    const failureMessage = await onSave(date, content.trim(), imageUrl);
    setIsSaving(false);
    if (failureMessage) setError(failureMessage);
    else onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-[#e8d5cc] bg-[#fdfbf7] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#e8d5cc] bg-[#f5f0e6] px-6 py-4">
          <h2 className="book-font-serif text-2xl text-[var(--book-primary-text)]">{entry ? "Xotirani tahrirlash" : "Yangi xotira qo'shish"}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
          <div>
            <label className="book-font-serif mb-1 block text-sm text-[#7a6b5e]">Sana *</label>
            <input
              required
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              disabled={Boolean(entry)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border border-[#dcd0c0] bg-white/50 p-2 font-sans outline-none focus:border-[#a39081] disabled:opacity-60"
            />
          </div>

          <div>
            <label className="book-font-serif mb-1 block text-sm text-[#7a6b5e]">Xotira matni *</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded border border-[#dcd0c0] bg-white/50 p-2 font-sans outline-none focus:border-[#a39081]"
            />
          </div>

          <div>
            <label className="book-font-serif mb-2 block text-sm text-[#7a6b5e]">Surat yuklash</label>
            <div className="flex items-center space-x-4">
              <label className="book-font-serif flex cursor-pointer items-center rounded-md bg-[#e8d5cc] px-4 py-2 text-sm text-[#4a3b32] transition-colors hover:bg-[#d4a373]">
                <Camera size={16} className="mr-2" /> {isUploadingImage ? "Yuklanmoqda..." : imageUrl ? "Rasmni almashtirish" : "Surat tanlash"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isUploadingImage} />
              </label>
              {imageUrl && (
                <div className="relative h-16 w-16 overflow-hidden rounded border border-gray-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="absolute right-0 top-0 rounded-bl bg-red-500 p-0.5 text-white"
                    aria-label="Rasmni olib tashlash"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3 border-t border-[#e8d5cc] pt-4">
            <button type="button" onClick={onClose} className="book-font-serif px-4 py-2 text-gray-500 hover:text-gray-800">
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingImage || !content.trim()}
              className="book-font-serif rounded-md bg-[#8b2e3e] px-6 py-2 text-white shadow-md transition-colors hover:bg-[#6e2330] disabled:opacity-50"
            >
              {isSaving ? "..." : "Saqlash"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function MomentsView({ role, startDate }: { role: MomentsRole; startDate: string }) {
  const [entries, setEntries] = useState<Record<string, MomentEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSheet, setCurrentSheet] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 1024, height: 768 });

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MomentEntry | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState("");

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isOwner = role === "owner";

  const today = useMemo(() => startOfDay(new Date()), []);
  const start = useMemo(() => (startDate ? startOfDay(parseDateKey(startDate)) : today), [startDate, today]);
  const dayCount = startDate ? Math.floor((today.getTime() - start.getTime()) / 86400000) + 1 : null;
  const startLabel = start.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [entriesRes, coverRes] = await Promise.all([
          fetch("/api/moments/entries"),
          fetch("/api/moments/cover"),
        ]);
        if (isAuthFailure(entriesRes.status)) {
          window.location.reload();
          return;
        }
        const result = await entriesRes.json();
        if (!cancelled && result.success) {
          const map: Record<string, MomentEntry> = {};
          for (const entry of result.data as MomentEntry[]) {
            map[entry.entry_date] = entry;
          }
          setEntries(map);
        }
        const coverResult = await coverRes.json().catch(() => null);
        if (!cancelled && coverResult?.success) {
          setCoverImageUrl(coverResult.url);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // The book is always the same 900x600 two-page .book-container - closed,
  // only its right half (the cover) has content, open, both halves do. On
  // mobile that 900px is too wide to fit, so it's scaled down; closed, it's
  // scaled (and shifted) to frame just the cover centered on screen, open,
  // it's scaled to fit the *full* spread centered on screen instead - so
  // opening the book visibly widens outward from the same center point,
  // rather than only ever showing one half. Desktop never shifts and always
  // fits the full spread.
  const isClosed = currentSheet === 0;
  const scale = useMemo(() => {
    const { width, height } = viewportSize;
    const availableHeight = height - (isMobile ? 200 : 220);
    if (isMobile) {
      const availableWidth = width - 32;
      const fitWidth = isClosed ? 450 : 900;
      return Math.min(availableWidth / fitWidth, availableHeight / 600, 1.2);
    }
    const availableWidth = width - 100;
    return Math.min(availableWidth / 900, availableHeight / 600, 1.2);
  }, [viewportSize, isMobile, isClosed]);

  // Small fixed-ish preview of just the cover half, used on the closed
  // landing screen where the book sits beside the intro text instead of
  // filling the viewport.
  const landingScale = useMemo(() => {
    const { width, height } = viewportSize;
    const availableWidth = (isMobile ? width - 64 : width * 0.4) / 450;
    const availableHeight = (height - 260) / 600;
    return Math.max(Math.min(0.85, availableWidth, availableHeight), 0.3);
  }, [viewportSize, isMobile]);

  // Chronological, oldest-first - the book reads like a real diary and
  // keeps growing as new memories are saved (no fixed page count).
  const sortedMemories = useMemo(
    () => Object.values(entries).sort((a, b) => (a.entry_date < b.entry_date ? -1 : 1)),
    [entries]
  );

  const pagesData = useMemo<PageData[]>(() => {
    const pages: PageData[] = [{ type: "cover" }, { type: "inside-cover" }, { type: "story-left" }, { type: "story-right" }];
    sortedMemories.forEach((entry, index) => pages.push({ type: "memory", data: entry, index }));
    return pages;
  }, [sortedMemories]);

  const sheets = useMemo(() => {
    const result: { front: PageData; back: PageData }[] = [];
    for (let i = 0; i < pagesData.length; i += 2) {
      result.push({ front: pagesData[i], back: pagesData[i + 1] || { type: "empty" } });
    }
    return result;
  }, [pagesData]);

  const totalSheets = sheets.length;

  const handleNext = () => setCurrentSheet((s) => Math.min(s + 1, totalSheets));
  const handlePrev = () => setCurrentSheet((s) => Math.max(s - 1, 0));

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const distance = touchStart - e.changedTouches[0].clientX;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    setTouchStart(null);
  };

  const openAddModal = () => {
    setEditingEntry(null);
    setModalDefaultDate(toDateKey(today));
    setIsModalOpen(true);
  };
  const openEditModal = (entry: MomentEntry) => {
    setEditingEntry(entry);
    setModalDefaultDate(entry.entry_date);
    setIsModalOpen(true);
  };
  const openModalForDate = (dateKey: string) => {
    const existing = entries[dateKey];
    setIsCalendarOpen(false);
    if (existing) openEditModal(existing);
    else {
      setEditingEntry(null);
      setModalDefaultDate(dateKey);
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const saveEntry = async (date: string, content: string, imageUrl: string | null): Promise<string | null> => {
    try {
      const res = await fetch("/api/moments/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, content, image_url: imageUrl }),
      });
      if (isAuthFailure(res.status)) {
        window.location.reload();
        return "Ruxsat yo'q";
      }
      const result = await res.json();
      if (result.success) {
        setEntries((prev) => ({ ...prev, [date]: result.data }));
        return null;
      }
      return result.error || "Saqlashda xatolik yuz berdi";
    } catch {
      return "Saqlashda xatolik yuz berdi";
    }
  };

  const deleteEntry = async (date: string) => {
    if (!confirm("Bu hotirani o'chirishni xohlaysizmi?")) return;
    const res = await fetch(`/api/moments/entries?date=${date}`, { method: "DELETE" });
    if (isAuthFailure(res.status)) {
      window.location.reload();
      return;
    }
    const result = await res.json();
    if (result.success) {
      setEntries((prev) => {
        const next = { ...prev };
        delete next[date];
        return next;
      });
      setCurrentSheet((s) => Math.min(s, Math.max(0, totalSheets - 1)));
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
      if (result.success) setShareLink(`${window.location.origin}/moments?token=${result.token}`);
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

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const compressed = await compressImage(file, 1200, 0.85);
      const formData = new FormData();
      formData.append("file", compressed);
      const uploadRes = await fetch("/api/moments/upload", { method: "POST", body: formData });
      if (isAuthFailure(uploadRes.status)) {
        window.location.reload();
        return;
      }
      const uploadResult = await uploadRes.json();
      if (!uploadResult.success) return;

      const saveRes = await fetch("/api/moments/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: uploadResult.url }),
      });
      if (isAuthFailure(saveRes.status)) {
        window.location.reload();
        return;
      }
      const saveResult = await saveRes.json();
      if (saveResult.success) setCoverImageUrl(saveResult.url);
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/02/10/audio_5b66d863f6.mp3?filename=soft-romantic-piano-10118.mp3");
      audioRef.current.loop = true;
    }
    if (isMusicPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsMusicPlaying(!isMusicPlaying);
  };

  const lock = async () => {
    await fetch("/api/moments/lock", { method: "POST" });
    window.location.href = "/moments";
  };

  const renderPageFace = (pageData: PageData, isLeft: boolean) => {
    switch (pageData.type) {
      case "cover":
        return (
          <CoverFace
            startLabel={startLabel}
            dayCount={dayCount}
            coverImageUrl={coverImageUrl}
            isOwner={isOwner}
            isUploadingCover={isUploadingCover}
            onUploadCover={handleCoverUpload}
          />
        );
      case "inside-cover":
        return <InsideCover />;
      case "story-left":
        return <StoryPageLeft startLabel={startLabel} dayCount={dayCount} />;
      case "story-right":
        return <StoryPageRight isOwner={isOwner} onAddMemory={openAddModal} />;
      case "memory":
        return (
          <MemoryPage
            entry={pageData.data}
            index={pageData.index}
            isLeft={isLeft}
            isOwner={isOwner}
            onEdit={() => openEditModal(pageData.data)}
            onDelete={() => deleteEntry(pageData.data.entry_date)}
          />
        );
      case "empty":
        return <EmptyPage isLeft={isLeft} />;
      default:
        return null;
    }
  };

  // The 900x600 two-page book, reused both centered full-size (open, or
  // closed on the old layout) and shrunk beside the closed-landing intro
  // text - only the scale and horizontal shift differ between the two.
  const renderBookContainer = (containerScale: number, shiftX: number) => (
    <motion.div
      className="book-container"
      animate={{ scale: containerScale, x: shiftX }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
    >
      <div className="book-leather-texture absolute right-0 top-0 h-full w-1/2 rounded-r-lg shadow-2xl" style={{ zIndex: 0 }} />

      {isClosed && (
        <div className="absolute right-1 top-1 h-[98%] w-[49%] rounded-r-sm bg-white shadow-[inset_-5px_0_10px_rgba(0,0,0,0.1)]" style={{ zIndex: 0 }} />
      )}

      {sheets.map((sheet, index) => {
        const isFlipped = currentSheet > index;
        const zIndex = isFlipped ? index + 10 : totalSheets - index + 10;

        return (
          <motion.div
            key={index}
            className="book-sheet shadow-[-2px_0_15px_rgba(0,0,0,0.1)]"
            style={{ zIndex }}
            initial={false}
            animate={{ rotateY: isFlipped ? -180 : 0 }}
            transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1.0] }}
          >
            <div className="book-page-face group rounded-r-lg bg-white shadow-sm">
              {renderPageFace(sheet.front, false)}
              <div className="pointer-events-none absolute inset-0 w-10 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            <div className="book-page-face book-page-back group rounded-l-lg bg-white shadow-sm shadow-[-5px_0_20px_rgba(0,0,0,0.2)]">
              {renderPageFace(sheet.back, true)}
              <div className="pointer-events-none absolute inset-0 left-auto right-0 w-10 bg-gradient-to-l from-black/20 to-transparent" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  return (
    <div
      className="book-desk-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }}
        aria-hidden="true"
      />

      <div className="absolute left-6 top-6 z-50">
        <span className="book-font-serif text-xs uppercase tracking-[0.3em] text-[#e8d5cc]/60">
          {role === "guest" ? "Mehmon" : "Xush kelibsiz"}
        </span>
      </div>

      <div className="absolute right-6 top-6 z-50 flex space-x-3">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label="Musiqa"
          className={`rounded-full p-3 shadow-lg backdrop-blur-sm transition-all ${
            isMusicPlaying ? "bg-[#d4a373] text-white" : "bg-white/20 text-[#e8d5cc] hover:bg-white/30"
          }`}
        >
          {isMusicPlaying ? <Music size={20} /> : <Music2 size={20} />}
        </button>
        {isOwner && (
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            aria-label="Kalendar"
            className="rounded-full bg-white/20 p-3 text-[#e8d5cc] shadow-lg backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <Calendar size={20} />
          </button>
        )}
        {isOwner && (
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            aria-label="Ulashish"
            className="rounded-full bg-white/20 p-3 text-[#e8d5cc] shadow-lg backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <Share2 size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={lock}
          aria-label="Yopish"
          className="rounded-full bg-white/20 p-3 text-[#e8d5cc] shadow-lg backdrop-blur-sm transition-all hover:bg-white/30"
        >
          <LogOut size={20} />
        </button>
      </div>

      {isLoading ? (
        <p className="book-font-script text-3xl text-[#e8d5cc]/60">Ochilmoqda...</p>
      ) : isClosed ? (
        <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 md:flex-row md:items-center md:justify-between md:gap-6 md:px-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#B8637F]/25 blur-[100px]" aria-hidden="true" />

          <div className="relative z-10 flex max-w-md flex-col items-center text-center md:items-start md:text-left">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#e8b9c8]">
              <Heart size={11} className="fill-[#e8b9c8] text-[#e8b9c8]" />
              Bizning
            </span>
            <h1 className="book-font-serif mt-3 text-5xl font-light leading-[1.05] text-[#F6EBDD] sm:text-6xl">
              Hayot
              <br />
              <span className="bg-gradient-to-r from-[#e8b9c8] to-[#B8637F] bg-clip-text text-transparent">Daftarimiz</span>
            </h1>
            <p className="book-font-poetic mt-4 flex items-center gap-3 text-2xl text-[#e8b9c8]/90">
              bizning sevgi kundaligimiz
              <span className="hidden h-px w-10 bg-[#e8b9c8]/40 md:inline-block" />
            </p>
            <p className="mt-6 text-sm leading-relaxed text-[#e8d5cc]/70">
              Har bir sahifa — bizning unutilmas lahzalarimiz,
              <br className="hidden md:block" /> birgalikda yozilgan baxt hikoyamiz...
            </p>
            <Heart size={16} className="mt-4 fill-[#B8637F] text-[#B8637F]" />

            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                onClick={handlePrev}
                disabled
                aria-label="Oldingi"
                className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-full bg-white/10 text-white/40"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Kitobni ochish"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#e8b9c8] to-[#B8637F] text-white shadow-[0_10px_25px_rgba(184,99,127,0.5)] transition-transform hover:scale-105"
              >
                <ChevronRight size={20} />
              </button>
              <span className="book-font-serif flex items-center gap-3 text-xs tracking-[0.2em] text-[#e8d5cc]/60">
                01
                <span className="h-px w-10 bg-[#e8d5cc]/30" />
                {String(Math.max(totalSheets, 1)).padStart(2, "0")}
              </span>
            </div>

            <p className="book-font-script mt-14 hidden text-xl text-[#e8d5cc]/50 md:block">
              Nice memories last forever ... <Heart size={14} className="inline fill-[#e8d5cc]/50 text-[#e8d5cc]/50" />
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div
              className="book-scene relative flex items-center justify-center overflow-hidden"
              style={{ width: 450 * landingScale, height: 600 * landingScale }}
            >
              {renderBookContainer(landingScale, -225 * landingScale)}
            </div>
            <div className="hidden flex-col items-center gap-3 md:flex">
              <span className="h-16 w-px bg-[#e8d5cc]/25" />
              <span className="book-font-serif [writing-mode:vertical-rl] text-xs tracking-[0.3em] text-[#e8d5cc]/50">
                BIRGALIKDA YANADA CHIROYLI
              </span>
              <Heart size={12} className="fill-[#B8637F]/70 text-[#B8637F]/70" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="book-scene flex h-full w-full items-center justify-center">
            {renderBookContainer(scale, isMobile ? -225 * scale : 0)}
          </div>

          <div className="absolute bottom-8 z-50 flex space-x-6">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Oldingi"
              className="flex items-center justify-center rounded-full border border-[#B8955A]/30 bg-[#3A2025]/90 p-4 text-[#F6EBDD] shadow-[0_5px_15px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#3A2025]"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentSheet >= totalSheets}
              aria-label="Keyingi"
              className={`flex items-center justify-center rounded-full border border-[#B8955A]/30 p-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all ${
                currentSheet >= totalSheets
                  ? "cursor-not-allowed bg-black/20 text-white/50 opacity-30"
                  : "bg-[#3A2025]/90 text-[#F6EBDD] backdrop-blur-sm hover:scale-105 hover:bg-[#3A2025]"
              }`}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </>
      )}

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={openModalForDate}
        entries={entries}
        minDate={startDate || undefined}
        maxDate={toDateKey(today)}
      />

      <MemoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveEntry}
        entry={editingEntry}
        defaultDate={modalDefaultDate}
        minDate={startDate || undefined}
        maxDate={toDateKey(today)}
      />

      <AnimatePresence>
        {isShareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsShareOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-xl border border-[#e8d5cc] bg-[#fdfbf7] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="book-font-serif text-xl text-[var(--book-primary-text)]">Bir martalik havola</h2>
                <button type="button" onClick={() => setIsShareOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="Yopish">
                  <X size={20} />
                </button>
              </div>

              {shareLink ? (
                <div className="flex flex-col gap-2">
                  <input
                    readOnly
                    value={shareLink}
                    className="w-full rounded-lg border border-[#dcd0c0] bg-white px-3 py-2 text-xs text-[#4a3b32]"
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    type="button"
                    onClick={copyLink}
                    className="book-font-serif rounded-lg bg-[#8b2e3e] py-2 text-sm text-white transition-colors hover:bg-[#6e2330]"
                  >
                    {linkCopied ? "Nusxalandi!" : "Nusxalash"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={generateLink}
                  disabled={isGeneratingLink}
                  className="book-font-serif w-full rounded-lg bg-[#e8d5cc] py-2.5 text-sm text-[#4a3b32] transition-colors hover:bg-[#d4a373] disabled:opacity-50"
                >
                  {isGeneratingLink ? "Yaratilmoqda..." : "Havola yaratish"}
                </button>
              )}
              <p className="book-font-serif mt-3 text-center text-[11px] text-[#a39081]">
                Havola faqat bir marta ochiladi va faqat ko&apos;rish uchun
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
