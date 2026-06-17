import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const result = await query(
      'SELECT * FROM cart WHERE user_id = $1',
      [userId]
    )

    return NextResponse.json({ 
      success: true, 
      cartItems: result.rows,
      total: result.rowCount
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

// POST add to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, quantity } = body

    if (!userId || !productId || !quantity) {
      return NextResponse.json({ error: 'User ID, Product ID, and quantity are required' }, { status: 400 })
    }

    // Check if product already in cart
    const existing = await query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )

    if (existing.rowCount && existing.rowCount > 0) {
      // Update quantity
      const updated = await query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, productId]
      )
      return NextResponse.json({ 
        success: true, 
        cartItem: updated.rows[0] 
      })
    }

    // Add new item
    const cartItem = await query(
      'INSERT INTO cart (id, user_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [`cart-${Date.now()}`, userId, productId, quantity]
    )

    return NextResponse.json({ 
      success: true, 
      cartItem: cartItem.rows[0]
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
