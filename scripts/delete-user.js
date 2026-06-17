require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function deleteUserByEmail(email) {
  try {
    if (!email) {
      console.error('Please provide an email address')
      console.log('Usage: node scripts/delete-user.js <email>')
      process.exit(1)
    }

    console.log(`Deleting user with email: ${email}`)

    // First check if user exists
    const checkResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (!checkResult.rowCount || checkResult.rowCount === 0) {
      console.log('User not found with that email')
      process.exit(0)
    }

    const user = checkResult.rows[0]
    console.log('Found user:', { id: user.id, name: user.name, email: user.email, phone: user.phone })

    // Delete user
    const deleteResult = await pool.query(
      'DELETE FROM users WHERE email = $1',
      [email]
    )

    if (deleteResult.rowCount && deleteResult.rowCount > 0) {
      console.log('User deleted successfully')
    } else {
      console.log('Failed to delete user')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Get email from command line argument
const email = process.argv[2]
deleteUserByEmail(email)
