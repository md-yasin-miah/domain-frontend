/**
 * Authentication API Types
 */

interface LoginRequest {
  username: string; // Can be username or email
  password: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
