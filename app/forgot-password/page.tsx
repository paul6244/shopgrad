"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Phone, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

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
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500'}`}>
      <div className="px-6 py-4">
        <Link href="/login" className={`inline-flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Sign In
        </Link>
      </div>

      <main className="flex-1 flex flex-col px-6 pt-10">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto w-full`}>
          {!submitted ? (
            <>
              <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Forgot Password?</h1>
              <p className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter your phone number and we'll send you a code to reset your password.
              </p>

              {error && <div className={`p-3 rounded-lg mb-6 ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Phone className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="tel"
                    placeholder="+233XXXXXXXXX"
                    className={`w-full py-3 pl-12 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
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
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <CheckCircle className={`h-10 w-10 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              </div>
              <h1 className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Check your SMS</h1>
              <p className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
        <div className={`w-32 h-1 rounded-full ${isDark ? 'bg-gray-600' : 'bg-black'}`}></div>
      </div>
    </div>
  )
}
