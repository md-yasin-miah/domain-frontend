interface Offer {
  amount: string,
  currency: currency,
  message: string,
  expires_at: string | null,
  id: number,
  listing_id: number,
  buyer_id: number,
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  counter_offer_id: number | null,
  created_at: string,
  updated_at: string,
  buyer: UserMini,
  listing: {
    id: number,
    title: string,
    slug: string,
    price: number,
    currency: Currency
  }
}

interface OfferCreateRequest {
  amount: number;
  currency: Currency;
  message: string;
  expires_at?: string;
  listing_id: number;
}

interface OfferCounterRequest {
  amount: number;
  message?: string;
}

interface ClientFiltersParams extends PaginationParams {
  listing_id?: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  buyer_id?: number;
}