import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendSMSOTP } from '@/lib/arkesel'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    console.log('Password reset request received:', { phone })

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    // Check if ARKESEL_API_KEY is set
    if (!process.env.ARKESEL_API_KEY) {
      console.error('ARKESEL_API_KEY environment variable is not set')
      return NextResponse.json({ error: 'SMS service configuration error' }, { status: 500 })
    }

    // Check if user exists by phone
    const result = await query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    )

    if (!result.rowCount || result.rowCount === 0) {
      // Don't reveal if user exists or not for security
      console.log('Password reset requested for non-existent phone:', phone)
      return NextResponse.json({ 
        success: true, 
        message: 'If an account exists with this phone number, a password reset code has been sent.' 
      })
    }

    const user = result.rows[0]

    // Generate OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    console.log('Generated password reset OTP for:', { phone, otp, expiresAt })

    // Store OTP in database
    try {
      await query(
        'INSERT INTO otps (id, identifier, otp, expires_at, method) VALUES ($1, $2, $3, $4, $5)',
        [`reset-${Date.now()}`, phone, otp, expiresAt, 'sms']
      )
      console.log('Password reset OTP stored in database successfully')
    } catch (dbError: any) {
      console.error('Failed to store password reset OTP in database:', dbError)
      return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 })
    }

    // Send OTP via SMS
    try {
      console.log('Sending password reset SMS to:', phone)
      await sendSMSOTP(phone, otp)
      console.log('Password reset SMS sent successfully')
    } catch (smsError: any) {
      console.error('Failed to send password reset SMS:', smsError)
      return NextResponse.json({ error: 'Failed to send password reset SMS' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists with this phone number, a password reset code has been sent.' 
    })
  } catch (error) {
    console.error('Error processing password reset:', error)
    return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 })
  }
}
