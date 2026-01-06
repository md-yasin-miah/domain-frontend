
// ============ Profile Types ============
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

interface ProfileCreateRequest {
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

interface ProfileCompletionResponse {
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
}

// ============ Marketplace Types ============


interface ListingCreateRequest {
  title: string;
  description: string;
  listing_type_id: number;
  price: number;
  currency: string;
  domain_name?: string;
  website_url?: string;
  status?: 'draft' | 'active';
}

type ListingUpdateRequest = Partial<ListingCreateRequest>;

// ============ Order Types ============



interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

interface PaymentIntentStatus {
  status: string;
  payment_intent_id: string | null;
}

// ============ Payment Types ============
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

interface PaymentCreateRequest {
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
}

// ============ Escrow Types ============
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

interface EscrowReleaseRequest {
  release_reason?: string;
}

interface EscrowRefundRequest {
  refund_reason?: string;
}

// ============ Offer Types ============

// ============ Auction Types ============
interface Auction {
  id: number;
  listing_id: number;
  starting_bid: number;
  current_bid: number | null;
  reserve_price: number | null;
  end_date: string;
  status: 'active' | 'ended' | 'cancelled';
  created_at: string;
}

interface Bid {
  id: number;
  auction_id: number;
  buyer_id: number;
  amount: number;
  created_at: string;
}

interface BidCreateRequest {
  amount: number;
}

interface AuctionCreateRequest {
  listing_id: number;
  starting_bid: number;
  reserve_price?: number;
  end_date: string;
}

interface AuctionUpdateRequest {
  starting_bid?: number;
  reserve_price?: number;
  end_date?: string;
  status?: 'active' | 'ended' | 'cancelled';
}

// ============ Message Types ============
interface Conversation {
  id: number;
  listing_id: number | null;
  participant1_id: number;
  participant2_id: number;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessageCreateRequest {
  content: string;
}

interface ConversationCreateRequest {
  listing_id?: number;
  recipient_id: number;
}

// ============ Review Types ============
interface Review {
  id: number;
  listing_id: number;
  order_id: number;
  reviewer_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewCreateRequest {
  listing_id: number;
  order_id: number;
  rating: number;
  comment?: string;
}

// ============ Support Types ============

// ============ FAQ Types ============
interface FAQCreateRequest {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_active?: boolean;
}

// ============ Blog Types ============
interface BlogPost {
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

interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published';
}

// ============ Dispute Types ============
interface Dispute {
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

interface DisputeCreateRequest {
  order_id: number;
  reason: string;
  description: string;
}

interface DisputeComment {
  id: number;
  dispute_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

// ============ Dashboard Types ============
interface AdminDashboard {
  total_users: number;
  active_listings: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  active_disputes: number;
  recent_orders: Order[];
  recent_users: UserResponse[];
}

interface SellerDashboard {
  total_listings: number;
  active_listings: number;
  total_sales: number;
  total_revenue: number;
  pending_orders: number;
  active_offers: number;
  recent_orders: Order[];
  recent_listings: Listing[];
}

interface BuyerDashboard {
  total_orders: number;
  active_orders: number;
  total_spent: number;
  favorite_listings: number;
  pending_offers: number;
  recent_orders: Order[];
  favorite_listings_data: Listing[];
}

interface PasswordUpdateRequest {
  current_password: string;
  new_password: string;
}

interface PasswordResetRequest {
  new_password: string;
}

interface UserStats {
  total_listings: number;
  total_orders: number;
  total_revenue: number;
  total_spent: number;
  average_rating: number | null;
}


// ============ Filter Types ============



