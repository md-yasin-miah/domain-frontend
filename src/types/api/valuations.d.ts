/** Types for GET /valuations/auto (AutoValuationResponse) and nested structures */

export interface MarketRankInfo {
  rank: number;
  total_count: number;
  percentile: number;
  tier: string; // "premium" | "mid-market" | "entry"
}

export interface ComparableSaleSummary {
  domain_name: string;
  domain_extension: string;
  sale_price: number;
  sale_date: string;
  currency: string;
}

export interface MarketTrendSummary {
  trend_key: string;
  average_sale_price: number;
  median_sale_price: number;
  price_change_percentage: number | null;
  total_sales_count: number;
  period_end: string;
  currency: string;
}

export interface DomainInfo {
  domain_age_years?: number | null;
  creation_date?: string | null;
  expiration_date?: string | null;
  registrar?: string | null;
  name_servers?: string[] | null;
  updated_date?: string | null;
  page_links_count?: number | null;
}

export interface AutoValuationResponse {
  domain: string;
  domain_name: string;
  domain_extension: string;
  estimated_value: number;
  min_estimate: number;
  max_estimate: number;
  currency: string;
  domain_length_score?: number | null;
  domain_age_years?: number | null;
  domain_authority_score?: number | null;
  backlinks_count?: number | null;
  monthly_traffic?: number | null;
  monthly_revenue?: number | null;
  comparable_sales_count: number;
  valuation_data?: Record<string, unknown> | null;
  calculated_at: string;
  market_rank?: MarketRankInfo | null;
  recent_comparable_sales: ComparableSaleSummary[];
  market_trend?: MarketTrendSummary | null;
  valuation_id?: number | null;
  domain_info?: DomainInfo | null;
}

/** Query params for GET /valuations/auto */
export interface AutoValuationParams {
  domain: string;
  domain_age_years?: number;
  domain_authority_score?: number;
  backlinks_count?: number;
  monthly_traffic?: number;
  monthly_revenue?: number;
}
