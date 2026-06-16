import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { databases, DATABASE_ID, ID } from '@/lib/appwrite'
import { sendSMSOTP, sendEmailOTP } from '@/lib/arkesel'

// OTP collection ID - add this to your Appwrite collections
const OTP_COLLECTION_ID = 'otps'

interface OTPDocument {
  identifier: string // phone or email
  otp: string
  expiresAt: number
  method: 'sms' | 'email'
  userId?: string
}

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

    // SMS Method - Use Arkesel
    if (method === 'sms') {
      if (!process.env.ARKESEL_API_KEY) {
        return NextResponse.json({ error: 'Arkesel API key is not configured' }, { status: 500 })
      }
      
      try {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = Date.now() + 5 * 60 * 1000
        
        // Store OTP in database
        await databases.createDocument(
          DATABASE_ID,
          OTP_COLLECTION_ID,
          ID.unique(),
          {
            identifier: phone,
            otp,
            expiresAt,
            method: 'sms'
          }
        )
        
        // Send OTP via Arkesel
        await sendSMSOTP(phone, otp)
        
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully via Arkesel SMS',
          method: 'sms'
        })
      } catch (arkeselError) {
        console.error('Arkesel error:', arkeselError)
        return NextResponse.json({ error: 'Failed to send OTP via Arkesel' }, { status: 500 })
      }
    }

    // Email Method - Use Arkesel
    if (method === 'email') {
      // Generate OTP once at the start
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 5 * 60 * 1000
      
      // Store OTP in database
      await databases.createDocument(
        DATABASE_ID,
        OTP_COLLECTION_ID,
        ID.unique(),
        {
          identifier: email,
          otp,
          expiresAt,
          method: 'email'
        }
      )
      
      // Try Arkesel first
      if (process.env.ARKESEL_API_KEY) {
        try {
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
