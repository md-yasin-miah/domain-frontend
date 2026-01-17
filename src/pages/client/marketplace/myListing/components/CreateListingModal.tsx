import React, { useState } from 'react';
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
import { useCreateListingFromVerificationMutation } from '@/store/api/productVerification';
import { useGetMarketplaceListingTypesQuery } from '@/store/api/marketplaceApi';
import { useGetProductVerificationsQuery } from '@/store/api/productVerification';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  // Form state
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateListingFromVerificationRequest>({
    title: '',
    description: '',
    short_description: '',
    price: '',
    currency: 'USD',
    is_price_negotiable: false,
    listing_type_id: 0,
    status: 'draft',
  });

  // API hooks
  const { data: verifications, isLoading: loadingVerifications } = useGetProductVerificationsQuery({
    status: 'verified',
  });
  const { data: listingTypes, isLoading: loadingTypes } = useGetMarketplaceListingTypesQuery();
  const [createListing, { isLoading: creating }] = useCreateListingFromVerificationMutation();

  // Filter verified verifications that don't have listings yet
  const availableVerifications = verifications?.filter(v => v.status === 'verified' && !v.listing_id) || [];

  const handleInputChange = (field: keyof CreateListingFromVerificationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!verificationId) {
      toast({
        title: 'Error',
        description: 'Please select a verified product',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.price || !formData.listing_type_id) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createListing({
        verificationId,
        data: formData,
      }).unwrap();

      toast({
        title: 'Success',
        description: 'Listing created successfully!',
      });

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        short_description: '',
        price: '',
        currency: 'USD',
        is_price_negotiable: false,
        listing_type_id: 0,
        status: 'draft',
      });
      setVerificationId(null);
      setStep(1);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to create listing',
        variant: 'destructive',
      });
    }
  };

  const selectedVerification = availableVerifications.find(v => v.id === verificationId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>
            Create a marketplace listing from your verified product (Step {step} of 2)
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification">Select Verified Product *</Label>
              {loadingVerifications ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading verified products...
                </div>
              ) : availableVerifications.length === 0 ? (
                <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/50">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">No verified products available</p>
                    <p className="text-sm text-muted-foreground">
                      Please verify a product first before creating a listing
                    </p>
                  </div>
                </div>
              ) : (
                <Select
                  value={verificationId?.toString()}
                  onValueChange={(value) => {
                    const id = parseInt(value);
                    setVerificationId(id);
                    const verification = availableVerifications.find(v => v.id === id);
                    if (verification) {
                      // Auto-fill title based on verification
                      const title = verification.domain_name
                        ? `${verification.domain_name}${verification.domain_extension || ''}`
                        : verification.website_url || '';
                      setFormData(prev => ({ ...prev, title }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVerifications.map((verification) => (
                      <SelectItem key={verification.id} value={verification.id.toString()}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>
                            {verification.domain_name
                              ? `${verification.domain_name}${verification.domain_extension || ''}`
                              : verification.website_url}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({verification.product_type})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedVerification && (
              <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
                <h4 className="font-semibold text-sm">Selected Product Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium capitalize">{selectedVerification.product_type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verified:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedVerification.verified_at!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter listing title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="listing_type">Listing Type *</Label>
                {loadingTypes ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading types...
                  </div>
                ) : (
                  <Select
                    value={formData.listing_type_id?.toString()}
                    onValueChange={(value) => handleInputChange('listing_type_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {listingTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={formData.short_description || ''}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Brief description (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of your listing"
                  rows={4}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold">Pricing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="negotiable"
                  checked={formData.is_price_negotiable}
                  onCheckedChange={(checked) => handleInputChange('is_price_negotiable', checked)}
                />
                <Label htmlFor="negotiable" className="cursor-pointer">
                  Price is negotiable
                </Label>
              </div>
            </div>

            {/* Optional Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold">Additional Information (Optional)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain_age">Domain Age (years)</Label>
                  <Input
                    id="domain_age"
                    type="number"
                    value={formData.domain_age_years || ''}
                    onChange={(e) => handleInputChange('domain_age_years', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain_authority">Domain Authority</Label>
                  <Input
                    id="domain_authority"
                    type="number"
                    value={formData.domain_authority || ''}
                    onChange={(e) => handleInputChange('domain_authority', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="0-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traffic">Monthly Traffic</Label>
                  <Input
                    id="traffic"
                    type="number"
                    value={formData.website_traffic_monthly || ''}
                    onChange={(e) => handleInputChange('website_traffic_monthly', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Monthly Revenue</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={formData.website_revenue_monthly || ''}
                    onChange={(e) => handleInputChange('website_revenue_monthly', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profit">Monthly Profit</Label>
                  <Input
                    id="profit"
                    type="number"
                    value={formData.website_profit_monthly || ''}
                    onChange={(e) => handleInputChange('website_profit_monthly', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backlinks">Domain Backlinks</Label>
                  <Input
                    id="backlinks"
                    type="number"
                    value={formData.domain_backlinks || ''}
                    onChange={(e) => handleInputChange('domain_backlinks', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technology">Website Technology</Label>
                  <Input
                    id="technology"
                    value={formData.website_technology || ''}
                    onChange={(e) => handleInputChange('website_technology', e.target.value)}
                    placeholder="e.g., WordPress, React, etc."
                  />
                </div>
              </div>
            </div>

            {/* Images & SEO */}
            <div className="space-y-4">
              <h3 className="font-semibold">Images & SEO (Optional)</h3>

              <div className="space-y-2">
                <Label htmlFor="primary_image">Primary Image URL</Label>
                <Input
                  id="primary_image"
                  value={formData.primary_image_url || ''}
                  onChange={(e) => handleInputChange('primary_image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_urls">Additional Image URLs</Label>
                <Input
                  id="image_urls"
                  value={formData.image_urls?.join(', ') || ''}
                  onChange={(e) => {
                    const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                    handleInputChange('image_urls', urls.length > 0 ? urls : null);
                  }}
                  placeholder="Comma-separated URLs"
                />
                <p className="text-xs text-muted-foreground">Separate multiple URLs with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="SEO description for search engines"
                  rows={2}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!verificationId}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={creating}>
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Listing
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingModal;