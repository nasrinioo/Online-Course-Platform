# Image Upload with Cloudinary

This document describes the image upload functionality integrated with Cloudinary for the Online Course Platform.

## 🚀 Features

- **Avatar Upload**: Profile picture upload for users
- **Image Optimization**: Automatic resizing and compression
- **Secure Storage**: Images stored securely on Cloudinary
- **Multiple Formats**: Support for JPG, JPEG, PNG, GIF, WEBP
- **File Size Limits**: 5MB maximum file size
- **Automatic Cleanup**: Old avatars are deleted when replaced

## 📦 Dependencies

```bash
pnpm add multer multer-storage-cloudinary cloudinary
pnpm add -D @types/multer
```

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Add them to your environment variables

## 📁 File Structure

```
src/
├── utils/
│   └── cloudinary.js          # Cloudinary configuration and utilities
├── middleware/
│   └── upload.js              # Upload middleware
└── modules/Auth/
    ├── auth.service.js        # Auth service with image handling
    ├── auth.controller.js     # Controllers with upload endpoints
    └── auth.routes.js         # Routes with upload middleware
```

## 🔌 API Endpoints

### Upload Avatar

**PUT** `/auth/avatar`

Upload a new avatar for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
image: <file> (required)
```

**Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://res.cloudinary.com/...",
    "bio": "User bio",
    "role": "STUDENT",
    "isActive": true,
    "emailVerified": null,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "avatar": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "online-course-platform/...",
    "originalname": "profile.jpg",
    "mimetype": "image/jpeg",
    "size": 123456
  }
}
```

### Update Profile with Avatar

**PUT** `/auth/profile`

Update user profile with optional avatar upload.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
firstName: "John" (optional)
lastName: "Doe" (optional)
bio: "User bio" (optional)
image: <file> (optional)
```

## 🛠️ Usage Examples

### Frontend Integration

```javascript
// Upload avatar
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/auth/avatar', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// Update profile with avatar
const updateProfile = async (profileData, file = null) => {
  const formData = new FormData();
  
  if (profileData.firstName) formData.append('firstName', profileData.firstName);
  if (profileData.lastName) formData.append('lastName', profileData.lastName);
  if (profileData.bio) formData.append('bio', profileData.bio);
  if (file) formData.append('image', file);

  const response = await fetch('/auth/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

### React Component Example

```jsx
import React, { useState } from 'react';

const AvatarUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/auth/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Avatar uploaded:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload Avatar'}
      </button>
    </div>
  );
};
```

## 🔒 Security Features

- **File Type Validation**: Only image files allowed
- **File Size Limits**: 5MB maximum
- **Authentication Required**: All upload endpoints require authentication
- **Automatic Cleanup**: Old avatars are deleted when replaced
- **Secure URLs**: Cloudinary provides HTTPS URLs

## 🎨 Image Transformations

Images are automatically optimized with these transformations:

- **Avatar**: 150x150px, face detection crop
- **Thumbnail**: 300x200px, fill crop
- **Course Image**: 600x400px, fill crop
- **Quality**: Auto-optimized for web

## 🚨 Error Handling

Common error responses:

```json
{
  "error": "File size too large. Maximum size is 5MB."
}
```

```json
{
  "error": "Only image files (jpg, jpeg, png, gif, webp) are allowed."
}
```

```json
{
  "error": "Please select an image to upload."
}
```

## 📝 Notes

- Images are stored in the `online-course-platform` folder on Cloudinary
- Old avatars are automatically deleted when a new one is uploaded
- All images are optimized for web delivery
- The system supports multiple image formats for maximum compatibility 