"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName?: string) => Promise<void>
  signupWithPhone: (phone: string, otp?: string, method?: 'sms' | 'email', email?: string, fullName?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password.length >= 6) {
          const user = {
            id: "user-1",
            name: email.split("@")[0],
            email,
          }
          setUser(user)
          localStorage.setItem("user", JSON.stringify(user))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  const signup = async (email: string, password: string, fullName?: string) => {
    // In a real app, this would make an API call to register
    // For demo purposes, we'll simulate a successful registration
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (email && password.length >= 6) {
          const user = {
            id: "user-" + Math.floor(Math.random() * 1000),
            name: fullName || email.split("@")[0],
            email,
          }
          setUser(user)
          localStorage.setItem("user", JSON.stringify(user))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  const signupWithPhone = async (phone: string, otp?: string, method: 'sms' | 'email' = 'sms', email?: string, fullName?: string) => {
    // Real OTP implementation using API routes
    if (!otp) {
      // Send OTP phase
      const body = method === 'email'
        ? { email, method: 'email' }
        : { phone, method: 'sms' }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send OTP')
      }
    } else {
      // Verify OTP phase
      const body = method === 'email'
        ? { email, otp, method: 'email', fullName }
        : { phone, otp, method: 'sms', fullName }

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Invalid OTP')
      }

      // Get user data from response
      const data = await response.json()
      const user = data.user || {
        id: "user-" + Math.floor(Math.random() * 1000),
        name: fullName || "User",
        email: method === 'email' ? (email || `${phone}@user.com`) : `${phone}@user.com`,
        phone: method === 'sms' ? phone : undefined,
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateProfile = (data: { name?: string; email?: string }) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, signupWithPhone, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
