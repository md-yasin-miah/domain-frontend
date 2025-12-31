/**
 * Marketplace API Types
 */
// ============ Listing Types ============
interface Listing {
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

interface OrderCreateRequest {
  listing_id: number;
  final_price?: number;
  currency?: string;
  offer_id?: number;
}

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
interface Offer {
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

interface OfferCreateRequest {
  listing_id: number;
  amount: number;
  currency: string;
  message?: string;
}

interface OfferCounterRequest {
  amount: number;
  message?: string;
}

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
  recent_users: import('./user').UserResponse[];
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

