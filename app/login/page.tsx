"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, ArrowLeft, Phone, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [otpMethod, setOtpMethod] = useState<"sms" | "email">("sms")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, signupWithPhone } = useAuth()

  const handleSendOtp = async () => {
    setError("")

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setLoading(true)
    try {
      await signupWithPhone(phone, undefined, otpMethod, otpMethod === "email" ? email : undefined)
      setOtpSent(true)
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (loginMethod === "email") {
      try {
        await login(email, password)
        router.push("/")
      } catch (err) {
        setError("Failed to sign in. Please check your credentials.")
      }
    } else {
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP")
        return
      }

      try {
        await signupWithPhone(phone, otp, otpMethod, otpMethod === "email" ? email : undefined)
        router.push("/")
      } catch (err) {
        setError("Invalid OTP. Please try again.")
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <div className="px-6 py-4">
        <Link href="/" className="inline-flex items-center text-black">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Shop
        </Link>
      </div>

      <main className="flex-1 flex flex-col px-6 pt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign in</h1>

          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

          {/* Login Method Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("email")
                setOtpSent(false)
                setError("")
              }}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                loginMethod === "email"
                  ? "bg-white text-rose-500 shadow"
                  : "text-gray-600"
              }`}
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("phone")
                setOtpSent(false)
                setError("")
              }}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                loginMethod === "phone"
                  ? "bg-white text-rose-500 shadow"
                  : "text-gray-600"
              }`}
            >
              <Smartphone className="h-4 w-4 inline mr-2" />
              Phone
            </button>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === "email" ? (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-rose-500">
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* OTP Method Toggle */}
              <div className="flex mb-4 bg-gray-100 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => {
                    setOtpMethod("sms")
                    setOtpSent(false)
                    setError("")
                  }}
                  className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                    otpMethod === "sms"
                      ? "bg-white text-rose-500 shadow"
                      : "text-gray-600"
                  }`}
                >
                  <Smartphone className="h-4 w-4 inline mr-2" />
                  SMS
                </button>
              </div>

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
                  disabled={otpSent}
                  required
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:from-rose-500 hover:to-purple-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:from-rose-500 hover:to-purple-600 transition-all shadow-lg"
              disabled={loginMethod === "phone" && !otpSent}
            >
              Sign In
            </button>
        </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-rose-500 hover:text-rose-600">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* iPhone Home Indicator */}
      <div className="h-8 flex justify-center items-end pb-1">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
