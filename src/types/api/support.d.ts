interface SupportTicket {
  title: string;
  description: string;
  category_id: number | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  id: number;
  created_by_id: number;
  assigned_to_id: number | null;
  created_at: string;
  updated_at: string;
  created_by: UserMini | null;
  assigned_to: UserMini | null;
  category: Category | null;
}

interface TicketCreateRequest {
  title: string;
  description: string;
  msg?: string;
  category_id: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to_id?: number | null;
  user_id?: number | null;
}

interface TicketUpdateRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  category_id?: number | null;
  assigned_to_id?: number | null;
}

interface SupportTicketFilters extends PaginationParams {
  status?: string;
  category_id?: number;
  created_by_id?: number;
  assigned_to_id?: number;
}


