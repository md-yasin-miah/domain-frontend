
interface Order {
  listing_id: number,
  final_price: number | string,
  currency: string,
  id: number,
  order_number: string,
  buyer_id: number,
  seller_id: number,
  listing_price: number | string,
  platform_fee: number | string,
  seller_amount: number | string,
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded',
  payment_method: string | null,
  payment_transaction_id: number | null,
  paid_at: string | null,
  completed_at: string | null,
  cancelled_at: string | null,
  cancellation_reason: string | null,
  created_at: string,
  updated_at: string,
  buyer: UserMini,
  seller: UserMini,
  listing: {
    id: number,
    title: string,
    slug: string,
    price: number,
  }
}
interface OrderCreateRequest {
  listing_id: number;
  final_price?: number;
  currency?: string;
  offer_id?: number;
}
interface OrderFilters extends PaginationParams {
  buyer_id?: number;
  seller_id?: number;
  status?: string;
  listing_id?: number;
}