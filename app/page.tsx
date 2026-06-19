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
  id: 37,
  name: "Eraser Set",
  price: 8,
  image: "https://i.pinimg.com/736x/24/09/df/2409dfea685c11eabac9600abdb13ae2.jpg",
  category: "Home",
},
{
  id: 40,
  name: "Tape Dispenser",
  price: 12,
  image: "https://i.pinimg.com/1200x/1a/f1/a9/1af1a921d24d670dcf59784af8b2f5ba.jpg",
  category: "Home",
},
{
  id: 42,
  name: "Paper Clips",
  price: 6,
  image: "https://i.pinimg.com/736x/f9/4c/7c/f94c7c7ce6c0e1cb58f1a0e61f7311f2.jpg",
  category: "Home",
},
{
  id: 61,
  name: "Vase",
  price: 85,
  image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop&q=80",
  category: "Home",
},
{
  id: 65,
  name: "Storage Box",
  price: 35,
  image: "https://i.pinimg.com/1200x/5d/32/b9/5d32b97cec9742bad19407a514be0b36.jpg",
  category: "Home",
},
{
  id: 66,
  name: "Laundry Basket",
  price: 40,
  image: "https://i.pinimg.com/736x/a7/70/42/a77042c320e7b0c7f21d0381c0bfb1b9.jpg",
  category: "Home",
},
{
  id: 67,
  name: "Iron",
  price: 75,
  image: "https://i.pinimg.com/736x/a0/cd/b8/a0cdb828cbb754240933b99dc378b5aa.jpg",
  category: "Home",
},
{
  id: 68,
  name: "Ironing Board",
  price: 55,
  image: "https://i.pinimg.com/736x/3a/80/ba/3a80bae0e8fd895e8bb3be8c837d8980.jpg",
  category: "Home",
},
{
  id: 69,
  name: "Drying Rack",
  price: 45,
  image: "https://i.pinimg.com/736x/1c/ba/16/1cba169c1e33554afc78b3022361cad6.jpg",
  category: "Home",
},
{
  id: 70,
  name: "Hangers",
  price: 20,
  image: "https://i.pinimg.com/736x/b5/3f/f9/b53ff9423b05f9b83228a6fd405aeb25.jpg",
  category: "Home",
},
{
  id: 88,
  name: "Exercise Ball",
  price: 45,
  image: "https://i.pinimg.com/736x/3e/38/6a/3e386ab9a093405d029b73235c432ffa.jpg",
  category: "Fitness",
},
{
  id: 91,
  name: "Medicine Ball",
  price: 35,
  image: "https://i.pinimg.com/1200x/17/54/55/17545543511b6076110cc3e3d196dd3c.jpg",
  category: "Fitness",
},
{
  id: 92,
  name: "Pull-up Bar",
  price: 120,
  image: "https://i.pinimg.com/736x/0e/a9/b2/0ea9b2d858bfce282c5453dcd6307641.jpg",
  category: "Fitness",
},
{
  id: 94,
  name: "Punching Bag",
  price: 180,
  image: "https://i.pinimg.com/736x/8f/dc/82/8fdc82395a7a9e18592558e181e502b4.jpg",
  category: "Fitness",
},
{
  id: 95,
  name: "Tennis Racket",
  price: 220,
  image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=500&fit=crop&q=80",
  category: "Fitness",
},
{
  id: 96,
  name: "Basketball",
  price: 65,
  image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop&q=80",
  category: "Fitness",
},
{
  id: 97,
  name: "Soccer Ball",
  price: 55,
  image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&h=500&fit=crop&q=80",
  category: "Fitness",
},
{
  id: 98,
  name: "Golf Clubs",
  price: 850,
  image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&h=500&fit=crop&q=80",
  category: "Fitness",
},
{
  id: 99,
  name: "Hiking Boots",
  price: 380,
  image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop&q=80",
  category: "Fashion",
},
{
  id: 100,
  name: "Camping Tent",
  price: 350,
  image: "https://i.pinimg.com/1200x/fc/39/63/fc39631887926395befdc3dded30ddb2.jpg",
  category: "Home",
},
  // Smartphones
 {
  id: 106,
  name: "Oppo Find X6 Pro",
  price: 6800,
  image: "https://i.pinimg.com/1200x/fb/f1/5c/fbf15c0a3793f603daea9c472e6616f6.jpg",
  category: "smartphones",
},
{
  id: 107,
  name: "Vivo X100 Pro",
  price: 7200,
  image: "https://i.pinimg.com/736x/1a/e5/62/1ae562acb328ea8a0e5e7997ebbc36e4.jpg",
  category: "smartphones",
},
{
  id: 108,
  name: "Samsung Galaxy S24 Ultra",
  price: 12000,
  image: "https://i.pinimg.com/736x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg",
  category: "smartphones",
},
{
  id: 109,
  name: "MacBook Air M3",
  price: 16000,
  image: "https://i.pinimg.com/1200x/fb/91/75/fb917567ea462ee7c6970b7d4c620a49.jpg",
  category: "laptops",
},
{
  id: 110,
  name: "HP Spectre x360",
  price: 15200,
  image: "https://i.pinimg.com/236x/11/4a/25/114a257e9a9beb1e367d70c4105974b7.jpg",
  category: "laptops",
},
{
  id: 111,
  name: "Dell XPS 15",
  price: 17500,
  image: "https://i.pinimg.com/1200x/88/86/a7/8886a71c467059fdc42c1f016647375b.jpg",
  category: "laptops",
},
{
  id: 112,
  name: "Lenovo ThinkPad X1",
  price: 4000,
  image: "https://i.pinimg.com/1200x/76/ff/eb/76ffeba5f269b51f4747598174e9a9c1.jpg",
  category: "laptops",
},
{
  id: 113,
  name: "ASUS ROG Zephyrus",
  price: 9500,
  image: "https://i.pinimg.com/736x/ce/67/29/ce6729850caad44d9a923e1ff2b6124a.jpg",
  category: "laptops",
},
{
  id: 114,
  name: "Microsoft Surface Pro 9",
  price: 13500,
  image: "https://i.pinimg.com/1200x/56/56/ef/5656ef726202afd87750158fa425c9b2.jpg",
  category: "laptops",
},
{
  id: 115,
  name: "Razer Blade 16",
  price: 21000,
  image: "https://i.pinimg.com/1200x/d5/83/0c/d5830c8578ac1e88d622724987c09a71.jpg",
  category: "laptops",
},
{
  id: 116,
  name: "Acer Swift 3",
  price: 8500,
  image: "https://i.pinimg.com/1200x/af/ef/24/afef241344f5b4e59f8d16e9c3952e4f.jpg",
  category: "laptops",
},
{
  id: 117,
  name: 'iPad Pro 12.9"',
  price: 9000,
  image: "https://i.pinimg.com/1200x/f7/d7/9e/f7d79e73156ebe63aab6c802404350a4.jpg",
  category: "tablets",
},
{
  id: 118,
  name: "Samsung Galaxy Tab S9",
  price: 8500,
  image: "https://i.pinimg.com/1200x/57/e8/48/57e8486ed0183ccedfc78ad80ee16ee7.jpg",
  category: "tablets",
},
{
  id: 119,
  name: "Microsoft Surface Go 3",
  price: 6500,
  image: "https://i.pinimg.com/736x/b0/50/09/b05009c21b8d362889b04c6e5a7ed68e.jpg",
  category: "tablets",
},
{
  id: 120,
  name: "Xiaomi Pad 6",
  price: 4500,
  image: "https://i.pinimg.com/736x/a8/ff/51/a8ff51b0393e67a68a00619e621197d4.jpg",
  category: "tablets",
},
{
  id: 121,
  name: "Sony WH-1000XM5",
  price: 500,
  image: "https://i.pinimg.com/736x/77/10/24/77102483f2e1c6fdf0028aa7fc76e05c.jpg",
  category: "headphones",
},
{
  id: 122,
  name: "Beats Studio Pro",
  price: 800,
  image: "https://i.pinimg.com/1200x/e1/1a/3d/e11a3d4bd7335e1f8319d1a06043124a.jpg",
  category: "headphones",
},
{
  id: 123,
  name: "JBL Tune 760NC",
  price: 1500,
  image: "https://i.pinimg.com/736x/8e/24/59/8e2459acc2c33d24bf6f981a3246bb99.jpg",
  category: "headphones",
},
{
  id: 124,
  name: "Apple AirPods Pro",
  price: 200,
  image: "https://i.pinimg.com/736x/88/12/28/88122855d4faa222a3c0ebb2c33e6726.jpg",
  category: "headphones",
},
{
  id: 125,
  name: "Apple AirPods",
  price: 150,
  image: "https://i.pinimg.com/736x/21/7f/9e/217f9e211a4bbaa16e43a8806e12042d.jpg",
  category: "headphones",
},
{
  id: 126,
  name: "Bose QuietComfort Ultra",
  price: 1200,
  image: "https://i.pinimg.com/736x/ab/e1/56/abe1560b3ac189401362820e69a2f0c8.jpg",
  category: "headphones",
},
{
  id: 127,
  name: "Sennheiser Momentum 4",
  price: 800,
  image: "https://i.pinimg.com/736x/94/b4/61/94b461068147b9d5461769be790b1c45.jpg",
  category: "headphones",
},
{
  id: 128,
  name: "Anker Soundcore Q35",
  price: 1200,
  image: "https://i.pinimg.com/1200x/75/59/d4/7559d4fab21feb88129c263d214f6d5b.jpg",
  category: "headphones",
},
{
  id: 129,
  name: "PlayStation 5",
  price: 8900,
  image: "https://i.pinimg.com/736x/30/35/7f/30357f6208f2ce95bfebf0259083b29d.jpg",
  category: "gaming",
},
{
  id: 130,
  name: "Xbox Series X",
  price: 8300,
  image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800",
  category: "gaming",
},
{
  id: 131,
  name: "DualSense Controller",
  price: 950,
  image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
  category: "gaming",
},
{
  id: 132,
  name: "Nintendo Switch OLED",
  price: 4500,
  image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800",
  category: "gaming",
},
{
  id: 133,
  name: "Steam Deck",
  price: 5500,
  image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800",
  category: "gaming",
},
{
  id: 138,
  name: "Apple Watch Series 9",
  price: 4200,
  image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
  category: "smartwatches",
},
{
  id: 139,
  name: "Samsung Galaxy Watch 6",
  price: 3200,
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  category: "smartwatches",
},
{
  id: 144,
  name: "Canon EOS R6",
  price: 18500,
  image: "https://i.pinimg.com/1200x/1c/27/46/1c2746176983c51a9caaaa7c29be8f64.jpg",
  category: "cameras",
},
{
  id: 145,
  name: "Sony A7 IV",
  price: 22000,
  image: "https://i.pinimg.com/1200x/d1/79/6c/d1796c8209b44412f556c061b10e8a0a.jpg",
  category: "cameras",
},
{
  id: 146,
  name: "DJI Mini 3 Pro",
  price: 7500,
  image: "https://i.pinimg.com/1200x/19/26/ff/1926ff05648602ba8a1828d4ce7aab0b.jpg",
  category: "cameras",
},
{
  id: 147,
  name: "GoPro Hero 12",
  price: 3500,
  image: "https://i.pinimg.com/1200x/2e/13/46/2e13460b84483005220f97dd3f45af95.jpg",
  category: "cameras",
},
{
  id: 154,
  name: 'Samsung 55" Smart TV',
  price: 7500,
  image: "https://i.pinimg.com/1200x/51/54/72/51547282fe55c468aafc10bb9c0fa8ad.jpg",
  category: "accessories",
},
{
  id: 155,
  name: 'LG OLED 65"',
  price: 14000,
  image: "https://i.pinimg.com/736x/d6/41/d6/d641d633b6091537c2f258fb7532d3c3.jpg",
  category: "accessories",
}
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
