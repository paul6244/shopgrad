import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "@/hooks/use-auth"
import { FavoritesProvider } from "@/hooks/use-favorites"
import { ThemeProvider } from "@/components/theme-provider"
import PWARegistration from "./pwa-registration"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopGrad - Shopping App",
  description: "A beautiful shopping app with gradient design",
  manifest: "/manifest.json",
  themeColor: "#f43f5e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShopGrad",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PWARegistration />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>{children}</CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
