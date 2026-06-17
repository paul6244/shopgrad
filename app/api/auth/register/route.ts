import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2',
      [email, phone || null]
    )

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new user
    const userId = `user-${Date.now()}`
    const result = await query(
      'INSERT INTO users (id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name || email.split('@')[0], email, phone || null]
    )

    return NextResponse.json({ 
      success: true, 
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
  }
}
