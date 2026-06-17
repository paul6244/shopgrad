import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      'SELECT * FROM products WHERE id = $1',
      [params.id]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      product: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, stock } = body

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (description) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }
    if (price) {
      updates.push(`price = $${paramIndex++}`)
      values.push(price)
    }
    if (image !== undefined) {
      updates.push(`image = $${paramIndex++}`)
      values.push(image)
    }
    if (category) {
      updates.push(`category = $${paramIndex++}`)
      values.push(category)
    }
    if (stock) {
      updates.push(`stock = $${paramIndex++}`)
      values.push(stock)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(params.id)

    const result = await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      product: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [params.id]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
