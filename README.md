# Market Map - Interactive Sector Explorer

A production-grade Market Map application built with Next.js 14, React 18, and Fastify. Features an interactive quadrant-style grid for exploring companies within sectors, with real-time search, faceted filtering, and comprehensive admin capabilities.

## Features

- **Interactive Market Map**: Quadrant-style grid visualization with zoom and pan capabilities
- **Real-time Search**: Instant company and sector search with debounced input
- **Advanced Filtering**: Multi-faceted filtering by stage, geography, and category
- **Freemium Access**: Fog-until-signup gating with first row visible to anonymous users
- **Community Suggestions**: Ultra-simple startup suggestion flow with rate limiting
- **Responsive Design**: Mobile-first approach with WCAG 2.2 AA compliance
- **Admin Panel**: Full CRUD operations for companies and categories
- **Performance Optimized**: < 2s FCP, < 4s TTI on 4G networks
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testing**: Comprehensive unit and E2E test coverage

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router, RSC, Streaming)
- **UI Library**: React 18 with TypeScript strict mode
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Validation**: Zod for runtime type checking

### Backend
- **API**: Fastify 4 with OpenAPI/Swagger documentation
- **Database**: PostgreSQL 15 with Prisma ORM
- **Validation**: Zod schema validation
- **Documentation**: Auto-generated OpenAPI specs

### DevOps
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions with automated testing
- **Code Quality**: ESLint (Airbnb) + Prettier + Husky
- **Testing**: Vitest (unit) + Playwright (E2E)

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker (optional)

### One-Command Setup
```bash
git clone <repository-url>
cd market-map
cp .env.example .env.local
make bootstrap
make dev
```

### Manual Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/market_map"

# Next.js
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External APIs
CLEARBIT_API_KEY="your-clearbit-api-key"

# Public access limits
PUBLIC_COMPANY_LIMIT=4
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # Run TypeScript checks
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

### Database
```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
```

### Server
```bash
npm run server:dev   # Start Fastify server in development
npm run server:build # Build and start Fastify server
```

## Docker Deployment

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t market-map .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@localhost:5432/market_map" \
  market-map
```

## API Documentation

The API documentation is automatically generated and available at:
- **Development**: http://localhost:3001/docs
- **Production**: https://your-domain.com/api/docs

### Key Endpoints

#### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

#### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Suggestions
- `POST /api/suggest` - Submit startup suggestion (rate limited: 5/hour)
- `GET /api/admin/suggestions` - List all suggestions (admin)
- `DELETE /api/admin/suggestions/:id` - Delete suggestion (admin)

## Freemium Access Model

The application implements a "fog-until-signup" gating system:

### For Anonymous Users
- **Limited Data**: Only the first row of companies is visible (controlled by `PUBLIC_COMPANY_LIMIT`)
- **Visual Gating**: Content below the first row is blurred with a gradient overlay and signup CTA
- **API Behavior**: `GET /api/companies` returns truncated results with `X-Data-Truncated: true` header

### For Authenticated Users
- **Full Access**: All companies and features are unlocked
- **Complete API**: `GET /api/companies` returns full dataset with `X-Data-Truncated: false` header
- **Enhanced Features**: Access to detailed company pages, CSV exports, and admin functions

### Configuration
```env
PUBLIC_COMPANY_LIMIT=4  # Number of companies visible to anonymous users
```

The limit is enforced both on the API level and frontend to ensure consistency. Authentication is handled through Google OAuth or magic link email authentication.

## Project Structure

```
market-map/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin panel
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── MarketMap.tsx     # Main market map component
│   │   ├── CompanyCard.tsx   # Company card component
│   │   └── Filters.tsx       # Filter components
│   ├── lib/                  # Utility functions
│   ├── server/               # Fastify server
│   │   ├── routes/          # API routes
│   │   └── db.ts            # Database connection
│   └── types/               # TypeScript types
├── prisma/                   # Database schema and migrations
├── tests/                    # Test files
│   ├── unit/                # Unit tests
│   └── e2e/                 # End-to-end tests
├── .github/workflows/        # CI/CD configuration
└── docker-compose.yml       # Docker configuration
```

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: TanStack Query with intelligent cache invalidation
- **Bundle Analysis**: Webpack Bundle Analyzer integration
- **CDN Ready**: Optimized for static asset delivery

## Testing Strategy

### Unit Tests (Vitest)
- Component testing with React Testing Library
- Utility function testing
- API endpoint testing

### E2E Tests (Playwright)
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device testing
- Accessibility testing
- Performance testing

### Test Coverage
- Minimum 80% code coverage
- Critical path testing
- Edge case validation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Workflow
1. All commits must pass pre-commit hooks (lint, type check)
2. Tests must pass in CI/CD pipeline
3. Code review required for all PRs
4. Semantic versioning for releases

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- Create an issue for bug reports
- Discussion forum for questions
- Email support@marketmap.com for enterprise inquiries