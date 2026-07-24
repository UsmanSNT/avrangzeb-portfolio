"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { Logo } from "@/app/components/Logo";
import { getHomeDictionary } from "@/content/locales";
import { defaultLocale, isSupportedLocale, languageLabels, languageStorageKey, supportedLocales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/types";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { AboutSection } from "@/components/sections/home/AboutSection";
import { SkillsSection } from "@/components/sections/home/SkillsSection";
import { ProjectsGoalsSection } from "@/components/sections/home/ProjectsGoalsSection";
import { MyProjectsSection } from "@/components/sections/home/MyProjectsSection";
import { FooterSection } from "@/components/sections/home/FooterSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SectionsDropdown, SectionsDropdownMobile } from "@/components/SectionsDropdown";

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseMenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [language, setLanguage] = useState<Locale>(defaultLocale);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; full_name: string | null } | null>(null);
  
  // CV state
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(true);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  const t = getHomeDictionary(language);

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem(languageStorageKey);
    if (isSupportedLocale(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        
        // Get user profile
        const res = await fetch(`/api/auth/profile?userId=${user.id}`);
        const profile = await res.json();
        
        if (profile && !profile.error) {
          setCurrentUser({
            email: profile.email,
            full_name: profile.full_name
          });
          // Admin yoki super_admin bo'lsa ma'lumotlarni o'zgartira oladi
          setIsAdmin(profile.role === 'admin' || profile.role === 'super_admin');
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Auth holati o'zgarganda yangilash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAuth();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactTelegram, setContactTelegram] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isContactSending, setIsContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");
  const shouldReduceMotion = useReducedMotion();

  // Contact form submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSending(true);
    setContactError("");
    setContactSuccess(false);

    // Validation
    if (!contactName.trim()) {
      setContactError("Ism maydoni to'ldirilishi kerak");
      setIsContactSending(false);
      return;
    }

    if (!contactMessage.trim()) {
      setContactError("Xabar maydoni to'ldirilishi kerak");
      setIsContactSending(false);
      return;
    }

    try {
      console.log('Sending contact form:', { name: contactName, telegram: contactTelegram });
      
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          telegram: contactTelegram.trim(),
          message: contactMessage.trim()
        })
      });

      const data = await res.json();
      console.log('Contact form response:', data);

      if (res.ok && data.success) {
        setContactSuccess(true);
        setContactName("");
        setContactTelegram("");
        setContactMessage("");
        // 5 soniyadan keyin success xabarini o'chirish
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        setContactError(data.error || "Xabar yuborishda xatolik yuz berdi");
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setContactError(error.message || "Xabar yuborishda xatolik yuz berdi");
    } finally {
      setIsContactSending(false);
    }
  };

  // CV fayl URL - public papkadagi fayl
  const staticCvUrl = '/cv/Avrangzeb_CV.pdf';

  // Fetch CV (agar Supabase'dan kerak bo'lsa)
  const fetchCV = async () => {
    try {
      setIsLoadingCv(true);
      // Avval static faylni tekshiramiz
      const staticExists = await fetch(staticCvUrl, { method: 'HEAD' }).then(res => res.ok).catch(() => false);
      
      if (staticExists) {
        setCvUrl(staticCvUrl);
        setIsLoadingCv(false);
        return;
      }

      // Agar static fayl bo'lmasa, API'dan olamiz
      const res = await fetch('/api/cv');
      const data = await res.json();
      
      if (data.success && data.cv_url) {
        setCvUrl(data.cv_url);
      } else {
        setCvUrl(null);
      }
    } catch (error) {
      console.error('Failed to fetch CV:', error);
      setCvUrl(null);
    } finally {
      setIsLoadingCv(false);
    }
  };

  // Load CV on mount
  useEffect(() => {
    // Static faylni darhol ko'rsatamiz
    setCvUrl(staticCvUrl);
    setIsLoadingCv(false);
    // Background'da API'dan ham tekshiramiz
    fetchCV();
  }, []);

  // CV yuklash
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type tekshirish
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt || '')) {
      alert(t.cv.fileTypes);
      return;
    }

    // File size tekshirish (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(t.cv.maxSize);
      return;
    }

    try {
      setIsUploadingCv(true);
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCvUrl(data.cv_url);
        alert(t.cv.uploadSuccess);
        await fetchCV(); // Refresh
      } else {
        alert(data.error || t.cv.uploadError);
      }
    } catch (error) {
      console.error('CV upload error:', error);
      alert(t.cv.uploadError);
    } finally {
      setIsUploadingCv(false);
      // Reset input
      e.target.value = '';
    }
  };

  // CV o'chirish
  const handleCVDelete = async () => {
    if (!confirm(t.cv.deleteConfirm)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/cv', {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCvUrl(null);
        alert(t.cv.deleteSuccess);
      } else {
        alert(data.error || t.cv.deleteError);
      }
    } catch (error) {
      console.error('CV delete error:', error);
      alert(t.cv.deleteError);
    }
  };

  // Save language to localStorage
  const changeLanguage = (lang: Locale) => {
    setLanguage(lang);
    localStorage.setItem(languageStorageKey, lang);
    setIsLangMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-line bg-background/78 shadow-2xl shadow-elevation/20 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - bosh sahifaga havola */}
            <button 
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="animate-pulse-glow rounded-lg">
                <Logo />
              </div>
              <span className="font-bold text-lg sm:text-xl">Avrangzeb</span>
            </button>
            
            {/* Desktop Navigation - faqat asosiy bo'limlar */}
            <div className="hidden md:flex items-center gap-2 lg:gap-6 xl:gap-8">
              {[
                { id: "projects", label: t.nav.projects },
                { id: "my-projects", label: t.nav.myProjects },
                { id: "about", label: t.about.title },
                { id: "skills", label: t.nav.skills },
                { id: "contact", label: t.contact.title },
                { id: "notes", label: t.nav.notes, isLink: true, href: "/notes" },
              ].map((item) => (
                item.isLink ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className="rounded-lg px-1.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-hover/[0.09] hover:text-cyan-text lg:px-2 lg:text-sm"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-lg px-1.5 py-1.5 text-xs font-semibold transition-colors hover:bg-hover/[0.09] hover:text-cyan-text lg:px-2 lg:text-sm ${
                      activeSection === item.id ? "bg-accent-cyan/10 text-cyan-text" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              ))}
              <SectionsDropdown locale={language} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="rounded-lg border border-line bg-hover/[0.09] px-2 py-1.5 text-xs font-bold text-cyan-text transition-colors hover:border-accent-cyan/40"
                >
                  {languageLabels[language].flag}
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-background/95 shadow-2xl shadow-elevation/40 backdrop-blur-2xl">
                    {supportedLocales.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2/50 transition-colors ${
                          language === lang ? "bg-accent-cyan/20 text-cyan-text" : "text-secondary"
                        }`}
                      >
                        <span className="text-xl">{languageLabels[lang].flag}</span>
                        <span>{languageLabels[lang].name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Login/Profile Button */}
              {isLoggedIn ? (
                <a
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="hidden items-center gap-2 rounded-lg bg-accent-green px-2 py-2 text-sm font-bold text-inverse transition-colors hover:bg-accent-cyan sm:flex lg:px-3"
                >
                  <div className="w-6 h-6 rounded-full bg-hover/20 flex items-center justify-center text-xs font-bold">
                    {currentUser?.full_name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="hidden lg:inline">{isAdmin ? t.auth.admin : t.auth.profile}</span>
                </a>
              ) : (
                <a
                  href="/auth/login"
                  className="hidden items-center gap-2 rounded-lg bg-accent-green px-2 py-2 text-sm font-bold text-inverse transition-colors hover:bg-accent-cyan sm:flex lg:px-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden lg:inline">{t.auth.login}</span>
                </a>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg border border-line bg-hover/[0.08] p-2 text-muted transition-colors hover:text-cyan-text md:hidden"
              >
                {isMobileMenuOpen ? <CloseMenuIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 border-t border-line pb-4 pt-4 md:hidden">
              <div className="flex flex-col gap-2">
                {[
                  { id: "projects", label: t.nav.projects },
                  { id: "my-projects", label: t.nav.myProjects },
                  { id: "about", label: t.about.title },
                  { id: "skills", label: t.nav.skills },
                  { id: "contact", label: t.contact.title },
                  { id: "notes", label: t.nav.notes, isLink: true, href: "/notes" },
                ].map((item) => (
                  item.isLink ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className="px-4 py-3 text-base font-medium text-secondary hover:text-cyan-text hover:bg-card/50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left text-base font-medium rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "text-cyan-text bg-accent-cyan/10"
                          : "text-secondary hover:text-cyan-text hover:bg-card/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                ))}
                <SectionsDropdownMobile locale={language} onNavigate={() => setIsMobileMenuOpen(false)} />

                {/* Mobile Login/Profile Button */}
                {isLoggedIn ? (
                  <a
                    href={isAdmin ? "/admin" : "/dashboard"}
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-green text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-6 h-6 rounded-full bg-hover/20 flex items-center justify-center text-sm font-bold">
                      {currentUser?.full_name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    {isAdmin ? t.auth.adminPanel : t.auth.myProfile}
                  </a>
                ) : (
                  <a
                    href="/auth/login"
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-green text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {t.auth.loginRegister}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <HeroSection
        t={t}
        scrollToSection={scrollToSection}
        cvUrl={cvUrl}
        staticCvUrl={staticCvUrl}
        shouldReduceMotion={shouldReduceMotion}
      />

      <ProjectsGoalsSection t={t} />

      <MyProjectsSection t={t} />

      <AboutSection t={t} />

      <SkillsSection t={t} />

      {/* CV Section */}
      <section id="legacy-cv" className="hidden">
        <div className="absolute inset-0 bg-surface" aria-hidden="true" />
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[linear-gradient(130deg,rgba(34,211,238,0.12),transparent_34%,rgba(16,185,129,0.1)_72%,transparent),linear-gradient(180deg,rgba(2,6,23,0.2),rgba(2,6,23,0.92))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-lg border border-accent-green/20 bg-accent-green/[0.14] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-green-text">
                {t.cv.title}
              </p>
              <h2 className="mt-5 text-4xl font-black leading-[0.98] text-foreground sm:text-5xl">
                {t.cv.title}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg lg:justify-self-end">
              {t.cv.subtitle}
            </p>
          </div>

          {isLoadingCv ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto"></div>
            </div>
          ) : cvUrl ? (
            <div className="rounded-2xl border border-line bg-hover/[0.045] p-6 shadow-2xl shadow-elevation/30 backdrop-blur-2xl sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/[0.12] text-cyan-text">
                    <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                      CV mavjud
                    </h3>
                    <p className="text-sm text-muted">
                      CV'ni yuklab olish uchun tugmani bosing
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={cvUrl || staticCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Avrangzeb_CV.pdf"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-green px-6 py-3 font-bold text-inverse transition-colors hover:bg-accent-cyan"
                    onClick={(e) => {
                      // Yangi tab'da ochilishini ta'minlash
                      e.preventDefault();
                      window.open(cvUrl || staticCvUrl, '_blank');
                      // Yuklab olish uchun
                      const link = document.createElement('a');
                      link.href = cvUrl || staticCvUrl;
                      link.download = 'Avrangzeb_CV.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.cv.download}
                  </a>
                  {isAdmin && (
                    <>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-hover/[0.08] px-6 py-3 font-semibold text-secondary transition-all hover:bg-hover/[0.12]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {isUploadingCv ? t.cv.uploading : t.cv.uploadNew}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleCVUpload}
                          className="hidden"
                          disabled={isUploadingCv}
                        />
                      </label>
                      <button
                        onClick={handleCVDelete}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/50 px-6 py-3 font-semibold text-red-300 transition-all hover:bg-red-500/10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        O'chirish
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-xl border border-line bg-hover/[0.08]">
                <svg className="w-10 h-10 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {/* Static CV mavjud bo'lsa, uni ko'rsatish */}
              <div className="mx-auto max-w-md rounded-2xl border border-line bg-hover/[0.045] p-6 shadow-2xl shadow-elevation/30 backdrop-blur-2xl sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/[0.12] text-cyan-text">
                    <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                      CV mavjud
                    </h3>
                    <p className="text-sm text-muted">
                      CV'ni yuklab olish uchun tugmani bosing
                    </p>
                  </div>
                </div>
                <a
                  href={staticCvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Avrangzeb_CV.pdf"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-green px-6 py-3 font-bold text-inverse transition-colors hover:bg-accent-cyan"
                  onClick={(e) => {
                    // Yangi tab'da ochilishini ta'minlash
                    e.preventDefault();
                    window.open(staticCvUrl, '_blank');
                    // Yuklab olish uchun
                    const link = document.createElement('a');
                    link.href = staticCvUrl;
                    link.download = 'Avrangzeb_CV.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t.cv.download}
                </a>
                {isAdmin && (
                  <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-hover/[0.08] px-6 py-3 font-semibold text-secondary transition-all hover:bg-hover/[0.12]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {isUploadingCv ? t.cv.uploading : t.cv.uploadNew}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleCVUpload}
                      className="hidden"
                      disabled={isUploadingCv}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative isolate overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-background" aria-hidden="true" />
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,rgba(34,211,238,0.13),transparent_35%,rgba(47,226,138,0.12)_78%,transparent),linear-gradient(180deg,rgba(2,6,23,0.22),rgba(2,6,23,0.95))]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8">
            <div>
              <p className="inline-flex rounded-lg border border-accent-cyan/20 bg-accent-cyan/[0.14] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-text">
                {t.contact.title}
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-foreground sm:text-4xl">
                {t.contact.subtitle}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4">
                <a
                  href="mailto:avrangzebabdujalilov@gmail.com"
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-hover/[0.045] p-3 shadow-2xl shadow-elevation/20 backdrop-blur-2xl transition-colors hover:border-accent-cyan/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-cyan-text flex-shrink-0">
                    <MailIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-subtle">{t.contact.email}</p>
                    <p className="truncate text-sm text-foreground transition-colors group-hover:text-cyan-text sm:text-base">avrangzebabdujalilov@gmail.com</p>
                  </div>
                </a>
                
                <a
                  href="https://t.me/Avrangzeb_99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-hover/[0.045] p-3 shadow-2xl shadow-elevation/20 backdrop-blur-2xl transition-colors hover:border-accent-cyan/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-cyan-text flex-shrink-0">
                    <TelegramIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-subtle">{t.contact.telegram}</p>
                    <p className="truncate text-sm text-foreground transition-colors group-hover:text-cyan-text sm:text-base">@Avrangzeb_99</p>
                  </div>
                </a>

                <a
                  href="tel:+821023492777"
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-hover/[0.045] p-3 shadow-2xl shadow-elevation/20 backdrop-blur-2xl transition-colors hover:border-accent-cyan/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-cyan-text flex-shrink-0">
                    <PhoneIcon />
        </div>
                  <div>
                    <p className="text-xs sm:text-sm text-subtle">{t.contact.phone}</p>
                    <p className="text-sm text-foreground transition-colors group-hover:text-cyan-text sm:text-base">+82 10-2349-2777</p>
                  </div>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/avrangzeb-abdujalilov-365b5221a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-hover/[0.045] p-3 shadow-2xl shadow-elevation/20 backdrop-blur-2xl transition-colors hover:border-accent-cyan/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-cyan-text flex-shrink-0">
                    <LinkedInIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-subtle">{t.contact.linkedin}</p>
                    <p className="truncate text-sm text-foreground transition-colors group-hover:text-cyan-text sm:text-base">avrangzeb-abdujalilov</p>
                  </div>
                </a>

                <a
                  href="https://github.com/UsmanSNT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-hover/[0.045] p-3 shadow-2xl shadow-elevation/20 backdrop-blur-2xl transition-colors hover:border-accent-cyan/40 sm:gap-4 sm:p-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-cyan-text flex-shrink-0">
                    <GitHubIcon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-subtle">{t.contact.github}</p>
                    <p className="truncate text-sm text-foreground transition-colors group-hover:text-cyan-text sm:text-base">UsmanSNT</p>
                  </div>
                </a>
            </div>
            
            {/* Contact Form */}
            <div className="rounded-2xl border border-line bg-hover/[0.045] p-4 shadow-2xl shadow-elevation/30 backdrop-blur-2xl sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
                {t.contact.sendMessage}
              </h3>
              
              {contactSuccess && (
                <div className="mb-4 p-3 bg-accent-green/20 border border-accent-green/50 rounded-lg text-green-text text-sm">
                  {t.contact.successMessage}
                </div>
              )}
              
              {contactError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {contactError}
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-muted mb-2">{t.contact.form.name}</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-line bg-background/55 px-3 py-2.5 text-sm text-foreground placeholder-subtle transition-colors focus:border-accent-cyan focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-muted mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-text" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      {t.contact.form.telegram}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={contactTelegram}
                    onChange={(e) => setContactTelegram(e.target.value)}
                    className="w-full rounded-lg border border-line bg-background/55 px-3 py-2.5 text-sm text-foreground placeholder-subtle transition-colors focus:border-accent-cyan focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                    placeholder={t.contact.form.telegramPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-muted mb-2">{t.contact.form.message}</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full resize-none rounded-lg border border-line bg-background/55 px-3 py-2.5 text-sm text-foreground placeholder-subtle transition-colors focus:border-accent-cyan focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                    placeholder={t.contact.form.messagePlaceholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isContactSending}
                  className="w-full rounded-lg bg-accent-green py-2.5 text-sm font-bold text-inverse transition-colors hover:bg-accent-cyan disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
                >
                  {isContactSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t.contact.form.sending}
                    </span>
                  ) : (
                    t.contact.form.send
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <FooterSection t={t} />
    </div>
  );
}



