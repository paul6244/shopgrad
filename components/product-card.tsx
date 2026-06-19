"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useTheme } from "next-themes"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  featured?: boolean
  isFavorite?: boolean
}

export default function ProductCard({
  product,
  featured = false,
  isFavorite: initialFavorite = false,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { theme } = useTheme()
  const [isProductFavorite, setIsProductFavorite] = useState(initialFavorite)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsProductFavorite(isFavorite(product.id) || initialFavorite)
  }, [product.id, isFavorite, initialFavorite])

  if (!mounted) return null

  const isDark = theme === "dark"

  const handleFavoriteToggle = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
    setIsProductFavorite(!isProductFavorite)
  }

  return (
    <div
      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
        featured ? "border-2 border-rose-300" : ""
      }`}
    >
      <div className="relative">
        <div className={`relative ${featured ? "aspect-[4/3]" : "aspect-square"}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized={product.image.startsWith("http")}
          />
        </div>
        {featured && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">Featured</div>
        )}
        <button className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm ${isDark ? 'bg-gray-700' : 'bg-white'}`} onClick={handleFavoriteToggle}>
          <Heart className={`h-5 w-5 ${isProductFavorite ? "fill-rose-500 text-rose-500" : isDark ? "text-gray-400" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-3">
        <h3 className={`font-medium line-clamp-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{product.name}</h3>
        <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</p>
        <div className="flex items-center justify-between">
          <span className={`font-bold ${isDark ? 'text-white' : ''}`}>GHS {product.price.toFixed(2)}</span>
          <button
            className={`p-1.5 rounded-full transition-colors ${isDark ? 'bg-gray-700 text-rose-400 hover:bg-gray-600' : 'bg-rose-100 text-rose-500 hover:bg-rose-200'}`}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
