# Using res.locals.user for User Data

This guide shows how to use `res.locals.user` to access user data throughout your application.

## 🎯 Overview

After login, user data is automatically saved in `res.locals.user` and can be accessed in any route handler.

## 📋 User Data Structure

```javascript
res.locals.user = {
  id: "user_id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "STUDENT",
  avatar: "https://cloudinary.com/avatar.jpg",
  bio: "Software developer",
  isActive: true,
  emailVerified: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🔧 How to Access User Data

### **1. Get User ID**
```javascript
// In any route handler
const userId = res.locals.user.id;
console.log('User ID:', userId);
```

### **2. Get User Name**
```javascript
const firstName = res.locals.user.firstName;
const lastName = res.locals.user.lastName;
const fullName = `${firstName} ${lastName}`;
```

### **3. Get User Role**
```javascript
const userRole = res.locals.user.role;
if (userRole === 'ADMIN') {
  // Admin specific logic
}
```

### **4. Check User Status**
```javascript
const isActive = res.locals.user.isActive;
const hasAvatar = !!res.locals.user.avatar;
const hasBio = !!res.locals.user.bio;
```

## 🚀 Usage Examples

### **Example 1: Simple User ID Access**
```javascript
exports.someFunction = async (req, res) => {
  try {
    const userId = res.locals.user.id;
    
    // Use userId for database operations
    const userData = await SomeService.getData(userId);
    
    res.json({ data: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **Example 2: Role-Based Logic**
```javascript
exports.adminOnlyFunction = async (req, res) => {
  try {
    const userRole = res.locals.user.role;
    
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Admin logic here
    res.json({ message: 'Admin action completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **Example 3: User Profile Check**
```javascript
exports.checkUserProfile = async (req, res) => {
  try {
    const user = res.locals.user;
    
    const profileStatus = {
      hasAvatar: !!user.avatar,
      hasBio: !!user.bio,
      isEmailVerified: !!user.emailVerified,
      isActive: user.isActive,
      profileComplete: !!(user.avatar && user.bio)
    };
    
    res.json({ profileStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 🔄 Fallback Pattern

The system uses a fallback pattern to get user ID:

```javascript
// Priority order for getting user ID
const userId = res.locals?.user?.id || req.user?.id || req.body?.userId || req.params?.userId;
```

## 📝 Route Handler Examples

### **Protected Route with User Data**
```javascript
// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;
    
    console.log(`User ${userId} (${userRole}) accessed profile`);
    
    // Your logic here
    res.json({ user: res.locals.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **Avatar Upload with User Context**
```javascript
// PUT /api/auth/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const currentAvatar = res.locals.user.avatar;
    
    console.log(`User ${userId} uploading new avatar`);
    console.log(`Previous avatar: ${currentAvatar}`);
    
    // Upload logic here
    res.json({ message: 'Avatar uploaded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 🛡️ Security Benefits

1. **Automatic Loading**: User data is loaded automatically by auth middleware
2. **Consistent Access**: Same pattern across all routes
3. **Type Safety**: User data structure is consistent
4. **Performance**: No need to query database again for basic user info

## ⚠️ Important Notes

1. **Always Available**: `res.locals.user` is available in all authenticated routes
2. **Fresh Data**: Data is loaded fresh from database on each request
3. **Immutable**: Don't modify `res.locals.user` directly
4. **Fallback**: Always check if user data exists before using

## 🧪 Testing

```javascript
// Test script to verify res.locals.user
const testUserData = async () => {
  try {
    // Login first
    const loginResponse = await axios.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'Password123'
    });
    
    const token = loginResponse.data.token;
    
    // Access protected route
    const profileResponse = await axios.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('User data in response:', profileResponse.data.user);
    console.log('User ID from locals:', profileResponse.data.user.id);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data);
  }
};
```

Now you can use `const userId = res.locals.user.id;` anywhere in your route handlers! 🎉 