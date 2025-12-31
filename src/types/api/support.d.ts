/**
 * Support & FAQ API Types
 */

interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

interface TicketCreateRequest {
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

interface FAQCreateRequest {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_active?: boolean;
}

