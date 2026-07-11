"use client"

import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"

export default function Loading() {
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center">
        {/* Animated Shopping Bag Icon */}
        <div className={`relative mb-8 transition-all duration-1000 ${mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative">
            <ShoppingBag className="w-24 h-24 text-white mx-auto animate-bounce" />
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>

        {/* Animated Logo Text */}
        <h1
          className={`text-5xl font-bold text-white mb-2 transition-all duration-1000 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          ShopGrad
        </h1>

        {/* Animated Tagline */}
        <p
          className={`text-white/80 text-lg transition-all duration-1000 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Your favorite shopping destination
        </p>

        {/* Loading dots */}
        <div className={`flex justify-center gap-2 mt-8 transition-all duration-1000 delay-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
