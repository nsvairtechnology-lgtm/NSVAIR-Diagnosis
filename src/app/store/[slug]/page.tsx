import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug, getProductsByCategory } from '@/lib/products-data'
import { ProductDetail } from '@/components/store/product-detail'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nsvair-diagnosis.onrender.com'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Generate static params for all 500+ products for instant pre-rendering & Google indexing
 */
export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((p) => ({
    slug: p.slug,
  }))
}

/**
 * Generate dynamic rich SEO metadata for each individual product
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | NSVAIR Diagnosis Store',
      description: 'The requested diagnostic medical product could not be found.',
    }
  }

  const title = `${product.name} — Buy Online | NSVAIR Diagnosis Store`
  const description = `${product.shortDescription} Buy ${product.name} from NSVAIR Diagnosis (Powered by NSVAIR GROUP OF INDUSTRY). SKU: ${product.sku}. Price: $${product.price}. ISO 13485 certified.`

  return {
    title,
    description,
    keywords: [
      product.name,
      product.subCategory,
      product.categoryLabel,
      `buy ${product.name}`,
      `${product.sku} NSVAIR`,
      'NSVAIR GROUP OF INDUSTRY',
      ...product.tags,
    ],
    alternates: {
      canonical: `${SITE_URL}/store/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/store/${product.slug}`,
      siteName: 'NSVAIR Diagnosis — Powered by NSVAIR GROUP OF INDUSTRY',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  // JSON-LD Schema.org Structured Data for Google Rich Snippets
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    mpn: product.sku,
    image: `${SITE_URL}/opengraph-image.png`,
    brand: {
      '@type': 'Brand',
      name: 'NSVAIR Diagnosis',
      parentOrganization: {
        '@type': 'Organization',
        name: 'NSVAIR GROUP OF INDUSTRY',
      },
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/store/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'NSVAIR GROUP OF INDUSTRY',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: '5.0',
      worstRating: '1.0',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Medical Store',
        item: `${SITE_URL}/store`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categoryLabel,
        item: `${SITE_URL}/store?category=${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${SITE_URL}/store/${product.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetail product={product} relatedProducts={related} />
    </>
  )
}
