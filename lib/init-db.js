require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function initializeDatabase() {
  try {
    const fs = require('fs')
    const path = require('path')
    
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(s => s.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement)
      }
    }
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    await pool.end()
  }
}

module.exports = { initializeDatabase }
