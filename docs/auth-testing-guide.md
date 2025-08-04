# Auth API Testing Guide

This guide covers testing the updated Auth API with separate avatar upload functionality.

## 🔄 Changes Made

### **Before:**
- Avatar and bio included in signup
- Avatar upload combined with profile update

### **After:**
- ✅ **Signup**: Only basic info (email, password, firstName, lastName, role)
- ✅ **Avatar**: Separate upload endpoint
- ✅ **Bio**: Can be added later via profile update
- ✅ **Remove Avatar**: New endpoint to remove avatar

## 📋 API Endpoints

### **Public Routes (No Authentication)**

#### **1. User Registration**
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "avatar": null,
    "bio": null,
    "isActive": true,
    "emailVerified": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### **2. User Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "avatar": null,
    "bio": null,
    "isActive": true,
    "emailVerified": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### **Protected Routes (Authentication Required)**

#### **3. Get User Profile**
```bash
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "avatar": null,
    "bio": null,
    "isActive": true,
    "emailVerified": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "session": {
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "loginCount": 1
  },
  "preferences": {
    "theme": "light",
    "notifications": true,
    "language": "en"
  },
  "progress": {},
  "courses": []
}
```

#### **4. Update User Profile (No Avatar)**
```bash
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Software developer with 5 years of experience"
}
```

**Expected Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "STUDENT",
    "avatar": null,
    "bio": "Software developer with 5 years of experience",
    "isActive": true,
    "emailVerified": null,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **5. Upload Avatar (Separate Endpoint)**
```bash
PUT /api/auth/avatar
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- image: [Select file]
```

**Expected Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "STUDENT",
    "avatar": "https://res.cloudinary.com/dxdlnlcpp/image/upload/v123/avatar.jpg",
    "bio": "Software developer with 5 years of experience",
    "isActive": true,
    "emailVerified": null,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "avatar": {
    "url": "https://res.cloudinary.com/dxdlnlcpp/image/upload/v123/avatar.jpg",
    "public_id": "online-course-platform/avatar",
    "originalname": "profile.jpg",
    "mimetype": "image/jpeg",
    "size": 123456
  }
}
```

#### **6. Remove Avatar**
```bash
DELETE /api/auth/avatar
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "message": "Avatar removed successfully",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "STUDENT",
    "avatar": null,
    "bio": "Software developer with 5 years of experience",
    "isActive": true,
    "emailVerified": null,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **7. Change Password**
```bash
PUT /api/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

**Expected Response:**
```json
{
  "message": "Password updated successfully"
}
```

#### **8. Get User Statistics**
```bash
GET /api/auth/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "stats": {
    "totalCourses": 0,
    "totalEnrollments": 0,
    "completedLessons": 0,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "loginCount": 1,
    "preferences": {
      "theme": "light",
      "notifications": true,
      "language": "en"
    }
  }
}
```

#### **9. Update User Preferences**
```bash
PUT /api/auth/preferences
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "theme": "dark",
  "notifications": true,
  "language": "en",
  "emailUpdates": false
}
```

**Expected Response:**
```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en",
    "emailUpdates": false,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🧪 Testing Scenarios

### **Scenario 1: Complete User Flow**
1. **Register** new user (no avatar/bio)
2. **Login** with credentials
3. **Get profile** (should show null avatar/bio)
4. **Update profile** with bio
5. **Upload avatar** (separate request)
6. **Get profile** (should show avatar and bio)
7. **Remove avatar** (separate request)
8. **Get profile** (should show null avatar)

### **Scenario 2: Error Testing**
1. **Invalid signup** (missing fields, invalid email)
2. **Invalid login** (wrong credentials)
3. **Protected endpoint without token**
4. **Upload invalid file** (non-image)
5. **Upload large file** (>5MB)

### **Scenario 3: Avatar Management**
1. **Upload avatar** → Should return Cloudinary URL
2. **Upload new avatar** → Should replace old one
3. **Remove avatar** → Should set to null
4. **Upload after removal** → Should work normally

## 📝 Postman Collection

### **Environment Variables:**
```
baseUrl: http://localhost:3000/api
authToken: (auto-set after login)
userId: (auto-set after login)
```

### **Test Scripts:**

#### **Login Test Script (Auto-save token):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set('authToken', response.token);
        pm.environment.set('userId', response.user.id);
        console.log('Token saved:', response.token);
    }
}
```

#### **Avatar Upload Test:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.avatar && response.avatar.url) {
        console.log('Avatar uploaded:', response.avatar.url);
    }
}
```

## 🔍 Validation Examples

### **Valid Signup:**
```json
{
  "email": "test@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

### **Invalid Signup (Missing Fields):**
```json
{
  "email": "invalid-email",
  "password": "123",
  "firstName": "",
  "lastName": ""
}
```

### **Valid Profile Update:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Software developer"
}
```

## 🚨 Common Issues

### **1. Avatar Upload Fails**
- Check file size (<5MB)
- Check file type (jpg, png, gif, webp)
- Verify Cloudinary credentials in `.env`

### **2. Token Issues**
- Token expires after 7 days
- Re-login to get fresh token
- Check Authorization header format

### **3. Profile Update Fails**
- Avatar cannot be updated via profile endpoint
- Use separate `/avatar` endpoint for avatar
- Bio can be updated via profile endpoint

## ✅ Success Checklist

- [ ] User can register without avatar/bio
- [ ] User can login and get token
- [ ] User can view profile with null avatar/bio
- [ ] User can update profile with bio
- [ ] User can upload avatar separately
- [ ] User can remove avatar
- [ ] User can change password
- [ ] User can update preferences
- [ ] User can view statistics
- [ ] All error cases work correctly

Your auth system now has clean separation of concerns with dedicated avatar management! 🎉 