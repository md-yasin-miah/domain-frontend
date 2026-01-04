interface Invoice {
  id: number;
  invoice_number: string;
  order_id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

interface InvoiceCreateRequest {
  order_id: number;
  amount: number;
  currency?: string;
  due_date?: string;
}

interface InvoiceUpdateRequest {
  amount?: number;
  currency?: string;
  status?: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issue_date?: string;
  due_date?: string;
}
