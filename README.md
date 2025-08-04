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
4. **Run the SQL setup script** in your Supabase SQL editor:

```sql
-- Copy and paste the contents of setup-database.sql
-- This will create all necessary tables
```

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
- Rate limiting (configurable)

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the API documentation at `/api-docs`
- Review the database schema in `prisma/schema.prisma`
- Test database connection with `pnpm run test:db`
