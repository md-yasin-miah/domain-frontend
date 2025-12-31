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

interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

interface PaymentIntentStatus {
  status: string;
  payment_intent_id: string | null;
}

