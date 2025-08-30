# StoryVerse Backend

A NestJS-based backend for the StoryVerse interactive story platform, implementing a microservices architecture with PostgreSQL, MongoDB, and Redis.

## Features

- **Microservices Architecture**: Modular design with separate services for users, stories, gameplay, inventory, and payments
- **Dual Database Strategy**: PostgreSQL for structured data, MongoDB for flexible story content
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Key-based Gameplay**: Free-to-play model with regenerating keys and premium diamond currency
- **Real-time Progress Tracking**: Save and restore player progress across devices
- **Payment Integration**: Ready for integration with App Store, Google Play, and web payment providers
- **Rate Limiting**: Built-in protection against abuse
- **Caching**: Redis integration for improved performance

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Databases**: PostgreSQL, MongoDB, Redis
- **Authentication**: JWT with refresh tokens
- **Validation**: Class-validator with DTOs
- **ORM**: TypeORM (PostgreSQL), Mongoose (MongoDB)
- **Package Manager**: pnpm

## Architecture

### Services

1. **User Service** - User management and authentication
2. **Story Service** - Story catalog and metadata
3. **Gameplay Service** - Interactive gameplay logic and progress tracking
4. **Inventory Service** - User currency and key management
5. **Payment Service** - In-app purchase handling

### Databases

- **PostgreSQL**: Users, user inventory, story metadata, chapters
- **MongoDB**: Story content, player progress
- **Redis**: Caching and session management

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- MongoDB
- Redis
- pnpm

### Installation

1. **Clone and navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start databases** (using Docker):
   ```bash
   # PostgreSQL
   docker run --name storyverse-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=storyverse -p 5432:5432 -d postgres:15

   # MongoDB
   docker run --name storyverse-mongo -p 27017:27017 -d mongo:6

   # Redis
   docker run --name storyverse-redis -p 6379:6379 -d redis:7
   ```

5. **Run the application**:
   ```bash
   # Development
   pnpm run start:dev

   # Production
   pnpm run build
   pnpm run start:prod
   ```

The API will be available at `http://localhost:3000/api/v1`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token

### Users
- `GET /api/v1/users/me` - Get user profile

### Stories
- `GET /api/v1/stories` - List published stories
- `GET /api/v1/stories/genres` - Get available genres
- `GET /api/v1/stories/:id` - Get story details
- `GET /api/v1/stories/:id/chapters` - Get story chapters

### Gameplay
- `POST /api/v1/gameplay/start-chapter` - Start playing a chapter
- `POST /api/v1/gameplay/make-choice` - Make a story choice
- `GET /api/v1/gameplay/progress/:storyId` - Get player progress
- `POST /api/v1/gameplay/save-progress` - Save player progress
- `GET /api/v1/gameplay/current-scene/:storyId` - Get current scene

### Inventory
- `GET /api/v1/inventory` - Get user inventory (keys, diamonds)

### Payment
- `GET /api/v1/payment/products` - Get available products
- `POST /api/v1/payment/purchase` - Process purchase

## Game Economy

### Keys System
- Players start with 5 keys
- 1 key consumed per chapter
- Keys regenerate every 30 minutes (configurable)
- Maximum 5 keys at once

### Diamond System
- Premium currency purchased with real money
- Used for special choices, outfits, and premium content
- Available purchase tiers: 100, 500, 1000, 2500, 5000 diamonds

## Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation with class-validator
- CORS protection
- Environment-based configuration

## Development

### Running Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Code Quality

```bash
# Linting
pnpm run lint

# Formatting
pnpm run format
```

## License

Private - StoryVerse Platform
