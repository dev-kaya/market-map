const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function migrateSchema() {
  try {
    console.log('🚀 Starting schema migration...');
    
    // Create categories table first
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "color" TEXT NOT NULL DEFAULT '#3B82F6',
        "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
      );
    `;
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name");
    `;
    
    console.log('✅ Categories table created');
    
    // Test insert
    const testCategory = await prisma.$executeRaw`
      INSERT INTO "categories" ("id", "name", "description") 
      VALUES ('test', 'Test Category', 'Test description')
      ON CONFLICT ("name") DO NOTHING;
    `;
    
    console.log('✅ Test data inserted');
    
    // Clean up test data
    await prisma.$executeRaw`DELETE FROM "categories" WHERE "id" = 'test';`;
    
    console.log('🎉 Schema migration successful! Your Supabase database is ready.');
    console.log('Run: npx prisma db push (to create all tables)');
    console.log('Then: npx prisma db seed (to add sample data)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrateSchema();