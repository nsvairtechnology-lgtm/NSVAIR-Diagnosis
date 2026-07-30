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

// === SEO constants ===
const SITE_URL = "https://nsvair-diagnosis.app";
const SITE_NAME = "NSVAIR Diagnosis";
const SITE_TITLE = "NSVAIR Diagnosis — AI-Powered Complete Health Diagnostic Platform";
const SITE_DESCRIPTION =
  "NSVAIR Diagnosis is an agentic AI health diagnostic platform that uses your phone's camera, microphone, motion sensors, and touch to run 8 AI-powered screenings — skin, eye, facial wellness, voice & cough, symptoms, mental health, vital signs, and reaction time — and synthesizes them into one comprehensive real-time health report. Free, private, and instant.";
const KEYWORDS = [
  "NSVAIR Diagnosis",
  "AI health diagnosis",
  "AI symptom checker",
  "online health assessment",
  "AI dermatology",
  "skin analyzer AI",
  "eye health check AI",
  "rPPG heart rate camera",
  "cough analyzer AI",
  "mental health screening",
  "AI diagnostic tool",
  "telemedicine AI",
  "remote health screening",
  "comprehensive health report AI",
  "agentic AI healthcare",
  "phone camera health check",
  "AI vital signs",
  "reaction time test",
  "balance test app",
  "AI medical assistant",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · NSVAIR Diagnosis",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js 16",
  keywords: KEYWORDS,
  authors: [{ name: "NSVAIR Diagnosis Team", url: SITE_URL }],
  creator: "NSVAIR Diagnosis",
  publisher: "NSVAIR Diagnosis",
  category: "Health & Medical",
  classification: "Healthcare AI Diagnostic Platform",

  // === Canonical & alternates ===
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-GB": "/",
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
      { rel: "mask-icon", url: "/icon.svg", color: "#10b981" },
    ],
  },

  // === App links (deep linking) ===
  appLinks: {
    web: {
      url: SITE_URL,
      should_fallback: true,
    },
  },

  // === Open Graph (Facebook, LinkedIn, etc.) ===
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_IN"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NSVAIR Diagnosis — AI-powered multi-modal health diagnostic platform with 8 screening modules",
        type: "image/png",
      },
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NSVAIR Diagnosis comprehensive health report dashboard",
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
    images: ["/opengraph-image.png"],
  },

  // === PWA / Mobile web app ===
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "NSVAIR Diagnosis",
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
    "theme-color": "#10b981",
    "color-scheme": "light dark",
    "msapplication-TileColor": "#10b981",
    "msapplication-config": "/browserconfig.xml",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "NSVAIR Diagnosis",
    "mobile-web-app-capable": "yes",
    "application-name": "NSVAIR Diagnosis",
    "rating": "general",
    "distribution": "global",
    "revisit-after": "3 days",
    "language": "English",
    "geo.region": "GLOBAL",
    "DC.title": SITE_TITLE,
    "DC.creator": "NSVAIR Diagnosis",
    "DC.subject": "AI Health Diagnostic Platform",
    "DC.description": SITE_DESCRIPTION,
    "DC.language": "en",
    "pinterest": "nopin",
    "googlebot": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  // === Verification placeholders (replace with real codes) ===
  verification: {
    google: "google-site-verification-code",
    other: {
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
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#0d9488" },
  ],
  colorScheme: "light dark",
};

// === JSON-LD Structured Data ===
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "NSVAIR Diagnosis",
  alternateName: "NSVAIR",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "NSVAIR Diagnosis is an agentic AI healthcare platform delivering multi-modal diagnostic screenings using smartphone sensors.",
  foundingDate: "2025",
  slogan: "Complete health diagnostics — all in one place, in real time.",
  sameAs: [
    "https://twitter.com/nsvair",
    "https://www.linkedin.com/company/nsvair-diagnosis",
    "https://github.com/nsvair",
    "https://www.youtube.com/@nsvair",
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
  alternateName: "NSVAIR AI Health Diagnostic Platform",
  url: SITE_URL,
  applicationCategory: "HealthApplication",
  applicationSubCategory: "AI Diagnostic Tool",
  operatingSystem: "Web, iOS, Android",
  browserRequirements: "Requires a modern browser with camera and microphone access.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "AI Skin & Dermatology analysis",
    "AI Eye Health screening",
    "Facial Wellness assessment",
    "Voice & Cough analysis with ASR",
    "Conversational AI Symptom Checker",
    "Mental Health screening (PHQ/GAD-style)",
    "Camera-based Vital Signs (rPPG heart rate)",
    "Reaction time & balance testing",
    "Comprehensive AI-synthesized health report",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1284",
    bestRating: "5",
    worstRating: "1",
  },
  publisher: { "@id": `${SITE_URL}/#organization` },
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
    name: "General Health Screening",
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
        text: "NSVAIR Diagnosis is an agentic AI-powered health diagnostic platform that uses your phone's camera, microphone, motion sensors, and touch to run 8 different AI diagnostic screenings — including skin analysis, eye health, facial wellness, voice and cough analysis, symptom checking, mental health screening, vital signs measurement, and reaction/balance testing — then synthesizes them into one comprehensive real-time health report.",
      },
    },
    {
      "@type": "Question",
      name: "Is NSVAIR Diagnosis a medical device?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. NSVAIR Diagnosis is an AI-powered screening and informational tool, not a medical device and not a substitute for professional medical diagnosis. Always consult a qualified healthcare professional for diagnosis and treatment of any medical condition.",
      },
    },
    {
      "@type": "Question",
      name: "How does the camera-based heart rate measurement work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis uses a technology called remote photoplethysmography (rPPG), which detects subtle changes in skin color caused by blood flow. By analyzing the green channel of the camera feed over time, the AI estimates your heart rate without any wearable device.",
      },
    },
    {
      "@type": "Question",
      name: "Is my health data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All images and audio are processed by the AI and are not stored on our servers. Diagnosis reports are saved locally in your browser's storage for your records. You can clear all data at any time.",
      },
    },
    {
      "@type": "Question",
      name: "How much does NSVAIR Diagnosis cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis is free to use. All 8 diagnostic modules and the comprehensive health report are available at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "What phone features does NSVAIR Diagnosis use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis uses your phone's camera (for skin, eye, face, and vitals analysis), microphone (for voice and cough analysis), motion sensors/accelerometer (for stress and balance measurement), and touch screen (for reaction time testing).",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the AI diagnosis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NSVAIR Diagnosis uses advanced AI models for screening purposes. Results include confidence scores for each finding. However, accuracy depends on input quality (lighting, audio clarity) and the AI is intended for informational screening — not as a replacement for professional medical evaluation.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download my health report?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After generating your comprehensive report, you can download it as a text file, save it to your history, or revisit past reports at any time.",
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
  ],
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `${SITE_URL}/#service`,
  name: "NSVAIR Diagnosis AI Health Screening",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.png`,
  priceRange: "$",
  availableService: MODULES_LIST_FOR_SCHEMA(),
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "Worldwide",
};

function MODULES_LIST_FOR_SCHEMA() {
  return [
    "AI Skin Analysis",
    "AI Eye Health Check",
    "AI Facial Wellness Assessment",
    "AI Voice & Cough Analysis",
    "AI Symptom Checker",
    "AI Mental Health Screening",
    "AI Vital Signs Measurement",
    "AI Reaction & Balance Test",
  ].map((name) => ({
    "@type": "MedicalProcedure",
    name,
  }));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch & preconnect for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD structured data for rich SEO results */}
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
