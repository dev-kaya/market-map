-- Create all tables manually for Supabase
-- Run this in Supabase SQL Editor

-- Categories table
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

CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name");

-- Companies table
CREATE TABLE IF NOT EXISTS "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'SEED',
    "country" TEXT,
    "city" TEXT,
    "geography" TEXT,
    "fundingToDate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastRoundDate" TIMESTAMP(3),
    "lastRoundSize" DOUBLE PRECISION,
    "employeeCount" INTEGER,
    "foundedYear" INTEGER,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- Investors table
CREATE TABLE IF NOT EXISTS "investors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "type" TEXT NOT NULL DEFAULT 'VC',
    "tier" TEXT NOT NULL DEFAULT 'MID_TIER',
    "focus" TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "investors_name_key" ON "investors"("name");

-- Company Investors junction table
CREATE TABLE IF NOT EXISTS "company_investors" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "roundDate" TIMESTAMP(3),
    "roundSize" DOUBLE PRECISION,
    "roundType" TEXT,
    "leadInvestor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "company_investors_pkey" PRIMARY KEY ("id")
);

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Endorsements table
CREATE TABLE IF NOT EXISTS "endorsements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "endorsements_pkey" PRIMARY KEY ("id")
);

-- Suggestions table
CREATE TABLE IF NOT EXISTS "suggestions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "suggestions_name_key" ON "suggestions"("name");

-- Add foreign key constraints
ALTER TABLE "companies" ADD CONSTRAINT "companies_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "company_investors" ADD CONSTRAINT "company_investors_companyId_fkey" 
    FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "company_investors" ADD CONSTRAINT "company_investors_investorId_fkey" 
    FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_companyId_fkey" 
    FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraints
ALTER TABLE "company_investors" ADD CONSTRAINT "company_investors_companyId_investorId_roundDate_key" 
    UNIQUE ("companyId", "investorId", "roundDate");

ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_userId_companyId_key" 
    UNIQUE ("userId", "companyId");

-- Add indexes
CREATE INDEX IF NOT EXISTS "endorsements_companyId_idx" ON "endorsements"("companyId");

-- Insert sample data
INSERT INTO "categories" ("id", "name", "description", "color", "positionX", "positionY") VALUES
('cat_fintech', 'Fintech', 'Financial technology companies', '#10B981', 100, 100),
('cat_enterprise', 'Enterprise Software', 'B2B software solutions', '#3B82F6', 300, 150),
('cat_ecommerce', 'E-commerce', 'Online retail and marketplace companies', '#F59E0B', 200, 300),
('cat_healthtech', 'Health Tech', 'Healthcare technology companies', '#EF4444', 400, 200)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "investors" ("id", "name", "logoUrl", "website", "type", "tier", "focus") VALUES
('inv_kaya', 'Kaya VC', 'https://media.licdn.com/dms/image/v2/C4D0BAQFf9R3vY0o6KQ/company-logo_200_200/company-logo_200_200/0/1630517672097/kayavc_logo?e=2147483647&v=beta&t=WlLBec6KzrhnB9XwHjUDs2_ydtDfkg9r2Fji4vND8aM', 'https://www.kaya.vc', 'VC', 'MID_TIER', '{"Fintech", "Enterprise Software"}'),
('inv_a16z', 'Andreessen Horowitz', 'https://i.nextmedia.com.au/News/a16z.png', 'https://a16z.com', 'VC', 'TOP_TIER', '{"Enterprise Software", "Fintech", "Health Tech"}')
ON CONFLICT ("name") DO NOTHING;