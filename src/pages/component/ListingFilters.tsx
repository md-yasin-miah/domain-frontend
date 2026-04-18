import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { MarketplaceListingFilterCriteria } from "@/lib/marketplaceListingFilters";

export type ListingFiltersValue = MarketplaceListingFilterCriteria;

type SectionKey =
  | "status"
  | "revenueGenerating"
  | "revenue"
  | "profit"
  | "traffic"
  | "extensions"
  | "domainAge"
  | "price"
  | "options";

const extensions = [
  ".com",
  ".org",
  ".net",
  ".io",
  ".co",
  ".info",
  ".club",
  ".online",
  ".co.uk",
  ".com.au",
];

const STATUS_KEYS: {
  key: string;
  label: string;
  value: MarketplaceListing["status"];
}[] = [
  { key: "st_active", label: "Active", value: "active" },
  { key: "st_pending", label: "Pending", value: "pending" },
  { key: "st_sold", label: "Sold", value: "sold" },
  { key: "st_draft", label: "Draft", value: "draft" },
  { key: "st_expired", label: "Expired", value: "expired" },
  { key: "st_suspended", label: "Suspended", value: "suspended" },
];

interface ListingFiltersProps {
  onFiltersChange?: (filters: ListingFiltersValue) => void;
}

const toNumberOrUndefined = (raw: string): number | undefined => {
  const t = raw.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isNaN(n) ? undefined : n;
};

