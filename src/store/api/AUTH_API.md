# Authentication API Implementation

## Overview

The authentication API has been implemented using RTK Query to connect to your backend API. The login endpoint is now configured to call `/auth/login`.

## Environment Variables

Make sure you have set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com
# OR
VITE_API_URL=https://your-api-domain.com
```

## API Endpoints

### POST `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "roles": [
      {
        "id": "role-id",
        "name": "Customer",
        "description": "Customer role"
      }
    ],
    "profile": {
      "id": "profile-id",
      "full_name": "John Doe",
      "phone_number": "+1234567890",
      "address": "123 Main St",
      "company_name": "Company Inc",
      "company_address": "456 Business Ave",
      "company_details": "Company details",
      "profile_completed": true
    }
  },
  "token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token",
  "expires_in": 3600
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

**Error Response (422 - Validation):**
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required"],
    "password": ["The password must be at least 6 characters"]
  }
}
```

## Implementation Details

### Files Updated

1. **`src/store/api/apiSlice.ts`**
   - Switched from `mockBaseQuery` to real `baseQuery`
   - Uses `VITE_API_BASE_URL` or `VITE_API_URL` from environment
   - Automatically adds Bearer token to requests
   - Handles 401 errors (can be extended for token refresh)

2. **`src/store/api/authApi.ts`**
   - `login` mutation now calls `POST /auth/login`
   - `signup` mutation calls `POST /auth/register`
   - `getCurrentUser` query calls `GET /auth/me`
   - `logout` mutation calls `POST /auth/logout`
   - `refreshToken` mutation calls `POST /auth/refresh`

3. **`src/store/slices/authSlice.ts`**
   - Updated to use `ApiUser` type instead of `MockUser`
   - Stores token and refresh token in localStorage
   - Automatically determines admin status from user roles

4. **`src/hooks/useAuth.ts`**
   - Enhanced error handling
   - Shows proper error messages from API
   - Handles loading states

### Usage

The login functionality works automatically through the existing `useAuth` hook:

```typescript
import { useAuth } from '@/hooks/useAuth';

const LoginComponent = () => {
  const { signIn, loading, error } = useAuth();

  const handleLogin = async () => {
    const result = await signIn(email, password);
    if (result.error) {
      // Handle error - error.message contains the API error message
      console.error(result.error.message);
    } else {
      // Success - user is automatically logged in
      // Token is stored in Redux and localStorage
    }
  };
};
```

## Token Management

- **Access Token**: Stored in Redux state and localStorage as `auth_token`
- **Refresh Token**: Stored in localStorage as `refresh_token` (if provided)
- **User Data**: Stored in localStorage as `auth_user` (JSON stringified)

The token is automatically included in all API requests via the `Authorization: Bearer <token>` header.

## Error Handling

The API errors are handled gracefully:
- Network errors are caught and displayed
- 401 errors automatically logout the user
- Validation errors show field-specific messages
- All errors are stored in Redux state for UI display

## Next Steps

1. **Test the login endpoint** with your actual API
2. **Implement token refresh** if your API supports it (update `baseQueryWithReauth`)
3. **Update other endpoints** (signup, getCurrentUser, logout) as needed
4. **Add request/response interceptors** if you need custom error handling

## Testing

To test the login:

1. Set your API URL in `.env`:
   ```
   VITE_API_BASE_URL=https://your-api.com
   ```

2. The login form will automatically use the real API endpoint

3. Check browser DevTools Network tab to see the actual API call

4. Verify the response format matches the expected structure above

