require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function addPasswordHashColumn() {
  try {
    console.log('Adding password_hash column to users table...')

    // Add the column if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
    `)

    console.log('password_hash column added successfully')
  } catch (error) {
    console.error('Error adding password_hash column:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

addPasswordHashColumn()
