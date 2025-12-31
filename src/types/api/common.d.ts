
// ============ Pagination Types ============
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
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
  detail: string | Array<{
    type: string;
    loc: (string | number)[];
    msg: string;
    input: any;
  }>;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
