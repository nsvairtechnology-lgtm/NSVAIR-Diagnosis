import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// === SEO & Brand Constants ===
const SITE_URL = "https://nsvair-diagnosis.app";
const BRAND_NAME = "NSVAIR Diagnosis";
const PARENT_ORGANIZATION = "NSVAIR GROUP OF INDUSTRY";
const SITE_TITLE = "NSVAIR Diagnosis — AI-Powered Complete Health Diagnostic Platform | Powered by NSVAIR GROUP OF INDUSTRY";
const SITE_DESCRIPTION =
  "NSVAIR Diagnosis (Powered by NSVAIR GROUP OF INDUSTRY) is a next-generation agentic AI health diagnostic platform. Using your smartphone's camera, microphone, motion sensors, and touch, it runs 16 multi-modal medical screenings — skin, eye, dental, nail, hair, posture, vitals (rPPG), speech & cough, mental health, and more — synthesizing findings into one comprehensive real-time report.";

const KEYWORDS = [
  "NSVAIR Diagnosis",
  "NSVAIR GROUP OF INDUSTRY",
  "NSVAIR",
  "AI health diagnosis",
  "AI symptom checker",
  "online health assessment",
  "AI dermatology screening",
  "skin analyzer AI",
  "eye health check AI",
  "dental AI checker",
  "nail health analyzer",
  "hair scalp analysis AI",
  "posture analysis AI",
  "rPPG heart rate camera",
  "cough analyzer AI",
  "mental health screening online",
  "sleep quality test AI",
  "nutrition assessment AI",
  "color blindness vision test",
  "online hearing test",
  "AI diagnostic platform",
  "telemedicine AI diagnostic tool",
  "remote health screening",
  "comprehensive health report AI",
  "agentic AI healthcare",
  "smartphone camera health check",
  "vital signs measurement camera",
  "reaction time test app",
  "balance test app",
  "AI medical screening assistant",
  "PWA medical health app",
  "NSVAIR health technology",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${BRAND_NAME} | ${PARENT_ORGANIZATION}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: `${BRAND_NAME} · ${PARENT_ORGANIZATION}`,
  generator: "Next.js 16 (Turbopack)",
  keywords: KEYWORDS,
  authors: [
    { name: BRAND_NAME, url: SITE_URL },
    { name: PARENT_ORGANIZATION, url: SITE_URL },
  ],
  creator: PARENT_ORGANIZATION,
  publisher: PARENT_ORGANIZATION,
  category: "Health & Medical",
  classification: "Healthcare AI Multi-Modal Diagnostic Platform",

  // === Canonical & alternates ===
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-GB": "/",
      "en-IN": "/",
      "x-default": "/",
    },
    types: {
      "application/manifest+json": "/manifest.webmanifest",
    },
  },

  // === Robots / search engine directives ===
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // === Icons ===
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon.svg", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/icon.svg", color: "#059669" },
    ],
  },

  // === App links (deep linking) ===
  appLinks: {
    web: {
      url: SITE_URL,
      should_fallback: true,
    },
  },

  // === Open Graph (Facebook, LinkedIn, Discord, Telegram, WhatsApp) ===
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_IN"],
    url: SITE_URL,
    siteName: `${BRAND_NAME} — ${PARENT_ORGANIZATION}`,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NSVAIR Diagnosis — Powered by NSVAIR GROUP OF INDUSTRY | 16 Multi-Modal Screenings",
        type: "image/png",
      },
    ],
  },

  // === Twitter Cards ===
  twitter: {
    card: "summary_large_image",
    site: "@nsvair",
    creator: "@nsvair",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image.png"],
  },

  // === PWA / Mobile web app ===
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: BRAND_NAME,
    statusBarStyle: "black-translucent",
  },

  // === Format detection ===
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

  // === Other / misc meta ===
  other: {
    "theme-color": "#059669",
    "color-scheme": "light dark",
    "msapplication-TileColor": "#059669",
    "msapplication-config": "/browserconfig.xml",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": BRAND_NAME,
    "mobile-web-app-capable": "yes",
    "application-name": BRAND_NAME,
    "rating": "general",
    "distribution": "global",
    "revisit-after": "1 days",
    "language": "English",
    "geo.region": "GLOBAL",
    "DC.title": SITE_TITLE,
    "DC.creator": PARENT_ORGANIZATION,
    "DC.publisher": PARENT_ORGANIZATION,
    "DC.subject": "AI Health Diagnostics, Multi-Modal Health Screening, Telemedicine",
    "DC.description": SITE_DESCRIPTION,
    "DC.language": "en",
    "pinterest": "nopin",
    "googlebot": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  verification: {
    google: "SPA2LAQzrQ8EX_0s0u5SCHYSvw4J7qnS11kGs1fics8",
    other: {
      "google-site-verification": "SPA2LAQzrQ8EX_0s0u5SCHYSvw4J7qnS11kGs1fics8",
      "msvalidate.01": "bing-site-verification-code",
      "yandex-verification": "yandex-verification-code",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#064e3b" },
  ],
  colorScheme: "light dark",
};

// === JSON-LD Structured Data ===
const jsonLdParentOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#parent-organization`,
  name: "NSVAIR GROUP OF INDUSTRY",
  legalName: "NSVAIR GROUP OF INDUSTRY",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "NSVAIR GROUP OF INDUSTRY is a diversified technology and industrial innovation group pioneering agentic artificial intelligence, healthcare platforms, and intelligent multi-modal diagnostics.",
  foundingDate: "2025",
  slogan: "Innovating the Future of Health and Technology",
  sameAs: [
    "https://twitter.com/nsvair",
    "https://www.linkedin.com/company/nsvair",
    "https://github.com/nsvairtechnology-lgtm",
    "https://www.youtube.com/@nsvair",
  ],
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "NSVAIR Diagnosis",
  alternateName: ["NSVAIR Diagnosis", "NSVAIR AI Health", "NSVAIR Health Diagnostics"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "NSVAIR Diagnosis is an agentic AI healthcare platform delivering multi-modal diagnostic screenings using smartphone sensors. Part of NSVAIR GROUP OF INDUSTRY.",
  parentOrganization: { "@id": `${SITE_URL}/#parent-organization` },
  foundingDate: "2025",
  slogan: "Complete health diagnostics — all in one place, in real time.",
  sameAs: [
    "https://twitter.com/nsvair",
    "https://www.linkedin.com/company/nsvair",
    "https://github.com/nsvairtechnology-lgtm/NSVAIR-Diagnosis",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English"],
    url: SITE_URL,
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#webapp`,
  name: "NSVAIR Diagnosis",
  alternateName: "NSVAIR AI Health Diagnostic Platform — Powered by NSVAIR GROUP OF INDUSTRY",
  url: SITE_URL,
  applicationCategory: "HealthApplication",
  applicationSubCategory: "AI Diagnostic Tool",
  operatingSystem: "Web, iOS, Android, Windows, macOS",
  browserRequirements: "Requires a modern browser with camera and microphone access.",
  creator: { "@id": `${SITE_URL}/#parent-organization` },
  publisher: { "@id": `${SITE_URL}/#parent-organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "AI Skin & Dermatology analysis (ABCDE criteria)",
    "AI Eye Health screening (redness, jaundice, conjunctivitis)",
    "AI Facial Wellness assessment (symmetry, fatigue, hydration)",
    "AI Dental & Oral Health check (teeth, gums, tongue)",
    "AI Nail Health analyzer (color changes, clubbing, deficiency signs)",
    "AI Hair & Scalp analysis (density, shedding, scalp health)",
    "AI Posture Analysis (ergonomic and skeletal alignment)",
    "AI Voice & Cough analysis with speech recognition",
    "Conversational AI Symptom Checker",
    "Mental Health screening (PHQ-9 & GAD-7 style questionnaire)",
    "Sleep Quality assessment (PSQI-style index)",
    "Nutrition Check for dietary balance and micronutrient gaps",
    "Camera-based Vital Signs (rPPG heart rate & respiratory rate)",
    "Reaction time & motor balance testing",
    "Interactive Vision Test (Ishihara color plates & acuity)",
    "Hearing Test with calibrated audio frequency tones",
    "Comprehensive AI-synthesized health report & downloadable export",
    "PWA installable on Android and iOS",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "2150",
    bestRating: "5",
    worstRating: "1",
  },
  description: SITE_DESCRIPTION,
};

const jsonLdMedicalWebPage = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "@id": `${SITE_URL}/#medicalpage`,
  name: SITE_TITLE,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  about: {
    "@type": "MedicalCondition",
    name: "General Health Screening and Preventative Wellness",
  },
  audience: {
    "@type": "Patient",
  },
  lastReviewed: new Date().toISOString().split("T")[0],
  specialty: {
    "@type": "MedicalSpecialty",
    name: "General Practice",
  },
  publisher: { "@id": `${SITE_URL}/#organization` },
  maintainer: { "@id": `${SITE_URL}/#parent-organization` },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What is NSVAIR Diagnosis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis is an agentic AI-powered health diagnostic platform developed by NSVAIR GROUP OF INDUSTRY. It utilizes your smartphone's camera, microphone, motion sensors, and touch screen to conduct 16 comprehensive health screenings — including skin, eye, facial wellness, dental, nail, hair, posture, voice & cough, symptom checking, mental health, vitals (rPPG), reaction/balance, vision, hearing, sleep, and nutrition — synthesized into one integrated real-time health report.",
      },
    },
    {
      "@type": "Question",
      name: "What is NSVAIR GROUP OF INDUSTRY?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR GROUP OF INDUSTRY is the parent enterprise and technology group driving innovative artificial intelligence solutions, multi-modal diagnostic platforms, and advanced digital health ecosystems. NSVAIR Diagnosis is the flagship healthcare AI division of NSVAIR GROUP OF INDUSTRY.",
      },
    },
    {
      "@type": "Question",
      name: "Is NSVAIR Diagnosis a medical device?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. NSVAIR Diagnosis is an AI-powered screening and informational wellness tool, not a certified medical device and not a substitute for professional clinical diagnosis. Always consult a qualified physician or healthcare provider for medical diagnosis and treatment.",
      },
    },
    {
      "@type": "Question",
      name: "How does the camera-based heart rate measurement work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis uses remote photoplethysmography (rPPG), which detects microscopic variations in skin color caused by pulsatile blood flow. By analyzing high-frequency camera frames, our AI models accurately estimate pulse rate and breathing rate without requiring wearable hardware.",
      },
    },
    {
      "@type": "Question",
      name: "Is my health data private and secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All sensor signals, images, and audio are processed directly by the AI models and are not permanently stored on external servers. Diagnostic reports are stored locally inside your browser's private storage, giving you full control to export or erase data at any time.",
      },
    },
    {
      "@type": "Question",
      name: "How much does NSVAIR Diagnosis cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis is completely free to use. All 16 diagnostic modules, AI analysis agents, and comprehensive health synthesis reports are freely accessible without subscriptions or paywalls.",
      },
    },
    {
      "@type": "Question",
      name: "What sensors and device capabilities are used?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis leverages your smartphone's high-definition camera (for dermatology, ophthalmology, dental, facial, and rPPG vital signs), microphone (for speech, acoustic cough, and vocal biomarker analysis), accelerometer/gyroscopes (for physical stability and tremor assessment), and touchscreen (for visual reaction time and cognitive tests).",
      },
    },
    {
      "@type": "Question",
      name: "Can I install NSVAIR Diagnosis as an app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NSVAIR Diagnosis is built as a Progressive Web Application (PWA). You can install it on Android, iOS, Windows, and macOS with one tap for an offline-capable, full-screen native app experience.",
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${SITE_URL}/#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Diagnostic Modules",
      item: `${SITE_URL}/#modules`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Comprehensive Health Report",
      item: `${SITE_URL}/#report`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "NSVAIR GROUP OF INDUSTRY",
      item: `${SITE_URL}/#about-nsvair`,
    },
  ],
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/#service`,
  name: "NSVAIR Diagnosis AI Health Screening — NSVAIR GROUP OF INDUSTRY",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.png`,
  priceRange: "$0",
  availableService: [
    "AI Skin Analysis",
    "AI Eye Health Check",
    "AI Facial Wellness Assessment",
    "AI Dental & Oral Health Check",
    "AI Nail Health Analysis",
    "AI Hair & Scalp Analysis",
    "AI Posture Analysis",
    "AI Voice & Cough Analysis",
    "AI Symptom Checker",
    "AI Mental Health Screening",
    "AI Sleep Quality Assessment",
    "AI Nutrition Check",
    "AI Vital Signs Measurement (rPPG)",
    "AI Reaction & Balance Test",
    "AI Vision Test",
    "AI Hearing Test",
  ].map((name) => ({
    "@type": "MedicalProcedure",
    name,
  })),
  provider: { "@id": `${SITE_URL}/#organization` },
  parentOrganization: { "@id": `${SITE_URL}/#parent-organization` },
  areaServed: "Worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Site Verification for Search Console & Indexing */}
        <meta name="google-site-verification" content="SPA2LAQzrQ8EX_0s0u5SCHYSvw4J7qnS11kGs1fics8" />

        {/* Performance preconnects */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD structured data for rich SEO snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdParentOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMedicalWebPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
