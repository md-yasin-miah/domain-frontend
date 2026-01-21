interface SavedSearch {
  id: number;
  user_id: number;
  name: string;
  listing_type_id: number | null;
  status: string | null;
  min_price: number | null;
  max_price: number | null;
  currency: string | null;
  domain_extension: string | null;
  min_domain_age: number | null;
  max_domain_age: number | null;
  min_traffic: number | null;
  max_traffic: number | null;
  min_revenue: number | null;
  max_revenue: number | null;
  search_text: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SavedSearchCreateRequest {
  name: string;
  listing_type_id?: number | null;
  status?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  currency?: string | null;
  domain_extension?: string | null;
  min_domain_age?: number | null;
  max_domain_age?: number | null;
  min_traffic?: number | null;
  max_traffic?: number | null;
  min_revenue?: number | null;
  max_revenue?: number | null;
  search_text?: string | null;
}

interface SavedSearchUpdateRequest {
  name?: string;
  is_active?: boolean;
  listing_type_id?: number | null;
  status?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  currency?: string | null;
  domain_extension?: string | null;
  min_domain_age?: number | null;
  max_domain_age?: number | null;
  min_traffic?: number | null;
  max_traffic?: number | null;
  min_revenue?: number | null;
  max_revenue?: number | null;
  search_text?: string | null;
}

interface SavedSearchFilters extends PaginationParams {
  is_active?: boolean;
}
