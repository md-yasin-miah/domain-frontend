// ============ Role Types ============
interface Role {
  id: number;
  name: string;
  description: string | null;
}

// ============ Filter Types ============
interface ListingFilters extends PaginationParams {
  status?: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
  listing_type_id?: number;
  seller_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
}

interface OrderFilters extends PaginationParams {
  buyer_id?: number;
  seller_id?: number;
  status?: string;
}