"use client"

import type React from "react"

import { useState } from "react"
import { Shield, ArrowLeft, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"

export default function TwoFactorPage() {
  const [enabled, setEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"setup" | "verify">("setup")
  const [success, setSuccess] = useState(false)

  const handleEnable = () => {
    setStep("verify")
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code")
      return
    }

    // Simulate verification
    setEnabled(true)
    setSuccess(true)
    setVerificationCode("")
  }

  const handleDisable = () => {
    setEnabled(false)
    setSuccess(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <div className="px-6 py-4">
        <Link href="/profile/settings" className="inline-flex items-center text-black">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Settings
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md mx-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 mr-2 text-rose-500" />
              <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
            </div>

            {!enabled ? (
              <>
                {step === "setup" ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Smartphone className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-900 mb-1">Enhanced Security</h3>
                          <p className="text-sm text-blue-700">
                            Add an extra layer of security to your account by requiring a verification code when signing in.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleEnable}
                      className="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
                    >
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      We've sent a 6-digit verification code to your phone. Enter it below to verify your identity.
                    </p>

                    {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg">{error}</div>}

                    <form onSubmit={handleVerify}>
                      <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="code"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-center text-2xl tracking-widest"
                          placeholder="000000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          maxLength={6}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
                      >
                        Verify
                      </button>
                    </form>

                    <button
                      onClick={() => setStep("setup")}
                      className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {success && (
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Two-factor authentication enabled!
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900 mb-1">Protection Active</h3>
                      <p className="text-sm text-green-700">
                        Your account is now protected with two-factor authentication. You'll need a verification code to sign in.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDisable}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
