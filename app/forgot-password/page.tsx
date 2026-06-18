"use client"

import type React from "react"

import { useState } from "react"
import { Phone, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phone) {
      setError("Please enter your phone number")
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send reset SMS')
      }

      // Redirect to reset password page with phone
      router.push(`/reset-password?phone=${encodeURIComponent(phone)}`)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset SMS. Please try again.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <div className="px-6 py-4">
        <Link href="/login" className="inline-flex items-center text-black">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Sign In
        </Link>
      </div>

      <main className="flex-1 flex flex-col px-6 pt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto w-full">
          {!submitted ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Forgot Password?</h1>
              <p className="text-gray-600 mb-6 text-center">
                Enter your phone number and we'll send you a code to reset your password.
              </p>

              {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+233XXXXXXXXX"
                    className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:from-rose-500 hover:to-purple-600 transition-all shadow-lg"
                >
                  Send Reset Code
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Check your SMS</h1>
              <p className="text-gray-600 mb-6 text-center">
                We've sent a password reset code to {phone}. Please check your SMS and follow the instructions.
              </p>
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:from-rose-500 hover:to-purple-600 transition-all shadow-lg text-center"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* iPhone Home Indicator */}
      <div className="h-8 flex justify-center items-end pb-1">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
