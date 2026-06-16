import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [`$id="${userId}"`]
    )

    if (response.total === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      profile: response.documents[0]
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email, phone, avatar, address, city, country } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const profile = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(country !== undefined && { country })
      }
    )

    return NextResponse.json({ 
      success: true, 
      profile 
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
