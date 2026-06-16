// Arkesel SMS and Email service for OTP generation

interface SendSMSParams {
  phone: string
  message: string
  sender?: string
}

interface SendEmailParams {
  email: string
  subject: string
  message: string
  sender?: string
}

interface ArkeselResponse {
  status: string
  message: string
  data?: any
}

// Only initialize if API key is configured
const apiKey = process.env.ARKESEL_API_KEY

export async function sendSMS({ phone, message, sender = 'ShopGrad' }: SendSMSParams): Promise<ArkeselResponse> {
  if (!apiKey) {
    throw new Error('Arkesel API key is not configured')
  }

  try {
    const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: sender,
        message: message,
        recipients: [phone]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send SMS via Arkesel')
    }

    return {
      status: 'success',
      message: 'SMS sent successfully via Arkesel',
      data
    }
  } catch (error) {
    console.error('Arkesel SMS error:', error)
    throw error
  }
}

export async function sendEmail({ email, subject, message, sender = 'ShopGrad' }: SendEmailParams): Promise<ArkeselResponse> {
  if (!apiKey) {
    throw new Error('Arkesel API key is not configured')
  }

  try {
    const response = await fetch('https://api.arkesel.com/api/v2/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: sender,
        recipients: [email],
        subject: subject,
        html: message
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email via Arkesel')
    }

    return {
      status: 'success',
      message: 'Email sent successfully via Arkesel',
      data
    }
  } catch (error) {
    console.error('Arkesel email error:', error)
    throw error
  }
}

export async function sendSMSOTP(phone: string, otp: string): Promise<ArkeselResponse> {
  const message = `Your ShopGrad verification code is: ${otp}. This code will expire in 5 minutes.`
  return sendSMS({ phone, message })
}

export async function sendEmailOTP(email: string, otp: string): Promise<ArkeselResponse> {
  const subject = 'Your ShopGrad Verification Code'
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Verification Code</h2>
      <p style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 20px 0;">${otp}</p>
      <p style="color: #666;">This code will expire in 5 minutes.</p>
      <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
    </div>
  `
  return sendEmail({ email, subject, message })
}
