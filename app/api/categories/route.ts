import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET all categories
export async function GET() {
  try {
    const result = await query('SELECT * FROM categories')

    return NextResponse.json({ 
      success: true, 
      categories: result.rows,
      total: result.rowCount
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const category = await query(
      'INSERT INTO categories (id, name, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [`cat-${Date.now()}`, name, description || '', image || '']
    )

    return NextResponse.json({ 
      success: true, 
      category: category.rows[0]
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
