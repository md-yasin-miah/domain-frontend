# Domain Market API - Frontend Developer Guide

A comprehensive FastAPI-based marketplace API for selling domains, websites, and related products. This guide provides everything you need to integrate with the API.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Base URL](#api-base-url)
- [Core Features](#core-features)
- [API Endpoints Reference](#api-endpoints-reference)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Integration Workflows](#integration-workflows)
- [Demo Data](#demo-data)
- [Testing](#testing)

---

## Getting Started

### Prerequisites

- Node.js / React / Vue / Angular (or your frontend framework)
- HTTP client library (Axios, Fetch API, etc.)

### Quick Start

1. **Start the API Server**:
   ```bash
   uvicorn main:app --reload
   ```

2. **Access API Documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

3. **Test Connection**:
   ```bash
   curl http://localhost:8000/
   ```

---

## Authentication

### Authentication Flow

1. **Register User**:
   ```
   POST /auth/register
   Body: { "email": "user@example.com", "username": "johndoe", "password": "securepass123" }
   ```

2. **Login** (supports both username and email):
   ```
   POST /auth/login
   Body: { "username": "johndoe", "password": "securepass123" }
   OR
   Body: { "username": "user@example.com", "password": "securepass123" }
   Response: { 
     "access_token": "eyJ...", 
     "refresh_token": "eyJ...",
     "token_type": "bearer" 
   }
   
   Note: The "username" field accepts either username or email address.
   Login returns both access_token (30 min expiry) and refresh_token (7 days expiry).
   ```

3. **Refresh Token** (when access token expires):
   ```
   POST /auth/refresh
   Body: { "refresh_token": "eyJ..." }
   Response: { 
     "access_token": "eyJ...",  // New access token
     "refresh_token": "eyJ...",  // New refresh token
     "token_type": "bearer" 
   }
   ```

4. **Use Token**:
   ```
   Authorization: Bearer eyJ...
   ```

### Token Management

**Token Expiration:**
- **Access Token**: 30 minutes (used for API requests)
- **Refresh Token**: 7 days (used to get new access tokens)

**Refresh Token Flow:**
1. Store both `access_token` and `refresh_token` after login
2. When access token expires (401 Unauthorized), use refresh token to get new tokens
3. Call `/auth/refresh` with the refresh_token
4. Update stored tokens with the new response
5. Retry the original request with new access token

**Example Implementation:**
```javascript
// Store tokens after login
const { access_token, refresh_token } = await loginResponse.json();
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Token refresh function
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  if (response.ok) {
    const { access_token, refresh_token } = await response.json();
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return access_token;
  } else {
    // Refresh token expired, redirect to login
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
}

// API request with auto-refresh
async function apiRequest(url, options = {}) {
  let token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // If token expired, refresh and retry
  if (response.status === 401) {
    token = await refreshAccessToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
  
  return response;
}
```

### Profile Completion Check

After login, check if user profile is complete:

```
GET /auth/me
Headers: Authorization: Bearer {token}
Response: {
  "is_profile_complete": false,
  "profile": null,
  ...
}
```

If `is_profile_complete: false`, redirect user to profile completion page.

### Complete Profile

```
POST /profile/me
Headers: Authorization: Bearer {token}
Body: {
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1-555-0100",
  "address_line1": "123 Main St",
  "city": "New York",
  "country": "USA",
  "postal_code": "10001"
}
```

---

## API Base URL

- **Development**: `http://localhost:8000`
- **Production**: Update based on your deployment

---

## Core Features

### 1. User Management
- User registration and authentication
- **Login with username OR email** (flexible authentication)
- **Full User Management API** (Admin: CRUD operations, role management, activation/deactivation)
- Profile management with completion tracking
- User statistics and analytics
- Role-based access control (Admin, Seller, Buyer)

### 2. Marketplace
- Listing management (domains, websites, apps)
- Search and filtering
- Featured listings
- Category management

### 3. Transactions
- Offers system
- Auctions and bidding
- Orders management
- **Payment processing (Stripe)** with payment tracking
- **Payment Management System** - Track all payments, refunds, status
- **Escrow Management System** - Secure fund holding, release, and refund
- Commission tracking

### 4. Communication
- Messaging between buyers and sellers
- Conversation threads per listing
- Read/unread status

### 5. Reviews & Ratings
- Product reviews
- Seller ratings
- Review moderation

### 6. Support & Content
- Support ticket system
- FAQ management
- Blog posts with SEO

### 7. Verification & Disputes
- Domain/website verification
- Dispute resolution
- Admin mediation

### 8. Analytics & Reports
- **Role-based Dashboard API** - Different dashboards for Admin, Seller, Buyer
- Listing analytics
- Seller performance metrics
- Admin overview with platform statistics
- User statistics per user

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and get tokens (username or email) | No |
| POST | `/auth/login-json` | Login with JSON body (username or email) | No |
| POST | `/auth/refresh` | Refresh access token using refresh token | No |
| GET | `/auth/me` | Get current user info | Yes |

### Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/me` | Get current user profile | Yes |
| POST | `/profile/me` | Create profile | Yes |
| PUT | `/profile/me` | Update profile | Yes |
| GET | `/profile/me/completion` | Check profile completion | Yes |
| GET | `/profile/{user_id}` | Get public user profile | Optional |

### User Management Endpoints (Admin)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | List all users (with filters) | Admin |
| GET | `/users/{id}` | Get user details | User/Admin |
| POST | `/users` | Create new user | Admin |
| PUT | `/users/{id}` | Update user info | User/Admin |
| PUT | `/users/{id}/password` | Update password | User/Admin |
| PUT | `/users/{id}/password/reset` | Reset password | Admin |
| POST | `/users/{id}/roles` | Assign roles | Admin |
| DELETE | `/users/{id}/roles/{role_id}` | Remove role | Admin |
| PUT | `/users/{id}/activate` | Activate user | Admin |
| PUT | `/users/{id}/deactivate` | Deactivate user | Admin |
| DELETE | `/users/{id}` | Delete/deactivate user | Admin |
| GET | `/users/{id}/stats` | Get user statistics | User/Admin |

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Get role-based dashboard | Yes |
| GET | `/dashboard/admin` | Admin dashboard | Admin |
| GET | `/dashboard/seller` | Seller dashboard | Yes |
| GET | `/dashboard/buyer` | Buyer dashboard | Yes |

### Marketplace Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/marketplace/listings` | List all listings (with advanced filters) | Optional |
| GET | `/marketplace/listings/{id}` | Get listing details | Optional |
| GET | `/marketplace/listings/slug/{slug}` | Get listing by slug | Optional |
| POST | `/marketplace/listings` | Create listing | Seller |
| PUT | `/marketplace/listings/{id}` | Update listing | Seller |
| DELETE | `/marketplace/listings/{id}` | Delete listing | Seller |
| POST | `/marketplace/listings/{id}/view` | Increment view count | Optional |
| POST | `/marketplace/listings/{id}/feature` | Feature/unfeature listing | Admin |
| POST | `/marketplace/listing-types` | Create listing type | Admin |
| GET | `/marketplace/listing-types` | List listing types | No |

### Offers Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/offers` | List offers | Yes |
| POST | `/offers` | Create offer | Buyer |
| GET | `/offers/{id}` | Get offer details | Yes |
| POST | `/offers/{id}/accept` | Accept offer | Seller |
| POST | `/offers/{id}/reject` | Reject offer | Seller |
| POST | `/offers/{id}/counter` | Counter offer | Seller |
| DELETE | `/offers/{id}` | Withdraw offer | Buyer |

### Auction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auctions` | List auctions | Optional |
| GET | `/auctions/{id}` | Get auction details | Optional |
| POST | `/auctions/{id}/bids` | Place bid | Buyer |
| GET | `/auctions/{id}/bids` | List bids | Optional |

### Orders Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | List orders (with filters) | Yes |
| POST | `/orders` | Create order | Buyer |
| GET | `/orders/{id}` | Get order details | Yes |
| PUT | `/orders/{id}` | Update order | Buyer/Seller |
| POST | `/orders/{id}/cancel` | Cancel order | Buyer/Seller |
| POST | `/orders/{id}/payment-intent` | Create Stripe payment intent | Buyer |
| GET | `/orders/{id}/payment-intent/status` | Get payment status | Buyer |
| POST | `/orders/{id}/payment-intent/confirm` | Confirm payment | Buyer |
| POST | `/orders/{id}/refund` | Request refund | Buyer/Admin |
| POST | `/orders/{id}/complete` | Mark order as completed | Seller/Admin |
| GET | `/orders/number/{order_number}` | Get order by order number | Yes |
| POST | `/orders/{id}/payment-intent/cancel` | Cancel payment intent | Buyer |

### Payment Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/payments` | List payments | Yes |
| POST | `/payments` | Create payment record | Buyer |
| GET | `/payments/{id}` | Get payment details | Yes |
| PUT | `/payments/{id}` | Update payment | Admin |
| GET | `/payments/order/{order_id}` | Get payment by order | Yes |

### Escrow Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/escrow` | List escrows | Yes |
| POST | `/escrow` | Create escrow | Admin |
| GET | `/escrow/{id}` | Get escrow details | Buyer/Seller |
| GET | `/escrow/order/{order_id}` | Get escrow by order | Yes |
| POST | `/escrow/{id}/release` | Release escrow to seller | Admin/Seller |
| POST | `/escrow/{id}/refund` | Refund escrow to buyer | Admin |
| PUT | `/escrow/{id}` | Update escrow | Admin |

### Favorites Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/favorites/listings` | Get favorite listings | Yes |
| POST | `/favorites/listings/{listing_id}` | Add to favorites | Yes |
| DELETE | `/favorites/listings/{listing_id}` | Remove from favorites | Yes |

### Messaging Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages/conversations` | List conversations | Yes |
| POST | `/messages/conversations` | Create conversation | Yes |
| GET | `/messages/conversations/{id}` | Get conversation | Yes |
| GET | `/messages/conversations/{id}/messages` | Get messages | Yes |
| POST | `/messages/conversations/{id}/messages` | Send message | Yes |
| PUT | `/messages/{id}/read` | Mark as read | Yes |

### Reviews Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews` | List reviews | Optional |
| POST | `/reviews` | Create review | Buyer (after order) |
| GET | `/reviews/{id}` | Get review details | Optional |
| PUT | `/reviews/{id}` | Update review | Reviewer |
| DELETE | `/reviews/{id}` | Delete review | Reviewer/Admin |

### Support Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/support/tickets` | List tickets | Yes |
| POST | `/support/tickets` | Create ticket | Yes |
| GET | `/support/tickets/{id}` | Get ticket details | Yes |
| PUT | `/support/tickets/{id}` | Update ticket | Yes |

### FAQ Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/faq` | List FAQs | No |
| GET | `/faq/{id}` | Get FAQ details | No |
| POST | `/faq` | Create FAQ | Admin |
| PUT | `/faq/{id}` | Update FAQ | Admin |
| DELETE | `/faq/{id}` | Delete FAQ | Admin |

### Blog Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/blog/posts` | List blog posts | No |
| GET | `/blog/posts/{id}` | Get post details | No |
| POST | `/blog/posts` | Create post | Admin/Author |
| PUT | `/blog/posts/{id}` | Update post | Admin/Author |
| DELETE | `/blog/posts/{id}` | Delete post | Admin |

### Dispute Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/disputes` | List disputes | Yes |
| POST | `/disputes` | Create dispute | Buyer/Seller |
| GET | `/disputes/{id}` | Get dispute details | Yes |
| PUT | `/disputes/{id}` | Update dispute | Admin |
| POST | `/disputes/{id}/resolve` | Resolve dispute | Admin |
| POST | `/disputes/{id}/comments` | Add comment | Yes |

### Category Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/categories/support` | Create support category | Admin |
| GET | `/categories/support` | List support categories | No |
| GET | `/categories/support/{id}` | Get support category | No |
| PUT | `/categories/support/{id}` | Update support category | Admin |
| DELETE | `/categories/support/{id}` | Delete support category | Admin |
| POST | `/categories/faq` | Create FAQ category | Admin |
| GET | `/categories/faq` | List FAQ categories | No |
| GET | `/categories/faq/{id}` | Get FAQ category | No |
| PUT | `/categories/faq/{id}` | Update FAQ category | Admin |
| DELETE | `/categories/faq/{id}` | Delete FAQ category | Admin |
| POST | `/categories/blog` | Create blog category | Admin |
| GET | `/categories/blog` | List blog categories | No |
| GET | `/categories/blog/{id}` | Get blog category | No |
| PUT | `/categories/blog/{id}` | Update blog category | Admin |
| DELETE | `/categories/blog/{id}` | Delete blog category | Admin |

### Commission Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/commissions` | Create commission rule | Admin |
| GET | `/commissions` | List commission rules | Yes |
| GET | `/commissions/{id}` | Get commission rule | Yes |
| PUT | `/commissions/{id}` | Update commission rule | Admin |
| DELETE | `/commissions/{id}` | Delete commission rule | Admin |
| POST | `/commissions/calculate` | Calculate commission for price | Yes |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | List user notifications | Yes |
| GET | `/notifications/unread/count` | Get unread count | Yes |
| DELETE | `/notifications` | Delete all notifications | Yes |
| GET | `/notifications/{id}` | Get notification details | Yes |
| PUT | `/notifications/{id}/read` | Mark as read | Yes |
| PUT | `/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/notifications/{id}` | Delete notification | Yes |

### Upload/File Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/uploads` | Upload file/image | Yes |
| POST | `/uploads/multiple` | Upload multiple files | Yes |
| GET | `/uploads` | List uploaded files | Yes |
| GET | `/uploads/{id}` | Get file details | Optional |
| GET | `/uploads/{id}/download` | Download file | Optional |
| DELETE | `/uploads/{id}` | Delete file | Yes |

### Verification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/verifications` | Create verification request | Yes |
| GET | `/verifications` | List verifications | Yes |
| GET | `/verifications/{id}` | Get verification details | Yes |
| PUT | `/verifications/{id}` | Update verification | Yes |
| POST | `/verifications/{id}/verify` | Approve verification | Admin |
| POST | `/verifications/{id}/reject` | Reject verification | Admin |
| DELETE | `/verifications/{id}` | Delete verification | Admin |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/listings/{listing_id}/stats` | Get listing analytics | Seller/Admin |
| GET | `/analytics/seller/{seller_id}/dashboard` | Get seller dashboard analytics | Seller/Admin |
| GET | `/analytics/admin/overview` | Get admin overview analytics | Admin |

### Valuation Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/valuations` | Create valuation | Yes |
| POST | `/valuations/calculate` | Calculate domain valuation | Optional |
| GET | `/valuations` | List valuations | Yes |
| GET | `/valuations/{id}` | Get valuation details | Yes |
| PUT | `/valuations/{id}` | Update valuation | Admin |
| DELETE | `/valuations/{id}` | Delete valuation | Admin |
| POST | `/valuations/comparable-sales` | Create comparable sale | Admin |
| GET | `/valuations/comparable-sales` | List comparable sales | Optional |
| GET | `/valuations/comparable-sales/{id}` | Get comparable sale | Optional |
| PUT | `/valuations/comparable-sales/{id}` | Update comparable sale | Admin |
| DELETE | `/valuations/comparable-sales/{id}` | Delete comparable sale | Admin |
| POST | `/valuations/market-trends` | Create market trend | Admin |
| GET | `/valuations/market-trends` | List market trends | Optional |
| GET | `/valuations/market-trends/{id}` | Get market trend | Optional |
| PUT | `/valuations/market-trends/{id}` | Update market trend | Admin |
| DELETE | `/valuations/market-trends/{id}` | Delete market trend | Admin |

### Social Features Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/social/follow` | Follow a seller | Yes |
| DELETE | `/social/follow/{seller_id}` | Unfollow a seller | Yes |
| GET | `/social/following` | List sellers user is following | Yes |
| GET | `/social/followers/{seller_id}` | List followers of a seller | Optional |
| GET | `/social/following/check/{seller_id}` | Check if following seller | Yes |
| GET | `/social/seller/{seller_id}/stats` | Get seller social stats | Optional |
| POST | `/social/shares` | Track listing share | Optional |
| GET | `/social/shares` | List listing shares | Yes |
| GET | `/social/shares/{id}` | Get share details | Yes |
| GET | `/social/listings/{listing_id}/share-stats` | Get listing share statistics | Optional |
| DELETE | `/social/shares/{id}` | Delete share | Admin/Owner |

### Bulk Operations Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bulk/listings/status` | Bulk update listing status | Seller/Admin |
| POST | `/bulk/listings/delete` | Bulk delete listings | Seller/Admin |
| POST | `/bulk/listings/feature` | Bulk feature/unfeature listings | Admin |

### Export Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/exports/listings/csv` | Export listings to CSV | Yes |
| GET | `/exports/orders/csv` | Export orders to CSV | Yes |

### Saved Searches Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/saved-searches` | Create saved search | Yes |
| GET | `/saved-searches` | List saved searches | Yes |
| GET | `/saved-searches/{id}` | Get saved search | Yes |
| PUT | `/saved-searches/{id}` | Update saved search | Yes |
| DELETE | `/saved-searches/{id}` | Delete saved search | Yes |

### Search Alerts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/search-alerts` | Create search alert | Yes |
| GET | `/search-alerts` | List search alerts | Yes |
| GET | `/search-alerts/{id}` | Get search alert | Yes |
| PUT | `/search-alerts/{id}` | Update search alert | Yes |
| DELETE | `/search-alerts/{id}` | Delete search alert | Yes |

### Message Attachment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/messages/{message_id}/attachments/{file_upload_id}` | Attach file to message | Yes |
| GET | `/messages/{message_id}/attachments` | List message attachments | Yes |
| DELETE | `/messages/{message_id}/attachments/{attachment_id}` | Remove attachment | Yes |

### Review Helpfulness Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reviews/{review_id}/helpfulness` | Vote helpful/not helpful | Yes |
| GET | `/reviews/{review_id}/helpfulness` | Get helpfulness stats | Optional |
| GET | `/reviews/{review_id}/helpfulness/votes` | List all votes | Optional |
| DELETE | `/reviews/{review_id}/helpfulness` | Remove vote | Yes |

### Invoice Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/invoices` | Create invoice | Admin |
| GET | `/invoices` | List invoices | Yes |
| GET | `/invoices/{id}` | Get invoice details | Yes |
| GET | `/invoices/order/{order_id}` | Get invoice by order | Yes |
| PUT | `/invoices/{id}` | Update invoice | Admin |
| POST | `/invoices/{id}/issue` | Issue invoice | Admin |
| POST | `/invoices/{id}/mark-paid` | Mark invoice as paid | Admin |

### Auction Endpoints (Complete)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auctions` | List auctions | Optional |
| POST | `/auctions` | Create auction | Seller |
| GET | `/auctions/{id}` | Get auction details | Optional |
| PUT | `/auctions/{id}` | Update auction | Seller/Admin |
| POST | `/auctions/{id}/bids` | Place bid | Buyer |
| GET | `/auctions/{id}/bids` | List bids | Optional |
| DELETE | `/auctions/{id}/bids/{bid_id}` | Withdraw bid | Buyer |

### Offer Endpoints (Complete)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/offers` | List offers | Yes |
| POST | `/offers` | Create offer | Buyer |
| GET | `/offers/{id}` | Get offer details | Yes |
| PUT | `/offers/{id}` | Update offer | Buyer |
| POST | `/offers/{id}/accept` | Accept offer | Seller |
| POST | `/offers/{id}/reject` | Reject offer | Seller |
| POST | `/offers/{id}/counter` | Counter offer | Seller |
| DELETE | `/offers/{id}` | Withdraw offer | Buyer |

### Stripe Webhook Endpoint

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/stripe/webhook` | Stripe webhook handler | No (signed) |

### Endpoint Permissions Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/endpoint-permissions` | Create endpoint permission | Admin |
| GET | `/endpoint-permissions` | List endpoint permissions | Admin |
| GET | `/endpoint-permissions/{id}` | Get endpoint permission | Admin |
| PUT | `/endpoint-permissions/{id}` | Update endpoint permission | Admin |
| DELETE | `/endpoint-permissions/{id}` | Delete endpoint permission | Admin |

---

## Error Handling

### Standard Error Response

```json
{
  "detail": "Error message here"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

### Example Error Handling (JavaScript)

```javascript
try {
  const response = await fetch('/api/orders', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Request failed');
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error:', error.message);
  // Handle error in UI
}
```

---

## Data Models

### User Profile

```typescript
interface UserProfile {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  address_line1: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  company_name: string | null;
  website: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

### Listing

```typescript
interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  listing_type_id: number;
  price: number;
  currency: string;
  status: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
  domain_name?: string;
  website_url?: string;
  seller_id: number;
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
}
```

### Order

```typescript
interface Order {
  id: number;
  order_number: string;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  final_price: number;
  platform_fee: number;
  seller_amount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}
```

### Payment

```typescript
interface Payment {
  id: number;
  payment_number: string;
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
}
```

### Escrow

```typescript
interface Escrow {
  id: number;
  escrow_number: string;
  order_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  platform_fee: number;
  seller_amount: number;
  status: 'pending' | 'released' | 'refunded' | 'disputed';
  held_at: string;
  released_at: string | null;
  refunded_at: string | null;
  created_at: string;
}
```

---

## Integration Workflows

### 1. User Registration & Onboarding

```javascript
// 1. Register
const registerResponse = await fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'securepass123'
  })
});
const user = await registerResponse.json();

// 2. Login (supports both username and email)
const loginResponse = await fetch('/auth/login-json', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',  // Can also use: 'user@example.com'
    password: 'securepass123'
  })
});
const { access_token, refresh_token } = await loginResponse.json();

// Store tokens securely (use httpOnly cookies in production)
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// 3. Check profile
const meResponse = await fetch('/auth/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const userInfo = await meResponse.json();

// 4. If profile incomplete, redirect to profile completion
if (!userInfo.is_profile_complete) {
  router.push('/complete-profile');
} else {
  router.push('/dashboard');
}
```

### 2. Create & List Listings (Seller Flow)

```javascript
// Create listing
const listing = await fetch('/marketplace/listings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Premium Domain',
    description: 'Great domain name',
    listing_type_id: 1,
    price: 5000,
    currency: 'USD',
    domain_name: 'example.com'
  })
}).then(r => r.json());

// List my listings
const myListings = await fetch('/marketplace/listings?seller_id=my_id', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

### 3. Purchase Flow (Buyer Flow)

```javascript
// 1. View listing
const listing = await fetch(`/marketplace/listings/${listingId}`)
  .then(r => r.json());

// 2. Create order
const order = await fetch('/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    listing_id: listingId,
    final_price: listing.price,
    currency: listing.currency
  })
}).then(r => r.json());

// 3. Create payment intent
const paymentIntent = await fetch(`/orders/${order.id}/payment-intent`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 4. Process payment with Stripe (client-side)
const stripe = Stripe('pk_test_...');
await stripe.confirmCardPayment(paymentIntent.client_secret, {
  payment_method: { card: cardElement }
});

// 5. Confirm payment
await fetch(`/orders/${order.id}/payment-intent/confirm`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 4. Offer Flow

```javascript
// 1. Make offer
const offer = await fetch('/offers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    listing_id: listingId,
    amount: 4500,
    currency: 'USD',
    message: 'Interested in purchasing'
  })
}).then(r => r.json());

// 2. Seller accepts offer
await fetch(`/offers/${offer.id}/accept`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${sellerToken}` }
});

// 3. Create order from accepted offer
const order = await fetch('/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    listing_id: listingId,
    offer_id: offer.id
  })
}).then(r => r.json());
```

### 5. Escrow Flow

```javascript
// After payment is confirmed, escrow is automatically created (admin/system)

