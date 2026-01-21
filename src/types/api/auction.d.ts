// Auction types based on backend API

interface UserBasicInfo {
  id: number;
  username: string;
  email: string;
}

interface ListingBasicInfo {
  id: number;
  title: string;
  slug: string;
  price: number;
}

interface Auction {
  id: number;
  listing_id: number;
  starting_price: number;
  reserve_price: number | null;
  bid_increment: number;
  current_bid: number | null;
  current_bidder_id: number | null;
  bid_count: number;
  starts_at: string;
  ends_at: string;
  auto_extend_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  current_bidder: UserBasicInfo | null;
  listing: ListingBasicInfo | null;
}

interface Bid {
  id: number;
  auction_id: number;
  bidder_id: number;
  amount: number;
  status: string; // "active" | "outbid" | "withdrawn"
  is_winning_bid: boolean;
  created_at: string;
  bidder: UserBasicInfo | null;
}

interface BidCreateRequest {
  amount: number;
}

interface AuctionCreateRequest {
  listing_id: number;
  starting_price: number;
  reserve_price?: number | null;
  bid_increment: number;
  starts_at: string;
  ends_at: string;
  auto_extend_minutes?: number;
}

interface AuctionUpdateRequest {
  starting_price?: number;
  reserve_price?: number | null;
  bid_increment?: number;
  starts_at?: string;
  ends_at?: string;
  auto_extend_minutes?: number;
  is_active?: boolean;
}

interface AuctionFilters extends PaginationParams {
  listing_id?: number;
  is_active?: boolean;
}
