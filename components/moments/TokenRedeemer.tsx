"use client";

import { useEffect, useState } from "react";

export function TokenRedeemer({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const redeem = async () => {
      try {
        const res = await fetch("/api/moments/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const result = await res.json();

        if (cancelled) return;

        if (result.success) {
          window.location.href = "/moments";
          return;
        }

        setError(result.error || "Havola yaroqsiz");
      } catch {
        if (!cancelled) setError("Xatolik yuz berdi");
      }
    };

    redeem();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#170a10] px-4">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(244,63,94,0.18),transparent_50%)]"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center text-center">
        {error ? (
          <>
            <span className="text-5xl" aria-hidden="true">
              💔
            </span>
            <p className="mt-5 max-w-xs text-sm text-rose-200/70">{error}</p>
          </>
        ) : (
          <>
            <span className="animate-heartbeat text-5xl" aria-hidden="true">
              ❤️‍🔥
            </span>
            <p className="mt-5 text-sm text-rose-200/70">Ochilmoqda...</p>
          </>
        )}
      </div>
    </div>
  );
}
