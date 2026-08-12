import type { MetadataRoute } from 'next'
import { getAllProducts, CATEGORY_DEFINITIONS } from '@/lib/products-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nsvair-diagnosis.onrender.com'
  const now = new Date()

  // All 18 diagnostic tests / modules
  const allTests = [
    { id: 'radiology', anchor: 'radiology-scan', name: 'X-Ray, Ultrasound & MRI AI Diagnostics', priority: 1.0 },
    { id: 'lab-report', anchor: 'lab-report-analyzer', name: 'Medical Lab Report & Blood Test AI', priority: 1.0 },
    { id: 'symptom', anchor: 'symptom-checker', name: 'Conversational AI Symptom Checker', priority: 1.0 },
    { id: 'vitals', anchor: 'vital-signs', name: 'Camera-Based Vital Signs (rPPG Heart Rate)', priority: 1.0 },
    { id: 'skin', anchor: 'skin-scanner', name: 'AI Skin & Dermatology Analysis', priority: 0.95 },
    { id: 'eye', anchor: 'eye-health', name: 'AI Eye Health & Jaundice Check', priority: 0.95 },
    { id: 'face', anchor: 'facial-wellness', name: 'AI Facial Wellness Assessment', priority: 0.90 },
    { id: 'dental', anchor: 'dental-oral', name: 'AI Dental & Oral Health Check', priority: 0.90 },
    { id: 'nail', anchor: 'nail-health', name: 'AI Nail Health & Deficiency Analyzer', priority: 0.90 },
    { id: 'hair', anchor: 'hair-scalp', name: 'AI Hair & Scalp Health Check', priority: 0.90 },
    { id: 'posture', anchor: 'posture-analysis', name: 'AI Posture & Ergonomic Screening', priority: 0.90 },
    { id: 'voice', anchor: 'voice-cough-analyzer', name: 'AI Voice & Cough Respiratory Analyzer', priority: 0.95 },
    { id: 'mental', anchor: 'mental-health', name: 'Mental Health Screening (PHQ/GAD)', priority: 0.95 },
    { id: 'sleep', anchor: 'sleep-quality', name: 'Sleep Quality & Circadian Assessment', priority: 0.90 },
    { id: 'nutrition', anchor: 'nutrition-check', name: 'Nutrition & Dietary Balance Check', priority: 0.90 },
    { id: 'vision', anchor: 'vision-test', name: 'Interactive Ishihara Vision & Color Test', priority: 0.95 },
    { id: 'hearing', anchor: 'hearing-test', name: 'Calibrated Frequency Hearing Test', priority: 0.95 },
    { id: 'reaction', anchor: 'reaction-balance', name: 'Psychomotor Reaction & Balance Test', priority: 0.90 },
  ]

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#modules`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/#about-nsvair`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/#how-it-works`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.80,
    },
    {
      url: `${baseUrl}/#comprehensive-report`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ]

  // Index each diagnostic test via query routes and anchor routes
  for (const test of allTests) {
    entries.push({
      url: `${baseUrl}/?module=${test.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: test.priority,
    })

    entries.push({
      url: `${baseUrl}/#${test.anchor}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: test.priority,
    })
  }

  // Index store category routes
  for (const catKey of Object.keys(CATEGORY_DEFINITIONS)) {
    entries.push({
      url: `${baseUrl}/store?category=${catKey}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.92,
    })
  }

  // Index ALL 500+ individual store products for search engine discovery & ranking
  const allProducts = getAllProducts()
  for (const product of allProducts) {
    entries.push({
      url: `${baseUrl}/store/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  }

  // Report generation action entry
  entries.push({
    url: `${baseUrl}/?action=report`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.90,
  })

  return entries
}
