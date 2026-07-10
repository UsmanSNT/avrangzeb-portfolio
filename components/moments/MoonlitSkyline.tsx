"use client";

import { useMemo } from "react";

interface StarConfig {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Skyline silhouette with a handful of lit windows, drawn once and reused -
// coordinates are arbitrary "city on the horizon" shapes, not a real place.
const BUILDINGS = [
  { x: 0, w: 40, h: 46 }, { x: 40, w: 26, h: 74 }, { x: 66, w: 34, h: 40 },
  { x: 100, w: 22, h: 60 }, { x: 122, w: 30, h: 30 }, { x: 152, w: 20, h: 68 },
  { x: 172, w: 40, h: 48 }, { x: 212, w: 24, h: 84 }, { x: 236, w: 30, h: 36 },
  { x: 266, w: 26, h: 58 }, { x: 292, w: 34, h: 42 }, { x: 326, w: 20, h: 72 },
  { x: 346, w: 30, h: 32 },
];

/* /moments hero backdrop: a soft moon with glow, twinkling stars, and a low
   city silhouette. Pure CSS/SVG so it stays lightweight next to the petals
   in RomanticBackground - this owns the "sky", that owns the "weather". */
export function MoonlitSkyline() {
  const stars = useMemo<StarConfig[]>(() => {
    const rand = seededRandom(101);
    return Array.from({ length: 28 }, () => ({
      left: rand() * 100,
      top: rand() * 55,
      size: 1 + rand() * 1.6,
      delay: rand() * 5,
      duration: 2.4 + rand() * 2.6,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      {/* Night sky wash */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#140a1f_0%,#2a1030_38%,#3a1226_62%,#170a10_100%)]" />

      {/* Stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="moments-star absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Moon */}
      <div className="moments-moon-glow absolute right-[12%] top-[8%] h-20 w-20 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffbe8,#fde9b8_55%,#f7cf8a_100%)] sm:h-28 sm:w-28" />

      {/* Heart-trail sparkles curling from the moon */}
      <svg
        className="absolute right-[6%] top-[10%] h-40 w-40 opacity-70 sm:h-56 sm:w-56"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M150 30 C 190 60, 185 110, 140 120 C 100 128, 90 150, 115 165"
          stroke="url(#trail)"
          strokeWidth="1.5"
          strokeDasharray="1 9"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>
        </defs>
      </svg>

      {/* City skyline */}
      <svg
        className="absolute inset-x-0 bottom-0 h-24 w-full sm:h-32"
        viewBox="0 0 366 84"
        preserveAspectRatio="none"
        fill="none"
      >
        {BUILDINGS.map((b, i) => (
          <rect key={i} x={b.x} y={84 - b.h} width={b.w} height={b.h} fill="#170a10" opacity="0.92" />
        ))}
        {BUILDINGS.map((b, i) =>
          Array.from({ length: Math.max(1, Math.floor(b.h / 16)) }).map((_, j) => (
            <rect
              key={`${i}-${j}`}
              x={b.x + b.w * 0.3}
              y={84 - b.h + 8 + j * 16}
              width={3}
              height={4}
              fill="#fde68a"
              opacity="0.55"
            />
          ))
        )}
      </svg>

      {/* Bottom fade so content sitting on top stays readable */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#170a10] to-transparent" />
    </div>
  );
}
