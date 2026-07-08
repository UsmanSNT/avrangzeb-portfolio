"use client";

import { useMemo } from "react";

const LOVE_PHRASES = [
  "Seni yaxshi ko'raman",
  "I love you",
  "사랑해",
  "Я тебя люблю",
  "Te quiero",
  "Je t'aime",
  "Ich liebe dich",
  "Ti amo",
  "أحبك",
  "我爱你",
];

interface PetalConfig {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  hue: number;
}

interface PhraseConfig {
  text: string;
  left: number;
  top: number;
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

export function RomanticBackground() {
  const petals = useMemo<PetalConfig[]>(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 16 }, () => ({
      left: rand() * 100,
      delay: rand() * 12,
      duration: 10 + rand() * 8,
      size: 12 + rand() * 10,
      drift: rand() > 0.5 ? 1 : -1,
      hue: rand() > 0.5 ? 340 : 20,
    }));
  }, []);

  const phrases = useMemo<PhraseConfig[]>(() => {
    const rand = seededRandom(7);
    return LOVE_PHRASES.map((text) => ({
      text,
      left: 5 + rand() * 80,
      top: 10 + rand() * 70,
      delay: rand() * 18,
      duration: 16 + rand() * 10,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Falling rose petals */}
      {petals.map((p, i) => (
        <span
          key={`petal-${i}`}
          className="moments-petal absolute top-[-5%]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: p.drift,
            ["--hue" as string]: p.hue,
          }}
        />
      ))}

      {/* Floating love phrases */}
      {phrases.map((p, i) => (
        <span
          key={`phrase-${i}`}
          className="moments-phrase absolute whitespace-nowrap text-xs font-medium text-rose-200/25 sm:text-sm"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
}
