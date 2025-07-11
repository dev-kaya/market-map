.PHONY: dev build test clean install docker-up docker-down

# Development
dev:
	npm run dev

# Build
build:
	npm run build

# Test
test:
	npm run test

test-e2e:
	npm run test:e2e

# Clean
clean:
	rm -rf node_modules .next

# Install dependencies
install:
	npm install

# Database
db-setup:
	npx prisma generate
	npx prisma db push
	npx prisma db seed

db-reset:
	npx prisma migrate reset --force
	npx prisma db seed

# Docker
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Lint and format
lint:
	npm run lint

lint-fix:
	npm run lint:fix

# Type check
typecheck:
	npm run typecheck

# One-command bootstrap
bootstrap: install db-setup
	@echo "🚀 Project bootstrapped successfully!"
	@echo "Run 'make dev' to start the development server"