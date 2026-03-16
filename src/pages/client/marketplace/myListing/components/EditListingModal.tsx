import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateMarketplaceListingMutation, useGetMarketplaceListingTypesQuery } from '@/store/api/marketplaceApi';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface EditListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: MarketplaceListing | null;
  onSuccess?: () => void;
}

const defaultForm = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  listing_type_id: 0,
  price: '' as number | string,
  currency: 'USD',
  is_price_negotiable: false,
  status: 'draft' as 'draft' | 'active' | 'pending' | 'sold',
  domain_name: '',
  domain_extension: '',
  domain_age_years: '' as number | string,
  domain_authority: '' as number | string,
  domain_backlinks: '' as number | string,
  website_url: '',
  website_traffic_monthly: '' as number | string,
  website_revenue_monthly: '' as number | string,
  website_profit_monthly: '' as number | string,
  website_technology: '',
  primary_image_url: '',
  image_urls_str: '',
  meta_title: '',
  meta_description: '',
};

const EditListingModal: React.FC<EditListingModalProps> = ({
  open,
  onOpenChange,
  listing,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState(defaultForm);

  const { data: typesData } = useGetMarketplaceListingTypesQuery(undefined, { skip: !open });
  const listingTypes = Array.isArray(typesData) ? typesData : typesData?.items ?? [];
  const [updateListing, { isLoading: isUpdating }] = useUpdateMarketplaceListingMutation();

  // Resolve current listing type (from form selection or initial listing)
  const selectedListingType =
    listingTypes.find((t) => t.id === formData.listing_type_id) ?? listing?.listing_type;
  const typeSlug = (selectedListingType?.slug ?? selectedListingType?.name ?? '').toLowerCase();
  const isDomainType =
    typeSlug === 'domain' || typeSlug === 'domains' || typeSlug.includes('domain');
  const isWebsiteType =
    typeSlug === 'website' || typeSlug === 'websites' || typeSlug.includes('website');

  useEffect(() => {
    if (open && listing) {
      setFormData({
        title: listing.title ?? '',
        slug: listing.slug ?? '',
        description: listing.description ?? '',
        short_description: listing.short_description ?? '',
        listing_type_id: listing.listing_type_id ?? listing.listing_type?.id ?? 0,
        price: listing.price ?? '',
        currency: listing.currency ?? 'USD',
        is_price_negotiable: listing.is_price_negotiable ?? false,
        status: (listing.status as 'draft' | 'active' | 'pending' | 'sold') ?? 'draft',
        domain_name: listing.domain_name ?? '',
        domain_extension: listing.domain_extension ?? '',
        domain_age_years: listing.domain_age_years ?? '',
        domain_authority: listing.domain_authority ?? '',
        domain_backlinks: listing.domain_backlinks ?? '',
        website_url: listing.website_url ?? '',
        website_traffic_monthly: listing.website_traffic_monthly ?? '',
        website_revenue_monthly: listing.website_revenue_monthly ?? '',
        website_profit_monthly: listing.website_profit_monthly ?? '',
        website_technology: listing.website_technology ?? '',
        primary_image_url: listing.primary_image_url ?? '',
        image_urls_str: Array.isArray(listing.image_urls) ? listing.image_urls.join(', ') : '',
        meta_title: listing.meta_title ?? '',
        meta_description: listing.meta_description ?? '',
      });
    }
  }, [open, listing]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const buildUpdatePayload = (): ListingUpdateRequest => {
    const slug = formData.slug?.trim() || generateSlug(formData.title);
    const price = typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price;
    const num = (v: number | string) => (v === '' || v == null ? undefined : Number(v));
    const str = (v: string) => v?.trim() || undefined;
    const imageUrls = formData.image_urls_str
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
    return {
      title: str(formData.title) || undefined,
      slug: slug || undefined,
      description: str(formData.description) || undefined,
      short_description: str(formData.short_description) || undefined,
      listing_type_id: formData.listing_type_id || undefined,
      price: Number.isFinite(price) ? price : undefined,
      currency: formData.currency,
      is_price_negotiable: formData.is_price_negotiable,
      status: formData.status,
      domain_name: str(formData.domain_name) || undefined,
      domain_extension: str(formData.domain_extension) || undefined,
      domain_age_years: num(formData.domain_age_years),
      domain_authority: num(formData.domain_authority),
      domain_backlinks: num(formData.domain_backlinks),
      website_url: str(formData.website_url) || undefined,
      website_traffic_monthly: num(formData.website_traffic_monthly),
      website_revenue_monthly: num(formData.website_revenue_monthly) as number | undefined,
      website_profit_monthly: num(formData.website_profit_monthly) as number | undefined,
      website_technology: str(formData.website_technology) || undefined,
      primary_image_url: str(formData.primary_image_url) || undefined,
      image_urls: imageUrls.length > 0 ? imageUrls : undefined,
      meta_title: str(formData.meta_title) || undefined,
      meta_description: str(formData.meta_description) || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast({
        title: t('client.listings.edit.validation_required', 'Validation'),
        description: t('client.listings.edit.title_description_required', 'Title and description are required.'),
        variant: 'destructive',
      });
      return;
    }
    if (!formData.listing_type_id) {
      toast({
        title: t('client.listings.edit.validation_required', 'Validation'),
        description: t('client.listings.edit.listing_type_required', 'Please select a listing type.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateListing({
        id: listing.id,
        data: buildUpdatePayload(),
      }).unwrap();

      toast({
        title: t('client.listings.edit.success', 'Listing updated'),
        description: t('client.listings.edit.success_desc', 'Your listing has been updated successfully.'),
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { detail?: string } }).data?.detail ?? (err as Error).message)
          : String(err);
      toast({
        title: t('client.listings.edit.error', 'Update failed'),
        description: msg,
        variant: 'destructive',
      });
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('client.listings.edit.title', 'Edit listing')}</DialogTitle>
          <DialogDescription>
            {t('client.listings.edit.description', 'Update your listing details below.')}
          </DialogDescription>
        </DialogHeader>

        <form id="edit-listing-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Basic */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">{t('client.listings.edit.basic', 'Basic information')}</h4>
            <div className="space-y-2">
              <Label htmlFor="edit-title">{t('client.listings.edit.title_label', 'Title')} *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={t('client.listings.edit.title_placeholder', 'Listing title')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">{t('client.listings.edit.slug', 'Slug')}</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                placeholder="listing-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-short">{t('client.listings.edit.short_description', 'Short description')}</Label>
              <Input
                id="edit-short"
                value={formData.short_description}
                onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
                placeholder={t('client.listings.edit.short_placeholder', 'Brief summary')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">{t('client.listings.edit.description', 'Description')} *</Label>
              <Textarea
                id="edit-desc"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder={t('client.listings.edit.description_placeholder', 'Full description')}
                rows={4}
              />
            </div>
          </div>

          {/* Type & pricing */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">{t('client.listings.edit.pricing', 'Type & pricing')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('client.listings.edit.listing_type', 'Listing type')} *</Label>
                <Select
                  value={formData.listing_type_id ? String(formData.listing_type_id) : ''}
                  onValueChange={(v) => setFormData((p) => ({ ...p, listing_type_id: parseInt(v, 10) || 0 }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('client.listings.edit.select_type', 'Select type')} />
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
                <Label>{t('client.listings.edit.price', 'Price')} *</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0"
                  />
                  <Select
                    value={formData.currency}
                    onValueChange={(v) => setFormData((p) => ({ ...p, currency: v }))}
                  >
                    <SelectTrigger className="w-[90px]">
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
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-negotiable"
                checked={formData.is_price_negotiable}
                onCheckedChange={(c) => setFormData((p) => ({ ...p, is_price_negotiable: c }))}
              />
              <Label htmlFor="edit-negotiable" className="cursor-pointer">
                {t('client.listings.edit.price_negotiable', 'Price is negotiable')}
              </Label>
            </div>
            <div className="space-y-2">
              <Label>{t('client.listings.edit.status', 'Status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, status: v as 'draft' | 'active' | 'pending' | 'sold' }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Domain data – only when listing type is domain */}
          {isDomainType && (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">{t('client.listings.edit.domain_info', 'Domain information')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.domain_name', 'Domain name')}</Label>
                  <Input
                    value={formData.domain_name}
                    onChange={(e) => setFormData((p) => ({ ...p, domain_name: e.target.value }))}
                    placeholder="example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.domain_extension', 'Extension')}</Label>
                  <Input
                    value={formData.domain_extension}
                    onChange={(e) => setFormData((p) => ({ ...p, domain_extension: e.target.value }))}
                    placeholder=".com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.domain_age', 'Domain age (years)')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.domain_age_years}
                    onChange={(e) => setFormData((p) => ({ ...p, domain_age_years: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.domain_authority', 'Domain authority')}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.domain_authority}
                    onChange={(e) => setFormData((p) => ({ ...p, domain_authority: e.target.value }))}
                    placeholder="0-100"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>{t('client.listings.edit.domain_backlinks', 'Domain backlinks')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.domain_backlinks}
                    onChange={(e) => setFormData((p) => ({ ...p, domain_backlinks: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Website data – only when listing type is website */}
          {isWebsiteType && (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">{t('client.listings.edit.website_info', 'Website information')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>{t('client.listings.edit.website_url', 'Website URL')}</Label>
                  <Input
                    value={formData.website_url}
                    onChange={(e) => setFormData((p) => ({ ...p, website_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.traffic', 'Monthly traffic')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.website_traffic_monthly}
                    onChange={(e) => setFormData((p) => ({ ...p, website_traffic_monthly: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.revenue', 'Monthly revenue')}</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.website_revenue_monthly}
                    onChange={(e) => setFormData((p) => ({ ...p, website_revenue_monthly: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('client.listings.edit.profit', 'Monthly profit')}</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.website_profit_monthly}
                    onChange={(e) => setFormData((p) => ({ ...p, website_profit_monthly: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>{t('client.listings.edit.technology', 'Website technology')}</Label>
                  <Input
                    value={formData.website_technology}
                    onChange={(e) => setFormData((p) => ({ ...p, website_technology: e.target.value }))}
                    placeholder="e.g. WordPress, React"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media & SEO */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">{t('client.listings.edit.media_seo', 'Images & SEO')}</h4>
            <div className="space-y-2">
              <Label>{t('client.listings.edit.primary_image', 'Primary image URL')}</Label>
              <Input
                value={formData.primary_image_url}
                onChange={(e) => setFormData((p) => ({ ...p, primary_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>{t('client.listings.edit.image_urls', 'Additional image URLs')}</Label>
              <Input
                value={formData.image_urls_str}
                onChange={(e) => setFormData((p) => ({ ...p, image_urls_str: e.target.value }))}
                placeholder={t('client.listings.edit.image_urls_placeholder', 'Comma-separated URLs')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('client.listings.edit.meta_title', 'Meta title')}</Label>
              <Input
                value={formData.meta_title}
                onChange={(e) => setFormData((p) => ({ ...p, meta_title: e.target.value }))}
                placeholder="SEO title"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('client.listings.edit.meta_description', 'Meta description')}</Label>
              <Textarea
                value={formData.meta_description}
                onChange={(e) => setFormData((p) => ({ ...p, meta_description: e.target.value }))}
                placeholder="SEO description"
                rows={2}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button type="submit" form="edit-listing-form" disabled={isUpdating}>
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('client.listings.edit.save', 'Save changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingModal;
