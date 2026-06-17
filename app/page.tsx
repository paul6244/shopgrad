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
    price: 650,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 850,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 450,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 150,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&h=500&fit=crop&q=80",
    category: "Fitness",
  },
  {
    id: 5,
    name: "Coffee Maker",
    price: 400,
    image: "https://images.unsplash.com/photo-1570486916434-a2bbfc74de4d?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 6,
    name: "Backpack",
    price: 250,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  // New products
  {
    id: 7,
    name: "Smartphone",
    price: 3500,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 300,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 9,
    name: "Fitness Tracker",
    price: 250,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&h=500&fit=crop&q=80",
    category: "Fitness",
  },
  {
    id: 10,
    name: "Dumbbell Set",
    price: 600,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&h=500&fit=crop&q=80",
    category: "Fitness",
  },
  {
    id: 11,
    name: "Desk Lamp",
    price: 175,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 12,
    name: "Throw Blanket",
    price: 150,
    image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 13,
    name: "Sunglasses",
    price: 400,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 14,
    name: "Leather Wallet",
    price: 200,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 15,
    name: "Wireless Earbuds",
    price: 80,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 16,
    name: "Plant Pot",
    price: 100,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },

  {
    id: 17,
    name: "Coffee Maker",
    price: 350,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  // Cheap products
  {
    id: 18,
    name: "Phone Case",
    price: 25,
    image: "https://images.unsplash.com/photo-1605336565649-9a467419a0c5?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 19,
    name: "USB Cable",
    price: 15,
    image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 20,
    name: "Water Bottle",
    price: 30,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 21,
    name: "Notebook",
    price: 20,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 22,
    name: "Pen Set",
    price: 35,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 23,
    name: "Keychain",
    price: 10,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 24,
    name: "Socks Pack",
    price: 40,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 25,
    name: "Baseball Cap",
    price: 45,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 26,
    name: "Sticky Notes",
    price: 12,
    image: "https://images.unsplash.com/photo-1456324504439-367cee175baf?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 27,
    name: "Phone Stand",
    price: 28,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 28,
    name: "Cable Organizer",
    price: 18,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 29,
    name: "Tote Bag",
    price: 35,
    image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 30,
    name: "Mug",
    price: 22,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  // More cheap products
  {
    id: 31,
    name: "Hair Tie Pack",
    price: 8,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 32,
    name: "Lip Balm",
    price: 15,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 33,
    name: "Hand Sanitizer",
    price: 12,
    image: "https://images.unsplash.com/photo-1594213114663-d94dbabf99f0?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 34,
    name: "Face Mask Pack",
    price: 25,
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&h=500&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: 35,
    name: "Screen Wipes",
    price: 18,
    image: "https://images.unsplash.com/photo-1563770095-39d468f95a42?w=500&h=500&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: 36,
    name: "Pencil Case",
    price: 20,
    image: "https://images.unsplash.com/photo-1586073413765-4df39b9c5b7a?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 37,
    name: "Eraser Set",
    price: 8,
    image: "https://images.unsplash.com/photo-1586073413765-4df39b9c5b7a?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 38,
    name: "Ruler",
    price: 5,
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 39,
    name: "Scissors",
    price: 15,
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 40,
    name: "Tape Dispenser",
    price: 12,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 41,
    name: "Stapler",
    price: 18,
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 42,
    name: "Paper Clips",
    price: 6,
    image: "https://images.unsplash.com/photo-1456324504439-367cee175baf?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 43,
    name: "Bookmark",
    price: 5,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 44,
    name: "Greeting Card",
    price: 10,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 45,
    name: "Gift Bag",
    price: 15,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 46,
    name: "Wrapping Paper",
    price: 12,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 47,
    name: "Ribbons",
    price: 8,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 48,
    name: "Gift Tags",
    price: 6,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 49,
    name: "Coasters",
    price: 16,
    image: "https://images.unsplash.com/photo-1574410191832-e7a09013f6d5?w=500&h=500&fit=crop&q=80",
    category: "Home",
  },
  {
    id: 50,
    name: "Kitchen Towel",
    price: 14,
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&q=80",
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
              Checkout (GHS {cartTotal.toFixed(2)})
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
