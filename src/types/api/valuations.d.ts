/** Types for GET /valuations/auto (AutoValuationResponse) and nested structures */

interface MarketRankInfo {
  rank: number;
  total_count: number;
  percentile: number;
  tier: string; // "premium" | "mid-market" | "entry"
}

interface ComparableSaleSummary {
  domain_name: string;
  domain_extension: string;
  sale_price: number;
  sale_date: string;
  currency: string;
}

interface MarketTrendSummary {
  trend_key: string;
  average_sale_price: number;
  median_sale_price: number;
  price_change_percentage: number | null;
  total_sales_count: number;
  period_end: string;
  currency: string;
}

interface DomainInfo {
  domain_age_years?: number | null;
  creation_date?: string | null;
  expiration_date?: string | null;
  registrar?: string | null;
  name_servers?: string[] | null;
  updated_date?: string | null;
  page_links_count?: number | null;
}

interface AutoValuationResponse {
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
interface AutoValuationParams {
  domain: string;
  domain_age_years?: number;
  domain_authority_score?: number;
  backlinks_count?: number;
  monthly_traffic?: number;
  monthly_revenue?: number;
}
interface Valuation {
  id: number;
  listing_id: number | null;
  valuation_type: string;
  domain_name: string | null;
  domain_extension: string | null;
  estimated_value: number;
  min_estimate: number | null;
  max_estimate: number | null;
  currency: string;
  domain_length_score: number | null;
  domain_age_years: number | null;
  domain_authority_score: number | null;
  backlinks_count: number | null;
  monthly_traffic: number | null;
  monthly_revenue: number | null;
  comparable_sales_count: number;
  calculated_at: string;
  created_at: string;
  updated_at: string;
  valuation_data: Record<string, unknown> | null;
}

interface ValuationFilters extends PaginationParams {
  listing_id?: number;
  valuation_type?: string;
}

interface ValuationUpdateRequest {
  estimated_value?: number;
  min_estimate?: number;
  max_estimate?: number;
  valuation_data?: Record<string, unknown>;
}

/** Matches backend ComparableSaleResponse */
interface ComparableSale {
  id: number;
  domain_name: string;
  domain_extension: string;
  sale_price: number;
  currency: string;
  sale_date: string;
  sale_source: string | null;
  buyer_type: string | null;
  domain_length: number | null;
  domain_age_years: number | null;
  has_numbers: boolean;
  has_hyphens: boolean;
  created_at: string;
}

interface ComparableSaleCreateRequest {
  domain_name: string;
  domain_extension: string;
  sale_price: number;
  currency?: string;
  sale_date: string;
  sale_source?: string | null;
  buyer_type?: string | null;
  domain_age_years?: number | null;
}

interface ComparableSaleFilters extends PaginationParams {
  domain_extension?: string;
  min_price?: number;
  max_price?: number;
}

interface ComparableSaleUpdateRequest {
  sale_price?: number;
  sale_date?: string;
  sale_source?: string | null;
  buyer_type?: string | null;
}

/** Matches backend MarketTrendResponse */
interface MarketTrend {
  id: number;
  trend_type: string;
  trend_key: string;
  period_start: string;
  period_end: string;
  average_sale_price: number;
  median_sale_price: number;
  total_sales_count: number;
  total_sales_volume: number;
  price_change_percentage: number | null;
  sales_count_change_percentage: number | null;
  currency: string;
  trend_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface MarketTrendFilters extends PaginationParams {
  trend_type?: string;
  trend_key?: string;
}

interface MarketTrendCreateRequest {
  trend_type: string;
  trend_key: string;
  period_start: string;
  period_end: string;
  average_sale_price: number;
  median_sale_price: number;
  total_sales_count: number;
  total_sales_volume: number;
  price_change_percentage?: number | null;
  sales_count_change_percentage?: number | null;
  currency?: string;
  trend_data?: Record<string, unknown> | null;
}

interface MarketTrendUpdateRequest {
  average_sale_price?: number;
  median_sale_price?: number;
  total_sales_count?: number;
  total_sales_volume?: number;
  price_change_percentage?: number | null;
  sales_count_change_percentage?: number | null;
  trend_data?: Record<string, unknown> | null;
}

/** GET /valuations/market-trends/insights */
interface MarketTrendInsightsResponse {
  summary: string;
  key_trends: string[];
  extension_highlights: { extension: string; insight: string }[];
  recommendations: string[];
  generated_at: string;
  data_used?: Record<string, unknown> | null;
}

interface MarketTrendInsightsParams {
  limit_sales?: number;
  limit_trends?: number;
  include_data_used?: boolean;
}

/** Params for POST /valuations/calculate (query params) */
interface ValuationCalculateParams {
  domain_name: string;
  domain_extension: string;
  domain_age_years?: number;
  domain_authority_score?: number;
  backlinks_count?: number;
  monthly_traffic?: number;
  monthly_revenue?: number;
}
