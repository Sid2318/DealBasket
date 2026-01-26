# JWT Authentication Implementation

## Overview

This implementation provides a secure JWT-based authentication system with the following features:

- **Short-lived access tokens** (15 minutes default) for API protection
- **Long-lived refresh tokens** (30 days default) stored securely in HTTP-only cookies
- **Database-stored refresh tokens** for proper revocation
- **Token refresh flow** for seamless user experience
- **Logout functionality** that properly invalidates tokens
- **Separate secrets** for access and refresh tokens
- **Production-ready security** with HTTPS, sameSite, and secure cookies

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │    Backend      │    │   Database      │
│                 │    │                 │    │                 │
│  - Access Token │◄──►│ - Verify Access │    │ - User Data     │
│  - Auto Refresh │    │ - Refresh Flow  │◄──►│ - Refresh Tokens│
│                 │    │ - Cookie Mgmt   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint           | Description             | Auth Required    |
| ------ | ------------------ | ----------------------- | ---------------- |
| POST   | `/auth/signup`     | Register new user       | No               |
| POST   | `/auth/login`      | Login user              | No               |
| POST   | `/auth/refresh`    | Refresh access token    | No (uses cookie) |
| POST   | `/auth/logout`     | Logout user             | No               |
| POST   | `/auth/logout-all` | Logout from all devices | No               |
| GET    | `/auth/me`         | Get current user info   | Yes              |

## Usage Examples

### 1. User Registration

```javascript
const response = await fetch("/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "securepassword123",
  }),
});
```

### 2. User Login

```javascript
const response = await fetch("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important: Include cookies
  body: JSON.stringify({
    email: "john@example.com",
    password: "securepassword123",
  }),
});

const data = await response.json();
// Store access token for API calls
localStorage.setItem("accessToken", data.accessToken);
```

### 3. Making Authenticated API Calls

```javascript
const response = await fetch("/api/protected-endpoint", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  },
  credentials: "include",
});
```

### 4. Handling Token Expiry (Frontend)

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  let token = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshResponse = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("accessToken", data.accessToken);

      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
        credentials: "include",
      });
    } else {
      // Refresh failed, redirect to login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return;
    }
  }

  return response;
}
```

### 5. Logout

```javascript
// Logout from current device
await fetch("/auth/logout", {
  method: "POST",
  credentials: "include",
});
localStorage.removeItem("accessToken");

// Logout from all devices
await fetch("/auth/logout-all", {
  method: "POST",
  credentials: "include",
});
localStorage.removeItem("accessToken");
```

## Security Features

### 1. Access Tokens

- **Short-lived** (15 minutes default)
- **JWT format** for stateless verification
- **Stored in localStorage** (client-side)
- **Used for API authentication**

### 2. Refresh Tokens

- **Long-lived** (30 days default)
- **Stored in HTTP-only cookies** (XSS protection)
- **Database validation** (proper revocation)
- **Secure, sameSite** cookie attributes

### 3. Cookie Security

```javascript
const cookieOptions = {
  httpOnly: true, // Prevent XSS attacks
  secure: isProduction, // HTTPS only in production
  sameSite: "none", // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/",
};
```

### 4. Token Secrets

- **Separate secrets** for access and refresh tokens
- **Environment variables** for configuration
- **Cryptographically secure** (minimum 64 characters)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use different secrets for each token type
JWT_ACCESS_SECRET=your_generated_secret_1
JWT_REFRESH_SECRET=your_generated_secret_2

# Configure expiration times
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Set environment
NODE_ENV=production  # Enable HTTPS-only cookies

# Configure CORS
FRONTEND_URL=https://yourdomain.com
```

## Database Schema

### User Model Extensions

```javascript
const userSchema = {
  // ... existing fields
  refreshTokens: [
    {
      token: { type: String, required: true },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000, // 30 days
      },
    },
  ],
};
```

## Security Best Practices

### Production Deployment

1. **Enable HTTPS** - Set `NODE_ENV=production`
2. **Secure cookies** - Automatically enabled in production
3. **CORS configuration** - Set correct `FRONTEND_URL`
4. **Secret management** - Use proper secret management (Azure Key Vault, etc.)
5. **Token rotation** - Consider implementing refresh token rotation
6. **Rate limiting** - Already implemented for auth endpoints
7. **Monitoring** - Log authentication events

### Frontend Implementation

1. **Store access tokens** in localStorage (or memory for extra security)
2. **Handle token refresh** automatically
3. **Clear tokens** on logout
4. **Include credentials** in requests (`credentials: 'include'`)
5. **Handle 401 responses** with automatic refresh

### Backend Security

1. **Validate all inputs** (already implemented)
2. **Hash passwords** with bcrypt (12 rounds minimum)
3. **Separate token secrets** (access vs refresh)
4. **Database token storage** for proper revocation
5. **Exclude sensitive data** from responses
6. **Proper error handling** without information leakage

## Migration from Old System

If updating from the old single-token system:

1. **Frontend changes**: Update login to handle new token structure
2. **Add refresh flow**: Implement automatic token refresh
3. **Update API calls**: Include credentials for cookie support
4. **Update logout**: Call new logout endpoints

## Testing

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Start server
npm run dev

# Test endpoints
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt
```

This implementation provides enterprise-grade security while maintaining ease of use and developer experience.
