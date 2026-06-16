import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite'

// GET cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CART,
      [`userId="${userId}"`]
    )

    return NextResponse.json({ 
      success: true, 
      cartItems: response.documents,
      total: response.total
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
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CART,
      [`userId="${userId}"`, `productId="${productId}"`]
    )

    if (existing.total > 0) {
      // Update quantity instead
      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CART,
        existing.documents[0].$id,
        {
          quantity: existing.documents[0].quantity + quantity
        }
      )
      return NextResponse.json({ 
        success: true, 
        cartItem: updated 
      })
    }

    const cartItem = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CART,
      ID.unique(),
      {
        userId,
        productId,
        quantity
      }
    )

    return NextResponse.json({ 
      success: true, 
      cartItem 
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
