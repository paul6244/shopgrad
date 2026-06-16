import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory OTP storage (WARNING: This won't work in serverless environments like Vercel)
// Using global to share between route instances in development
// For production, consider using Redis or a database
declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number; method: 'sms' | 'email' }>
}

if (!global.otpStore) {
  global.otpStore = new Map<string, { otp: string; expiresAt: number; method: 'sms' | 'email' }>()
}

const otpStore = global.otpStore

export async function POST(request: NextRequest) {
  try {
    const { phone, email, otp, method, fullName } = await request.json()

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

    // SMS Method - Verify OTP from memory
    if (method === 'sms') {
      const storedData = otpStore.get(phone)
      
      if (!storedData) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }
      
      // Check if OTP is expired
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(phone)
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
      }

      // Verify OTP directly
      if (storedData.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      // Clear OTP after successful verification
      otpStore.delete(phone)

      // Return success with user info (simplified - no database)
      return NextResponse.json({ 
        success: true, 
        message: 'OTP verified successfully via SMS',
        user: {
          id: `user-${phone}`,
          name: fullName || phone,
          phone: phone,
          email: `${phone}@user.com`
        }
      })
    }

    // Email Method - Verify OTP from memory
    if (method === 'email') {
      const storedData = otpStore.get(email)
      
      if (!storedData) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }
      
      // Check if OTP is expired
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email)
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      // Clear OTP after successful verification
      otpStore.delete(email)

      // Return success with user info (simplified - no database)
      return NextResponse.json({ 
        success: true, 
        message: 'OTP verified successfully via email',
        user: {
          id: `user-${email}`,
          name: fullName || email.split('@')[0],
          email: email
        }
      })
    }

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