const ListingFilters = ({ onFiltersChange }: ListingFiltersProps) => {
  const [panelVisible, setPanelVisible] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
    status: true,
    revenueGenerating: true,
    revenue: true,
    profit: true,
    traffic: true,
    extensions: true,
    domainAge: true,
    price: true,
    options: true,
  });

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      revenue_yes: false,
      revenue_no: false,
      featured_only: false,
      negotiable_only: false,
    };
    for (const { key } of STATUS_KEYS) initial[key] = false;
    for (const ext of extensions) initial[`ext_${ext}`] = false;
    return initial;
  });

  const [ranges, setRanges] = useState({
    revenueMin: "",
    revenueMax: "",
    profitMin: "",
    profitMax: "",
    trafficMin: "",
    trafficMax: "",
    priceMin: "",
    priceMax: "",
    domainAgeMin: "",
    domainAgeMax: "",
  });

  const toggleSection = (key: SectionKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChecked = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setKeyword("");
    setChecked(() => {
      const next: Record<string, boolean> = {
        revenue_yes: false,
        revenue_no: false,
        featured_only: false,
        negotiable_only: false,
      };
      for (const { key } of STATUS_KEYS) next[key] = false;
      for (const ext of extensions) next[`ext_${ext}`] = false;
      return next;
    });
    setRanges({
      revenueMin: "",
      revenueMax: "",
      profitMin: "",
      profitMax: "",
      trafficMin: "",
      trafficMax: "",
      priceMin: "",
      priceMax: "",
      domainAgeMin: "",
      domainAgeMax: "",
    });
  };

  useEffect(() => {
    const statuses = STATUS_KEYS.filter(({ key }) => checked[key]).map(
      ({ value }) => value,
    );

    const revenueYes = Boolean(checked.revenue_yes);
    const revenueNo = Boolean(checked.revenue_no);
    let revenue_generating: boolean | undefined;
    if (revenueYes && !revenueNo) revenue_generating = true;
    else if (revenueNo && !revenueYes) revenue_generating = false;

    const domain_extensions = extensions
      .filter((ext) => checked[`ext_${ext}`])
      .map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));

    const payload: ListingFiltersValue = {
      search: keyword.trim() || undefined,
      min_price: toNumberOrUndefined(ranges.priceMin),
      max_price: toNumberOrUndefined(ranges.priceMax),
      statuses: statuses.length ? statuses : undefined,
      min_website_revenue_monthly: toNumberOrUndefined(ranges.revenueMin),
      max_website_revenue_monthly: toNumberOrUndefined(ranges.revenueMax),
      min_website_profit_monthly: toNumberOrUndefined(ranges.profitMin),
      max_website_profit_monthly: toNumberOrUndefined(ranges.profitMax),
      min_website_traffic_monthly: toNumberOrUndefined(ranges.trafficMin),
      max_website_traffic_monthly: toNumberOrUndefined(ranges.trafficMax),
      domain_extensions: domain_extensions.length ? domain_extensions : undefined,
      min_domain_age_years: toNumberOrUndefined(ranges.domainAgeMin),
      max_domain_age_years: toNumberOrUndefined(ranges.domainAgeMax),
      revenue_generating,
      is_featured: checked.featured_only ? true : undefined,
      is_price_negotiable: checked.negotiable_only ? true : undefined,
    };

    onFiltersChange?.(payload);
  }, [keyword, ranges, checked, onFiltersChange]);

  const SectionHeader = ({
    title,
    sectionKey,
  }: {
    title: string;
    sectionKey: SectionKey;
  }) => (
    <button
      type="button"
      className="flex w-full items-center justify-between text-left"
      onClick={() => toggleSection(sectionKey)}
    >
      <span className="text-sm font-semibold">{title}</span>
      {expanded[sectionKey] ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );

  const CheckboxRow = ({ label, value }: { label: string; value: string }) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox
        checked={Boolean(checked[value])}
        onCheckedChange={() => toggleChecked(value)}
      />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="w-full rounded-lg border bg-card p-4 md:p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground md:hidden"
          onClick={() => setPanelVisible((prev) => !prev)}
        >
          <Filter className="h-4 w-4" />
          Filter By
        </button>
        <div className="hidden items-center gap-2 text-sm font-medium text-muted-foreground md:inline-flex">
          <Filter className="h-4 w-4" />
          Filter By
        </div>
        <Button
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={clearFilters}
        >
          Clear
        </Button>
      </div>

      <Separator className="my-4" />

      <div className={panelVisible ? "block" : "hidden md:block"}>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Search</h3>
          <p className="mb-2 text-xs text-muted-foreground">
            Matches title, descriptions, domain name, slug, website URL
          </p>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Keyword"
          />
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="status" title="Status" />
          {expanded.status && (
            <div className="grid grid-cols-1 gap-2 pl-1 sm:grid-cols-2">
              {STATUS_KEYS.map(({ key, label }) => (
                <CheckboxRow key={key} label={label} value={key} />
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader
            sectionKey="revenueGenerating"
            title="Revenue-generating"
          />
          {expanded.revenueGenerating && (
            <div className="space-y-2 pl-1">
              <CheckboxRow
                label="Yes (monthly revenue > 0)"
                value="revenue_yes"
              />
              <CheckboxRow label="No (no or zero revenue)" value="revenue_no" />
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="revenue" title="Monthly revenue" />
          {expanded.revenue && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                value={ranges.revenueMin}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, revenueMin: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="Max"
                value={ranges.revenueMax}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, revenueMax: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="profit" title="Monthly profit" />
          {expanded.profit && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                value={ranges.profitMin}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, profitMin: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="Max"
                value={ranges.profitMax}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, profitMax: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="traffic" title="Monthly traffic" />
          {expanded.traffic && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                value={ranges.trafficMin}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, trafficMin: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="Max"
                value={ranges.trafficMax}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, trafficMax: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="extensions" title="Domain extension" />
          {expanded.extensions && (
            <div className="grid grid-cols-2 gap-2 pl-1">
              {extensions.map((ext) => (
                <CheckboxRow key={ext} label={ext} value={`ext_${ext}`} />
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="domainAge" title="Domain age (years)" />
          {expanded.domainAge && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min years"
                value={ranges.domainAgeMin}
                onChange={(e) =>
                  setRanges((prev) => ({
                    ...prev,
                    domainAgeMin: e.target.value,
                  }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="Max years"
                value={ranges.domainAgeMax}
                onChange={(e) =>
                  setRanges((prev) => ({
                    ...prev,
                    domainAgeMax: e.target.value,
                  }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="price" title="Price" />
          {expanded.price && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                value={ranges.priceMin}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, priceMin: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="Max"
                value={ranges.priceMax}
                onChange={(e) =>
                  setRanges((prev) => ({ ...prev, priceMax: e.target.value }))
                }
                className="h-fit rounded-sm px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3">
          <SectionHeader sectionKey="options" title="Listing options" />
          {expanded.options && (
            <div className="space-y-2 pl-1">
              <CheckboxRow label="Featured only" value="featured_only" />
              <CheckboxRow
                label="Price negotiable only"
                value="negotiable_only"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;
