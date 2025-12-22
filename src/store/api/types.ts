// API Response Types - Based on Backend Models

// ============ Authentication Types ============
export interface LoginRequest {
  username: string; // Can be username or email
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_profile_complete: boolean;
  profile: UserProfile | null;
  roles: Role[];
  created_at: string;
}

// ============ Profile Types ============
export interface UserProfile {
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

export interface ProfileCreateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  company_name?: string;
  website?: string;
  social_links?: {
    [key: string]: string;
  } | null;
}

export interface ProfileCompletionResponse {
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
}

// ============ Role Types ============
export interface Role {
  id: number;
  name: string;
  description: string | null;
}

// ============ Marketplace Types ============
export interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  listing_type_id: number;
  price: number;
  currency: string;
  status: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
  domain_name?: string | null;
  website_url?: string | null;
  seller_id: number;
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListingCreateRequest {
  title: string;
  description: string;
  listing_type_id: number;
  price: number;
  currency: string;
  domain_name?: string;
  website_url?: string;
  status?: 'draft' | 'active';
}

export interface ListingUpdateRequest extends Partial<ListingCreateRequest> {}

// ============ Order Types ============
export interface Order {
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

export interface OrderCreateRequest {
  listing_id: number;
  final_price?: number;
  currency?: string;
  offer_id?: number;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export interface PaymentIntentStatus {
  status: string;
  payment_intent_id: string | null;
}

// ============ Payment Types ============
export interface Payment {
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

export interface PaymentCreateRequest {
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
}

// ============ Escrow Types ============
export interface Escrow {
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

export interface EscrowReleaseRequest {
  release_reason?: string;
}

export interface EscrowRefundRequest {
  refund_reason?: string;
}

// ============ Offer Types ============
export interface Offer {
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  message: string | null;
  counter_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface OfferCreateRequest {
  listing_id: number;
  amount: number;
  currency: string;
  message?: string;
}

export interface OfferCounterRequest {
  amount: number;
  message?: string;
}

// ============ Auction Types ============
export interface Auction {
  id: number;
  listing_id: number;
  starting_bid: number;
  current_bid: number | null;
  reserve_price: number | null;
  end_date: string;
  status: 'active' | 'ended' | 'cancelled';
  created_at: string;
}

export interface Bid {
  id: number;
  auction_id: number;
  buyer_id: number;
  amount: number;
  created_at: string;
}

export interface BidCreateRequest {
  amount: number;
}

export interface AuctionCreateRequest {
  listing_id: number;
  starting_bid: number;
  reserve_price?: number;
  end_date: string;
}

export interface AuctionUpdateRequest {
  starting_bid?: number;
  reserve_price?: number;
  end_date?: string;
  status?: 'active' | 'ended' | 'cancelled';
}

// ============ Message Types ============
export interface Conversation {
  id: number;
  listing_id: number | null;
  participant1_id: number;
  participant2_id: number;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageCreateRequest {
  content: string;
}

export interface ConversationCreateRequest {
  listing_id?: number;
  recipient_id: number;
}

// ============ Review Types ============
export interface Review {
  id: number;
  listing_id: number;
  order_id: number;
  reviewer_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreateRequest {
  listing_id: number;
  order_id: number;
  rating: number;
  comment?: string;
}

// ============ Support Types ============
export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface TicketCreateRequest {
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// ============ FAQ Types ============
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface FAQCreateRequest {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_active?: boolean;
}

// ============ Blog Types ============
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: number;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published';
}

// ============ Dispute Types ============
export interface Dispute {
  id: number;
  order_id: number;
  buyer_id: number;
  seller_id: number;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

export interface DisputeCreateRequest {
  order_id: number;
  reason: string;
  description: string;
}

export interface DisputeComment {
  id: number;
  dispute_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

// ============ Dashboard Types ============
export interface AdminDashboard {
  total_users: number;
  active_listings: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  active_disputes: number;
  recent_orders: Order[];
  recent_users: UserResponse[];
}

export interface SellerDashboard {
  total_listings: number;
  active_listings: number;
  total_sales: number;
  total_revenue: number;
  pending_orders: number;
  active_offers: number;
  recent_orders: Order[];
  recent_listings: Listing[];
}

export interface BuyerDashboard {
  total_orders: number;
  active_orders: number;
  total_spent: number;
  favorite_listings: number;
  pending_offers: number;
  recent_orders: Order[];
  favorite_listings_data: Listing[];
}

// ============ User Management Types ============
export interface UserCreateRequest {
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
}

export interface UserUpdateRequest {
  email?: string;
  username?: string;
  is_active?: boolean;
}

export interface PasswordUpdateRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  new_password: string;
}

export interface UserStats {
  total_listings: number;
  total_orders: number;
  total_revenue: number;
  total_spent: number;
  average_rating: number | null;
}

// ============ Pagination Types ============
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
  page?: number;
  size?: number;
}

// ============ Filter Types ============
export interface ListingFilters extends PaginationParams {
  status?: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
  listing_type_id?: number;
  seller_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export interface OrderFilters extends PaginationParams {
  buyer_id?: number;
  seller_id?: number;
  status?: string;
}

// ============ Error Types ============
export interface ApiError {
  detail: string | Array<{
    type: string;
    loc: (string | number)[];
    msg: string;
    input: any;
  }>;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

