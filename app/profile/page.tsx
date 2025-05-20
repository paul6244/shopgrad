"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Heart, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500">
      <div className="px-6 py-4">
        <Link href="/" className="inline-flex items-center text-black">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Shop
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-rose-400 to-purple-500 px-6 py-8 text-white">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-purple-500 text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="opacity-90">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <Link
                href="/profile/orders"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-3 text-rose-500" />
                  <span>My Orders</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link
                href="/profile/wishlist"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-3 text-rose-500" />
                  <span>Wishlist</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link
                href="/profile/settings"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-rose-500" />
                  <span>Settings</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-3 text-rose-500" />
                  <span>Logout</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="sticky bottom-0 bg-white bg-opacity-90 backdrop-blur-sm shadow-lg">
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
                className={`flex flex-col items-center ${item.name === "Profile" ? "text-rose-500 font-medium" : ""}`}
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
