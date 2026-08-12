import { NextResponse } from 'next/server'
import { getAllProducts, getProductBySlug, searchProducts } from '@/lib/products-data'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const category = (searchParams.get('category') || 'all') as any
    const sort = (searchParams.get('sort') || 'popular') as any

    const products = searchProducts(query, category, sort)

    return NextResponse.json({
      success: true,
      total: products.length,
      products,
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required product fields: name, price, category' },
        { status: 400 }
      )
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const product = {
      ...body,
      id: `prod-admin-${Date.now()}`,
      slug,
      sku: body.sku || `NSV-ADM-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: `Product "${product.name}" created successfully`,
      product,
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create product' },
      { status: 500 }
    )
  }
}
