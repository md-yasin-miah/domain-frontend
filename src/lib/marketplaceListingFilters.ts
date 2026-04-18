/** Client-side filter criteria aligned with `MarketplaceListing` fields. */
export interface MarketplaceListingFilterCriteria {
  search?: string;
  min_price?: number;
  max_price?: number;
  statuses?: MarketplaceListing["status"][];
  min_website_revenue_monthly?: number;
  max_website_revenue_monthly?: number;
  min_website_profit_monthly?: number;
  max_website_profit_monthly?: number;
  min_website_traffic_monthly?: number;
  max_website_traffic_monthly?: number;
  /** Normalized extensions e.g. `.com`, `.io` — matched against `domain_extension` */
  domain_extensions?: string[];
  min_domain_age_years?: number;
  max_domain_age_years?: number;
  /** `true`: monthly revenue > 0; `false`: null or <= 0 */
  revenue_generating?: boolean;
  is_featured?: boolean;
  is_price_negotiable?: boolean;
}

function toNumber(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number")
    return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function normalizeExtension(ext: string | null | undefined): string {
  if (!ext) return "";
  const e = ext.trim().toLowerCase();
  return e.startsWith(".") ? e : `.${e}`;
}

export function applyMarketplaceListingFilters(
  listings: MarketplaceListing[],
  criteria: MarketplaceListingFilterCriteria,
): MarketplaceListing[] {
  const hasAnyCriteria = Object.keys(criteria).some(
    (k) =>
      criteria[k as keyof MarketplaceListingFilterCriteria] !== undefined,
  );
  if (!hasAnyCriteria) return listings;

  return listings.filter((listing) => {
    if (criteria.search) {
      const q = criteria.search.trim().toLowerCase();
      const blob = [
        listing.title,
        listing.short_description,
        listing.description,
        listing.domain_name ?? "",
        listing.slug,
        listing.website_url ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }

    if (criteria.statuses?.length) {
      if (!criteria.statuses.includes(listing.status)) return false;
    }

    const price = toNumber(listing.price);
    if (
      criteria.min_price != null &&
      price != null &&
      price < criteria.min_price
    )
      return false;
    if (
      criteria.max_price != null &&
      price != null &&
      price > criteria.max_price
    )
      return false;

    const rev = toNumber(listing.website_revenue_monthly);
    if (criteria.revenue_generating === true) {
      if (rev == null || rev <= 0) return false;
    } else if (criteria.revenue_generating === false) {
      if (rev != null && rev > 0) return false;
    }
    if (
      criteria.min_website_revenue_monthly != null &&
      (rev == null || rev < criteria.min_website_revenue_monthly)
    )
      return false;
    if (
      criteria.max_website_revenue_monthly != null &&
      (rev == null || rev > criteria.max_website_revenue_monthly)
    )
      return false;

    const prof = toNumber(listing.website_profit_monthly);
    if (
      criteria.min_website_profit_monthly != null &&
      (prof == null || prof < criteria.min_website_profit_monthly)
    )
      return false;
    if (
      criteria.max_website_profit_monthly != null &&
      (prof == null || prof > criteria.max_website_profit_monthly)
    )
      return false;

    const traffic = listing.website_traffic_monthly;
    const trafficNum =
      typeof traffic === "number" && Number.isFinite(traffic)
        ? traffic
        : null;
    if (
      criteria.min_website_traffic_monthly != null &&
      (trafficNum == null || trafficNum < criteria.min_website_traffic_monthly)
    )
      return false;
    if (
      criteria.max_website_traffic_monthly != null &&
      (trafficNum == null || trafficNum > criteria.max_website_traffic_monthly)
    )
      return false;

    if (criteria.domain_extensions?.length) {
      const ext = normalizeExtension(listing.domain_extension);
      const allowed = criteria.domain_extensions.map((e) =>
        normalizeExtension(e),
      );
      if (!ext || !allowed.includes(ext)) return false;
    }

    const age = listing.domain_age_years;
    if (
      criteria.min_domain_age_years != null &&
      (age == null || age < criteria.min_domain_age_years)
    )
      return false;
    if (
      criteria.max_domain_age_years != null &&
      (age == null || age > criteria.max_domain_age_years)
    )
      return false;

    if (criteria.is_featured === true && !listing.is_featured) return false;
    if (criteria.is_price_negotiable === true && !listing.is_price_negotiable)
      return false;

    return true;
  });
}
