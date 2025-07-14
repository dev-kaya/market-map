const { Client } = require('pg');

const password = 'wb18PQj0LgbcCayr';
const projectRef = 'bxiqugtqobtqoounuwtn';

// Different possible Supabase URL formats
const connectionStrings = [
  `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
  `postgresql://postgres:${password}@${projectRef}.supabase.co:5432/postgres`,
  `postgresql://postgres:${password}@db.${projectRef}.supabase.co:6543/postgres?pgbouncer=true`,
  `postgresql://postgres.${projectRef}:${password}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
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
    await client.end();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message);
    return false;
  }
}

async function testAll() {
  console.log('Testing different Supabase connection formats...\n');
  
  let connected = false;
  
  connected = await testConnection(connectionStrings[0], 'Standard format with db. prefix');
  if (!connected) {
    connected = await testConnection(connectionStrings[1], 'Without db. prefix');
  }
  if (!connected) {
    connected = await testConnection(connectionStrings[2], 'Pooler connection (port 6543)');
  }
  if (!connected) {
    connected = await testConnection(connectionStrings[3], 'AWS US-West pooler');
  }
  if (!connected) {
    connected = await testConnection(connectionStrings[4], 'AWS US-East pooler');
  }
  
  if (!connected) {
    console.log('\n❌ Could not connect with any format.');
    console.log('\nPlease verify in your Supabase dashboard:');
    console.log('1. Project Status: Is it Active (not Paused)?');
    console.log('2. Settings → Database → Connection string');
    console.log('3. Try the "Connection pooling" tab instead of "Direct connection"');
  }
}

testAll();