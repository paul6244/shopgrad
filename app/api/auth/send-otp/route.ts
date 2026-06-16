import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { account } from '@/lib/appwrite'
import { sendSMSOTP, sendEmailOTP } from '@/lib/arkesel'

// Shared in-memory OTP storage (must match verify-otp storage)
// Using global to share between route instances
declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number; method: 'sms' | 'email'; userId?: string }>
}

if (!global.otpStore) {
  global.otpStore = new Map<string, { otp: string; expiresAt: number; method: 'sms' | 'email'; userId?: string }>()
}

const otpStore = global.otpStore

export async function POST(request: NextRequest) {
  try {
    const { phone, email, method } = await request.json()

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

    // SMS Method - Try Arkesel first, then Appwrite Phone Auth
    if (method === 'sms') {
      // Try Arkesel first
      if (process.env.ARKESEL_API_KEY) {
        try {
          // Generate OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString()
          const expiresAt = Date.now() + 5 * 60 * 1000
          
          // Store OTP for verification
          otpStore.set(phone, { otp, expiresAt, method: 'sms' })
          
          // Send OTP via Arkesel
          await sendSMSOTP(phone, otp)
          
          return NextResponse.json({ 
            success: true, 
            message: 'OTP sent successfully via Arkesel SMS',
            method: 'sms'
          })
        } catch (arkeselError) {
          console.error('Arkesel error, falling back to Appwrite:', arkeselError)
          // Fall through to Appwrite
        }
      }
      
      // Fallback to Appwrite Phone Auth
      try {
        // Appwrite uses createPhoneToken to send SMS
        const phoneToken = await account.createPhoneToken(
          'unique()',
          phone
        )

        // Store the userId for verification
        otpStore.set(phone, { 
          otp: phoneToken.userId, 
          expiresAt: Date.now() + 5 * 60 * 1000, 
          method: 'sms',
          userId: phoneToken.userId 
        })

        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully via Appwrite SMS',
          method: 'sms',
          userId: phoneToken.userId
        })
      } catch (appwriteError: any) {
        console.error('Appwrite error:', appwriteError)
        
        // Handle SMS limit exceeded error
        if (appwriteError.code === 402 && appwriteError.type === 'limit_auth_phone_exceeded') {
          return NextResponse.json({ 
            error: 'SMS authentication limit exceeded. Please upgrade your Appwrite plan or use email authentication instead.',
            code: 'SMS_LIMIT_EXCEEDED',
            suggestion: 'Try using email OTP or upgrade your Appwrite plan'
          }, { status: 429 })
        }
        
        return NextResponse.json({ error: 'Failed to send OTP via Appwrite' }, { status: 500 })
      }
    }

    // Email Method - Use Arkesel
    if (method === 'email') {
      // Try Arkesel first
      if (process.env.ARKESEL_API_KEY) {
        try {
          // Generate OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString()
          const expiresAt = Date.now() + 5 * 60 * 1000
          
          // Store OTP for verification
          otpStore.set(email, { otp, expiresAt, method: 'email' })
          
          // Send OTP via Arkesel
          await sendEmailOTP(email, otp)
          
          return NextResponse.json({ 
            success: true, 
            message: 'OTP sent successfully via Arkesel email',
            method: 'email'
          })
        } catch (arkeselError) {
          console.error('Arkesel error, falling back to Resend:', arkeselError)
          // Fall through to Resend
        }
      }
      
      // Fallback to Resend
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 5 * 60 * 1000
      otpStore.set(email, { otp, expiresAt, method: 'email' })

      // Try Resend if configured
      if (resend) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Your Verification Code',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Your Verification Code</h2>
                <p style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 20px 0;">${otp}</p>
                <p style="color: #666;">This code will expire in 5 minutes.</p>
                <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
              </div>
            `
          })

          return NextResponse.json({ 
            success: true, 
            message: 'OTP sent successfully via email',
            method: 'email'
          })
        } catch (resendError) {
          console.error('Resend error, falling back to console:', resendError)
        }
      }

      // Fallback: Log to console
      console.log(`Email OTP for ${email}: ${otp}`)

      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully (check console for demo OTP)',
        method: 'email',
        demo: true
      })
    }

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
