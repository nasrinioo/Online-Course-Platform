# Online Course Platform

A modern online course platform built with Express.js, Prisma, PostgreSQL (Supabase), Redis, and JWT authentication.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- pnpm (recommended) or npm
- Redis (for caching)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Online-Course-Platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Generate Prisma client**
   ```bash
   pnpm run build
   ```

5. **Test database connection**
   ```bash
   pnpm run test:db
   ```

6. **Start the development server**
   ```bash
   pnpm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration - Supabase PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# CORS Configuration
CORS_ORIGIN=*

# Rate limiting (optional — defaults shown)
# Global API limiter applies to routes under /api after /healthz and /docs
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
# Stricter limit for POST /api/auth/login and /api/auth/signup
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=20

# Encryption
ENCRYPTION_SECRET=your_super_secret_encryption_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your connection string** from the Database settings
3. **Update your `.env` file** with the connection details
4. **Apply the database schema** using Prisma Migrate (recommended):

   ```bash
   pnpm run migrate
   ```

   For production or CI, use:

   ```bash
   pnpm run db:deploy
   ```

   Alternatively, you can run legacy SQL from `setup-database.sql` in the Supabase SQL editor if you are not using migrations.

## 📊 Database Schema

The platform includes the following main entities:

- **Users** - Students, Instructors, and Admins
- **Courses** - Course information and metadata
- **Lessons** - Individual lessons within courses
- **Enrollments** - Student course enrollments
- **Lesson Progress** - Student progress tracking
- **Trending Courses** - Popular course analytics

## 🛠️ Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run start        # Start production server

# Database
pnpm run build        # Generate Prisma client
pnpm run migrate      # Run database migrations
pnpm run db:push      # Push schema to database
pnpm run studio       # Open Prisma Studio
pnpm run test:db      # Test database connection

# Other
pnpm run test         # Run tests
```

## 🔗 API Endpoints

- **Health Check**: `GET /health`
- **API Documentation**: `GET /api-docs`
- **Authentication**: `POST /auth/login`, `POST /auth/register`
- **Courses**: `GET /courses`, `POST /courses`, etc.
- **Users**: `GET /users`, `POST /users`, etc.

## 🏗️ Architecture

- **Express.js** - Web framework
- **Prisma** - Database ORM
- **Supabase** - PostgreSQL database
- **Redis** - Caching layer
- **JWT** - Authentication
- **Swagger** - API documentation

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Rate limiting: global limiter on `/api` routes (see `RATE_LIMIT_*` env vars) and a stricter limiter on `POST /api/auth/login` and `POST /api/auth/signup` (`AUTH_RATE_LIMIT_*`)

## 🚀 Deployment

### Local Development

```bash
# Install Redis (if not already installed)
# macOS: brew install redis
# Ubuntu: sudo apt-get install redis-server

# Start Redis
redis-server

# Start the application
pnpm run dev
```

### Production

1. **Set up environment variables** for production
2. **Install dependencies**: `pnpm install --prod`
3. **Generate Prisma client**: `pnpm run build`
4. **Run migrations**: `pnpm run migrate`
5. **Start the server**: `pnpm run start`

## 📝 Testing

```bash
# Test database connection
pnpm run test:db

# Run tests (when implemented)
pnpm run test
```
