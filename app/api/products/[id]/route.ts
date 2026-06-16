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

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = productsStore.find(p => p.$id === params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, stock } = body

    const index = productsStore.findIndex(p => p.$id === params.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = productsStore[index]
    if (name) product.name = name
    if (description) product.description = description
    if (price) product.price = price
    if (image !== undefined) product.image = image
    if (category) product.category = category
    if (stock) product.stock = stock

    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = productsStore.findIndex(p => p.$id === params.id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    productsStore.splice(index, 1)

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
