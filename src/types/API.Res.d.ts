interface ClientProfile {
  first_name: string,
  last_name: string,
  phone: string,
  bio: string,
  avatar_url: string,
  address_line1: string,
  address_line2: string,
  city: string,
  state: string,
  country: string,
  postal_code: string,
  company_name: string,
  website: string,
  social_links: {
    [key: string]: string
  } | null,
  id: number,
  user_id: number,
  is_verified: boolean,
  verification_date: string,
  created_at: string,
  updated_at: string
}