import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET all favorites for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const result = await query(
      'SELECT * FROM favorites WHERE user_id = $1',
      [userId]
    )

    return NextResponse.json({ 
      success: true, 
      favorites: result.rows,
      total: result.rowCount
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
    const existing = await query(
      'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 400 })
    }

    const favorite = await query(
      'INSERT INTO favorites (id, user_id, product_id) VALUES ($1, $2, $3) RETURNING *',
      [`fav-${Date.now()}`, userId, productId]
    )

    return NextResponse.json({ 
      success: true, 
      favorite: favorite.rows[0]
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 })
  }
}
