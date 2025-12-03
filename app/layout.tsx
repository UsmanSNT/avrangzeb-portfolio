import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avrangzeb Abdujalilov | Network Administrator & Cybersecurity Student",
  description: "Abdujalilov Avrangzeb - Janubiy Koreya, Woosuk Universiteti Axborot xavfsizligi talabasi. Network Administrator, CCNA, Cybersecurity mutaxassisi. Portfolio, loyihalar va bog'lanish.",
  keywords: [
    "Avrangzeb Abdujalilov",
    "Abdujalilov Avrangzeb", 
    "압둘잘릴로프 아브랑젭",
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
  ],
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
    url: 'https://avrangzeb-portfolio.vercel.app',
    siteName: 'Avrangzeb Abdujalilov Portfolio',
    title: 'Avrangzeb Abdujalilov | Network Administrator & Cybersecurity',
    description: 'Janubiy Koreya, Woosuk Universiteti Axborot xavfsizligi talabasi. Network Administrator, CCNA, Cybersecurity mutaxassisi.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Avrangzeb Abdujalilov - Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avrangzeb Abdujalilov | Network Administrator',
    description: 'Network Administrator & Cybersecurity Student at Woosuk University, South Korea',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'hkkXR8HTrCqInv8nhznuiC0MdS2AqZqSsmD9S-7wKU4',
  },
  alternates: {
    canonical: 'https://avrangzeb-portfolio.vercel.app',
    languages: {
      'uz-UZ': 'https://avrangzeb-portfolio.vercel.app',
      'en-US': 'https://avrangzeb-portfolio.vercel.app',
      'ko-KR': 'https://avrangzeb-portfolio.vercel.app',
    },
  },
  category: 'technology',
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Avrangzeb Abdujalilov',
  alternateName: ['Abdujalilov Avrangzeb', '압둘잘릴로프 아브랑젭'],
  description: 'Network Administrator & Cybersecurity Student at Woosuk University, South Korea',
  url: 'https://avrangzeb-portfolio.vercel.app',
  image: 'https://avrangzeb-portfolio.vercel.app/images/profile.jpg',
  email: 'avrangzebabdujalilov@gmail.com',
  telephone: '+82-10-2349-2777',
  jobTitle: 'Network Administrator Student',
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
    <html lang="uz">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
