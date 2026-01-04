interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: 'support' | 'faq' | 'blog';
  created_at: string;
  updated_at: string;
}

interface CategoryCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  type: 'support' | 'faq' | 'blog';
}

interface CategoryUpdateRequest {
  name?: string;
  slug?: string;
  description?: string;
}