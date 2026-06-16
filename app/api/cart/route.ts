import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory cart storage (WARNING: This won't work in serverless environments like Vercel)
// For production, consider using Redis or a database
declare global {
  var cartStore: Map<string, any[]>
}

if (!global.cartStore) {
  global.cartStore = new Map<string, any[]>()
}

const cartStore = global.cartStore

// GET cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const cartItems = cartStore.get(userId) || []

    return NextResponse.json({ 
      success: true, 
      cartItems,
      total: cartItems.length
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

    // Get existing cart items
    const cartItems = cartStore.get(userId) || []
    
    // Check if product already in cart
    const existingIndex = cartItems.findIndex((item: any) => item.productId === productId)
    
    if (existingIndex >= 0) {
      // Update quantity
      cartItems[existingIndex].quantity += quantity
    } else {
      // Add new item
      cartItems.push({
        $id: `cart-${Date.now()}`,
        userId,
        productId,
        quantity
      })
    }
    
    cartStore.set(userId, cartItems)

    return NextResponse.json({ 
      success: true, 
      cartItem: existingIndex >= 0 ? cartItems[existingIndex] : cartItems[cartItems.length - 1]
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
