import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      params.id
    )

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

    const product = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(image !== undefined && { image }),
        ...(category && { category }),
        ...(stock && { stock })
      }
    )

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
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.PRODUCTS,
      params.id
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
