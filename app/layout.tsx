import type { Metadata } from "next";
import "./globals.css";
import { themeInitScript } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

const defaultTitle = "Avrangzeb Abdujalilov | Software Engineer & AI/Backend Developer";
const defaultDescription = "Abdujalilov Avrangzeb - Software Engineer specializing in AI, backend development, network security, and cybersecurity. Based in Jeonju, South Korea. Portfolio, projects, and contact.";
const defaultKeywords = [
  "Avrangzeb Abdujalilov",
  "Abdujalilov Avrangzeb",
  "압둘잘릴로프 아브랑젭",
  "Software Engineer",
  "AI Engineer",
  "Backend Developer",
  "Network Administrator",
  "Cybersecurity",
  "CCNA",
  "Woosuk University",
  "우석대학교",
  "IT Security",
  "Tarmoq mutaxassisi",
  "Axborot xavfsizligi",
  "O'zbekiston IT",
  "Korea IT student",
  "Portfolio",
  "Linux Administrator",
  "Cisco",
  "CompTIA Network+"
];

// Admin panel (/admin/seo) orqali tahrirlanadigan global SEO sozlamalarini oladi.
// Baza mavjud bo'lmasa yoki xato bo'lsa, standart qiymatlarga qaytadi.
async function getGlobalSeoSettings() {
  try {
    const { data } = await supabase
      .from('portfolio_seo_settings')
      .select('title, description, keywords')
      .eq('page_key', 'global')
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeoSettings();
  const title = seo?.title || defaultTitle;
  const description = seo?.description || defaultDescription;
  const keywords = seo?.keywords
    ? seo.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    : defaultKeywords;

  return {
  metadataBase: new URL("https://avrangzebabdujalilov.com"),
  title,
  description,
  keywords,
  authors: [{ name: "Avrangzeb Abdujalilov" }],
  creator: "Avrangzeb Abdujalilov",
  publisher: "Avrangzeb Abdujalilov",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    alternateLocale: ['en_US', 'ko_KR'],
    url: 'https://avrangzebabdujalilov.com',
    siteName: 'Avrangzeb Abdujalilov Portfolio',
    title,
    description,
    images: [
      {
        url: '/images/profile.png',
        width: 1200,
        height: 630,
        alt: 'Avrangzeb Abdujalilov - Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/profile.png'],
  },
  verification: {
    google: 'hkkXR8HTrCqInv8nhznuiC0MdS2AqZqSsmD9S-7wKU4',
  },
  alternates: {
    canonical: 'https://avrangzebabdujalilov.com',
    languages: {
      'uz-UZ': 'https://avrangzebabdujalilov.com',
      'en-US': 'https://avrangzebabdujalilov.com',
      'ko-KR': 'https://avrangzebabdujalilov.com',
    },
  },
  category: 'technology',
  };
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Avrangzeb Abdujalilov',
  alternateName: ['Abdujalilov Avrangzeb', '압둘잘릴로프 아브랑젭'],
  description: 'Software Engineer specializing in AI, backend development, network security, and cybersecurity, based in South Korea',
  url: 'https://avrangzebabdujalilov.com',
  image: 'https://avrangzebabdujalilov.com/images/profile.png',
  email: 'avrangzebabdujalilov@gmail.com',
  telephone: '+82-10-2349-2777',
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'EducationalOrganization',
    name: 'Woosuk University',
    alternateName: '우석대학교',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jeonju',
      addressCountry: 'South Korea'
    }
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Woosuk University',
  },
  knowsAbout: [
    'Software Engineering',
    'Artificial Intelligence',
    'Backend Development',
    'Network Administration',
    'Cybersecurity',
    'Cisco Networking',
    'Linux Server',
    'Windows Server',
    'CCNA',
    'CompTIA Network+',
    'Cloud Computing'
  ],
  sameAs: [
    'https://github.com/UsmanSNT',
    'https://www.linkedin.com/in/avrangzeb-abdujalilov-365b5221a/',
    'https://t.me/Avrangzeb_Abdujalilov'
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/images/profile.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Decorative script/serif fonts for the /moments memory book */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Dancing+Script&display=swap"
        />
        <meta name="theme-color" content="#081018" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#eef2f8" media="(prefers-color-scheme: light)" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
