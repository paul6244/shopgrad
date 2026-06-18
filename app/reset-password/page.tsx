"use client"

import type React from "react"

import { useState } from "react"
import { Lock, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!phone) {
      setError("Phone number is required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
        <div className="flex-1 flex flex-col px-6 pt-10 items-center justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-4 text-center">Password Reset Successful</h1>
          <p className="text-black mb-8 opacity-80 text-center">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reset Password</h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter the 6-digit code sent to {phone} and your new password.
          </p>

          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min 8 characters)"
                className="w-full py-3 pl-12 pr-12 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full py-3 pl-12 pr-12 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:from-rose-500 hover:to-purple-600 transition-all shadow-lg"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </main>

      {/* iPhone Home Indicator */}
      <div className="h-8 flex justify-center items-end pb-1">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
