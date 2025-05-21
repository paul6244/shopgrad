"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingBag } from "lucide-react"
import ProductCard from "@/components/product-card"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useFavorites } from "@/hooks/use-favorites"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Sample product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&h=500&fit=crop&q=80",
    category: "Fitness",
  },
  {
    id: 5,
    name: "Coffee Maker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1570486916434-a2bbfc74de4d?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 6,
    name: "Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  // New products
  {
    id: 7,
    name: "Smartphone",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 9,
    name: "Fitness Tracker",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&h=500&fit=crop&q=80",
    category: "Fitness",
  },
  {
    id: 10,
    name: "Dumbbell Set",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&h=500&fit=crop&q=80",
    category: "Fitness",
  },
  {
    id: 11,
    name: "Desk Lamp",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1534189283006-b4999384a2eb?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 12,
    name: "Throw Blanket",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 13,
    name: "Sunglasses",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 14,
    name: "Leather Wallet",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 15,
    name: "Wireless Earbuds",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 16,
    name: "Plant Pot",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
]

export default function ShoppingApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, cartTotal } = useCart()
  const { user } = useAuth()
  const { isFavorite } = useFavorites()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  useEffect(() => {
    if (categoryParam) {
      setSearchQuery(categoryParam)
    }
  }, [categoryParam])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ShopGrad
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm hidden md:inline">Hi, {user.name}</span>
                  <Link
                    href="/profile"
                    className="w-8 h-8 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full flex items-center justify-center text-white"
                  >
                    {user.name.charAt(0)}
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 text-white"
                >
                  Sign In
                </Link>
              )}
              <button className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-3 pl-10 pr-4 bg-[#f2f2f7] text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-hide">
          {["All", "Electronics", "Fashion", "Home", "Fitness"].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (category === "All" && !searchQuery) ||
                (category !== "All" && searchQuery.toLowerCase() === category.toLowerCase())
                  ? "bg-rose-500 text-white"
                  : "bg-white hover:bg-rose-100"
              }`}
              onClick={() => setSearchQuery(category === "All" ? "" : category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(6, 9).map((product) => (
              <ProductCard key={product.id} product={product} featured isFavorite={isFavorite(product.id)} />
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <h2 className="text-xl font-bold mb-4 text-white">All Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} isFavorite={isFavorite(product.id)} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-white">No products found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 flex justify-center z-10 px-4">
            <Link
              href="/checkout"
              className="bg-gradient-to-r from-rose-500 to-purple-600 text-white py-3 px-8 rounded-full shadow-lg font-medium flex items-center"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Checkout (${cartTotal.toFixed(2)})
            </Link>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            {[
              { name: "Home", href: "/" },
              { name: "Categories", href: "/categories" },
              { name: "Favorites", href: "/favorites" },
              { name: "Profile", href: user ? "/profile" : "/login" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center ${item.name === "Home" ? "text-rose-500 font-medium" : ""}`}
              >
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
