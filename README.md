# CEE Market Map

Interactive visualization of leading tech companies in Central and Eastern Europe.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (for database)

### Setup

1. **Clone and install**:
```bash
git clone https://github.com/dev-kaya/market-map.git
cd market-map
npm install
```

2. **Configure database**:
   - Create a Supabase project at https://supabase.com
   - Copy your connection string from Settings → Database
   - Update `.env.local`:
```bash
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Set up database tables**:
   - Go to your Supabase SQL Editor
   - Run the SQL from the deployment guide to create tables

4. **Start development**:
```bash
npm run dev
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Deployment**: Vercel

## 🔧 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run typecheck    # Check TypeScript
npm run lint         # Run linting
```

## 📊 Database

The app uses PostgreSQL with these main tables:
- `companies` - Company information and metrics
- `categories` - Industry categories
- `investors` - VC/PE firm data
- `company_investors` - Investment relationships

## 🚀 Deployment

1. **Deploy to Vercel**:
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

2. **Environment variables needed**:
   - `DATABASE_URL` - Your Supabase connection string
   - `NEXTAUTH_SECRET` - Random secret for auth
   - `NEXTAUTH_URL` - Your deployed URL

## 📝 Adding Companies

Visit `/admin/companies` to add new companies through the web interface.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License