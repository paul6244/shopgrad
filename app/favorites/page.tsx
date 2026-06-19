"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import ProductCard from "@/components/product-card"
import { useFavorites } from "@/hooks/use-favorites"
import { useTheme } from "next-themes"

export default function FavoritesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user || !mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500'}`}>
      {/* Header */}
      <div className="px-6 py-4">
        <Link href="/" className={`inline-flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Shop
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>Your Favorites</h1>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className={`flex items-center px-4 py-2 rounded-full text-white hover:bg-opacity-30 transition-colors ${isDark ? 'bg-gray-700 bg-opacity-20' : 'bg-white bg-opacity-20'}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white bg-opacity-90'} rounded-xl p-8 text-center`}>
            <Heart className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No favorites yet</h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Items you favorite will appear here. Browse products and click the heart icon to add them to your
              favorites.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} isFavorite={true} />
            ))}
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className={`sticky bottom-0 backdrop-blur-sm shadow-lg ${isDark ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            {[
              { name: "Home", href: "/" },
              { name: "Categories", href: "/categories" },
              { name: "Favorites", href: "/favorites" },
              { name: "Profile", href: "/profile" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center ${item.name === "Favorites" ? "text-rose-500 font-medium" : isDark ? 'text-white' : ''}`}
              >
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}
