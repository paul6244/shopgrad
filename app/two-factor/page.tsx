"use client"

import type React from "react"

import { useState } from "react"
import { Shield, ArrowLeft, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState as useStateHook } from "react"

export default function TwoFactorPage() {
  const [enabled, setEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"setup" | "verify">("setup")
  const [success, setSuccess] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useStateHook(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

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
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500'}`}>
      <div className="px-6 py-4">
        <Link href="/profile/settings" className={`inline-flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Settings
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden max-w-md mx-auto`}>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 mr-2 text-rose-500" />
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : ''}`}>Two-Factor Authentication</h1>
            </div>

            {!enabled ? (
              <>
                {step === "setup" ? (
                  <div className="space-y-6">
                    <div className={`${isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                      <div className="flex items-start">
                        <Smartphone className={`h-5 w-5 mr-3 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                        <div>
                          <h3 className={`font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>Enhanced Security</h3>
                          <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
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
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      We've sent a 6-digit verification code to your phone. Enter it below to verify your identity.
                    </p>

                    {error && <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>{error}</div>}

                    <form onSubmit={handleVerify}>
                      <div className="mb-4">
                        <label htmlFor="code" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Verification Code
                        </label>
                        <input
                          type="text"
                          id="code"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-center text-2xl tracking-widest ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
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
                      className={`w-full py-2 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {success && (
                  <div className={`p-3 rounded-lg flex items-center ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Two-factor authentication enabled!
                  </div>
                )}

                <div className={`${isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                  <div className="flex items-start">
                    <CheckCircle className={`h-5 w-5 mr-3 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                    <div>
                      <h3 className={`font-medium mb-1 ${isDark ? 'text-green-300' : 'text-green-900'}`}>Protection Active</h3>
                      <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        Your account is now protected with two-factor authentication. You'll need a verification code to sign in.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDisable}
                  className={`w-full py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors ${isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700'}`}
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
