import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "@/hooks/use-auth"
import { FavoritesProvider } from "@/hooks/use-favorites"
import { ThemeProvider } from "@/components/theme-provider"
import PWARegistration from "./pwa-registration"
import StructuredData from "@/components/structured-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopGrad - Your Favorite Shopping Destination | Best Deals on Electronics, Fashion & More",
  description: "Discover amazing deals on smartphones, laptops, headphones, gaming consoles, fashion items, and home essentials. ShopGrad offers the best prices with fast delivery.",
  keywords: "shopping, online store, electronics, smartphones, laptops, headphones, gaming, fashion, home goods, best deals, discount shopping",
  authors: [{ name: "ShopGrad" }],
  creator: "ShopGrad",
  publisher: "ShopGrad",
  metadataBase: new URL("https://your-domain.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.vercel.app",
    title: "ShopGrad - Your Favorite Shopping Destination",
    description: "Discover amazing deals on smartphones, laptops, headphones, gaming consoles, fashion items, and home essentials.",
    siteName: "ShopGrad",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "ShopGrad - Your Favorite Shopping Destination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopGrad - Your Favorite Shopping Destination",
    description: "Discover amazing deals on smartphones, laptops, headphones, gaming consoles, fashion items, and home essentials.",
    images: ["/icon.svg"],
    creator: "@shopgrad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
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
