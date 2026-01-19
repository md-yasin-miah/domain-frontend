interface Invoice {
  order_id: number,
  subtotal: number,
  platform_fee: number,
  total_amount: number,
  currency: string,
  id: number,
  invoice_number: string,
  buyer_id: number,
  seller_id: number,
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string | null,
  due_date: string | null,
  issued_at: string | null,
  paid_at: string | null,
  pdf_file_url: string | null,
  created_at: string,
  updated_at: string
}
interface InvoiceCreateRequest {
  order_id: number,
  subtotal: number,
  platform_fee: number,
  total_amount: number,
  currency: string
}

interface InvoiceUpdateRequest {
  amount?: number;
  currency?: string;
  status?: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issue_date?: string;
  due_date?: string;
}
interface InvoiceQueryParams extends PaginationParams {
  buyer_id?: number;
  seller_id?: number;
  status?: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  order_id?: number;
}
