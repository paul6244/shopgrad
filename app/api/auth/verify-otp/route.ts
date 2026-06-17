import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { phone, email, otp, method, fullName } = await request.json()

    console.log('Verify OTP Request received:', { phone, email, otp, method, fullName })

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    // Validate based on method
    if (method === 'sms' && !phone) {
      return NextResponse.json({ error: 'Phone number and OTP are required for SMS' }, { status: 400 })
    }
    if (method === 'email' && !email) {
      return NextResponse.json({ error: 'Email and OTP are required for email verification' }, { status: 400 })
    }
    if (!method || !['sms', 'email'].includes(method)) {
      return NextResponse.json({ error: 'Method must be either "sms" or "email"' }, { status: 400 })
    }
    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 })
    }

    // SMS Method - Verify OTP from database
    if (method === 'sms') {
      const result = await query(
        'SELECT * FROM otps WHERE identifier = $1 AND method = $2 ORDER BY created_at DESC LIMIT 1',
        [phone, 'sms']
      )
      
      if (!result.rowCount || result.rowCount === 0) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }
      
      const storedData = result.rows[0]
      
      // Check if OTP is expired
      if (Date.now() > storedData.expires_at) {
        // Delete expired OTP
        await query('DELETE FROM otps WHERE id = $1', [storedData.id])
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
      }

      // Verify OTP directly
      if (storedData.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      // Clear OTP after successful verification
      await query('DELETE FROM otps WHERE id = $1', [storedData.id])

      // Get existing user from database
      const existingUser = await query(
        'SELECT * FROM users WHERE phone = $1',
        [phone]
      )

      if (!existingUser.rowCount || existingUser.rowCount === 0) {
        return NextResponse.json({ error: 'User not found. Please sign up first.' }, { status: 404 })
      }

      const userData = existingUser.rows[0]

      return NextResponse.json({ 
        success: true, 
        message: 'OTP verified successfully via SMS',
        user: {
          id: userData.id,
          name: userData.name,
          phone: userData.phone,
          email: userData.email
        }
      })
    }

    // Email Method - Verify OTP from database
    if (method === 'email') {
      const result = await query(
        'SELECT * FROM otps WHERE identifier = $1 AND method = $2 ORDER BY created_at DESC LIMIT 1',
        [email, 'email']
      )
      
      if (!result.rowCount || result.rowCount === 0) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }
      
      const storedData = result.rows[0]
      
      // Check if OTP is expired
      if (Date.now() > storedData.expires_at) {
        // Delete expired OTP
        await query('DELETE FROM otps WHERE id = $1', [storedData.id])
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      // Clear OTP after successful verification
      await query('DELETE FROM otps WHERE id = $1', [storedData.id])

      // Get existing user from database
      const existingUser = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (!existingUser.rowCount || existingUser.rowCount === 0) {
        return NextResponse.json({ error: 'User not found. Please sign up first.' }, { status: 404 })
      }

      const userData = existingUser.rows[0]

      return NextResponse.json({ 
        success: true, 
        message: 'OTP verified successfully via email',
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email
        }
      })
    }

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
