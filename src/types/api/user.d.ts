interface UserMini {
  id: number;
  username: string;
  email: string;
}
interface UserResponse {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_profile_complete?: boolean;
  profile: UserProfile | null;
  roles: Role[];
  created_at: string;
}

interface UserProfile {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  address_line1: string | null;
  address_line2?: string | null;
  city: string | null;
  state?: string | null;
  country: string | null;
  postal_code: string | null;
  company_name: string | null;
  website: string | null;
  social_links?: {
    [key: string]: string;
  } | null;
  is_verified: boolean;
  verification_date?: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileCreateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  company_name?: string;
  website?: string;
  social_links?: {
    [key: string]: string;
  } | null;
}

interface ProfileCompletionResponse {
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
}

interface UserCreateRequest {
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
}

interface UserUpdateRequest {
  email?: string;
  username?: string;
  is_active?: boolean;
}

interface PasswordUpdateRequest {
  current_password: string;
  new_password: string;
}

interface PasswordResetRequest {
  new_password: string;
}

interface UserStats {
  total_listings: number;
  total_orders: number;
  total_revenue: number;
  total_spent: number;
  average_rating: number | null;
}
