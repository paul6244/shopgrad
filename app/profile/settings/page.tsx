"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Bell, Shield, Moon, Sun, Globe, CreditCard, Trash2, LogOut, Download, Phone } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [emailPromotions, setEmailPromotions] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone || "")
      // Load settings from localStorage
      const storedSettings = localStorage.getItem(`settings-${user.id}`)
      if (storedSettings) {
        const settings = JSON.parse(storedSettings)
        setNotifications(settings.notifications ?? true)
        setEmailPromotions(settings.emailPromotions ?? false)
        setDarkMode(settings.darkMode ?? false)
        setLanguage(settings.language ?? "en")
      }
    }
  }, [user])

  useEffect(() => {
    if (mounted && user) {
      setTheme(darkMode ? "dark" : "light")
    }
  }, [darkMode, mounted, user])

  const handleSave = async () => {
    if (user) {
      try {
        // Update profile in database
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, name, email, phone })
        })

        if (!response.ok) {
          throw new Error('Failed to update profile')
        }

        const data = await response.json()
        
        // Update local state
        updateProfile({ name, email, phone })
        
        // Save settings to localStorage
        const settings = {
          notifications,
          emailPromotions,
          darkMode,
          language,
        }
        localStorage.setItem(`settings-${user.id}`, JSON.stringify(settings))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile. Please try again.')
      }
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const handleDeleteAccount = () => {
    if (user) {
      // In a real app, this would make an API call
      localStorage.removeItem(`user`)
      localStorage.removeItem(`settings-${user.id}`)
      localStorage.removeItem(`favorites-${user.id}`)
      localStorage.removeItem(`orders-${user.id}`)
      logout()
      window.location.href = "/"
    }
  }

  const handleExportData = () => {
    if (user) {
      const data = {
        profile: user,
        favorites: JSON.parse(localStorage.getItem(`favorites-${user.id}`) || "[]"),
        orders: JSON.parse(localStorage.getItem(`orders-${user.id}`) || "[]"),
        settings: JSON.parse(localStorage.getItem(`settings-${user.id}`) || "{}"),
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `shopgrad-data-${user.id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (!user || !mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-rose-200 via-rose-300 to-purple-500'}`}>
      <div className="px-6 py-4">
        <Link href="/profile" className={`inline-flex items-center ${isDark ? 'text-white' : 'text-black'}`}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Profile
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-white'}`}>Settings</h1>

        <div className="space-y-4">
          {/* Profile Settings */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : ''}`}>
                <User className="h-5 w-5 mr-2 text-rose-500" />
                Profile Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full py-2 bg-gradient-to-r from-rose-400 to-purple-500 text-white rounded-lg font-medium hover:from-rose-500 hover:to-purple-600 transition-colors"
                >
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : ''}`}>
                <Bell className="h-5 w-5 mr-2 text-rose-500" />
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : ''}`}>Order Updates</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Receive updates about your orders</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? "bg-rose-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : ''}`}>Promotional Emails</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Receive deals and promotions</p>
                  </div>
                  <button
                    onClick={() => setEmailPromotions(!emailPromotions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailPromotions ? "bg-rose-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailPromotions ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : ''}`}>
                {darkMode ? <Moon className="h-5 w-5 mr-2 text-rose-500" /> : <Sun className="h-5 w-5 mr-2 text-rose-500" />}
                Appearance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : ''}`}>Dark Mode</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Switch to dark theme</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? "bg-rose-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Globe className="h-4 w-4 mr-1" />
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : ''}`}>
                <Shield className="h-5 w-5 mr-2 text-rose-500" />
                Security
              </h2>
              <div className="space-y-3">
                <Link
                  href="/change-password"
                  className={`block w-full py-2 px-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300'}`}
                >
                  Change Password
                </Link>
                <Link
                  href="/two-factor"
                  className={`block w-full py-2 px-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300'}`}
                >
                  Two-Factor Authentication
                </Link>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : ''}`}>
                <Download className="h-5 w-5 mr-2 text-rose-500" />
                Data & Privacy
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className={`w-full py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center ${isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300'}`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={`${isDark ? 'bg-gray-800 border-red-900' : 'bg-white'} rounded-xl shadow-lg overflow-hidden border-2 ${isDark ? 'border-red-900' : 'border-red-200'}`}>
            <div className="p-6">
              <h2 className={`text-xl font-bold mb-4 flex items-center text-red-600`}>
                <Trash2 className="h-5 w-5 mr-2" />
                Danger Zone
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete Account
                </button>
                {showDeleteConfirm && (
                  <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
                    <p className={`text-sm mb-3 ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                      Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className={`flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors ${isDark ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300'}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full py-3 rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700'}`}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  )
}
