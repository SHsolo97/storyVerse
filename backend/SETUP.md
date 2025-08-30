# StoryVerse Backend Setup Guide

## Prerequisites

1. **Node.js** (v18+) - ✅ Installed
2. **pnpm** - ✅ Installed  
3. **Docker Desktop** - ⚠️ Not running (required for databases)
4. **PostgreSQL** (via Docker or local installation)
5. **MongoDB** (via Docker or local installation)
6. **Redis** (via Docker or local installation)

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Databases (Docker)
```bash
# Start Docker Desktop first, then run:
docker-compose up -d

# This will start:
# - PostgreSQL on port 5432
# - MongoDB on port 27017  
# - Redis on port 6379
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Update .env with your database credentials if needed
```

### 4. Run the Application
```bash
# Development mode
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod
```

## Database Setup

### Option 1: Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Local Installation
If you prefer local installations:

**PostgreSQL:**
```bash
# Create database
createdb storyverse_dev
createdb storyverse_test
```

**MongoDB:**
```bash
# Start MongoDB service
mongod --dbpath /path/to/data
```

**Redis:**
```bash
# Start Redis server
redis-server
```

## API Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Authentication
```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Stories
```bash
# Get all stories (requires authentication)
curl -X GET http://localhost:3000/stories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get user's stories
curl -X GET http://localhost:3000/stories/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development Commands

```bash
# Start in watch mode
pnpm run start:dev

# Run tests
pnpm test

# Run e2e tests
pnpm run test:e2e

# Lint code
pnpm run lint

# Format code
pnpm run format

# Build for production
pnpm run build
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── config/         # Configuration files
├── database/       # Database configurations
├── dto/           # Data Transfer Objects
├── entities/      # PostgreSQL entities
├── gameplay/      # Gameplay logic module
├── guards/        # Authentication guards
├── inventory/     # User inventory module
├── payment/       # Payment processing module
├── schemas/       # MongoDB schemas
├── story/         # Story management module
├── user/          # User management module
└── main.ts        # Application entry point
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

## Environment Variables

Key environment variables in `.env`:

```bash
# Application
NODE_ENV=development
PORT=3000

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=storyverse_dev

# MongoDB
MONGODB_URI=mongodb://localhost:27017/storyverse

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

## Troubleshooting

### Common Issues

1. **Docker not running**
   ```bash
   # Start Docker Desktop first
   docker-compose up -d
   ```

2. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -ano | findstr :3000
   netstat -ano | findstr :5432
   ```

3. **Database connection issues**
   - Verify databases are running: `docker-compose ps`
   - Check connection strings in `.env`
   - Ensure firewall isn't blocking ports

4. **Build errors**
   ```bash
   # Clean install
   rm -rf node_modules
   pnpm install
   pnpm run build
   ```

## Next Steps

1. Start Docker Desktop
2. Run `docker-compose up -d` to start databases
3. Run `pnpm run start:dev` to start the application
4. Test the API endpoints using the examples above
5. Check the Swagger documentation at `http://localhost:3000/api`

## Production Deployment

For production deployment:

1. Build the Docker image:
   ```bash
   docker build -t storyverse-backend .
   ```

2. Run with production environment:
   ```bash
   docker run -p 3000:3000 --env-file .env.production storyverse-backend
   ```

3. Use the provided `docker-compose.prod.yml` for full production setup.
