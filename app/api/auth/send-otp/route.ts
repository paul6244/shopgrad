import { NextRequest, NextResponse } from 'next/server'
import { sendSMSOTP, sendEmailOTP } from '@/lib/arkesel'

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
    const { phone, email, method } = await request.json()

    console.log('OTP Request:', { phone, email, method })

    // Validate based on method
    if (method === 'sms' && !phone) {
      return NextResponse.json({ error: 'Phone number is required for SMS' }, { status: 400 })
    }
    if (method === 'email' && !email) {
      return NextResponse.json({ error: 'Email is required for email OTP' }, { status: 400 })
    }
    if (!method || !['sms', 'email'].includes(method)) {
      return NextResponse.json({ error: 'Method must be either "sms" or "email"' }, { status: 400 })
    }

    // SMS Method - Use Arkesel
    if (method === 'sms') {
      if (!process.env.ARKESEL_API_KEY) {
        console.error('ARKESEL_API_KEY is not configured')
        return NextResponse.json({ error: 'Arkesel API key is not configured' }, { status: 500 })
      }
      
      try {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = Date.now() + 5 * 60 * 1000
        
        console.log('Generated OTP for SMS:', { phone, otp, expiresAt })
        
        // Store OTP in memory
        otpStore.set(phone, { otp, expiresAt, method: 'sms' })
        console.log('OTP stored in memory successfully')
        
        // Send OTP via Arkesel
        await sendSMSOTP(phone, otp)
        console.log('OTP sent via Arkesel successfully')
        
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully via Arkesel SMS',
          method: 'sms'
        })
      } catch (arkeselError: any) {
        console.error('Arkesel error:', arkeselError)
        return NextResponse.json({ 
          error: 'Failed to send OTP via Arkesel',
          details: arkeselError.message || 'Unknown error'
        }, { status: 500 })
      }
    }

    // Email Method - Use Arkesel
    if (method === 'email') {
      if (!process.env.ARKESEL_API_KEY) {
        console.error('ARKESEL_API_KEY is not configured')
        return NextResponse.json({ error: 'Arkesel API key is not configured' }, { status: 500 })
      }
      
      try {
        // Generate OTP once at the start
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = Date.now() + 5 * 60 * 1000
        
        console.log('Generated OTP for Email:', { email, otp, expiresAt })
        
        // Store OTP in memory
        otpStore.set(email, { otp, expiresAt, method: 'email' })
        console.log('OTP stored in memory successfully')
        
        // Send OTP via Arkesel
        await sendEmailOTP(email, otp)
        console.log('OTP sent via Arkesel successfully')
        
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully via Arkesel email',
          method: 'email'
        })
      } catch (arkeselError: any) {
        console.error('Arkesel error:', arkeselError)
        return NextResponse.json({ 
          error: 'Failed to send OTP via Arkesel',
          details: arkeselError.message || 'Unknown error'
        }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
