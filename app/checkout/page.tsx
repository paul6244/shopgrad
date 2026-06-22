"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Truck, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { useTheme } from "next-themes"

type CheckoutStep = "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Ghana",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [mounted, setMounted] = useState(false)

  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Pre-fill phone number if user has one
    if (user?.phone) {
      setShippingInfo(prev => ({ ...prev, phone: user.phone || '' }))
    }
  }, [user])

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = async () => {
    setIsProcessing(true)

    try {
      const reference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      const email = user?.email || shippingInfo.fullName.replace(/\s+/g, '').toLowerCase() + '@user.com'

      console.log('Payment submission:', {
        email,
        amount: totalAmount,
        reference,
        user: user ? 'logged in' : 'guest',
        cartItems: cartItems.length
      })

      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: totalAmount,
          reference,
          callbackUrl: `${window.location.origin}/checkout/verify?reference=${reference}`,
          metadata: {
            orderId: reference,
            items: cartItems.length,
            total: totalAmount,
            shippingInfo
          }
        })
      })

      const data = await response.json()

      console.log('Payment initialization response:', data)

      if (response.ok && data.status && data.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url
      } else {
        throw new Error(data.error || 'Failed to initialize payment - no authorization URL returned')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setIsProcessing(false)
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.'
      alert(errorMessage)
    }
  }

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  // Redirect if cart is empty (only on client)
  useEffect(() => {
    if (mounted && cartItems.length === 0 && currentStep !== "confirmation") {
      router.push("/")
    }
  }, [mounted, cartItems.length, currentStep, router])

  const shippingCost = 10
  const tax = cartTotal * 0.12
  const totalAmount = cartTotal + shippingCost + tax

  if (!mounted || (cartItems.length === 0 && currentStep !== "confirmation")) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500'}`}>
      {/* Header */}
      <div className="px-6 py-4">
        {currentStep !== "confirmation" ? (
          <Link href="/" className={`inline-flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Shop
          </Link>
        ) : (
          <div className="h-6"></div>
        )}
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Checkout Steps */}
        {currentStep !== "confirmation" && (
          <div className="flex justify-between mb-8 px-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "shipping" ? "bg-rose-500 text-white" : isDark ? 'bg-gray-700 text-rose-500' : 'bg-white text-rose-500'
                }`}
              >
                1
              </div>
              <span className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-white'}`}>Shipping</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 w-full ${isDark ? 'bg-gray-700 bg-opacity-30' : 'bg-white bg-opacity-30'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "payment" ? "bg-rose-500 text-white" : isDark ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-400'
                }`}
              >
                2
              </div>
              <span className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-white'}`}>Payment</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 w-full ${isDark ? 'bg-gray-700 bg-opacity-30' : 'bg-white bg-opacity-30'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-400'}`}>3</div>
              <span className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-white'}`}>Confirmation</span>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {currentStep === "shipping" && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>Shipping Information</h1>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Region
                    </label>
                    <input
                      type="text"
                      id="state"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Country
                    </label>
                    <select
                      id="country"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      required
                    >
                      <option value="Ghana">Ghana</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Kenya">Kenya</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>Payment Information</h1>
              <div className="space-y-4">
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                  <div className="flex items-center mb-3">
                    <CreditCard className="h-5 w-5 text-rose-500 mr-2" />
                    <span className={`font-medium ${isDark ? 'text-white' : ''}`}>Pay with Paystack</span>
                  </div>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Secure payment powered by Paystack. You will be redirected to complete your payment.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    className="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors disabled:opacity-70"
                  >
                    {isProcessing ? "Processing..." : `Pay GHS ${totalAmount.toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {currentStep === "confirmation" && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <Check className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : ''}`}>Order Confirmed!</h1>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Your order #{orderId} has been placed successfully. We've sent a confirmation to your email.
              </p>

              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
                <div className="flex items-center justify-center mb-2">
                  <Truck className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Estimated delivery: 3-5 business days</span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Shipping to: {shippingInfo.fullName}, {shippingInfo.address}, {shippingInfo.city},{" "}
                  {shippingInfo.state} {shippingInfo.zipCode}
                </p>
              </div>

              <Link
                href="/"
                className="inline-block py-3 px-6 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Order Summary */}
        {currentStep !== "confirmation" && (
          <div className={`mt-8 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : ''}`}>Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={item.image.startsWith("http")}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : ''}`}>{item.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity}</p>
                    </div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white' : ''}`}>GHS {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className={`mt-6 border-t pt-4 ${isDark ? 'border-gray-700' : ''}`}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={isDark ? 'text-gray-400' : ''}>Subtotal</span>
                  <span className={isDark ? 'text-white' : ''}>GHS {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className={isDark ? 'text-gray-400' : ''}>Shipping</span>
                  <span className={isDark ? 'text-white' : ''}>GHS {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className={isDark ? 'text-gray-400' : ''}>Tax</span>
                  <span className={isDark ? 'text-white' : ''}>GHS {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className={isDark ? 'text-white' : ''}>Total</span>
                  <span className={isDark ? 'text-white' : ''}>GHS {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
