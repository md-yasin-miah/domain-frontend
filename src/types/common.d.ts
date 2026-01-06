// ============ Role Types ============
interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string[];
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

interface MenuSubItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
  subItems?: MenuSubItem[];
}
