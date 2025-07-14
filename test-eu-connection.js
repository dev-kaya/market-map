const { Client } = require('pg');

const password = 'wb18PQj0LgbcCayr';
const projectRef = 'bxiqugtqobtqoounuwtn';

// EU West 2 connection formats
const connectionStrings = [
  // Direct connection
  `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
  
  // Pooled connection (Transaction mode) - EU West 2
  `postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres`,
  
  // Pooled with pgbouncer flag
  `postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true`,
];

async function testConnection(connectionString, description) {
  console.log(`\nTesting ${description}...`);
  console.log('URL:', connectionString.replace(/:[^:@]*@/, ':****@'));
  
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    await client.end();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message);
    return false;
  }
}

async function testAll() {
  console.log('Testing EU West 2 Supabase connections...\n');
  
  let connected = false;
  
  connected = await testConnection(connectionStrings[0], 'Direct connection');
  
  if (!connected) {
    console.log('\n🔄 Trying pooled connection...');
    connected = await testConnection(connectionStrings[1], 'Pooled connection (EU West 2)');
  }
  
  if (!connected) {
    connected = await testConnection(connectionStrings[2], 'Pooled with pgbouncer flag');
  }
  
  if (connected) {
    console.log('\n✅ Connection successful! Update your .env.local with the working connection string.');
  } else {
    console.log('\n❌ All connection attempts failed.');
    console.log('Please double-check your password in the Supabase dashboard.');
  }
}

testAll();