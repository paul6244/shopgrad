import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory favorites storage (WARNING: This won't work in serverless environments like Vercel)
// For production, consider using Redis or a database
declare global {
  var favoritesStore: Map<string, any[]>
}

if (!global.favoritesStore) {
  global.favoritesStore = new Map<string, any[]>()
}

const favoritesStore = global.favoritesStore

// GET all favorites for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const favorites = favoritesStore.get(userId) || []

    return NextResponse.json({ 
      success: true, 
      favorites,
      total: favorites.length
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

// POST add to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 })
    }

    // Get existing favorites
    const favorites = favoritesStore.get(userId) || []
    
    // Check if already in favorites
    if (favorites.some((item: any) => item.productId === productId)) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 400 })
    }

    const favorite = {
      $id: `fav-${Date.now()}`,
      userId,
      productId
    }
    
    favorites.push(favorite)
    favoritesStore.set(userId, favorites)

    return NextResponse.json({ 
      success: true, 
      favorite 
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
  }
}
