// ============ Pagination (used by API slices) ============
interface PaginationParams {
  skip?: number;
  limit?: number;
}

/** Extended params for listing users (search + pagination) */
interface UsersListParams extends PaginationParams {
  search?: string;
  role?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
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
  category_id?: number | null;
  order?: number;
  is_active?: boolean;
}

// ============ Blog Types ============
interface BlogPostAuthor {
  id: number;
  username: string;
  email: string;
}

interface BlogPostCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
  order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: number;
  author?: BlogPostAuthor | null;
  category_id: number | null;
  category?: BlogPostCategory | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface BlogPostCreateRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  category_id?: number | null;
  published_at?: string | null;
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
