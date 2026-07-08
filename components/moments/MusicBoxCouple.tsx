// A small decorative "music box" figure: bride and groom orbit a shared
// center while staying upright, mimicking a wind-up music box toy. The
// outer ring rotates (moments-music-box) and each figure counter-rotates
// (moments-music-box > *) so it never appears upside down.
export function MusicBoxCouple() {
  return (
    <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border border-dashed border-rose-300/20" />
      <div className="moments-music-box absolute inset-0">
        <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl">
          👰
        </span>
        <span className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl">
          🤵
        </span>
      </div>
    </div>
  );
}
