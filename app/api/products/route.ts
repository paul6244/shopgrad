import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory products storage (WARNING: This won't work in serverless environments like Vercel)
// For production, consider using Redis or a database
declare global {
  var productsStore: any[]
}

if (!global.productsStore) {
  global.productsStore = [
    {
      $id: 'prod-1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      image: '',
      category: 'Electronics',
      stock: 50,
      userId: 'user-1'
    },
    {
      $id: 'prod-2',
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 149.99,
      image: '',
      category: 'Electronics',
      stock: 30,
      userId: 'user-1'
    },
    {
      $id: 'prod-3',
      name: 'T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      image: '',
      category: 'Clothing',
      stock: 100,
      userId: 'user-1'
    }
  ]
}

const productsStore = global.productsStore

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')

    let filteredProducts = [...productsStore]

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    if (userId) {
      filteredProducts = filteredProducts.filter(p => p.userId === userId)
    }

    return NextResponse.json({ 
      success: true, 
      products: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, stock, userId } = body

    if (!name || !description || !price || !category || !stock || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = {
      $id: `prod-${Date.now()}`,
      name,
      description,
      price,
      image: image || '',
      category,
      stock,
      userId
    }
    
    productsStore.push(product)

    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
