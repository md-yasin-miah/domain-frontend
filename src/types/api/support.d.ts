interface SupportTicket {
  title: string;
  description: string;
  category_id: number;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  id: number,
  created_by_id: number,
  assigned_to_id: number | null,
  created_at: string,
  updated_at: string,
  created_by: UserMini,
  assigned_to: UserMini | null,
  category: Category,
}

interface TicketCreateRequest {
  subject: string;
  description: string;
  category_id: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}


