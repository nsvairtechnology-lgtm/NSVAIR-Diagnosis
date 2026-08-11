import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NSVAIR Diagnosis — AI Health Diagnostic Platform',
    short_name: 'NSVAIR Diagnosis',
    description:
      "Agentic AI health diagnostics using your phone's camera, microphone, motion sensors, and touch. 8 AI screenings + one comprehensive report.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#10b981',
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
        name: 'Dental Check',
        short_name: 'Dental',
        description: 'AI dental & oral health check',
        url: '/?module=dental',
      },
      {
        name: 'Symptom Checker',
        short_name: 'Symptoms',
        description: 'Conversational AI symptom analysis',
        url: '/?module=symptom',
      },
      {
        name: 'Vital Signs',
        short_name: 'Vitals',
        description: 'Camera-based heart rate (rPPG)',
        url: '/?module=vitals',
      },
      {
        name: 'Mental Health',
        short_name: 'Mental',
        description: 'Stress, anxiety & depression screening',
        url: '/?module=mental',
      },
      {
        name: 'Vision Test',
        short_name: 'Vision',
        description: 'Color blindness & sharpness test',
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
        description: 'Generate your complete health report',
        url: '/?action=report',
      },
    ],
    screenshots: [
      {
        src: '/opengraph-image.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'NSVAIR Diagnosis dashboard with 8 diagnostic modules',
      },
    ],
  }
}
