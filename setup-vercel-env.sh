#!/bin/bash

# Setup Vercel environment variables
echo "Setting up Vercel environment variables..."

# Database URL
echo "postgresql://postgres.bxiqugtqobtqoounuwtn:wb18PQj0LgbcCayr@aws-0-eu-west-2.pooler.supabase.com:6543/postgres" | npx vercel env add DATABASE_URL production

# Direct URL for migrations
echo "postgresql://postgres.bxiqugtqobtqoounuwtn:wb18PQj0LgbcCayr@aws-0-eu-west-2.pooler.supabase.com:6543/postgres" | npx vercel env add DIRECT_URL production

# NextAuth Secret
echo "wb18PQj0LgbcCayr" | npx vercel env add NEXTAUTH_SECRET production

# NextAuth URL (we'll update this after deployment)
echo "https://market-map.vercel.app" | npx vercel env add NEXTAUTH_URL production

echo "Environment variables configured!"
echo "Now deploying..."

# Deploy again
npx vercel --prod