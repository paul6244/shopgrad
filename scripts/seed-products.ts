import { Client, Databases, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a310a9e001f8110923d')

const databases = new Databases(client)

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'shopgrad_db'
const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || 'products'

const products = [
  {
    name: "Basic Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt, perfect for everyday wear. Available in multiple colors.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Clothing",
    stock: 50,
    userId: "admin"
  },
  {
    name: "Canvas Sneakers",
    description: "Lightweight canvas sneakers with rubber sole. Great for casual outings.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    category: "Footwear",
    stock: 30,
    userId: "admin"
  },
  {
    name: "Denim Jeans",
    description: "Classic fit denim jeans with five-pocket styling. Durable and stylish.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    category: "Clothing",
    stock: 40,
    userId: "admin"
  },
  {
    name: "Wireless Earbuds",
    description: "Bluetooth wireless earbuds with noise cancellation and long battery life.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    category: "Electronics",
    stock: 25,
    userId: "admin"
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather bifold wallet with multiple card slots and coin pocket.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    category: "Accessories",
    stock: 60,
    userId: "admin"
  },
  {
    name: "Sunglasses",
    description: "UV protection sunglasses with polarized lenses. Stylish and functional.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    category: "Accessories",
    stock: 35,
    userId: "admin"
  },
  {
    name: "Backpack",
    description: "Durable backpack with padded laptop compartment and multiple pockets.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Bags",
    stock: 20,
    userId: "admin"
  },
  {
    name: "Wrist Watch",
    description: "Analog wrist watch with leather strap. Water-resistant and elegant.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Accessories",
    stock: 45,
    userId: "admin"
  },
  {
    name: "Hoodie",
    description: "Comfortable cotton blend hoodie with kangaroo pocket. Perfect for cool weather.",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    category: "Clothing",
    stock: 55,
    userId: "admin"
  },
  {
    name: "Phone Case",
    description: "Protective phone case with shock absorption. Fits most smartphone models.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    category: "Electronics",
    stock: 100,
    userId: "admin"
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with breathable mesh and cushioned sole.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    category: "Footwear",
    stock: 25,
    userId: "admin"
  },
  {
    name: "Baseball Cap",
    description: "Classic baseball cap with adjustable strap. One size fits all.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    category: "Accessories",
    stock: 70,
    userId: "admin"
  },
  {
    name: "Portable Charger",
    description: "10000mAh portable power bank with fast charging. Compact and lightweight.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    category: "Electronics",
    stock: 40,
    userId: "admin"
  },
  {
    name: "Socks Pack",
    description: "Pack of 6 cotton blend socks. Comfortable and durable for everyday use.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80",
    category: "Clothing",
    stock: 80,
    userId: "admin"
  },
  {
    name: "Tote Bag",
    description: "Canvas tote bag with sturdy handles. Perfect for shopping or daily use.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=800&q=80",
    category: "Bags",
    stock: 50,
    userId: "admin"
  }
]

async function seedProducts() {
  try {
    console.log('Starting to seed products...')
    
    for (const product of products) {
      try {
        const result = await databases.createDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION,
          ID.unique(),
          product
        )
        console.log(`✅ Created product: ${product.name}`)
      } catch (error) {
        console.error(`❌ Failed to create product: ${product.name}`, error)
      }
    }
    
    console.log('✅ Product seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
  }
}

seedProducts()
