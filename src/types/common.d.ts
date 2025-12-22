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
}