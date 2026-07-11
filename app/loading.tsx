"use client"

import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"

export default function Loading() {
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)
    
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 3200)
    
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        willChange: "opacity",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div className="text-center px-4 w-full max-w-md">
        {/* Animated Shopping Bag Icon */}
        <div 
          className={`relative mb-6 sm:mb-8 transition-all duration-1000 ease-out ${
            mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative">
            <ShoppingBag className="w-20 h-20 sm:w-24 sm:h-24 text-white mx-auto animate-bounce" />
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-ping" />
            <div className="absolute -bottom-2 -left-2 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>

        {/* Animated Logo Text */}
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-1000 ease-out delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          ShopGrad
        </h1>

        {/* Animated Tagline */}
        <p
          className={`text-white/80 text-sm sm:text-base md:text-lg transition-all duration-1000 ease-out delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          Your favorite shopping destination
        </p>

        {/* Loading dots */}
        <div 
          className={`flex justify-center gap-2 mt-6 sm:mt-8 transition-all duration-1000 ease-out delay-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ willChange: "opacity" }}
        >
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
