interface SavedSearch {
  id: number;
  user_id: number;
  name: string;
  search_params: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface SavedSearchCreateRequest {
  name: string;
  search_params: Record<string, any>;
}

interface SavedSearchUpdateRequest {
  name?: string;
  search_params?: Record<string, any>;
}
