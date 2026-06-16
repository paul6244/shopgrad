import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite'

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')

    let queries = []

    if (category) {
      queries.push(`category="${category}"`)
    }

    if (userId) {
      queries.push(`userId="${userId}"`)
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      queries.length > 0 ? queries : undefined
    )

    return NextResponse.json({ 
      success: true, 
      products: response.documents,
      total: response.total
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

    const product = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      ID.unique(),
      {
        name,
        description,
        price,
        image: image || '',
        category,
        stock,
        userId
      }
    )

    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
