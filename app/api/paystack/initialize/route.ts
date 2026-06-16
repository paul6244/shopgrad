import { NextRequest, NextResponse } from 'next/server'
import { initializePayment } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, reference, callbackUrl, metadata } = body

    if (!email || !amount || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields: email, amount, reference' },
        { status: 400 }
      )
    }

    const response = await initializePayment({
      email,
      amount,
      reference,
      callbackUrl,
      metadata
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Paystack initialization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
