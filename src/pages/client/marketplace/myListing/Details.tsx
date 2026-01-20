import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Eye,
  Heart,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Globe,
  Package,
  AlertCircle,
  CheckCircle2,
  Power,
  MessageSquare,
  Loader2,
  User,
  ExternalLink,
  FileText,
  Sparkles,
  Clock
} from 'lucide-react';
import { useGetMarketplaceListingQuery, useUpdateMarketplaceListingStatusMutation } from '@/store/api/marketplaceApi';
import { formatCurrency, formatNumber, getStatusColor, getStatusLabel, timeFormat, getStatusBadgeVariant } from '@/lib/helperFun';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ReturnBack } from '@/components/common/ReturnBack';
import { CopyToClipboard } from '@/components/common/CopyToClipboard';
import { useAuth } from '@/store/hooks/useAuth';
import MakeOfferModal from './components/MakeOfferModal';
import { ROUTES } from '@/lib/routes';
import { useGetProfileCompletionQuery } from '@/store/api/profileApi';

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: listing, isLoading, error } = useGetMarketplaceListingQuery(Number(id));
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateMarketplaceListingStatusMutation();
  const [makeOfferModalOpen, setMakeOfferModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check profile completion if user is logged in
  const { data: profileCompletion, isLoading: profileCompletionLoading } = useGetProfileCompletionQuery(undefined, {
    skip: !user,
  });

  // Check if we should open the offer modal automatically (from URL param)
  useEffect(() => {
    const openOffer = searchParams.get('openOffer');
    if (openOffer === 'true' && user && listing && !profileCompletionLoading) {
      // Check if profile is complete
      if (profileCompletion?.is_complete) {
        // Profile is complete, open modal
        setMakeOfferModalOpen(true);
        // Remove the query param
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('openOffer');
        setSearchParams(newSearchParams, { replace: true });
      } else if (profileCompletion?.is_complete === false) {
        // Profile is not complete, redirect to profile setup with return URL
        const returnUrl = `${window.location.pathname}?openOffer=true`;
        navigate(`${ROUTES.CLIENT.PROFILE_SETUP}?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
      }
    }
  }, [user, listing, profileCompletion, profileCompletionLoading, searchParams, setSearchParams, navigate]);

  // Handle make offer
  const handleMakeOffer = () => {
    if (!user) {
      // Store the current URL with openOffer flag for redirect after login
      const returnUrl = `${window.location.pathname}?openOffer=true`;
      navigate(`${ROUTES.AUTH.INDEX}?tab=login&returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      // Check if profile is complete
      if (profileCompletion?.is_complete) {
        setMakeOfferModalOpen(true);
      } else {
        // Profile is not complete, redirect to profile setup with return URL
        const returnUrl = `${window.location.pathname}?openOffer=true`;
        navigate(`${ROUTES.CLIENT.PROFILE_SETUP}?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async () => {
    if (!listing) return;
    const newStatus = listing.status === 'active' ? 'draft' : 'active';
    try {
      await updateStatus({ id: listing.id, new_status: newStatus }).unwrap();

      toast({
        title: 'Success',
        description: `Listing ${newStatus === 'active' ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as ApiError)?.data?.detail || 'Failed to update listing status',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The listing you're looking for doesn't exist or has been removed.
        </p>
        <ReturnBack />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto">
      <div className="space-y-6 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <ReturnBack label="Back to My Listings" />
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {listing.title}
          </span>
        </div>

        {/* Premium Header - Subtle Design */}
        <div className="relative overflow-hidden rounded-xl bg-primary/10 border border-border/50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 border border-border">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight mb-1 text-foreground">
                  {listing.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Listing Details and Management
                </p>
              </div>
            </div>
            {user && listing.seller_id === user.id && (
              <div className="flex gap-2">
                {listing && (
                  <Button
                    variant={listing.status === 'active' ? 'outline' : 'default'}
                    onClick={handleStatusToggle}
                    disabled={isUpdatingStatus}
                    size="sm"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      <Power className="w-3.5 h-3.5 mr-2" />
                    )}
                    {listing.status === 'active' ? 'Unpublish' : 'Publish'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="w-3.5 h-3.5 mr-2" />
                  Edit Listing
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - Subtle Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Listing Price</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(listing.price)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{listing.currency}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Views</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatNumber(listing.view_count)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Views</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Favorites</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatNumber(listing.favorite_count)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Saved</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(listing.status)}
                    className={cn(
                      "capitalize text-xs font-medium px-2 py-0.5 mt-1",
                      getStatusColor(listing.status),
                      "text-white border-0"
                    )}
                  >
                    {getStatusLabel(listing.status, t)}
                  </Badge>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Information - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Listing Information</CardTitle>
                    <CardDescription className="text-xs">Complete details about this listing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Listing Type */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Type
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {listing.listing_type.name}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Status
                      </label>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(listing.status)}
                      className={cn(
                        "capitalize text-xs font-medium px-2 py-0.5",
                        getStatusColor(listing.status),
                        "text-white border-0"
                      )}
                    >
                      {getStatusLabel(listing.status, t)}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Price
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(listing.price)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{listing.currency}</p>
                  </div>

                  {/* Featured */}
                  {listing.is_featured && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          Featured
                        </label>
                      </div>
                      <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured Listing
                      </Badge>
                    </div>
                  )}
                </div>

                <Separator className="my-3" />

                {/* Description */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <label className="text-xs font-medium text-muted-foreground">
                      Description
                    </label>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                </div>

                {listing.short_description && (
                  <>
                    <Separator className="my-3" />
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          Short Description
                        </label>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {listing.short_description}
                      </p>
                    </div>
                  </>
                )}

                {listing.is_price_negotiable && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Price Negotiable
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Performance Metrics - Clean Design */}
            {(listing.website_traffic_monthly > 0 || listing.domain_authority) && (
              <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
                      <CardDescription className="text-xs">Key performance indicators</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listing.website_traffic_monthly > 0 && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Monthly Traffic
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatNumber(listing.website_traffic_monthly)}
                        </p>
                      </div>
                    )}
                    {listing.domain_authority && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Domain Authority
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {listing.domain_authority}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset Details - Clean Design */}
            {(listing.domain_name || listing.website_url) && (
              <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Asset Details</CardTitle>
                      <CardDescription className="text-xs">Domain and website information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listing.domain_name && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Domain Name
                          </label>
                        </div>
                        <CopyToClipboard textToCopy={listing.domain_name}>
                          <p className="text-sm font-semibold text-foreground">
                            {listing.domain_name}{listing.domain_extension}
                          </p>
                        </CopyToClipboard>
                      </div>
                    )}
                    {listing.website_url && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Website URL
                          </label>
                        </div>
                        <a
                          href={listing.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          {listing.website_url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {listing.domain_age_years && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Domain Age
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {listing.domain_age_years} years
                        </p>
                      </div>
                    )}
                    {listing.domain_backlinks && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Backlinks
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatNumber(listing.domain_backlinks)}
                        </p>
                      </div>
                    )}
                    {listing.website_technology && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Technology
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {listing.website_technology}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Information - Clean Design */}
            {(listing.website_revenue_monthly || listing.website_profit_monthly) && (
              <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">Financial Information</CardTitle>
                      <CardDescription className="text-xs">Revenue and profit details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listing.website_revenue_monthly && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Monthly Revenue
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(listing.website_revenue_monthly)}
                        </p>
                      </div>
                    )}
                    {listing.website_profit_monthly && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">
                            Monthly Profit
                          </label>
                        </div>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(listing.website_profit_monthly)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="text-center p-3 rounded-lg bg-muted/30 border border-border mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Listing Price</p>
                  <p className="text-2xl font-semibold text-foreground">{formatCurrency(listing.price)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{listing.currency}</p>
                </div>
                {
                  listing.seller_id !== user?.id && 
                <Button
                className="w-full"
                variant="default"
                onClick={handleMakeOffer}
                size="sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  {t('offers.create.button')}
                </Button>
                }
                {user && listing.seller_id === user.id && (
                  <>
                    <Button
                      className="w-full"
                      variant={listing.status === 'active' ? 'outline' : 'default'}
                      onClick={handleStatusToggle}
                      disabled={isUpdatingStatus}
                      size="sm"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      ) : (
                        <Power className="w-3.5 h-3.5 mr-2" />
                      )}
                      {listing.status === 'active' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      <Edit className="w-3.5 h-3.5 mr-2" />
                      Update Price
                    </Button>
                    {!listing.is_featured && (
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="sm">
                        <Star className="w-3.5 h-3.5 mr-2" />
                        Feature Listing
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Timeline - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <label className="text-xs font-medium text-muted-foreground">
                      Created At
                    </label>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {timeFormat(listing.created_at, 'MMM DD, YYYY')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {timeFormat(listing.created_at, 'HH:mm')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <label className="text-xs font-medium text-muted-foreground">
                      Updated At
                    </label>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {timeFormat(listing.updated_at, 'MMM DD, YYYY')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {timeFormat(listing.updated_at, 'HH:mm')}
                  </p>
                </div>
                {listing.expires_at && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Expires At
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {timeFormat(listing.expires_at, 'MMM DD, YYYY')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeFormat(listing.expires_at, 'HH:mm')}
                    </p>
                  </div>
                )}
                {listing.sold_at && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Sold On
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {timeFormat(listing.sold_at, 'MMM DD, YYYY')}
                    </p>
                    {listing.sold_price && (
                      <p className="text-sm font-semibold text-green-600 mt-0.5">
                        {formatCurrency(listing.sold_price)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Information - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Seller Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Username
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {listing.seller.username}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Email
                      </label>
                    </div>
                    <CopyToClipboard textToCopy={listing.seller.email}>
                      <p className="text-sm font-semibold text-foreground">
                        {listing.seller.email}
                      </p>
                    </CopyToClipboard>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Actions - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Additional Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Eye className="w-3.5 h-3.5 mr-2" />
                  View Public Page
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <DollarSign className="w-3.5 h-3.5 mr-2" />
                  View Offers
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  View Analytics
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      {listing && (
        <MakeOfferModal
          open={makeOfferModalOpen}
          onOpenChange={setMakeOfferModalOpen}
          listing={listing}
          onSuccess={() => setMakeOfferModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Details;