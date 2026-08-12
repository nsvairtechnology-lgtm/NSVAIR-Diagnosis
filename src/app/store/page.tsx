import type { Metadata } from 'next'
import { StoreFront } from '@/components/store/store-front'
import { getAllProducts } from '@/lib/products-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nsvair-diagnosis.onrender.com'

export const metadata: Metadata = {
  title: 'NSVAIR Diagnosis Medical Store — Buy 500+ AI Diagnostic Kits, Ultrasound Probes & Lab Panels',
  description:
    'Official NSVAIR Diagnosis Store (Powered by NSVAIR GROUP OF INDUSTRY). Buy 500+ clinical AI screening passes, handheld ultrasound probes, smart dermatoscopes, at-home blood test kits, and medical supplies.',
  keywords: [
    'NSVAIR Diagnosis store',
    'buy medical imaging devices',
    'handheld ultrasound probe price',
    'smart dermatoscope smartphone',
    'at-home CBC blood test kit',
    'AI diagnostic screening pass',
    'NSVAIR GROUP OF INDUSTRY',
    'medical supplies online',
    'ECG monitor wireless',
    'pulse oximeter clinical grade',
  ],
  alternates: {
    canonical: `${SITE_URL}/store`,
  },
  openGraph: {
    title: 'NSVAIR Diagnosis Medical Store — Buy 500+ Clinical Diagnostic Products',
    description:
      'Buy hospital-grade AI diagnostic passes, wireless ultrasound devices, home lab test kits, and clinical wellness gear from NSVAIR GROUP OF INDUSTRY.',
    url: `${SITE_URL}/store`,
    siteName: 'NSVAIR Diagnosis — Powered by NSVAIR GROUP OF INDUSTRY',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSVAIR Diagnosis Store — 500+ Medical Products',
    description: 'Official diagnostic kits and medical hardware powered by NSVAIR GROUP OF INDUSTRY.',
  },
}

export default function StorePage() {
  const products = getAllProducts()

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'NSVAIR Diagnosis Medical Marketplace & Store',
    description: 'Online store for 500+ clinical AI diagnostic screening passes, medical imaging hardware, and home blood test kits.',
    url: `${SITE_URL}/store`,
    publisher: {
      '@type': 'Organization',
      name: 'NSVAIR GROUP OF INDUSTRY',
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'OfferCatalog',
      name: 'NSVAIR Medical Products Catalog',
      itemListElement: products.slice(0, 50).map((p, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: p.name,
          sku: p.sku,
          description: p.shortDescription,
          url: `${SITE_URL}/store/${p.slug}`,
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        },
        position: idx + 1,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <StoreFront />
    </>
  )
}
