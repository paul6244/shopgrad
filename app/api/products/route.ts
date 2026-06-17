import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')

    let queryText = 'SELECT * FROM products'
    const params: any[] = []
    const conditions: string[] = []

    if (category) {
      conditions.push(`category = $${params.length + 1}`)
      params.push(category)
    }

    if (userId) {
      conditions.push(`user_id = $${params.length + 1}`)
      params.push(userId)
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ')
    }

    const result = await query(queryText, params)

    return NextResponse.json({ 
      success: true, 
      products: result.rows,
      total: result.rowCount
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, stock, userId } = body

    if (!name || !description || !price || !category || !stock || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await query(
      'INSERT INTO products (id, name, description, price, image, category, stock, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [`prod-${Date.now()}`, name, description, price, image || '', category, stock, userId]
    )

    return NextResponse.json({ 
      success: true, 
      product: product.rows[0]
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
