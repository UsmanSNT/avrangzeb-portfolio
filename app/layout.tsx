import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://avrangzebabdujalilov.com"),
  title: "Avrangzeb Abdujalilov | Software Engineer & AI/Backend Developer",
  description: "Abdujalilov Avrangzeb - Software Engineer specializing in AI, backend development, network security, and cybersecurity. Based in Jeonju, South Korea. Portfolio, projects, and contact.",
  keywords: [
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
    url: 'https://avrangzebabdujalilov.com',
    siteName: 'Avrangzeb Abdujalilov Portfolio',
    title: 'Avrangzeb Abdujalilov | Software Engineer & AI/Backend Developer',
    description: 'Software Engineer specializing in AI, backend development, network security, and cybersecurity. Based in Jeonju, South Korea.',
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
    title: 'Avrangzeb Abdujalilov | Software Engineer',
    description: 'Software Engineer specializing in AI, backend development, and cybersecurity, based in South Korea',
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
    <html lang="uz">
      <head>
        <link rel="apple-touch-icon" href="/images/profile.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
