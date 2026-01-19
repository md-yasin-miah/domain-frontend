interface MarketplaceListingFilters extends PaginationParams {
  status?: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
  listing_type_id?: number;
  seller_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
}
interface MarketplaceListingType {
  id: number,
  name: string,
  slug: string,
  icon: string,
  description: string,
  is_active: boolean,
  created_at: string,
  updated_at: string
}
interface MarketplaceListing {
  id: number,
  title: string,
  slug: string,
  description: string,
  short_description: string,
  listing_type_id: number,
  price: number | string,
  currency: 'USD' | string,
  is_price_negotiable: boolean,
  domain_name: string | null,
  domain_extension: string | null,
  domain_age_years: number | null,
  domain_authority: number | null,
  domain_backlinks: number | null,
  website_url: string,
  website_traffic_monthly: number,
  website_revenue_monthly: number | string,
  website_profit_monthly: number | string,
  website_technology: string,
  status: 'draft' | 'active' | 'sold' | 'expired' | 'suspended',
  is_featured: boolean,
  primary_image_url: string,
  image_urls: string[] | null,
  meta_title: string | null,
  meta_description: string | null,
  additional_metadata: object | null,
  expires_at: string | null,
  seller_id: number,
  view_count: number,
  favorite_count: number,
  sold_at: string | null,
  sold_to_user_id: number | null,
  sold_price: number | null,
  created_at: string,
  updated_at: string,
  seller: {
    id: number,
    username: string,
    email: string
  },
  listing_type: MarketplaceListingType,
  is_favorited: boolean


  // self added asper UI design
  is_auto_renew: boolean,
  dns_records: string,
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

