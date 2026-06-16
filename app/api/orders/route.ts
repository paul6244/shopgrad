import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite'

// GET all orders (for a specific user)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      [`userId="${userId}"`]
    )

    return NextResponse.json({ 
      success: true, 
      orders: response.documents,
      total: response.total
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

    const order = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ORDERS,
      ID.unique(),
      {
        userId,
        total,
        status,
        shippingAddress,
        items: typeof items === 'string' ? items : JSON.stringify(items)
      }
    )

    return NextResponse.json({ 
      success: true, 
      order 
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
