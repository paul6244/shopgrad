import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory orders storage (WARNING: This won't work in serverless environments like Vercel)
// For production, consider using Redis or a database
declare global {
  var ordersStore: Map<string, any[]>
}

if (!global.ordersStore) {
  global.ordersStore = new Map<string, any[]>()
}

const ordersStore = global.ordersStore

// GET all orders (for a specific user)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const orders = ordersStore.get(userId) || []

    return NextResponse.json({ 
      success: true, 
      orders,
      total: orders.length
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

    const order = {
      $id: `order-${Date.now()}`,
      userId,
      total,
      status,
      shippingAddress,
      items: typeof items === 'string' ? items : JSON.stringify(items),
      createdAt: new Date().toISOString()
    }
    
    const userOrders = ordersStore.get(userId) || []
    userOrders.push(order)
    ordersStore.set(userId, userOrders)

    return NextResponse.json({ 
      success: true, 
      order 
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
