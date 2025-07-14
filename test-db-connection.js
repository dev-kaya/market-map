const { Client } = require('pg');

// Load environment from .env.local
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:wb18PQj0LgbcCayr@db.bxiqugtqobtqoounuwtn.supabase.co:5432/postgres";

console.log('Testing connection to Supabase...');
console.log('Connection string:', connectionString.replace(/:[^:@]*@/, ':****@')); // Hide password

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time from database:', result.rows[0].now);
    
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n⚠️  The database host cannot be found. Please check:');
      console.error('1. Is your Supabase project reference correct?');
      console.error('2. Copy the connection string directly from Supabase dashboard');
    }
  }
}

testConnection();