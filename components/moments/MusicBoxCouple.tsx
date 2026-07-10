// A small decorative "music box" figure: bride and groom orbit a shared
// center while staying upright, mimicking a wind-up music box toy. The
// outer ring rotates (moments-music-box) and each figure counter-rotates
// (moments-music-box > *) so it never appears upside down.
export function MusicBoxCouple() {
  return (
    <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true">
      <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_70%)] blur-md" />
      <div className="absolute inset-0 rounded-full border border-rose-300/25 shadow-[0_0_18px_rgba(244,63,94,0.25)]" />
      <div className="absolute inset-0 rounded-full border border-dashed border-amber-200/20" />
      <div className="moments-music-box absolute inset-0">
        <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl drop-shadow-[0_0_6px_rgba(244,63,94,0.4)] sm:text-2xl">
          👰
        </span>
        <span className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl drop-shadow-[0_0_6px_rgba(244,63,94,0.4)] sm:text-2xl">
          🤵
        </span>
      </div>
    </div>
  );
}
