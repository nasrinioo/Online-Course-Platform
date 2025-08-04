# API Endpoints Documentation

All backend endpoints are organized under the `/api` prefix.

## 🔗 Base URL
```
http://localhost:3000/api
```

## 📋 Available Endpoints

### 🔐 Authentication (`/api/auth`)

#### Public Routes (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | User registration |
| `POST` | `/api/auth/login` | User login |

#### Protected Routes (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/profile` | Get user profile |
| `PUT` | `/api/auth/profile` | Update user profile |
| `PUT` | `/api/auth/avatar` | Upload user avatar |
| `PUT` | `/api/auth/change-password` | Change password |
| `GET` | `/api/auth/stats` | Get user statistics |
| `PUT` | `/api/auth/preferences` | Update user preferences |

#### Admin Routes (Admin Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/auth/verify-email/:userId` | Verify user email |
| `PUT` | `/api/auth/toggle-status/:userId` | Toggle account status |

### 👥 Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users (Admin) |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user (Admin) |
| `GET` | `/api/users/search` | Search users |
| `GET` | `/api/users/stats` | Get user statistics |

### 📚 Courses (`/api/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | Get all courses |
| `POST` | `/api/courses` | Create course (Instructor) |
| `GET` | `/api/courses/:id` | Get course by ID |
| `PUT` | `/api/courses/:id` | Update course (Instructor) |
| `DELETE` | `/api/courses/:id` | Delete course (Instructor) |
| `GET` | `/api/courses/featured` | Get featured courses |
| `GET` | `/api/courses/search` | Search courses |
| `GET` | `/api/courses/categories` | Get course categories |

### 📖 Lessons (`/api/lessons`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lessons` | Get all lessons |
| `POST` | `/api/lessons` | Create lesson (Instructor) |
| `GET` | `/api/lessons/:id` | Get lesson by ID |
| `PUT` | `/api/lessons/:id` | Update lesson (Instructor) |
| `DELETE` | `/api/lessons/:id` | Delete lesson (Instructor) |

### 🎓 Enrollments (`/api/enrollments`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/enrollments` | Get user enrollments |
| `POST` | `/api/enrollments` | Enroll in course |
| `GET` | `/api/enrollments/:id` | Get enrollment by ID |
| `PUT` | `/api/enrollments/:id` | Update enrollment |
| `DELETE` | `/api/enrollments/:id` | Cancel enrollment |

### 📊 Progress (`/api/progress`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/progress` | Get user progress |
| `POST` | `/api/progress` | Update lesson progress |
| `GET` | `/api/progress/:lessonId` | Get lesson progress |
| `PUT` | `/api/progress/:lessonId` | Update lesson progress |

### 🏷️ Categories (`/api/categories`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Create category (Admin) |
| `GET` | `/api/categories/:id` | Get category by ID |
| `PUT` | `/api/categories/:id` | Update category (Admin) |
| `DELETE` | `/api/categories/:id` | Delete category (Admin) |

### ⭐ Reviews (`/api/reviews`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | Get course reviews |
| `POST` | `/api/reviews` | Create review |
| `GET` | `/api/reviews/:id` | Get review by ID |
| `PUT` | `/api/reviews/:id` | Update review |
| `DELETE` | `/api/reviews/:id` | Delete review |

### 💳 Payments (`/api/payments`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/payments` | Get user payments |
| `POST` | `/api/payments` | Create payment |
| `GET` | `/api/payments/:id` | Get payment by ID |
| `PUT` | `/api/payments/:id` | Update payment status |

### 🔔 Notifications (`/api/notifications`) - Coming Soon

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get user notifications |
| `POST` | `/api/notifications` | Create notification |
| `GET` | `/api/notifications/:id` | Get notification by ID |
| `PUT` | `/api/notifications/:id` | Mark as read |

## 🔧 System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/healthz` | Health check |
| `GET` | `/api/docs` | API documentation |

## 📝 Request Examples

### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Upload Avatar
```bash
curl -X PUT http://localhost:3000/api/auth/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@avatar.jpg"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "bio": "Software developer"
  }'
```

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation error |
| `500` | Internal Server Error |

## 🔄 Pagination

For endpoints that return lists, use query parameters:

```
GET /api/courses?page=1&limit=10&sort=createdAt&order=desc
```

## 🔍 Search

For search endpoints, use query parameters:

```
GET /api/courses/search?q=javascript&category=programming&difficulty=beginner
```

## 📈 Rate Limiting

API requests are rate-limited to prevent abuse:
- **Public endpoints**: 100 requests per hour
- **Protected endpoints**: 1000 requests per hour
- **Admin endpoints**: 500 requests per hour 