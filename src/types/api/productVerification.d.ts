
interface ProductVerification {
  id: number;
  user_id: number;
  listing_id: number | null;
  product_type: 'domain' | 'website';
  domain_name: string | null;
  domain_extension: string | null;
  website_url: string | null;
  verification_method: 'dns' | 'file_upload';
  verification_token: string;
  verification_code: string;
  dns_record_data: {
    type: string;
    name: string;
    value: string;
    full_record: string;
    instructions: string;
  } | null;
  verification_file_data: {
    file_path: string;
    file_url: string;
    filename: string;
    verification_code: string;
    instructions: string;
  } | null;
  status: 'pending' | 'verified' | 'rejected' | 'expired' | 'failed';
  verified_at: string | null;
  verified_by_id: number | null;
  verification_attempts: number;
  last_verification_check: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface ProductVerificationFilters {
  status?: 'pending' | 'verified' | 'rejected' | 'expired' | 'failed';
  product_type?: 'domain' | 'website';
}

interface ProductVerificationCreateRequest {
  product_type: string;
  domain_name?: string;
  domain_extension?: string;
  website_url?: string;
}

interface ProductVerificationStatusResponse {
  id: number;
  status: 'pending' | 'verified' | 'rejected' | 'expired' | 'failed';
  verification_method: 'dns' | 'file_upload' | null;
  is_verified: boolean;
  verified_at: string | null;
  verification_attempts: number;
  last_verification_check: string | null;
  expires_at: string | null;
  can_create_listing: boolean;
  listing_id: number | null;
  message: string | null;
}

interface CreateListingFromVerificationRequest {
  title: string;
  description: string;
  short_description?: string | null;
  price: number | string;
  currency?: string;
  is_price_negotiable?: boolean;
  listing_type_id: number;
  // Additional optional fields
  domain_age_years?: number | null;
  domain_authority?: number | null;
  domain_backlinks?: number | null;
  website_traffic_monthly?: number | null;
  website_revenue_monthly?: number | string | null;
  website_profit_monthly?: number | string | null;
  website_technology?: string | null;
  status?: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
  primary_image_url?: string | null;
  image_urls?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
}
interface ProductVerificationVerifyResponse {
  id: number;
  status: 'pending' | 'verified' | 'rejected' | 'expired' | 'failed';
  verification_method: 'dns' | 'file_upload';
  is_verified: boolean;
  verified_at: string | null;
  verification_attempts: number;
  last_verification_check: string | null;
  expires_at: string;
  can_create_listing: boolean;
  listing_id: number | null;
  message: string;
}