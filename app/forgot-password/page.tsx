"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Simulate sending reset email
    setSubmitted(true)
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
        {!submitted ? (
          <>
            <h1 className="text-4xl font-bold text-black mb-4">Forgot Password?</h1>
            <p className="text-black mb-8 opacity-80">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-black" />
                </div>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full py-4 pl-12 pr-4 bg-[#f2f2f7] text-gray-700 rounded-full focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center mt-8">
                <button type="submit" className="bg-[#f2f2f7] text-black font-bold py-4 px-8 rounded-full min-w-[160px]">
                  Send Reset Link
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-4 text-center">Check your email</h1>
            <p className="text-black mb-8 opacity-80 text-center">
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
            </p>
            <Link
              href="/login"
              className="bg-[#f2f2f7] text-black font-bold py-4 px-8 rounded-full min-w-[160px] text-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </main>

      {/* iPhone Home Indicator */}
      <div className="h-8 flex justify-center items-end pb-1">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
