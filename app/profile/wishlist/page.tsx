"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Trash2, ShoppingCart, Filter, ArrowUpDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import ProductCard from "@/components/product-card"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc"
type FilterOption = "all" | "electronics" | "fashion" | "home" | "fitness"

export default function WishlistPage() {
  const { user } = useAuth()
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addToCart } = useCart()
  const [sortBy, setSortBy] = useState<SortOption>("name-asc")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
        <div className="px-6 py-4">
          <Link href="/profile" className="inline-flex items-center text-black">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Profile
          </Link>
        </div>
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Please sign in</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to view your wishlist.</p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Filter favorites
  const filteredFavorites = favorites.filter((product) => {
    if (filterBy === "all") return true
    return product.category.toLowerCase() === filterBy
  })

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      default:
        return 0
    }
  })

  const handleAddAllToCart = () => {
    favorites.forEach((product) => addToCart(product))
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home" },
    { value: "fitness", label: "Fitness" },
  ]

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <div className="px-6 py-4">
        <Link href="/profile" className="inline-flex items-center text-black">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Profile
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
            <p className="text-white text-sm opacity-90">{favorites.length} items</p>
          </div>
          {favorites.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleAddAllToCart}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </button>
              <button
                onClick={clearFavorites}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Items you add to your wishlist will appear here. Browse products and click the heart icon to add them.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter by Category
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {sortedFavorites.length === 0 ? (
              <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center">
                <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">No items found</h2>
                <p className="text-gray-600 mb-6">
                  Try changing your filter or sort options to see more items.
                </p>
                <button
                  onClick={() => {
                    setFilterBy("all")
                    setSortBy("name-asc")
                  }}
                  className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedFavorites.map((product) => (
                  <ProductCard key={product.id} product={product} isFavorite={true} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
