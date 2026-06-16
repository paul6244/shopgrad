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

  console.log('Paystack configuration check:', {
    hasSecretKey: !!secretKey
  })

  if (!secretKey) {
    throw new Error('Paystack API keys are not configured')
  }

  try {
    const requestBody = {
      email: params.email,
      amount: params.amount * 100, // Paystack expects amount in kobo (GHS * 100)
      reference: params.reference,
      callback_url: params.callbackUrl || process.env.PAYSTACK_CALLBACK_URL,
      metadata: params.metadata
    }

    console.log('Paystack request:', {
      url: 'https://api.paystack.co/transaction/initialize',
      body: {
        ...requestBody,
        amount: requestBody.amount,
        email: requestBody.email
      }
    })

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    console.log('Paystack response:', {
      status: response.status,
      ok: response.ok,
      data: data
    })

    if (!response.ok) {
      throw new Error(data.message || `Paystack API error: ${response.status}`)
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

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment')
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
