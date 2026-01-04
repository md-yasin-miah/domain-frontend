interface FAQ {
  question: string;
  answer: string;
  category_id: number,
  is_active: boolean,
  order: number,
  id: number,
  created_by_id: number,
  created_at: string,
  updated_at: string,
  created_by: {
    id: number,
    username: string,
    email: string,
  },
  category: {
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    id: number;
    order: number;
    created_at: string;
    updated_at: string;
  }
}

interface FAQCreateRequest {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_active?: boolean;
}
