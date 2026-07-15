"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Lock, ArrowLeft, Phone, Smartphone, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [otpMethod, setOtpMethod] = useState<"sms" | "email">("sms")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, signupWithPhone } = useAuth()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

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
    } catch (err: any) {
      // Handle different error types from API
      if (err.response?.data) {
        const errorData = err.response.data
        setError(errorData.details || errorData.error || "Failed to send OTP. Please try again.")
        
        // If SMS is unavailable, suggest email
        if (errorData.error === 'insufficient_balance' || errorData.error === 'invalid_coverage') {
          if (otpMethod === 'sms') {
            setError(`${errorData.details} Try switching to email verification.`)
          }
        }
      } else {
        setError("Failed to send OTP. Please try again.")
      }
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
        setError("Password is incorrect. Please check your credentials.")
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
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500'}`}>
      <div className="px-6 py-4">
        <Link href="/" className={`inline-flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Shop
        </Link>
      </div>

      <main className="flex-1 flex flex-col px-6 pt-10">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto w-full`}>
          <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign in</h1>

          {error && <div className={`p-3 rounded-lg mb-6 ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>{error}</div>}

          {/* Login Method Toggle */}
          <div className={`flex mb-6 rounded-full p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("email")
                setOtpSent(false)
                setError("")
              }}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                loginMethod === "email"
                  ? `${isDark ? 'bg-gray-600 text-rose-400' : 'bg-white text-rose-500'} shadow`
                  : `${isDark ? 'text-gray-300' : 'text-gray-600'}`
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
                  ? `${isDark ? 'bg-gray-600 text-rose-400' : 'bg-white text-rose-500'} shadow`
                  : `${isDark ? 'text-gray-300' : 'text-gray-600'}`
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
                  <Mail className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  placeholder="Enter email"
                  className={`w-full py-3 pl-12 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full py-3 pl-12 pr-12 rounded-full border focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-4 flex items-center ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className={`text-sm hover:text-rose-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* OTP Method Toggle */}
              <div className={`flex mb-4 rounded-full p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setOtpMethod("sms")
                    setOtpSent(false)
                    setError("")
                  }}
                  className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                    otpMethod === "sms"
                      ? `${isDark ? 'bg-gray-600 text-rose-400' : 'bg-white text-rose-500'} shadow`
                      : `${isDark ? 'text-gray-300' : 'text-gray-600'}`
                  }`}
                >
                  <Smartphone className="h-4 w-4 inline mr-2" />
                  SMS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpMethod("email")
                    setOtpSent(false)
                    setError("")
                  }}
                  className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                    otpMethod === "email"
                      ? `${isDark ? 'bg-gray-600 text-rose-400' : 'bg-white text-rose-500'} shadow`
                      : `${isDark ? 'text-gray-300' : 'text-gray-600'}`
                  }`}
                >
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </button>
              </div>

              {otpMethod === 'sms' ? (
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
                    disabled={otpSent}
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className={`w-full py-3 pl-12 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    required
                  />
                </div>
              )}

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
                      <Lock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className={`w-full py-3 pl-12 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setError("")
                    }}
                    className="text-sm text-rose-500 hover:text-rose-600 mt-2"
                  >
                    Resend OTP
                  </button>
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
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
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
        <div className={`w-32 h-1 rounded-full ${isDark ? 'bg-gray-600' : 'bg-black'}`}></div>
      </div>
    </div>
  )
}
