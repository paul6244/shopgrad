import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      profile: result.rows[0]
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

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (email) {
      updates.push(`email = $${paramIndex++}`)
      values.push(email)
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`)
      values.push(phone)
    }
    if (avatar !== undefined) {
      updates.push(`avatar = $${paramIndex++}`)
      values.push(avatar)
    }
    if (address !== undefined) {
      updates.push(`address = $${paramIndex++}`)
      values.push(address)
    }
    if (city !== undefined) {
      updates.push(`city = $${paramIndex++}`)
      values.push(city)
    }
    if (country !== undefined) {
      updates.push(`country = $${paramIndex++}`)
      values.push(country)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(userId)

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      profile: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
