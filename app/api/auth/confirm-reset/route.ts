import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcrypt'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp, newPassword } = body

    console.log('Password reset confirmation received:', { phone, otp })

    if (!phone || !otp || !newPassword) {
      return NextResponse.json({ error: 'Phone, OTP, and new password are required' }, { status: 400 })
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    // Validate OTP from database
    const result = await query(
      'SELECT * FROM otps WHERE identifier = $1 AND method = $2 ORDER BY created_at DESC LIMIT 1',
      [phone, 'sms']
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 })
    }

    const storedData = result.rows[0]

    // Check if OTP is expired
    if (Date.now() > storedData.expires_at) {
      // Delete expired OTP
      await query('DELETE FROM otps WHERE id = $1', [storedData.id])
      return NextResponse.json({ error: 'Reset code has expired' }, { status: 400 })
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 })
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update user password
    const updateResult = await query(
      'UPDATE users SET password_hash = $1 WHERE phone = $2 RETURNING *',
      [passwordHash, phone]
    )

    if (!updateResult.rowCount || updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete used OTP
    await query('DELETE FROM otps WHERE id = $1', [storedData.id])

    console.log('Password reset successful for:', phone)

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully' 
    })
  } catch (error) {
    console.error('Error confirming password reset:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
