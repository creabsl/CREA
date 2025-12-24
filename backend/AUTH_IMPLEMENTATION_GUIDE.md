# Authentication Implementation Guide

## Overview
Implemented a secure JWT-based authentication system with refresh tokens to improve security and user experience.

## Token Configuration
- **Access Token**: Expires in **1 hour** (for security)
- **Refresh Token**: Expires in **7 days** (for longer sessions)
- **Error Handling**: Reduced console spam by filtering out repetitive expired token logs

## New API Endpoints

### 1. Request OTP
```
POST /api/auth/request-otp
Body: { email, name (optional) }
Response: { success: true }
```

### 2. Verify OTP (Returns tokens)
```
POST /api/auth/verify-otp
Body: { email, code, name (optional), password (optional) }
Response: { _id, name, email, role, token, refreshToken }
```

### 3. Refresh Access Token (NEW)
```
POST /api/auth/refresh-token
Body: { refreshToken }
Response: { token }
```
Use this when your access token expires to get a new one without re-logging in.

### 4. Logout (NEW)
```
POST /api/auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: { success: true, message: "Logged out successfully" }
```

## Frontend Implementation Steps

### 1. Store Both Tokens
```javascript
// After successful login (verifyOtp response)
localStorage.setItem('accessToken', response.token);
localStorage.setItem('refreshToken', response.refreshToken);
```

### 2. Handle Expired Tokens
```javascript
// In your API interceptor (api.ts)
const api = axios.create({...});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && error.response?.data?.message === 'Token expired, please refresh') {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh-token', { refreshToken });
        
        localStorage.setItem('accessToken', data.token);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest); // Retry original request
      } catch (err) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Add Authorization Header
```javascript
// Automatically add token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }
);
```

### 4. Logout
```javascript
// Call logout endpoint
await api.post('/api/auth/logout');
localStorage.clear();
```

## Key Benefits
✅ **Shorter-lived access tokens** - More secure  
✅ **Refresh tokens** - Users stay logged in longer  
✅ **Automatic token refresh** - Seamless UX  
✅ **Reduced console spam** - Only critical errors logged  
✅ **Proper logout** - Clears refresh tokens from server

## Database Changes
User model now includes:
- `refreshToken` - Stores the refresh token
- `refreshTokenExpiresAt` - When the refresh token expires

These fields are automatically managed and cleared on logout.
