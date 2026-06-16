import { Client, Account, Databases, Storage, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

// Database ID
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ''

// Collection IDs
const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '',
  PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || '',
  CATEGORIES: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || '',
  ORDERS: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || '',
  FAVORITES: process.env.NEXT_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID || '',
  CART: process.env.NEXT_PUBLIC_APPWRITE_CART_COLLECTION_ID || ''
}

// Bucket IDs
const BUCKETS = {
  PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_BUCKET_ID || '',
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_BUCKET_ID || ''
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
