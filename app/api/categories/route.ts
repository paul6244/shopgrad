import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite'

// GET all categories
export async function GET() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CATEGORIES
    )

    return NextResponse.json({ 
      success: true, 
      categories: response.documents,
      total: response.total
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

    const category = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CATEGORIES,
      ID.unique(),
      {
        name,
        description: description || '',
        image: image || ''
      }
    )

    return NextResponse.json({ 
      success: true, 
      category 
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
