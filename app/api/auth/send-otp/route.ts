import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendSMSOTP, sendEmailOTP } from '@/lib/arkesel'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { phone, email, method } = await request.json()

    console.log('OTP Request received:', { phone, email, method })

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    // Check if ARKESEL_API_KEY is set
    if (!process.env.ARKESEL_API_KEY) {
      console.error('ARKESEL_API_KEY environment variable is not set')
      return NextResponse.json({ error: 'Arkesel API key is not configured' }, { status: 500 })
    }

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
        
        // Store OTP in database
        try {
          await query(
            'INSERT INTO otps (id, identifier, otp, expires_at, method) VALUES ($1, $2, $3, $4, $5)',
            [`otp-${Date.now()}`, phone, otp, expiresAt, 'sms']
          )
          console.log('OTP stored in database successfully')
        } catch (dbError: any) {
          console.error('Failed to store OTP in database:', dbError)
          return NextResponse.json({ 
            error: 'Database error',
            details: 'Failed to store OTP. Please try again.',
            retryable: true
          }, { status: 500 })
        }
        
        // Send OTP via Arkesel
        console.log('Sending OTP via Arkesel to phone:', phone)
        const arkeselResult = await sendSMSOTP(phone, otp)
        console.log('Arkesel response:', arkeselResult)
        
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully via SMS',
          method: 'sms',
          arkeselResponse: arkeselResult
        })
      } catch (arkeselError: any) {
        console.error('Arkesel error:', arkeselError)
        
        // Determine specific error type
        let errorType = 'unknown'
        let userMessage = 'Failed to send OTP. Please try again.'
        let canRetry = true
        
        const errorMessage = arkeselError.message || ''
        
        if (errorMessage.includes('Insufficient balance') || errorMessage.includes('insufficient balance')) {
          errorType = 'insufficient_balance'
          userMessage = 'SMS service is temporarily unavailable. Please try email verification instead.'
          canRetry = false
        } else if (errorMessage.includes('invalid coverage') || errorMessage.includes('No valid number')) {
          errorType = 'invalid_coverage'
          userMessage = 'This phone number is not supported. Please try email verification instead.'
          canRetry = false
        } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT') || errorMessage.includes('Connect Timeout') || errorMessage.includes('ECONNRESET')) {
          errorType = 'timeout'
          userMessage = 'Connection error. Please check your network and try again, or use email verification.'
        } else if (errorMessage.includes('Invalid phone')) {
          errorType = 'invalid_phone'
          userMessage = 'Invalid phone number format. Please check and try again.'
          canRetry = false
        }
        
        return NextResponse.json({ 
          error: errorType,
          details: userMessage,
          retryable: canRetry,
          originalError: errorMessage
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
        
        // Store OTP in database
        try {
          await query(
            'INSERT INTO otps (id, identifier, otp, expires_at, method) VALUES ($1, $2, $3, $4, $5)',
            [`otp-${Date.now()}`, email, otp, expiresAt, 'email']
          )
          console.log('OTP stored in database successfully')
        } catch (dbError: any) {
          console.error('Failed to store OTP in database:', dbError)
          // Continue anyway - OTP will still be sent
        }
        
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
