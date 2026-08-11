import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nsvair-diagnosis.app'
  const now = new Date()

  const moduleAnchors = [
    'skin-scanner',
    'eye-health',
    'facial-wellness',
    'dental-oral',
    'nail-health',
    'hair-scalp',
    'posture-analysis',
    'voice-cough-analyzer',
    'symptom-checker',
    'mental-health',
    'sleep-quality',
    'nutrition-check',
    'vital-signs',
    'reaction-balance',
    'vision-test',
    'hearing-test',
  ]

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/#modules`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  for (const anchor of moduleAnchors) {
    entries.push({
      url: `${baseUrl}/#${anchor}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  entries.push(
    {
      url: `${baseUrl}/#comprehensive-report`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  )

  return entries
}
