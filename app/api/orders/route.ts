import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET all orders (for a specific user)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1',
      [userId]
    )

    return NextResponse.json({ 
      success: true, 
      orders: result.rows,
      total: result.rowCount
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, total, status, shippingAddress, items } = body

    if (!userId || !total || !status || !shippingAddress || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order = await query(
      'INSERT INTO orders (id, user_id, total, status, shipping_address, items) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [`order-${Date.now()}`, userId, total, status, JSON.stringify(shippingAddress), typeof items === 'string' ? items : JSON.stringify(items)]
    )

    return NextResponse.json({ 
      success: true, 
      order: order.rows[0]
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
