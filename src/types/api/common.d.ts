
// ============ Pagination Types ============
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number,
    page: number,
    page_size: number,
    total_pages: number,
    has_next: boolean,
    has_previous: boolean
  }
}

interface PaginationParams {
  skip?: number;
  limit?: number;
  page?: number;
  size?: number;
  search?: string;
}

// ============ Error Types ============
interface ApiError {
  data?: { detail: string }
  status?: number;
}
interface ApiFormPostError {
  data?: {
    detail: Array<{
      type: string;
      loc: (string | number)[];
      msg: string;
      input: any;
    }>;
  }
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

type Currency = 'USD'