import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  List,
  Search,
  Loader2,
  Trash2,
  Star,
  ExternalLink,
  Plus,
  Edit,
  Eye,
  Heart,
  MoreVertical,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetMarketplaceListingsQuery,
  useGetMyMarketListingQuery,
  useUpdateMarketplaceListingStatusMutation,
  useUpdateMarketplaceListingMutation,
  useDeleteMarketplaceListingMutation,
  useGetMarketplaceListingTypesQuery,
} from "@/store/api/marketplaceApi";
import { usePagination } from "@/hooks/usePagination";
import { ColumnDef } from "@/components/ui/data-table";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { formatCurrency, formatNumber, getStatusBadgeVariant, getStatusLabel, timeFormat } from "@/lib/helperFun";
import { cn } from "@/lib/utils";

const LISTING_STATUSES = ["draft", "active", "pending", "sold"] as const;
type ViewMode = "all" | "my";

export default function ListingsManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [listingTypeId, setListingTypeId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<MarketplaceListing | null>(null);

  const { data: typesData } = useGetMarketplaceListingTypesQuery();
  const listingTypes = typesData ?? [];

  const filters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      search: searchTerm || undefined,
      listing_type_id: listingTypeId === "all" ? undefined : Number(listingTypeId),
      ...(viewMode === "my" && statusFilter !== "all" ? { status: statusFilter as MarketplaceListing["status"] } : {}),
    }),
    [page, size, searchTerm, listingTypeId, viewMode, statusFilter]
  );

  const { data: allListingsData, isLoading: isLoadingAll } = useGetMarketplaceListingsQuery(filters, {
    skip: viewMode !== "all",
  });
  const { data: myListingsData, isLoading: isLoadingMy } = useGetMyMarketListingQuery(filters, {
    skip: viewMode !== "my",
  });

  const isAll = viewMode === "all";
  const data = isAll ? allListingsData : myListingsData;
  const isLoading = isAll ? isLoadingAll : isLoadingMy;

  const items: MarketplaceListing[] = Array.isArray(data) ? data : data?.items ?? [];
  const pagination = data?.pagination;

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateMarketplaceListingStatusMutation();
  const [updateListing] = useUpdateMarketplaceListingMutation();
  const [deleteListing, { isLoading: isDeleting }] = useDeleteMarketplaceListingMutation();

  const handleStatusChange = async (listing: MarketplaceListing, newStatus: (typeof LISTING_STATUSES)[number]) => {
    try {
      await updateStatus({ id: listing.id, new_status: newStatus }).unwrap();
      toast({
        title: t("admin.listings.status_updated") ?? "Status updated",
        description: t("admin.listings.status_updated_desc", { title: listing.title, status: newStatus }) ?? `Status set to ${newStatus}.`,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("admin.listings.status_update_error");
      toast({ title: t("admin.listings.status_update_error") ?? "Update failed", description: message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!listingToDelete) return;
    try {
      await deleteListing(listingToDelete.id).unwrap();
      toast({
        title: t("admin.listings.delete_success") ?? "Listing deleted",
        description: t("admin.listings.delete_success_desc") ?? "The listing has been deleted.",
      });
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("admin.listings.delete_error");
      toast({ title: t("admin.listings.delete_error") ?? "Delete failed", description: message, variant: "destructive" });
    }
  };

  const handleFeature = async (listing: MarketplaceListing) => {
    try {
      await updateListing({ id: listing.id, data: { is_featured: !listing.is_featured } }).unwrap();
      toast({
        title: listing.is_featured ? (t("admin.listings.unfeatured") ?? "Unfeatured") : (t("admin.listings.featured") ?? "Featured"),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("admin.listings.feature_error");
      toast({ title: t("admin.listings.feature_error") ?? "Error", description: message, variant: "destructive" });
    }
  };

  const columns: ColumnDef<MarketplaceListing>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: t("admin.listings.table.title") ?? "Title",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.title}</span>
          {row.short_description && (
            <span className="text-xs text-muted-foreground line-clamp-1">{row.short_description}</span>
          )}
        </div>
      ),
      minWidth: 220,
      enableSorting: true,
    },
    {
      id: "seller",
      accessorKey: (row) => row.seller?.username ?? row.seller?.email ?? "—",
      header: t("admin.listings.table.seller") ?? "Seller",
      cell: ({ row }) => (
        <span className="text-sm">{row.seller ? row.seller.username ?? row.seller.email : "—"}</span>
      ),
      enableSorting: true,
    },
    {
      id: "listing_type",
      accessorKey: (row) => row.listing_type?.name,
      header: t("admin.listings.table.type") ?? "Type",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium">
          {row.listing_type?.name ?? "—"}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "price",
      accessorKey: "price",
      header: t("admin.listings.table.price") ?? "Price",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{formatCurrency(row.price)}</span>
          {row.is_price_negotiable && (
            <span className="text-xs text-muted-foreground">Negotiable</span>
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("admin.listings.table.status") ?? "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", row.status === "active" ? "bg-green-500" : "bg-muted-foreground/50")} />
          <span className={cn("capitalize rounded-md border px-2 py-0.5 text-xs font-medium", getStatusBadgeVariant(row.status) === "default" ? "border-primary bg-primary/10 text-primary" : "border-border")}>
            {getStatusLabel(row.status, t)}
          </span>
          {row.is_featured && (
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "views",
      accessorKey: "view_count",
      header: t("admin.listings.table.views") ?? "Views",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>{formatNumber(row.view_count ?? 0)}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "favorites",
      accessorKey: "favorite_count",
      header: t("admin.listings.table.favorites") ?? "Fav",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Heart className="h-3.5 w-3.5" />
          <span>{formatNumber(row.favorite_count ?? 0)}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: t("admin.listings.table.created") ?? "Created",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{timeFormat(row.created_at, "MMM DD, YYYY")}</span>,
      enableSorting: true,
    },
  ];

  const totalItems = pagination?.total ?? items.length;
  const activeCount = items.filter((i) => i.status === "active").length;
  const totalViews = items.reduce((acc, i) => acc + (i.view_count ?? 0), 0);
  const totalFavs = items.reduce((acc, i) => acc + (i.favorite_count ?? 0), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header - admin vibe */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="h-7 w-7 text-muted-foreground" />
            {t("admin.listings.title") ?? "Listings Management"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("admin.listings.description") ?? "View and manage marketplace listings. Change status, feature, or delete."}
          </p>
        </div>
        <Button asChild className="border text-primary border-border bg-card hover:bg-muted/50">
          <Link to="/admin/listings-management/create">
            <Plus className="h-4 w-4 mr-2" />
            {t("admin.listings.create_listing") ?? "Create listing"}
          </Link>
        </Button>
      </div>

      {/* Stats cards - admin style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold mt-0.5">{totalItems}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-xl font-bold mt-0.5 text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total views</p>
            <p className="text-xl font-bold mt-0.5">{formatNumber(totalViews)}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total favorites</p>
            <p className="text-xl font-bold mt-0.5 text-muted-foreground">{formatNumber(totalFavs)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => { setViewMode("all"); handlePageChange(1); }}
          >
            {t("admin.listings.view_all_active") ?? "All active"}
          </Button>
          <Button
            variant={viewMode === "my" ? "default" : "outline"}
            size="sm"
            onClick={() => { setViewMode("my"); handlePageChange(1); }}
          >
            {t("admin.listings.view_my") ?? "My listings"}
          </Button>
        </div>
        {viewMode === "my" && (
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); handlePageChange(1); }}>
            <SelectTrigger className="w-[140px] border-border">
              <SelectValue placeholder={t("admin.listings.filter_status") ?? "Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.listings.status_all") ?? "All"}</SelectItem>
              {LISTING_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{t(`admin.listings.status_${s}`) ?? s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={listingTypeId} onValueChange={(v) => { setListingTypeId(v); handlePageChange(1); }}>
          <SelectTrigger className="w-[160px] border-border">
            <SelectValue placeholder={t("admin.listings.filter_type") ?? "Type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.listings.type_all") ?? "All types"}</SelectItem>
            {listingTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin.listings.search_placeholder") ?? "Search by title or type..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-border"
          />
        </div>
      </div>

      {/* Data table */}
      <Card className="border border-border">
        <CardContent className="pt-6">
          <DataTableWithPagination
            data={items}
            columns={columns}
            pagination={
              pagination
                ? {
                    total: pagination.total,
                    page: pagination.page,
                    total_pages: pagination.total_pages,
                    has_next: pagination.has_next,
                    has_previous: pagination.has_previous,
                  }
                : undefined
            }
            isLoading={isLoading}
            emptyMessage={t("admin.listings.no_listings") ?? "No listings found."}
            emptyIcon={<List className="h-12 w-12 text-muted-foreground" />}
            getRowId={(row) => String(row.id)}
            enableSorting={true}
            onRowClick={(row) => navigate(`/admin/listings-management/view/${row.id}`)}
            renderActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border">
                  <DropdownMenuLabel>{t("admin.listings.table.actions") ?? "Actions"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/admin/listings-management/view/${row.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t("admin.listings.view_listing") ?? "View"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/admin/listings-management/edit/${row.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("admin.listings.edit_listing") ?? "Edit"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFeature(row)}>
                    <Star className={cn("h-4 w-4 mr-2", row.is_featured && "fill-amber-400")} />
                    {row.is_featured ? (t("admin.listings.unfeature") ?? "Unfeature") : (t("admin.listings.feature") ?? "Feature")}
                  </DropdownMenuItem>
                  {LISTING_STATUSES.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleStatusChange(row, s)}
                      disabled={row.status === s}
                    >
                      {t(`admin.listings.status_${s}`) ?? s}
                    </DropdownMenuItem>
                  ))}
                  {row.public_url && (
                    <DropdownMenuItem asChild>
                      <a href={row.public_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("admin.listings.view_public") ?? "View public"}
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => { setListingToDelete(row); setDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("common.delete") ?? "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            actionsColumnHeader={t("admin.listings.table.actions") ?? "Actions"}
            pageSize={size}
            onPageChange={(newPage) => handlePageChange(newPage)}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.listings.delete_confirm_title") ?? "Delete listing?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.listings.delete_confirm_desc") ?? "This action cannot be undone."}
              {listingToDelete && (
                <div className="mt-2 p-2 rounded border border-border bg-muted/30 font-medium">{listingToDelete.title}</div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel") ?? "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t("common.delete") ?? "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
