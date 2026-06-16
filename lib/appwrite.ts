import { Client, Account, Databases, Storage, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a310a9e001f8110923d')

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

// Database ID
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'shopgrad_db'

// Collection IDs
const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
  PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || 'products',
  CATEGORIES: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
  ORDERS: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || 'orders',
  FAVORITES: process.env.NEXT_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID || 'favorites',
  CART: process.env.NEXT_PUBLIC_APPWRITE_CART_COLLECTION_ID || 'cart'
}

// Bucket IDs
const BUCKETS = {
  PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_BUCKET_ID || 'products_images',
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_BUCKET_ID || 'users_avatars'
}

export { 
  client, 
  account, 
  databases, 
  storage, 
  ID,
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS
}
