import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetMarketplaceListingQuery,
  useGetMarketplaceListingTypesQuery,
  useCreateMarketplaceListingMutation,
  useUpdateMarketplaceListingMutation,
} from "@/store/api/marketplaceApi";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-")
    .replace(/^-|-$/g, "");
}

const DEFAULT_FORM = {
  title: "",
  slug: "",
  description: "",
  short_description: "",
  listing_type_id: 0,
  price: 0,
  currency: "USD",
  is_price_negotiable: false,
  status: "draft" as const,
  is_featured: false,
  domain_name: "",
  domain_extension: "",
  domain_age_years: undefined as number | undefined,
  domain_authority: undefined as number | undefined,
  domain_backlinks: undefined as number | undefined,
  website_url: "",
  website_traffic_monthly: undefined as number | undefined,
  website_revenue_monthly: undefined as number | undefined,
  website_profit_monthly: undefined as number | undefined,
  website_technology: "",
  primary_image_url: "",
  meta_title: "",
  meta_description: "",
};

export default function ListingCreateEdit() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const numericId = id ? parseInt(id, 10) : 0;

  const [formData, setFormData] = useState(DEFAULT_FORM);

  const { data: listing, isLoading: isLoadingListing } =
    useGetMarketplaceListingQuery(
      isEditing && numericId
        ? { id: numericId, increment_view: false }
        : numericId,
      { skip: !isEditing || !numericId },
    );
  const { data: typesData } = useGetMarketplaceListingTypesQuery();
  const listingTypes = typesData ?? [];

  const [createListing, { isLoading: isCreating }] =
    useCreateMarketplaceListingMutation();
  const [updateListing, { isLoading: isUpdating }] =
    useUpdateMarketplaceListingMutation();

  useEffect(() => {
    if (listing && isEditing) {
      setFormData({
        title: listing.title ?? "",
        slug: listing.slug ?? "",
        description: listing.description ?? "",
        short_description: listing.short_description ?? "",
        listing_type_id: listing.listing_type_id ?? 0,
        price: Number(listing.price) ?? 0,
        currency: listing.currency ?? "USD",
        is_price_negotiable: listing.is_price_negotiable ?? false,
        status:
          (listing.status as "draft" | "active" | "pending" | "sold") ??
          "draft",
        is_featured: listing.is_featured ?? false,
        domain_name: listing.domain_name ?? "",
        domain_extension: listing.domain_extension ?? "",
        domain_age_years: listing.domain_age_years ?? undefined,
        domain_authority: listing.domain_authority ?? undefined,
        domain_backlinks: listing.domain_backlinks ?? undefined,
        website_url: listing.website_url ?? "",
        website_traffic_monthly: listing.website_traffic_monthly ?? undefined,
        website_revenue_monthly:
          listing.website_revenue_monthly != null
            ? Number(listing.website_revenue_monthly)
            : undefined,
        website_profit_monthly:
          listing.website_profit_monthly != null
            ? Number(listing.website_profit_monthly)
            : undefined,
        website_technology: listing.website_technology ?? "",
        primary_image_url: listing.primary_image_url ?? "",
        meta_title: listing.meta_title ?? "",
        meta_description: listing.meta_description ?? "",
      });
    }
  }, [listing, isEditing]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const buildPayload = (): ListingCreateRequest & { slug?: string } => {
    const slug =
      formData.slug?.trim() || generateSlug(formData.title) || "listing";
    return {
      title: formData.title.trim(),
      slug: slug,
      description: formData.description.trim(),
      short_description: formData.short_description.trim() || undefined,
      listing_type_id: formData.listing_type_id,
      price: Number(formData.price) || 0,
      currency: formData.currency,
      is_price_negotiable: formData.is_price_negotiable,
      status: formData.status,
      is_featured: formData.is_featured,
      domain_name: formData.domain_name.trim() || undefined,
      domain_extension: formData.domain_extension.trim() || undefined,
      domain_age_years: formData.domain_age_years,
      domain_authority: formData.domain_authority,
      domain_backlinks: formData.domain_backlinks,
      website_url: formData.website_url.trim() || undefined,
      website_traffic_monthly: formData.website_traffic_monthly,
      website_revenue_monthly: formData.website_revenue_monthly,
      website_profit_monthly: formData.website_profit_monthly,
      website_technology: formData.website_technology.trim() || undefined,
      primary_image_url: formData.primary_image_url.trim() || undefined,
      meta_title: formData.meta_title.trim() || undefined,
      meta_description: formData.meta_description.trim() || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: t("admin.listings.form.required_fields") ?? "Required fields",
        description:
          t("admin.listings.form.title_description_required") ??
          "Title and description are required.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.listing_type_id) {
      toast({
        title: t("admin.listings.form.required_fields") ?? "Required fields",
        description:
          t("admin.listings.form.listing_type_required") ??
          "Please select a listing type.",
        variant: "destructive",
      });
      return;
    }

    const payload = buildPayload();

    try {
      if (isEditing && numericId) {
        await updateListing({
          id: numericId,
          data: payload as ListingUpdateRequest,
        }).unwrap();
        toast({
          title:
            t("admin.listings.messages.update_success") ?? "Listing updated",
          description:
            t("admin.listings.messages.update_success_desc") ??
            "The listing has been updated.",
        });
      } else {
        await createListing(payload as ListingCreateRequest).unwrap();
        toast({
          title:
            t("admin.listings.messages.create_success") ?? "Listing created",
          description:
            t("admin.listings.messages.create_success_desc") ??
            "The listing has been created.",
        });
      }
      navigate("/admin/listings-management");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : isEditing
            ? t("admin.listings.errors.update_error")
            : t("admin.listings.errors.create_error");
      toast({
        title: isEditing
          ? (t("admin.listings.errors.update_error") ?? "Update failed")
          : (t("admin.listings.errors.create_error") ?? "Create failed"),
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isEditing && (isLoadingListing || (id && !listing))) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/listings-management">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditing
            ? (t("admin.listings.edit_title") ?? "Edit Listing")
            : (t("admin.listings.create_title") ?? "Create Listing")}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("admin.listings.form.basic_info") ?? "Basic information"}
              </CardTitle>
              <CardDescription>
                {t("admin.listings.form.basic_info_desc") ??
                  "Title, type, price and status."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t("admin.listings.form.title") ?? "Title"} *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={
                      t("admin.listings.form.title_placeholder") ??
                      "Listing title"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    {t("admin.listings.form.slug") ?? "Slug"}
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, slug: e.target.value }))
                    }
                    placeholder={
                      t("admin.listings.form.slug_placeholder") ?? "url-slug"
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("admin.listings.form.description") ?? "Description"} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder={
                    t("admin.listings.form.description_placeholder") ??
                    "Full description"
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">
                  {t("admin.listings.form.short_description") ??
                    "Short description"}
                </Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      short_description: e.target.value,
                    }))
                  }
                  placeholder={
                    t("admin.listings.form.short_description_placeholder") ??
                    "Brief summary"
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="listing_type">
                    {t("admin.listings.form.listing_type") ?? "Listing type"} *
                  </Label>
                  <Select
                    value={
                      formData.listing_type_id
                        ? String(formData.listing_type_id)
                        : ""
                    }
                    onValueChange={(v) =>
                      setFormData((p) => ({
                        ...p,
                        listing_type_id: parseInt(v, 10) || 0,
                      }))
                    }
                  >
                    <SelectTrigger id="listing_type">
                      <SelectValue
                        placeholder={
                          t("admin.listings.form.select_type") ?? "Select type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {listingTypes.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {t("admin.listings.form.price") ?? "Price"} *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          price: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                    <Select
                      value={formData.currency}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, currency: v }))
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_price_negotiable"
                    checked={formData.is_price_negotiable}
                    onCheckedChange={(c) =>
                      setFormData((p) => ({ ...p, is_price_negotiable: c }))
                    }
                  />
                  <Label htmlFor="is_price_negotiable">
                    {t("admin.listings.form.is_price_negotiable") ??
                      "Price negotiable"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(c) =>
                      setFormData((p) => ({ ...p, is_featured: c }))
                    }
                  />
                  <Label htmlFor="is_featured">
                    {t("admin.listings.form.is_featured") ?? "Featured"}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>{t("admin.listings.form.status") ?? "Status"}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData((p) => ({
                        ...p,
                        status: v as "draft" | "active" | "pending" | "sold",
                      }))
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        {t("admin.listings.status_draft") ?? "Draft"}
                      </SelectItem>
                      <SelectItem value="active">
                        {t("admin.listings.status_active") ?? "Active"}
                      </SelectItem>
                      <SelectItem value="pending">
                        {t("admin.listings.status_pending") ?? "Pending"}
                      </SelectItem>
                      <SelectItem value="sold">
                        {t("admin.listings.status_sold") ?? "Sold"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("admin.listings.form.domain_website") ?? "Domain & website"}
              </CardTitle>
              <CardDescription>
                {t("admin.listings.form.domain_website_desc") ??
                  "Optional domain and website metrics."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="domain_name">
                    {t("admin.listings.form.domain_name") ?? "Domain name"}
                  </Label>
                  <Input
                    id="domain_name"
                    value={formData.domain_name}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        domain_name: e.target.value,
                      }))
                    }
                    placeholder="example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain_extension">
                    {t("admin.listings.form.domain_extension") ?? "Extension"}
                  </Label>
                  <Input
                    id="domain_extension"
                    value={formData.domain_extension}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        domain_extension: e.target.value,
                      }))
                    }
                    placeholder=".com"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="domain_age_years">
                    {t("admin.listings.form.domain_age_years") ??
                      "Domain age (years)"}
                  </Label>
                  <Input
                    id="domain_age_years"
                    type="number"
                    min={0}
                    value={formData.domain_age_years ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        domain_age_years: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain_authority">
                    {t("admin.listings.form.domain_authority") ??
                      "Domain authority"}
                  </Label>
                  <Input
                    id="domain_authority"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.domain_authority ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        domain_authority: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain_backlinks">
                    {t("admin.listings.form.domain_backlinks") ?? "Backlinks"}
                  </Label>
                  <Input
                    id="domain_backlinks"
                    type="number"
                    min={0}
                    value={formData.domain_backlinks ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        domain_backlinks: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">
                  {t("admin.listings.form.website_url") ?? "Website URL"}
                </Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, website_url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website_traffic_monthly">
                    {t("admin.listings.form.website_traffic_monthly") ??
                      "Monthly traffic"}
                  </Label>
                  <Input
                    id="website_traffic_monthly"
                    type="number"
                    min={0}
                    value={formData.website_traffic_monthly ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        website_traffic_monthly: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website_technology">
                    {t("admin.listings.form.website_technology") ??
                      "Technology"}
                  </Label>
                  <Input
                    id="website_technology"
                    value={formData.website_technology}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        website_technology: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("admin.listings.form.media_seo") ?? "Media & SEO"}
              </CardTitle>
              <CardDescription>
                {t("admin.listings.form.media_seo_desc") ??
                  "Primary image and meta fields."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary_image_url">
                  {t("admin.listings.form.primary_image_url") ??
                    "Primary image URL"}
                </Label>
                <Input
                  id="primary_image_url"
                  type="url"
                  value={formData.primary_image_url}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      primary_image_url: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_title">
                  {t("admin.listings.form.meta_title") ?? "Meta title"}
                </Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, meta_title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">
                  {t("admin.listings.form.meta_description") ??
                    "Meta description"}
                </Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      meta_description: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/listings-management">
                {t("common.cancel") ?? "Cancel"}
              </Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading") ?? "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing
                    ? (t("common.update") ?? "Update")
                    : (t("admin.listings.form.create") ?? "Create listing")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
