# Server Storage Usage Guide

This guide explains how to use the server-side storage system for managing user data in your Express.js backend.

## 🚀 Features

- **Encrypted Data Storage**: All data is encrypted using AES-256-CBC
- **Automatic Expiration**: Data can be set to expire automatically
- **Caching**: Fast access with in-memory caching
- **Type-Safe Storage**: Different data types (stores, courses, sessions, etc.)
- **Express.js Integration**: Middleware for easy integration

## 📦 Setup

### 1. Add Middleware to Your App

```javascript
// app.js or server.js
const { attachServerStorage } = require('./src/middleware/serverStorage');

// Add the middleware to your Express app
app.use(attachServerStorage);
```

### 2. Use in Your Routes

```javascript
// Example route with server storage
app.get('/user/profile', auth, (req, res) => {
  // Access user data
  const userStoreIds = req.getUserStoreIds();
  const userCourses = req.getUserCourses();
  const userSession = req.getUserSession();
  
  res.json({
    storeIds: userStoreIds,
    courses: userCourses,
    session: userSession
  });
});
```

## 🔧 Usage Examples

### Basic Usage (Like Your Example)

```javascript
// Save store IDs (like your example)
app.get('/user/stores', auth, (req, res) => {
  const storeIds = res.locals.user.Store.map((store) => store.id);
  
  // Save to server storage
  req.saveUserStoreIds(storeIds);
  
  res.json({ storeIds });
});

// Get store IDs
app.get('/user/stores', auth, (req, res) => {
  const storeIds = req.getUserStoreIds();
  res.json({ storeIds });
});
```

### User Session Management

```javascript
// Save user session data
app.post('/user/login', (req, res) => {
  // After successful login
  req.saveUserSession({
    lastLogin: new Date(),
    loginCount: 1,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip
  });
  
  res.json({ message: 'Login successful' });
});

// Get user session
app.get('/user/session', auth, (req, res) => {
  const session = req.getUserSession();
  res.json({ session: session.data });
});
```

### User Preferences

```javascript
// Save user preferences
app.put('/user/preferences', auth, (req, res) => {
  const { theme, notifications, language } = req.body;
  
  req.saveUserPreferences({
    theme,
    notifications,
    language,
    updatedAt: new Date()
  });
  
  res.json({ message: 'Preferences saved' });
});

// Get user preferences
app.get('/user/preferences', auth, (req, res) => {
  const preferences = req.getUserPreferences();
  res.json({ preferences: preferences.data });
});
```

### Course Management

```javascript
// Save user courses
app.post('/user/courses', auth, (req, res) => {
  const courses = req.body.courses;
  req.saveUserCourses(courses);
  
  res.json({ message: 'Courses saved' });
});

// Get user courses
app.get('/user/courses', auth, (req, res) => {
  const courses = req.getUserCourses();
  res.json({ courses });
});
```

### Progress Tracking

```javascript
// Save user progress
app.put('/user/progress', auth, (req, res) => {
  const { lessonId, completed, watchTime } = req.body;
  
  const currentProgress = req.getUserProgress();
  const updatedProgress = {
    ...currentProgress,
    [lessonId]: {
      completed,
      watchTime,
      updatedAt: new Date()
    }
  };
  
  req.saveUserProgress(updatedProgress);
  
  res.json({ message: 'Progress saved' });
});

// Get user progress
app.get('/user/progress', auth, (req, res) => {
  const progress = req.getUserProgress();
  res.json({ progress });
});
```

## 🔌 Advanced Usage

### Auto-Save Middleware

```javascript
const { autoSaveUserData } = require('./src/middleware/serverStorage');

// Automatically save user data from response
app.get('/user/stores', auth, autoSaveUserData('stores'), (req, res) => {
  // This will automatically save store IDs when response is sent
  res.json({
    user: {
      Store: [
        { id: 1, name: 'Store 1' },
        { id: 2, name: 'Store 2' }
      ]
    }
  });
});
```

### Load Data Middleware

```javascript
const { loadUserData } = require('./src/middleware/serverStorage');

// Load user data into res.locals
app.get('/user/dashboard', auth, loadUserData('courses'), (req, res) => {
  // res.locals.userCourses will contain the user's courses
  res.json({
    courses: res.locals.userCourses,
    // other data...
  });
});
```

### Multiple Data Types

```javascript
app.get('/user/dashboard', 
  auth, 
  loadUserData('courses'),
  loadUserData('progress'),
  loadUserData('preferences'),
  (req, res) => {
    res.json({
      courses: res.locals.userCourses,
      progress: res.locals.userProgress,
      preferences: res.locals.userPreferences
    });
  }
);
```

## 🛠️ Direct Storage Access

```javascript
const { serverStorage } = require('./src/utils/serverStorage');

// Direct access to storage
app.get('/admin/storage-stats', (req, res) => {
  const stats = serverStorage.getStorageStats();
  res.json(stats);
});

// Clean up expired data
app.post('/admin/cleanup', (req, res) => {
  const cleanedCount = serverStorage.cleanupExpiredData();
  res.json({ cleanedCount });
});
```

## 📊 Data Types and Structure

### Store IDs
```javascript
// Save
req.saveUserStoreIds([1, 2, 3, 4]);

// Get
const storeIds = req.getUserStoreIds(); // [1, 2, 3, 4]
```

### User Session
```javascript
// Save
req.saveUserSession({
  lastLogin: new Date(),
  loginCount: 5,
  userAgent: 'Mozilla/5.0...',
  ipAddress: '192.168.1.1'
});

// Get
const session = req.getUserSession();
```

### User Preferences
```javascript
// Save
req.saveUserPreferences({
  theme: 'dark',
  notifications: true,
  language: 'en',
  emailUpdates: false
});

// Get
const preferences = req.getUserPreferences();
```

### User Progress
```javascript
// Save
req.saveUserProgress({
  'lesson-1': {
    completed: true,
    watchTime: 300,
    completedAt: new Date()
  },
  'lesson-2': {
    completed: false,
    watchTime: 150,
    lastAccessed: new Date()
  }
});

// Get
const progress = req.getUserProgress();
```

## 🔒 Security Features

- **Encryption**: All data is encrypted using AES-256-CBC
- **Automatic Expiration**: Session data expires automatically
- **Memory Management**: Automatic cleanup of expired data
- **Error Handling**: Graceful error handling for all operations

## 📝 Best Practices

1. **Use Type-Specific Functions**: Use `saveUserStoreIds()` instead of generic `saveUserData()`
2. **Handle Errors**: Always check the `success` property of returned objects
3. **Clean Up**: Use expiration times for temporary data
4. **Cache Wisely**: The system automatically caches frequently accessed data
5. **Validate Data**: Validate data before saving

## 🚨 Error Handling

```javascript
// Always check for success
const result = req.saveUserStoreIds(storeIds);
if (!result.success) {
  console.error('Failed to save store IDs:', result.error);
  return res.status(500).json({ error: 'Failed to save data' });
}

// Handle missing data gracefully
const storeIds = req.getUserStoreIds();
if (storeIds.length === 0) {
  // Handle empty data
  return res.json({ storeIds: [], message: 'No stores found' });
}
```

## 🔄 Migration from Your Current Code

### Before (Your Example)
```javascript
const storeIds = res.locals.user.Store.map((store) => store.id);
```

### After (With Server Storage)
```javascript
// Save the data
const storeIds = res.locals.user.Store.map((store) => store.id);
req.saveUserStoreIds(storeIds);

// Later, retrieve the data
const savedStoreIds = req.getUserStoreIds();
```

This provides persistent storage that survives server restarts and can be accessed across different requests! 