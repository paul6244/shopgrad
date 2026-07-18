"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, X } from "lucide-react"
import { verifyPayment } from "@/lib/paystack"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      const reference = searchParams.get("reference")

      if (!reference) {
        setStatus("error")
        setMessage("No payment reference found")
        return
      }

      try {
        const response = await verifyPayment(reference)

        if (response.status) {
          setStatus("success")
          setMessage("Payment verified successfully!")

          // Save order to localStorage
          if (user && response.data?.metadata && typeof window !== 'undefined') {
            try {
              const orders = JSON.parse(localStorage.getItem(`orders-${user.id}`) || "[]")
              const newOrder = {
                id: response.data.metadata.orderId || reference,
                date: new Date().toLocaleDateString(),
                status: "processing" as const,
                total: response.data.metadata.total || 0,
                items: response.data.metadata.items || 0,
              }
              orders.unshift(newOrder)
              localStorage.setItem(`orders-${user.id}`, JSON.stringify(orders))
            } catch (error) {
              console.error('Failed to save order to localStorage:', error)
            }
          }

          clearCart()

          // Redirect to confirmation page after 3 seconds
          setTimeout(() => {
            router.push("/checkout/confirmation")
          }, 3000)
        } else {
          setStatus("error")
          setMessage("Payment verification failed")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage("An error occurred during verification")
      }
    }

    verifyPaymentStatus()
  }, [searchParams, router, clearCart, user])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
              <p className="text-gray-600">Please wait while we verify your payment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
