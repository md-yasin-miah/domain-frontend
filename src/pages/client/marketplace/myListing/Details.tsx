import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
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
  CheckCircle2
} from 'lucide-react';
import { useGetMarketplaceListingQuery } from '@/store/api/marketplaceApi';
import { formatCurrency, formatNumber, getStatusColor, getStatusLabel, timeFormat, getStatusBadgeVariant } from '@/lib/helperFun';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: listing, isLoading, error } = useGetMarketplaceListingQuery(Number(id));

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
        <Button onClick={() => navigate(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Listings
        </Link>
        <span className="text-muted-foreground">•</span>
        <span className="text-sm text-muted-foreground">{listing.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            {listing.title}
          </h1>
          <p className="text-muted-foreground mt-2">
            Listing Details and Management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Listing
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Info Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{listing.listing_type.name}</Badge>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', getStatusColor(listing.status))} />
                      <Badge variant={getStatusBadgeVariant(listing.status)}>
                        {getStatusLabel(listing.status, t)}
                      </Badge>
                    </div>
                    {listing.is_featured && (
                      <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(listing.price)}</p>
                  {listing.is_price_negotiable && (
                    <Badge variant="secondary" className="mt-2">
                      Price Negotiable
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{listing.description}</p>
                </div>
                {listing.short_description && (
                  <div>
                    <h4 className="font-semibold mb-2">Short Description</h4>
                    <p className="text-muted-foreground">{listing.short_description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metrics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">{formatNumber(listing.view_count)}</div>
                  <div className="text-xs text-muted-foreground">Total Views</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold text-red-500">{formatNumber(listing.favorite_count)}</div>
                  <div className="text-xs text-muted-foreground">Favorites</div>
                </div>
                {listing.website_traffic_monthly > 0 && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-green-500">{formatNumber(listing.website_traffic_monthly)}</div>
                    <div className="text-xs text-muted-foreground">Monthly Traffic</div>
                  </div>
                )}
                {listing.domain_authority && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Globe className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold text-blue-500">{listing.domain_authority}</div>
                    <div className="text-xs text-muted-foreground">Domain Authority</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Domain/Website Details */}
          {(listing.domain_name || listing.website_url) && (
            <Card>
              <CardHeader>
                <CardTitle>Asset Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {listing.domain_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domain Name:</span>
                      <span className="font-medium">{listing.domain_name}{listing.domain_extension}</span>
                    </div>
                  )}
                  {listing.website_url && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Website URL:</span>
                      <a href={listing.website_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                        {listing.website_url}
                      </a>
                    </div>
                  )}
                  {listing.domain_age_years && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domain Age:</span>
                      <span className="font-medium">{listing.domain_age_years} years</span>
                    </div>
                  )}
                  {listing.domain_backlinks && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Backlinks:</span>
                      <span className="font-medium">{formatNumber(listing.domain_backlinks)}</span>
                    </div>
                  )}
                  {listing.website_technology && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology:</span>
                      <span className="font-medium">{listing.website_technology}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Details */}
          {(listing.website_revenue_monthly || listing.website_profit_monthly) && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {listing.website_revenue_monthly && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Revenue:</span>
                      <span className="font-medium">{formatCurrency(listing.website_revenue_monthly)}</span>
                    </div>
                  )}
                  {listing.website_profit_monthly && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Profit:</span>
                      <span className="font-bold text-green-600">{formatCurrency(listing.website_profit_monthly)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(listing.price)}</div>
                <p className="text-sm text-muted-foreground">{listing.currency}</p>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Price
                </Button>
                {!listing.is_featured && (
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    <Star className="w-4 h-4 mr-2" />
                    Feature Listing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-muted-foreground">Created</div>
                  <div className="font-medium">{timeFormat(listing.created_at, 'MMM DD, YYYY')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-muted-foreground">Last Updated</div>
                  <div className="font-medium">{timeFormat(listing.updated_at, 'MMM DD, YYYY')}</div>
                </div>
              </div>
              {listing.expires_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-muted-foreground">Expires</div>
                    <div className="font-medium">{timeFormat(listing.expires_at, 'MMM DD, YYYY')}</div>
                  </div>
                </div>
              )}
              {listing.sold_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <div className="flex-1">
                    <div className="text-muted-foreground">Sold On</div>
                    <div className="font-medium">{timeFormat(listing.sold_at, 'MMM DD, YYYY')}</div>
                    {listing.sold_price && (
                      <div className="text-green-600 font-semibold">{formatCurrency(listing.sold_price)}</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-medium">{listing.seller.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-xs">{listing.seller.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Public Page
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                View Offers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Details;