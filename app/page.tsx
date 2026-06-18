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
  // Smartphones
  { id: 51, name: "iPhone 15 Pro Max", price: 14500, image: "https://i.pinimg.com/736x/cb/2a/d0/cb2ad0bbc24149758f88797d22b54ab7.jpg", category: "smartphones" },
  { id: 52, name: "Samsung Galaxy S24 Ultra", price: 11800, image: "https://i.pinimg.com/1200x/5b/d8/93/5bd893c5ec4277bc4cff54fbb3e79afb.jpg", category: "smartphones" },
  { id: 53, name: "Google Pixel 8 Pro", price: 9600, image: "https://i.pinimg.com/1200x/ed/93/e5/ed93e514854b5aac82409189a813db4e.jpg", category: "smartphones" },
  { id: 54, name: "Xiaomi 14 Pro", price: 7400, image: "https://i.pinimg.com/736x/73/bc/9e/73bc9e39d2052a5a40535dc2d0d991f6.jpg", category: "smartphones" },
  { id: 55, name: "OnePlus 12", price: 8200, image: "https://i.pinimg.com/736x/8b/0a/ff/8b0affab4dc57570bf6c3e717684332d.jpg", category: "smartphones" },
  { id: 56, name: "Oppo Find X6 Pro", price: 6800, image: "https://i.pinimg.com/736x/21/45/89/2145899f8c5b2e3a7c8d9e6f5a4b3c2d.jpg", category: "smartphones" },
  { id: 57, name: "Vivo X100 Pro", price: 7200, image: "https://i.pinimg.com/736x/98/76/54/987654321fedcba9876543210fedcba.jpg", category: "smartphones" },
  { id: 58, name: "Nothing Phone 2", price: 5500, image: "https://i.pinimg.com/736x/ab/cd/ef/abcdef1234567890abcdef1234567890.jpg", category: "smartphones" },

  // Laptops
  { id: 59, name: "MacBook Air M3", price: 16000, image: "https://i.pinimg.com/1200x/fb/91/75/fb917567ea462ee7c6970b7d4c620a49.jpg", category: "laptops" },
  { id: 60, name: "HP Spectre x360", price: 15200, image: "https://i.pinimg.com/1200x/3d/24/99/3d2499097573b4a6cf1ec23b04e1fdfa.jpg", category: "laptops" },
  { id: 61, name: "Dell XPS 15", price: 17500, image: "https://i.pinimg.com/1200x/ae/6c/ac/ae6cacbcd79fa5603c6cbca5a2bff03b.jpg", category: "laptops" },
  { id: 62, name: "Lenovo ThinkPad X1", price: 14000, image: "https://i.pinimg.com/474x/40/50/f1/4050f17d38b5da7d9961b278f9cd0e06.jpg", category: "laptops" },
  { id: 63, name: "ASUS ROG Zephyrus", price: 19500, image: "https://i.pinimg.com/736x/cb/40/68/cb40685221f65875289d73b05c940169.jpg", category: "laptops" },
  { id: 64, name: "Microsoft Surface Pro 9", price: 13500, image: "https://i.pinimg.com/736x/12/34/56/1234567890abcdef1234567890abcdef.jpg", category: "laptops" },
  { id: 65, name: "Razer Blade 16", price: 21000, image: "https://i.pinimg.com/736x/fe/dc/ba/fedcba9876543210fedcba9876543210.jpg", category: "laptops" },
  { id: 66, name: "Acer Swift 3", price: 8500, image: "https://i.pinimg.com/736x/87/65/43/876543210fedcba9876543210fedcba.jpg", category: "laptops" },

  // Tablets
  { id: 67, name: "iPad Pro 12.9\"", price: 12000, image: "https://i.pinimg.com/736x/c3/c5/d6/c3c5d61a8c22f8a5487255a33ded6f76.jpg", category: "tablets" },
  { id: 68, name: "Samsung Galaxy Tab S9", price: 8500, image: "https://i.pinimg.com/736x/54/32/10/543210fedcba9876543210fedcba9876.jpg", category: "tablets" },
  { id: 69, name: "Microsoft Surface Go 3", price: 6500, image: "https://i.pinimg.com/736x/ba/98/76/ba9876543210fedcba9876543210fedc.jpg", category: "tablets" },
  { id: 70, name: "Xiaomi Pad 6", price: 4500, image: "https://i.pinimg.com/736x/10/fe/dc/10fedcba9876543210fedcba98765432.jpg", category: "tablets" },

  // Headphones & Audio
  { id: 71, name: "Sony WH-1000XM5", price: 4500, image: "https://i.pinimg.com/736x/2e/ad/55/2ead5536541de6438ed7bd2d67bf9b03.jpg", category: "headphones" },
  { id: 72, name: "Beats Studio Pro", price: 3800, image: "https://i.pinimg.com/736x/2e/f8/ad/2ef8addea9403e915541df08d0ff46a1.jpg", category: "headphones" },
  { id: 73, name: "JBL Tune 760NC", price: 1500, image: "https://i.pinimg.com/736x/fe/69/2e/fe692e0f0d3677c188c67c92e37648d0.jpg", category: "headphones" },
  { id: 74, name: "Apple AirPods Pro", price: 200, image: "/image/headset.png", category: "headphones" },
  { id: 75, name: "Apple AirPods", price: 150, image: "/image/air.png", category: "headphones" },
  { id: 76, name: "Bose QuietComfort Ultra", price: 5200, image: "https://i.pinimg.com/736x/76/54/32/76543210fedcba9876543210fedcba98.jpg", category: "headphones" },
  { id: 77, name: "Sennheiser Momentum 4", price: 4800, image: "https://i.pinimg.com/736x/32/10/fe/3210fedcba9876543210fedcba987654.jpg", category: "headphones" },
  { id: 78, name: "Anker Soundcore Q35", price: 1200, image: "https://i.pinimg.com/736x/fe/dc/ba/fedcba9876543210fedcba9876543210.jpg", category: "headphones" },

  // Gaming
  { id: 79, name: "PlayStation 5", price: 8900, image: "https://i.pinimg.com/736x/55/ba/7e/55ba7e148dcd3aeeea4eb80414aadab5.jpg", category: "gaming" },
  { id: 80, name: "Xbox Series X", price: 8300, image: "https://i.pinimg.com/736x/f2/36/4d/f2364d095cc49b756acd943e303102b0.jpg", category: "gaming" },
  { id: 81, name: "DualSense Controller", price: 950, image: "https://i.pinimg.com/1200x/f5/f4/0e/f5f40e732523e984ef3084583e0d8d41.jpg", category: "gaming" },
  { id: 82, name: "Nintendo Switch OLED", price: 4500, image: "https://i.pinimg.com/736x/cb/a9/87/cba9876543210fedcba9876543210fed.jpg", category: "gaming" },
  { id: 83, name: "Steam Deck", price: 5500, image: "https://i.pinimg.com/736x/8b/3a/5f/8b3a5ff5a8d2e4f1b7c9e2d3a8b5c6d.jpg", category: "gaming" },
  { id: 84, name: "Razer BlackWidow V4", price: 2200, image: "https://i.pinimg.com/736x/9c/2a/4b/9c2a4b3d5e6f7a8b9c0d1e2f3a4b5c6d.jpg", category: "gaming" },
  { id: 85, name: "Logitech G Pro X", price: 2800, image: "https://i.pinimg.com/736x/f1/2e/8d/f12e8d3a4b5c6d7e8f9a0b1c2d3e4f5.jpg", category: "gaming" },
  { id: 86, name: "USB Gaming mouse", price: 150, image: "https://i.pinimg.com/736x/3a/7b/9c/3a7b9c4d5e6f7a8b9c0d1e2f3a4b5c6d.jpg", category: "gaming" },
  { id: 87, name: "Wireless Gaming Mouse", price: 190, image: "https://i.pinimg.com/1200x/f9/20/06/f920067f7d78218df227e9faaf7529ea.jpg", category: "gaming" },

  // Smartwatches
  { id: 88, name: "Apple Watch Series 9", price: 4200, image: "https://i.pinimg.com/1200x/fe/9a/59/fe9a59044c893818ff937e091b4ebd58.jpg", category: "smartwatches" },
  { id: 89, name: "Samsung Galaxy Watch 6", price: 3200, image: "https://i.pinimg.com/736x/63/52/45/635245ff65d498791679cedcf7e3186b.jpg", category: "smartwatches" },
  { id: 90, name: "Ultra 3 Watch", price: 200, image: "/image/ulta.png", category: "smartwatches" },
  { id: 91, name: "Garmin Fenix 7", price: 5500, image: "https://i.pinimg.com/736x/8d/4e/6a/8d4e6a7b8c9d0e1f2a3b4c5d6e7f8.jpg", category: "smartwatches" },
  { id: 92, name: "Fitbit Sense 2", price: 2800, image: "https://i.pinimg.com/736x/9f/3a/7b/9f3a7b8c9d0e1f2a3b4c5d6e7f8a9.jpg", category: "smartwatches" },
  { id: 93, name: "Amazfit GTR 4", price: 1500, image: "https://i.pinimg.com/736x/2b/6c/8d/2b6c8d9e0f1a2b3c4d5e6f7a8b9c0d.jpg", category: "smartwatches" },

  // Cameras & Photography
  { id: 94, name: "Canon EOS R6", price: 18500, image: "https://i.pinimg.com/736x/8a/9b/4c/8a9b4c5d6e7f8a9b0c1d2e3f4a5b6.jpg", category: "cameras" },
  { id: 95, name: "Sony A7 IV", price: 22000, image: "https://i.pinimg.com/736x/7b/9c/2e/7b9c2e4d5f6a7b8c9d0e1f2a3b4c5.jpg", category: "cameras" },
  { id: 96, name: "DJI Mini 3 Pro", price: 7500, image: "https://i.pinimg.com/736x/4e/6f/8a/4e6f8a2b3c4d5e6f7a8b9c0d1e2.jpg", category: "cameras" },
  { id: 97, name: "GoPro Hero 12", price: 3500, image: "https://i.pinimg.com/736x/9a/2b/4c/9a2b4c5d6e7f8a9b0c1d2e3f4a5.jpg", category: "cameras" },
  { id: 98, name: "Instax Mini Evo", price: 850, image: "https://i.pinimg.com/736x/5c/7d/9e/5c7d9e0f1a2b3c4d5e6f7a8b9c.jpg", category: "cameras" },

  // Smart Home
  { id: 99, name: "Amazon Echo Dot 5", price: 450, image: "https://i.pinimg.com/736x/6f/8a/cd/6f8acd0e1f2a3b4c5d6e7f8a9b0c.jpg", category: "smarthome" },
  { id: 100, name: "Google Nest Hub", price: 1200, image: "https://i.pinimg.com/736x/1e/3a/5c/1e3a5c7d8e9f0a1b2c3d4e5f6a7.jpg", category: "smarthome" },
  { id: 101, name: "Philips Hue Lights", price: 850, image: "https://i.pinimg.com/736x/8b/2c/4d/8b2c4d5e6f7a8b9c0d1e2f3a4.jpg", category: "smarthome" },
  { id: 102, name: "Ring Video Doorbell", price: 2200, image: "https://i.pinimg.com/736x/3c/5d/7e/3c5d7e8f9a0b1c2d3e4f5a6b7.jpg", category: "smarthome" },
  { id: 103, name: "TP-Link Smart Plug", price: 250, image: "https://i.pinimg.com/736x/7a/9c/1e/7a9c1e2f3a4b5c6d7e8f9a0b1.jpg", category: "smarthome" },

  // Accessories
  { id: 104, name: "Samsung 55\" Smart TV", price: 7500, image: "https://i.pinimg.com/1200x/9f/37/5b/9f375b72494224eb5c43b3589fcab6d4.jpg", category: "accessories" },
  { id: 105, name: "LG OLED 65\"", price: 14000, image: "https://i.pinimg.com/736x/c6/d6/d0/c6d6d07259aeffe54ecb27dfac5f90e8.jpg", category: "accessories" },
  { id: 106, name: "Tecknet wireless keyboard", price: 200, image: "https://i.pinimg.com/1200x/15/4b/53/154b5391dfe3dbc05f09d2d7a158dcff.jpg", category: "accessories" },
  { id: 107, name: "Power Bank 20000mAh", price: 205, image: "https://i.pinimg.com/736x/92/69/86/9269867d21c331a588a174385feea6fe.jpg", category: "accessories" },
  { id: 108, name: "Logitech C920 Webcam", price: 450, image: "https://i.pinimg.com/1200x/1b/8c/1e/1b8c1e7a9c0d2f5b4a3c8e5b6f9a7c8.jpg", category: "accessories" },
  { id: 109, name: "SanDisk 1TB SSD", price: 850, image: "https://i.pinimg.com/736x/4a/7b/9c/4a7b9c2d3e4f5a6b7c8d9e0f1a2b3.jpg", category: "accessories" },
  { id: 110, name: "USB-C Hub 7-in-1", price: 450, image: "https://i.pinimg.com/736x/8c/3d/6f/8c3d6f0e1f2a3b4c5d6e7f8a9b0c1.jpg", category: "accessories" },
  { id: 111, name: "Wireless Charger 15W", price: 350, image: "https://i.pinimg.com/736x/2e/5a/8b/2e5a8b3c4d5e6f7a8b9c0d1e2f3a4.jpg", category: "accessories" },
  { id: 112, name: "Bluetooth Speaker JBL", price: 650, image: "https://i.pinimg.com/736x/9f/1a/4d/9f1a4d7e8f9a0b1c2d3e4f5a6b7.jpg", category: "accessories" },
  { id: 113, name: "Cable Management Kit", price: 150, image: "https://i.pinimg.com/736x/6b/8c/1e/6b8c1e2f3a4b5c6d7e8f9a0b1c2.jpg", category: "accessories" },

  // Premium originals
  { id: 114, name: "Apple MacBook Pro 16-inch", price: 9000, image: "https://i.pinimg.com/736x/5f/8a/3c/5f8a3c7d9e0f1a2b3c4d5e6f7a8.jpg", category: "laptops" },
  { id: 115, name: "Apple iPad Pro 12.9-inch", price: 1000, image: "https://i.pinimg.com/736x/a7/b8/c9/a7b8c9d0e1f2a3b4c5d6e7f8a9b0c.jpg", category: "tablets" },
  { id: 116, name: "Video Camera", price: 2530, image: "/image/vg.png", category: "cameras" },
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
          {[
            "All",
            "Electronics",
            "Fashion",
            "Home",
            "Fitness",
            "smartphones",
            "laptops",
            "tablets",
            "headphones",
            "gaming",
            "smartwatches",
            "cameras",
            "smarthome",
            "accessories",
          ].map((category) => (
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
