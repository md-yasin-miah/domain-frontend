interface Escrow {
  id: number;
  escrow_number: string;
  order_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  platform_fee: number;
  seller_amount: number;
  currency: string;
  status: 'pending' | 'released' | 'refunded' | 'disputed';
  held_at: string;
  released_at: string | null;
  refunded_at: string | null;
  released_by_id: number | null;
  refunded_by_id: number | null;
  release_reason: string | null;
  refund_reason: string | null;
  dispute_id: number | null;
  payment_id: number | null;
  created_at: string;
  updated_at: string;
  buyer?: {
    id: number;
    email: string;
    username: string | null;
  } | null;
  seller?: {
    id: number;
    email: string;
    username: string | null;
  } | null;
  order?: {
    id: number;
    order_number: string;
    status: string;
  } | null;
}

interface EscrowCreateRequest {
  order_id: number;
  amount: number;
  platform_fee: number;
  seller_amount: number;
  currency?: string;
  payment_id?: number;
  additional_metadata?: Record<string, any>;
}

interface EscrowReleaseRequest {
  release_reason?: string;
  force?: boolean;
}

interface EscrowRefundRequest {
  refund_reason?: string;
  force?: boolean;
}

interface EscrowUpdateRequest {
  status?: string;
  release_reason?: string;
  refund_reason?: string;
  dispute_id?: number;
  additional_metadata?: Record<string, any>;
}