"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, ArrowLeft, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate full name
    if (!fullName || fullName.trim().length < 2) {
      setError("Please enter your full name")
      return
    }

    // Validate Ghana phone number format (+233XXXXXXXXX)
    const phoneRegex = /^\+233\d{9}$/
    if (!phone || !phoneRegex.test(phone)) {
      setError("Please enter a valid Ghana phone number (+233XXXXXXXXX)")
      return
    }

    // Validate email
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    // Validate password minimum length
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await signup(email, password, fullName, phone)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to create an account. Please try again.")
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign up</h1>

          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                placeholder="Phone Number (+233XXXXXXXXX)"
                className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
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
                placeholder="Password (min 8 characters)"
                className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full py-3 pl-12 pr-4 bg-gray-50 text-gray-700 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:from-rose-500 hover:to-purple-600 transition-all shadow-lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-rose-500 hover:text-rose-600">
                Sign In
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
