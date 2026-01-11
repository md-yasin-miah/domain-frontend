
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
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verified_at: string | null;
  verified_by_id: number | null;
  verification_attempts: number;
  last_verification_check: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface ProductVerificationFilters {
  status?: 'pending' | 'verified' | 'rejected' | 'expired';
  product_type?: 'domain' | 'website';
}

interface ProductVerificationCreateRequest {
  product_type: string;
  domain_name?: string;
  domain_extension?: string;
  website_url?: string;
}
