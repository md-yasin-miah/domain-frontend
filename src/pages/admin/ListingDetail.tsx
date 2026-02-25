import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Trash2,
  Star,
  ArrowLeft,
  Power,
  Loader2,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useGetMarketplaceListingQuery, useUpdateMarketplaceListingStatusMutation, useUpdateMarketplaceListingMutation, useDeleteMarketplaceListingMutation } from "@/store/api/marketplaceApi";
import { formatCurrency, formatNumber, getStatusColor, getStatusLabel, timeFormat, getStatusBadgeVariant } from "@/lib/helperFun";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LISTING_STATUSES = ["draft", "active", "pending", "sold"] as const;

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const numericId = id ? parseInt(id, 10) : 0;
  const { data: listing, isLoading, error } = useGetMarketplaceListingQuery(
    numericId ? { id: numericId, increment_view: false } : numericId
  );
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateMarketplaceListingStatusMutation();
  const [updateListing] = useUpdateMarketplaceListingMutation();
  const [deleteListing, { isLoading: isDeleting }] = useDeleteMarketplaceListingMutation();

  const handleStatusChange = async (newStatus: typeof LISTING_STATUSES[number]) => {
    if (!listing) return;
    try {
      await updateStatus({ id: listing.id, new_status: newStatus }).unwrap();
      toast({
        title: t("admin.listings.status_updated") ?? "Status updated",
        description: t("admin.listings.status_updated_desc", { title: listing.title, status: newStatus }) ?? `Status set to ${newStatus}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.listings.status_update_error");
      toast({ title: t("admin.listings.status_update_error") ?? "Update failed", description: msg, variant: "destructive" });
    }
  };

  const handleFeature = async () => {
    if (!listing) return;
    try {
      await updateListing({ id: listing.id, data: { is_featured: !listing.is_featured } }).unwrap();
      toast({
        title: listing.is_featured ? (t("admin.listings.unfeatured") ?? "Unfeatured") : (t("admin.listings.featured") ?? "Featured"),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.listings.feature_error");
      toast({ title: t("admin.listings.feature_error") ?? "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!listing) return;
    try {
      await deleteListing(listing.id).unwrap();
      toast({ title: t("admin.listings.delete_success") ?? "Deleted", description: t("admin.listings.delete_success_desc") ?? "Listing deleted." });
      setDeleteOpen(false);
      navigate("/admin/listings-management");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.listings.delete_error");
      toast({ title: t("admin.listings.delete_error") ?? "Delete failed", description: msg, variant: "destructive" });
    }
  };

  if (isLoading || !numericId) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">{t("admin.listings.not_found") ?? "Listing not found."}</p>
        <Button variant="outline" asChild>
          <Link to="/admin/listings-management">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("admin.listings.back_to_list") ?? "Back to Listings"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/listings-management" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("admin.listings.back_to_list") ?? "Back to Listings"}
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium truncate max-w-[200px]">{listing.title}</span>
      </div>

      {/* Admin header */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{listing.title}</h1>
              <p className="text-sm text-muted-foreground">Admin view · Manage listing</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4 mr-2" />}
                  {t("admin.listings.change_status") ?? "Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LISTING_STATUSES.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)} disabled={listing.status === s}>
                    {t(`admin.listings.status_${s}`) ?? s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleFeature}>
              <Star className={cn("h-4 w-4 mr-2", listing.is_featured && "fill-amber-400 text-amber-500")} />
              {listing.is_featured ? (t("admin.listings.unfeature") ?? "Unfeature") : (t("admin.listings.feature") ?? "Feature")}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/admin/listings-management/edit/${listing.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                {t("admin.listings.edit_listing") ?? "Edit"}
              </Link>
            </Button>
            {listing.public_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={listing.public_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("admin.listings.view_public") ?? "View public"}
                </a>
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t("common.delete") ?? "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="text-lg font-semibold">{formatCurrency(listing.price)}</p>
            <p className="text-xs text-muted-foreground">{listing.currency}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Views</p>
            <p className="text-lg font-semibold">{formatNumber(listing.view_count)}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Favorites</p>
            <p className="text-lg font-semibold">{formatNumber(listing.favorite_count)}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Badge variant={getStatusBadgeVariant(listing.status)} className={cn("capitalize", getStatusColor(listing.status))}>
              {getStatusLabel(listing.status, t)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border">
            <CardHeader className="border-b border-border bg-muted/20">
              <CardTitle className="text-base font-semibold">Listing information</CardTitle>
              <CardDescription>Type, price, description</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-md border border-border bg-muted/20">
                  <label className="text-xs font-medium text-muted-foreground">Type</label>
                  <p className="text-sm font-medium">{listing.listing_type?.name ?? "—"}</p>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/20">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Badge variant={getStatusBadgeVariant(listing.status)} className="capitalize text-xs mt-1">
                    {getStatusLabel(listing.status, t)}
                  </Badge>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/20">
                  <label className="text-xs font-medium text-muted-foreground">Price</label>
                  <p className="text-sm font-medium">{formatCurrency(listing.price)} {listing.currency}</p>
                </div>
                {listing.is_featured && (
                  <div className="p-3 rounded-md border border-border bg-muted/20">
                    <label className="text-xs font-medium text-muted-foreground">Featured</label>
                    <Badge variant="default" className="mt-1">Featured</Badge>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <div className="mt-1 p-3 rounded-md border border-border bg-muted/10">
                  <p className="text-sm whitespace-pre-wrap">{listing.description}</p>
                </div>
              </div>
              {listing.short_description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Short description</label>
                    <p className="text-sm mt-1">{listing.short_description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {(listing.website_traffic_monthly > 0 || listing.domain_authority) && (
            <Card className="border border-border">
              <CardHeader className="border-b border-border bg-muted/20">
                <CardTitle className="text-base font-semibold">Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {listing.website_traffic_monthly > 0 && (
                    <div className="p-3 rounded-md border border-border bg-muted/20">
                      <label className="text-xs text-muted-foreground">Monthly traffic</label>
                      <p className="text-sm font-medium">{formatNumber(listing.website_traffic_monthly)}</p>
                    </div>
                  )}
                  {listing.domain_authority != null && (
                    <div className="p-3 rounded-md border border-border bg-muted/20">
                      <label className="text-xs text-muted-foreground">Domain authority</label>
                      <p className="text-sm font-medium">{listing.domain_authority}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {(listing.domain_name || listing.website_url) && (
            <Card className="border border-border">
              <CardHeader className="border-b border-border bg-muted/20">
                <CardTitle className="text-base font-semibold">Asset details</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {listing.domain_name && (
                    <div className="p-3 rounded-md border border-border bg-muted/20">
                      <label className="text-xs text-muted-foreground">Domain</label>
                      <p className="text-sm font-medium">{listing.domain_name}{listing.domain_extension ?? ""}</p>
                    </div>
                  )}
                  {listing.website_url && (
                    <div className="p-3 rounded-md border border-border bg-muted/20">
                      <label className="text-xs text-muted-foreground">Website</label>
                      <a href={listing.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        {listing.website_url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border border-border">
            <CardHeader className="border-b border-border bg-muted/20">
              <CardTitle className="text-base font-semibold">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-md border border-border bg-muted/20">
                <label className="text-xs text-muted-foreground">Created</label>
                <p className="text-sm font-medium">{timeFormat(listing.created_at, "MMM DD, YYYY")}</p>
              </div>
              <div className="p-3 rounded-md border border-border bg-muted/20">
                <label className="text-xs text-muted-foreground">Updated</label>
                <p className="text-sm font-medium">{timeFormat(listing.updated_at, "MMM DD, YYYY")}</p>
              </div>
              {listing.expires_at && (
                <div className="p-3 rounded-md border border-border bg-muted/20">
                  <label className="text-xs text-muted-foreground">Expires</label>
                  <p className="text-sm font-medium">{timeFormat(listing.expires_at, "MMM DD, YYYY")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {listing.seller && (
            <Card className="border border-border">
              <CardHeader className="border-b border-border bg-muted/20">
                <CardTitle className="text-base font-semibold">Seller</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 rounded-md border border-border bg-muted/20">
                  <label className="text-xs text-muted-foreground">Username</label>
                  <p className="text-sm font-medium">{listing.seller.username}</p>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/20">
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p className="text-sm font-medium">{listing.seller.email}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.listings.delete_confirm_title") ?? "Delete listing?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.listings.delete_confirm_desc") ?? "This action cannot be undone."}
              <div className="mt-2 p-2 rounded bg-muted font-medium">{listing.title}</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel") ?? "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("common.delete") ?? "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
