import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory user profiles storage (WARNING: This won't work in serverless environments like Vercel)
// For production, consider using Redis or a database
declare global {
  var usersStore: Map<string, any>
}

if (!global.usersStore) {
  global.usersStore = new Map<string, any>()
}

const usersStore = global.usersStore

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const profile = usersStore.get(userId)

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      profile 
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

    const profile = usersStore.get(userId)
    
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (name) profile.name = name
    if (email) profile.email = email
    if (phone !== undefined) profile.phone = phone
    if (avatar !== undefined) profile.avatar = avatar
    if (address !== undefined) profile.address = address
    if (city !== undefined) profile.city = city
    if (country !== undefined) profile.country = country

    usersStore.set(userId, profile)

    return NextResponse.json({ 
      success: true, 
      profile 
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
