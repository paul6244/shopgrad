import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite'

// GET all favorites for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FAVORITES,
      [`userId="${userId}"`]
    )

    return NextResponse.json({ 
      success: true, 
      favorites: response.documents,
      total: response.total
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

    // Check if already in favorites
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FAVORITES,
      [`userId="${userId}"`, `productId="${productId}"`]
    )

    if (existing.total > 0) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 400 })
    }

    const favorite = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.FAVORITES,
      ID.unique(),
      {
        userId,
        productId
      }
    )

    return NextResponse.json({ 
      success: true, 
      favorite 
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
  }
}
