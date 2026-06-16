import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// In-memory categories storage (WARNING: This won't work in serverless environments like Vercel)
// For production, consider using Redis or a database
declare global {
  var categoriesStore: any[]
}

if (!global.categoriesStore) {
  global.categoriesStore = [
    { $id: 'cat-1', name: 'Electronics', description: 'Electronic devices and accessories', image: '' },
    { $id: 'cat-2', name: 'Clothing', description: 'Fashion and apparel', image: '' },
    { $id: 'cat-3', name: 'Home & Garden', description: 'Home improvement and garden supplies', image: '' }
  ]
}

const categoriesStore = global.categoriesStore

// GET all categories
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      categories: categoriesStore,
      total: categoriesStore.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const category = {
      $id: `cat-${Date.now()}`,
      name,
      description: description || '',
      image: image || ''
    }
    
    categoriesStore.push(category)

    return NextResponse.json({ 
      success: true, 
      category 
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
