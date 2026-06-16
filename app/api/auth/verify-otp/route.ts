import { NextRequest, NextResponse } from 'next/server'
import { account, databases, DATABASE_ID, COLLECTIONS, ID } from '@/lib/appwrite'

// OTP collection ID - must match send-otp route
const OTP_COLLECTION_ID = 'otps'

interface OTPDocument {
  identifier: string // phone or email
  otp: string
  expiresAt: number
  method: 'sms' | 'email'
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const { phone, email, otp, method, fullName } = await request.json()

    // Validate based on method
    if (method === 'sms' && !phone) {
      return NextResponse.json({ error: 'Phone number and OTP are required for SMS' }, { status: 400 })
    }
    if (method === 'email' && !email) {
      return NextResponse.json({ error: 'Email and OTP are required for email verification' }, { status: 400 })
    }
    if (!method || !['sms', 'email'].includes(method)) {
      return NextResponse.json({ error: 'Method must be either "sms" or "email"' }, { status: 400 })
    }
    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 })
    }

    // SMS Method - Handle both Arkesel and Appwrite Phone Auth
    if (method === 'sms') {
      // Query database for OTP
      const otpDocuments = await databases.listDocuments(
        DATABASE_ID,
        OTP_COLLECTION_ID,
        [`identifier="${phone}"`, `method="sms"`]
      )
      
      if (otpDocuments.documents.length === 0) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }
      
      // Get the most recent OTP
      const storedData = otpDocuments.documents[0] as any
      
      // Check if OTP is expired
      if (Date.now() > storedData.expiresAt) {
        // Delete expired OTP
        await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION_ID, storedData.$id)
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
      }

      // If storedData has userId, use Appwrite Phone Auth verification
      if (storedData.userId) {
        try {
          // Appwrite uses updatePhoneSession to verify the code
          const session = await account.updatePhoneSession(
            storedData.userId,
            otp
          )

          // Clear OTP after successful verification
          await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION_ID, storedData.$id)

          // Create or update user in database
          try {
            // Check if user already exists
            const existingUsers = await databases.listDocuments(
              DATABASE_ID,
              COLLECTIONS.USERS,
              [`phone="${phone}"`]
            )

            let userData
            if (existingUsers.documents.length > 0) {
              // User exists, return existing data
              userData = existingUsers.documents[0]
            } else {
              // Create new user
              userData = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                ID.unique(),
                {
                  name: 'User',
                  phone: phone,
                  email: `${phone}@user.com`
                }
              )
            }

            return NextResponse.json({ 
              success: true, 
              message: 'OTP verified successfully via Appwrite SMS',
              user: {
                id: userData.$id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone
              }
            })
          } catch (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json({ 
              error: 'Failed to update user database after OTP verification',
              success: false
            }, { status: 500 })
          }
        } catch (appwriteError) {
          console.error('Appwrite error:', appwriteError)
          return NextResponse.json({ error: 'Failed to verify OTP via Appwrite' }, { status: 500 })
        }
      } else {
        // Arkesel or local OTP verification - verify OTP directly
        if (storedData.otp !== otp) {
          return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
        }

        // Clear OTP after successful verification
        await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION_ID, storedData.$id)

        // Create or update user in database
        try {
          // Check if user already exists
          const existingUsers = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [`phone="${phone}"`]
          )

          let userData
          if (existingUsers.documents.length > 0) {
            // User exists, return existing data
            userData = existingUsers.documents[0]
          } else {
            // Create new user
            userData = await databases.createDocument(
              DATABASE_ID,
              COLLECTIONS.USERS,
              ID.unique(),
              {
                name: fullName || phone,
                phone: phone,
                email: `${phone}@user.com`
              }
            )
          }

          return NextResponse.json({ 
            success: true, 
            message: 'OTP verified successfully via SMS',
            user: {
              id: userData.$id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone
            }
          })
        } catch (dbError) {
          console.error('Database error:', dbError)
          return NextResponse.json({ 
            error: 'Failed to update user database after OTP verification',
            success: false
          }, { status: 500 })
        }
      }
    }

    // Email Method - Verify OTP from database
    if (method === 'email') {
      // Query database for OTP
      const otpDocuments = await databases.listDocuments(
        DATABASE_ID,
        OTP_COLLECTION_ID,
        [`identifier="${email}"`, `method="email"`]
      )
      
      if (otpDocuments.documents.length === 0) {
        return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
      }
      
      // Get the most recent OTP
      const storedData = otpDocuments.documents[0] as any
      
      // Check if OTP is expired
      if (Date.now() > storedData.expiresAt) {
        // Delete expired OTP
        await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION_ID, storedData.$id)
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      // Clear OTP after successful verification
      await databases.deleteDocument(DATABASE_ID, OTP_COLLECTION_ID, storedData.$id)

      // Create or update user in database
      try {
        // Check if user already exists
        const existingUsers = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [`email="${email}"`]
        )

        let userData
        if (existingUsers.documents.length > 0) {
          // User exists, return existing data
          userData = existingUsers.documents[0]
        } else {
          // Create new user
          userData = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
              name: fullName || email.split('@')[0],
              email: email
            }
          )
        }

        return NextResponse.json({ 
          success: true, 
          message: 'OTP verified successfully via email',
          user: {
            id: userData.$id,
            name: userData.name,
            email: userData.email
          }
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({ 
          error: 'Failed to update user database after OTP verification',
          success: false
        }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
