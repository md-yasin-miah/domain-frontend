/**
 * Payment API Types
 */

interface Payment {
  id: number;
  payment_number: string;
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  paid_at: string | null;
  processed_at: string | null;
  refunded_at: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  created_at: string;
  updated_at: string;
  order?: {
    id: number;
    order_number: string;
    status: string;
  } | null;
}

interface PaymentCreateRequest {
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id?: string;
  additional_metadata?: Record<string, any>;
}

interface PaymentUpdateRequest {
  status?: string;
  transaction_id?: string;
  provider_response?: Record<string, any>;
  refund_amount?: number;
  refund_reason?: string;
  refund_transaction_id?: string;
  additional_metadata?: Record<string, any>;
}

interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

interface PaymentIntentStatus {
  status: string;
  payment_intent_id: string | null;
}

interface PaymentMethod {
  id: string;
  name: string;
  display_name: string;
  description: string;
  enabled: boolean;
  supported_currencies: string[];
  icon: string;
  requires_redirect: boolean;
}