// 1. Check escrow status
const escrow = await fetch(`/escrow/order/${orderId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 2. After order completion, release escrow (seller can request, admin approves)
await fetch(`/escrow/${escrow.id}/release`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    release_reason: 'Order completed successfully'
  })
});
```

### 6. Messaging Flow

```javascript
// 1. Create or get conversation
const conversations = await fetch('/messages/conversations', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 2. Send message
await fetch(`/messages/conversations/${conversationId}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Hello, I\'m interested in your listing'
  })
});

// 3. Get messages
const messages = await fetch(`/messages/conversations/${conversationId}/messages`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

---

## Demo Data

See `DEMO_DATA_README.md` for demo user credentials and sample data.

### Quick Demo Login

- **Admin**: `admin@domainmarket.com` / `admin123`
- **Seller**: `john@example.com` / `password123`
- **Buyer**: `jane@example.com` / `password123`

To populate demo data, run:
```bash
python app/seed_demo_data.py
```

---

## Testing

### Using Swagger UI

1. Start server: `uvicorn main:app --reload`
2. Open: `http://localhost:8000/docs`
3. Click "Authorize" and enter: `Bearer {your_token}`
4. Test endpoints directly in browser

### Using cURL

```bash
# Login with username
curl -X POST "http://localhost:8000/auth/login-json" \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "password": "password123"}'

# Login with email (also works!)
curl -X POST "http://localhost:8000/auth/login-json" \
  -H "Content-Type: application/json" \
  -d '{"username": "john@example.com", "password": "password123"}'
# Response: {"access_token": "...", "refresh_token": "...", "token_type": "bearer"}

# Refresh token when access token expires
curl -X POST "http://localhost:8000/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
# Response: {"access_token": "...", "refresh_token": "...", "token_type": "bearer"}

# Get listings
curl -X GET "http://localhost:8000/marketplace/listings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using JavaScript Fetch

```javascript
const token = 'your_access_token';

const response = await fetch('http://localhost:8000/marketplace/listings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const listings = await response.json();
console.log(listings);
```

---

## Recent Updates & Features

### New Features Added

1. **Payment Management System** ✅
   - Full payment tracking and management
   - Support for multiple payment methods
   - Refund handling and tracking
   - Payment status updates
   - Integration with Stripe payment processing

2. **Escrow Management System** ✅
   - Secure fund holding during transactions
   - Escrow release to sellers
   - Escrow refund to buyers
   - Dispute integration
   - Admin control over escrow operations

3. **User Management API** ✅
   - Complete CRUD operations for user management
   - User activation/deactivation
   - Role assignment and management
   - Password reset functionality
   - User statistics and analytics
   - Search and filtering capabilities

4. **Role-Based Dashboard API** ✅
   - Admin dashboard with platform-wide statistics
   - Seller dashboard with listing/order metrics
   - Buyer dashboard with purchase/favorite stats
   - Profile completion tracking

5. **Profile Management with Completion Tracking** ✅
   - Profile creation and updates
   - Completion percentage calculation
   - Missing fields tracking
   - Automatic redirect flow for incomplete profiles

6. **Enhanced Authentication** ✅
   - **Login with username OR email** - Users can login with either
   - **JWT Refresh Token Support** - Access tokens (30 min) + Refresh tokens (7 days)
   - Token refresh endpoint for seamless session management
   - Flexible authentication support
   - Better error messages
   - Both OAuth2 form and JSON login methods support email/username

---

## Payment Integration (Stripe)

### Stripe Configuration

Test keys are configured in the backend. For frontend:

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_51Sg9djK3qrj27QaQG8NtRYr7Gfupkyy66koOO1huhWABeRmmjMJfVwlIDmJV6Yo0YTqy7RVLTKgsEl7VcTuJQLnF00ODwAnVWo');
```

### Payment Flow

1. Create order → Get order ID
2. Create payment intent → Get `client_secret`
3. Use Stripe.js to confirm payment
4. Confirm payment on backend
5. Payment webhook updates order status automatically

---

## Common Patterns

### Pagination

Most list endpoints support pagination:

```
GET /marketplace/listings?skip=0&limit=20
```

### Filtering

Many endpoints support filtering:

```
GET /marketplace/listings?status=active&listing_type_id=1
GET /orders?buyer_id=123&status=completed
```

### Sorting

Default sorting is usually by creation date (descending). Some endpoints support custom sorting via query parameters.

---

## Environment Variables

Backend uses these environment variables (configure in `.env`):

```env
SECRET_KEY=your-secret-key
DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/dbname
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Support & Resources

- **API Documentation**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Demo Data Guide**: See `DEMO_DATA_README.md`
- **Feature Analysis**: See `FEATURE_ANALYSIS.md`

---

## Notes for Frontend Developers

1. **Always check `is_profile_complete`** after login and redirect if incomplete
2. **Store JWT tokens securely** - Store both access_token and refresh_token (httpOnly cookies recommended for production)
3. **Handle token expiration** - Implement auto-refresh using refresh_token before redirecting to login
4. **Login supports both username and email** - users can login with either
5. **Refresh Token Flow** - When access_token expires (401), use refresh_token to get new tokens automatically
6. **Token Expiration** - Access tokens expire in 30 minutes, refresh tokens in 7 days
5. **Implement proper error handling** for all API calls
6. **Use pagination** for large data sets
7. **Cache data appropriately** to reduce API calls
8. **Handle loading states** for better UX
9. **Validate forms client-side** before API calls
10. **Test with demo credentials** before production integration
11. **Monitor API response times** and implement timeout handling
12. **Use role-based dashboards** - `/dashboard` auto-detects user role
13. **Payment flow** - Create order → Payment intent → Stripe → Confirm → Escrow
14. **Escrow flow** - Funds held until order completion or dispute resolution
15. **User Management** - Admin can manage users, assign roles, activate/deactivate

---

Happy coding! 🚀

For questions or issues, refer to the API documentation at `/docs` or contact the backend team.