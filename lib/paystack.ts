// Paystack payment service

interface InitializePaymentParams {
  email: string
  amount: number
  reference: string
  callbackUrl?: string
  metadata?: Record<string, any>
}

interface PaystackResponse {
  status: boolean
  message: string
  data?: {
    reference: string
    access_code: string
    authorization_url: string
    metadata?: Record<string, any>
  }
}

export async function initializePayment(params: InitializePaymentParams): Promise<PaystackResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error('Paystack API keys are not configured')
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!params.email || !emailRegex.test(params.email)) {
    throw new Error('Invalid email format')
  }

  // Validate amount
  if (!params.amount || typeof params.amount !== 'number' || params.amount <= 0) {
    throw new Error('Amount must be a positive number')
  }

  // Validate reference
  if (!params.reference || params.reference.trim().length === 0) {
    throw new Error('Reference cannot be empty')
  }

  try {
    const requestBody = {
      email: params.email,
      amount: params.amount * 100, // Paystack expects amount in kobo (GHS * 100)
      reference: params.reference,
      callback_url: params.callbackUrl || process.env.PAYSTACK_CALLBACK_URL,
      metadata: params.metadata
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || `Paystack API error: ${response.status}`)
    }

    return {
      status: true,
      message: 'Payment initialized successfully',
      data: data.data
    }
  } catch (error) {
    console.error('Paystack error:', error)
    throw error
  }
}

export async function verifyPayment(reference: string): Promise<PaystackResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error('Paystack secret key is not configured')
  }

  // Validate reference
  if (!reference || reference.trim().length === 0) {
    throw new Error('Reference cannot be empty')
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to verify payment')
    }

    return {
      status: data.data.status === 'success',
      message: data.message,
      data: data.data
    }
  } catch (error) {
    console.error('Paystack verification error:', error)
    throw error
  }
}
