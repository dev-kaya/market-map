# Deployment Guide

## Database & Cloud Deployment Setup

### Option 1: Vercel + Supabase (Recommended)

#### Step 1: Set up Supabase Database
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to initialize
3. Go to Settings > Database and copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password

#### Step 2: Set up Environment Variables
Create a `.env.local` file:
```bash
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Auth (generate a random string)
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="https://your-app.vercel.app"
```

#### Step 3: Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

#### Step 4: Set up Database Schema
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with initial data
npx prisma db seed
```

### Option 2: Railway (Full-stack)

#### Step 1: Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Railway will automatically detect and deploy your app

#### Step 2: Add PostgreSQL Database
1. In Railway dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Railway will provide DATABASE_URL automatically

#### Step 3: Set Environment Variables
```bash
DATABASE_URL="postgresql://..." # Provided by Railway
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-app.railway.app"
```

### Option 3: Self-hosted with Docker

#### Step 1: Set up Production Environment
```bash
# Copy environment file
cp .env.example .env

# Update with your production values
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/market_map"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

#### Step 2: Deploy with Docker Compose
```bash
# Build and start services
docker-compose up -d

# Run database migrations
docker-compose exec web npx prisma db push
docker-compose exec web npx prisma db seed
```

## Post-Deployment Tasks

### 1. Add Initial Data
- Visit `/admin/companies` to add companies
- Use the web interface or API endpoints
- Import existing company data

### 2. Set up Authentication
- Configure your auth providers
- Set up admin users
- Test the authentication flow

### 3. Monitor and Scale
- Set up monitoring (Vercel Analytics, Railway metrics)
- Monitor database usage
- Scale as needed

## Database Management

### Local Development
```bash
# Start local database
docker-compose up -d db

# Run migrations
npm run db:push

# Seed data
npm run db:seed

# View data
npm run db:studio
```

### Production Management
```bash
# View production data
npx prisma studio --url $DATABASE_URL

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Reset database (BE CAREFUL!)
npm run db:reset
```

## API Endpoints

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create company
- `GET /api/companies/[id]` - Get company details

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category

### Admin Interface
- `/admin/companies` - Add companies via web form

## Environment Variables Reference

```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="https://your-app.com"

# Optional
NODE_ENV="production"
```

## Troubleshooting

### Database Connection Issues
1. Check DATABASE_URL format
2. Verify database is running
3. Check firewall/security groups
4. Test connection: `npx prisma db pull`

### Build Errors
1. Run `npx prisma generate`
2. Check TypeScript errors: `npm run typecheck`
3. Verify environment variables

### Performance Issues
1. Add database indexes
2. Optimize queries
3. Enable database connection pooling
4. Consider caching strategies