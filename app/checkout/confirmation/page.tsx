"use client"

import Link from "next/link"
import { Check, Truck, ShoppingBag } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Truck className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Estimated delivery: 3-5 business days</span>
            </div>
            <p className="text-sm text-gray-500">
              We've sent a confirmation to your email with your order details.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 inline mr-2" />
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  )
}
