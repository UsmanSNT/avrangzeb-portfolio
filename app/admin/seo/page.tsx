"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/auth";

interface SeoSetting {
  id?: string;
  page_key: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
}

const PAGE_LABELS: Record<string, string> = {
  global: "Bosh sahifa (Global)",
  notes: "Yozuvlar",
  gallery: "Galereya",
  news: "IT Yangiliklar",
  "knowledge-hub": "Bilimlar Markazi",
  books: "Kitoblar",
};

const KNOWN_PAGE_KEYS = Object.keys(PAGE_LABELS);

export default function AdminSeoPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, SeoSetting>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch(`/api/auth/profile?userId=${authUser.id}`);
      const profile = await res.json();

      if (profile.error || !profile.id) {
        router.push("/dashboard");
        return;
      }

      if (profile.role !== "admin" && profile.role !== "super_admin") {
        router.push("/dashboard");
        return;
      }

      setUser(profile);
      await loadSettings();
      setIsLoading(false);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/seo", {
      headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
    });
    const data: SeoSetting[] = await res.json();

    const byKey: Record<string, SeoSetting> = {};
    for (const key of KNOWN_PAGE_KEYS) {
      byKey[key] = { page_key: key, title: "", description: "", keywords: "", og_image: "" };
    }
    if (Array.isArray(data)) {
      for (const row of data) {
        byKey[row.page_key] = row;
      }
    }
    setSettings(byKey);
  };

  const updateField = (pageKey: string, field: keyof SeoSetting, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
  };

  const handleSave = async (pageKey: string) => {
    setSavingKey(pageKey);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const setting = settings[pageKey];

      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(setting),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Xato yuz berdi" });
      } else {
        setSettings((prev) => ({ ...prev, [pageKey]: data }));
        setMessage({ type: "success", text: `${PAGE_LABELS[pageKey] || pageKey} SEO sozlamalari saqlandi!` });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("SEO save error:", err);
      setMessage({ type: "error", text: "Kutilmagan xato yuz berdi" });
    } finally {
      setSavingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface via-card to-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-card to-surface">
      <header className="bg-card/50 backdrop-blur-sm border-b border-line/50 sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Admin Panel</span>
            </Link>
            <h1 className="text-base font-bold text-foreground sm:text-xl">SEO Boshqaruvi</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4">
          <p className="text-cyan-text font-medium">🔍 Google va boshqa qidiruv tizimlarida ko&apos;rinish sozlamalari</p>
          <p className="text-cyan-text/70 text-sm mt-1">
            Har bir sahifa uchun meta sarlavha (title), tavsif (description) va kalit so&apos;zlarni (keywords) shu yerdan tahrirlashingiz mumkin.
            &quot;Bosh sahifa (Global)&quot; butun sayt uchun standart qiymatlarni belgilaydi.
          </p>
        </div>

        {message && (
          <div className={`mb-6 rounded-xl p-4 border ${
            message.type === "success"
              ? "bg-accent-green/10 border-accent-green/30 text-green-text"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {KNOWN_PAGE_KEYS.map((pageKey) => {
            const setting = settings[pageKey] || { page_key: pageKey, title: "", description: "", keywords: "", og_image: "" };
            return (
              <div key={pageKey} className="bg-card border border-line/50 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-foreground mb-4">{PAGE_LABELS[pageKey]}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted mb-1">Meta sarlavha (Title)</label>
                    <input
                      type="text"
                      value={setting.title || ""}
                      onChange={(e) => updateField(pageKey, "title", e.target.value)}
                      placeholder="Sahifa sarlavhasi"
                      maxLength={70}
                      className="w-full bg-surface-2 text-foreground rounded-lg px-3 py-2 border border-line focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                    <p className="text-xs text-muted mt-1">{(setting.title || "").length}/70 belgi (tavsiya: 50-60)</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Meta tavsif (Description)</label>
                    <textarea
                      value={setting.description || ""}
                      onChange={(e) => updateField(pageKey, "description", e.target.value)}
                      placeholder="Qidiruv natijalarida ko'rinadigan qisqa tavsif"
                      maxLength={160}
                      rows={3}
                      className="w-full bg-surface-2 text-foreground rounded-lg px-3 py-2 border border-line focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                    />
                    <p className="text-xs text-muted mt-1">{(setting.description || "").length}/160 belgi (tavsiya: 120-155)</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Kalit so&apos;zlar (Keywords, vergul bilan ajrating)</label>
                    <input
                      type="text"
                      value={setting.keywords || ""}
                      onChange={(e) => updateField(pageKey, "keywords", e.target.value)}
                      placeholder="masalan: Avrangzeb Abdujalilov, portfolio, software engineer"
                      className="w-full bg-surface-2 text-foreground rounded-lg px-3 py-2 border border-line focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-1">Ijtimoiy tarmoq rasmi (OG Image URL, ixtiyoriy)</label>
                    <input
                      type="text"
                      value={setting.og_image || ""}
                      onChange={(e) => updateField(pageKey, "og_image", e.target.value)}
                      placeholder="/images/profile.png"
                      className="w-full bg-surface-2 text-foreground rounded-lg px-3 py-2 border border-line focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave(pageKey)}
                      disabled={savingKey === pageKey}
                      className="flex items-center gap-2 rounded-lg bg-accent-cyan/20 text-cyan-text px-4 py-2 text-sm font-medium hover:bg-accent-cyan/30 transition-colors disabled:opacity-50"
                    >
                      {savingKey === pageKey && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      Saqlash
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
