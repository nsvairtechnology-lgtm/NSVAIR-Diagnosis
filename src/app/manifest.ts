import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NSVAIR Diagnosis — Powered by NSVAIR GROUP OF INDUSTRY',
    short_name: 'NSVAIR Diagnosis',
    description:
      "NSVAIR Diagnosis (Powered by NSVAIR GROUP OF INDUSTRY) is an agentic AI health diagnostic platform using your smartphone's camera, microphone, motion sensors, and touch to run 16 AI screenings with instant comprehensive health reporting.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#064e3b',
    theme_color: '#059669',
    categories: ['health', 'medical', 'productivity', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Skin Scanner',
        short_name: 'Skin',
        description: 'AI skin & dermatology analysis',
        url: '/?module=skin',
      },
      {
        name: 'Eye Health Check',
        short_name: 'Eye',
        description: 'AI eye redness, jaundice & fatigue check',
        url: '/?module=eye',
      },
      {
        name: 'Facial Wellness',
        short_name: 'Face',
        description: 'AI facial wellness & symmetry analysis',
        url: '/?module=face',
      },
      {
        name: 'Dental Check',
        short_name: 'Dental',
        description: 'AI dental & oral health check',
        url: '/?module=dental',
      },
      {
        name: 'Nail Analyzer',
        short_name: 'Nail',
        description: 'AI nail health & deficiency screening',
        url: '/?module=nail',
      },
      {
        name: 'Hair & Scalp Check',
        short_name: 'Hair',
        description: 'AI hair density and scalp health analysis',
        url: '/?module=hair',
      },
      {
        name: 'Posture Analysis',
        short_name: 'Posture',
        description: 'AI posture alignment & ergonomic check',
        url: '/?module=posture',
      },
      {
        name: 'Voice & Cough',
        short_name: 'Voice',
        description: 'AI speech & respiratory cough analysis',
        url: '/?module=voice',
      },
      {
        name: 'Symptom Checker',
        short_name: 'Symptoms',
        description: 'Conversational AI symptom analysis',
        url: '/?module=symptom',
      },
      {
        name: 'Vital Signs (rPPG)',
        short_name: 'Vitals',
        description: 'Camera-based heart & breathing rate (rPPG)',
        url: '/?module=vitals',
      },
      {
        name: 'Mental Health',
        short_name: 'Mental',
        description: 'Stress, anxiety & depression screening',
        url: '/?module=mental',
      },
      {
        name: 'Sleep Assessment',
        short_name: 'Sleep',
        description: 'AI sleep quality & circadian health analysis',
        url: '/?module=sleep',
      },
      {
        name: 'Nutrition Check',
        short_name: 'Nutrition',
        description: 'AI dietary balance & deficiency assessment',
        url: '/?module=nutrition',
      },
      {
        name: 'Vision Test',
        short_name: 'Vision',
        description: 'Color blindness & visual acuity test',
        url: '/?module=vision',
      },
      {
        name: 'Hearing Test',
        short_name: 'Hearing',
        description: 'Tone frequency hearing screening',
        url: '/?module=hearing',
      },
      {
        name: 'Comprehensive Report',
        short_name: 'Report',
        description: 'Generate your complete synthesized health report',
        url: '/?action=report',
      },
    ],
    screenshots: [
      {
        src: '/opengraph-image.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'NSVAIR Diagnosis dashboard with 16 diagnostic modules — Powered by NSVAIR GROUP OF INDUSTRY',
      },
    ],
  }
}
