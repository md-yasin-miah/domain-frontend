import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ColumnDef } from "@/components/ui/data-table";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import {
  Search,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Play,
  Power,
  PowerOff,
  Calendar,
  XCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  useGetSavedSearchesQuery,
  useCreateSavedSearchMutation,
  useUpdateSavedSearchMutation,
  useDeleteSavedSearchMutation,
} from "@/store/api/savedSearchApi";
import { useAuth } from "@/store/hooks/useAuth";
import { timeFormat, getStatusBadgeVariant } from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import CustomTooltip from "@/components/common/CustomTooltip";
import EmptyState from "@/components/common/EmptyState";
import { extractErrorMessage } from "@/lib/errorHandler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ROUTES } from "@/lib/routes";
import SavedSearchForm from "./components/SavedSearchForm";
import { useGetMarketplaceListingTypesQuery } from "@/store/api/marketplaceApi";

interface SavedSearchFilters {
  skip?: number;
  limit?: number;
  is_active?: boolean;
}

const ClientSavedSearchPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<SavedSearch | null>(null);
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: SavedSearchFilters = {
      skip: (page - 1) * size,
      limit: size,
    };

    if (statusFilter !== "all") {
      params.is_active = statusFilter === "active";
    }

    return params;
  }, [page, size, statusFilter]);

  const {
    data: searchesData,
    isLoading,
    error,
    refetch,
  } = useGetSavedSearchesQuery(queryParams);

  const { data: listingTypes } = useGetMarketplaceListingTypesQuery();

  const [createSearch, { isLoading: isCreating }] = useCreateSavedSearchMutation();
  const [updateSearch, { isLoading: isUpdating }] = useUpdateSavedSearchMutation();
  const [deleteSearch, { isLoading: isDeleting }] = useDeleteSavedSearchMutation();

  // Handle paginated or array response
  const searches = useMemo(() => {
    if (!searchesData) return [];
    if (Array.isArray(searchesData)) return searchesData;
    return searchesData.items || [];
  }, [searchesData]);

  const pagination = useMemo(() => {
    if (!searchesData || Array.isArray(searchesData)) {
      return {
        total: searches.length,
        page: page,
        total_pages: Math.ceil(searches.length / size),
        has_next: page * size < searches.length,
        has_previous: page > 1,
      };
    }
    return searchesData.pagination;
  }, [searchesData, searches.length, page, size]);

  // Handle create saved search
  const handleCreate = async (data: SavedSearchCreateRequest) => {
    try {
      await createSearch(data).unwrap();
      toast({
        title: t("savedSearches.actions.create_success"),
        description: t("savedSearches.actions.create_success_desc"),
      });
      setCreateDialogOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("savedSearches.actions.create_error"),
        description: errorMessage || t("savedSearches.actions.create_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle update saved search
  const handleUpdate = async (data: SavedSearchUpdateRequest) => {
    if (!selectedSearch) return;

    try {
      await updateSearch({ id: selectedSearch.id, data }).unwrap();
      toast({
        title: t("savedSearches.actions.update_success"),
        description: t("savedSearches.actions.update_success_desc"),
      });
      setEditDialogOpen(false);
      setSelectedSearch(null);
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("savedSearches.actions.update_error"),
        description: errorMessage || t("savedSearches.actions.update_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle delete saved search
  const handleDelete = async () => {
    if (!selectedSearch) return;

    try {
      await deleteSearch(selectedSearch.id).unwrap();
      toast({
        title: t("savedSearches.actions.delete_success"),
        description: t("savedSearches.actions.delete_success_desc"),
      });
      setDeleteDialogOpen(false);
      setSelectedSearch(null);
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("savedSearches.actions.delete_error"),
        description: errorMessage || t("savedSearches.actions.delete_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle toggle active status
  const handleToggleActive = useCallback(async (search: SavedSearch) => {
    try {
      await updateSearch({
        id: search.id,
        data: { is_active: !search.is_active },
      }).unwrap();
      toast({
        title: t("savedSearches.actions.toggle_success"),
        description: search.is_active
          ? t("savedSearches.actions.deactivated")
          : t("savedSearches.actions.activated"),
      });
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("savedSearches.actions.toggle_error"),
        description: errorMessage || t("savedSearches.actions.toggle_error_desc"),
        variant: "destructive",
      });
    }
  }, [updateSearch, toast, t, refetch]);

  // Handle use saved search - navigate to marketplace with filters
  const handleUseSearch = useCallback((search: SavedSearch) => {
    const params = new URLSearchParams();

    if (search.listing_type_id) {
      params.set("listing_type_id", search.listing_type_id.toString());
    }
    if (search.status) {
      params.set("status", search.status);
    }
    if (search.min_price) {
      params.set("min_price", search.min_price.toString());
    }
    if (search.max_price) {
      params.set("max_price", search.max_price.toString());
    }
    if (search.currency) {
      params.set("currency", search.currency);
    }
    if (search.domain_extension) {
      params.set("domain_extension", search.domain_extension);
    }
    if (search.min_domain_age) {
      params.set("min_domain_age", search.min_domain_age.toString());
    }
    if (search.max_domain_age) {
      params.set("max_domain_age", search.max_domain_age.toString());
    }
    if (search.min_traffic) {
      params.set("min_traffic", search.min_traffic.toString());
    }
    if (search.max_traffic) {
      params.set("max_traffic", search.max_traffic.toString());
    }
    if (search.min_revenue) {
      params.set("min_revenue", search.min_revenue.toString());
    }
    if (search.max_revenue) {
      params.set("max_revenue", search.max_revenue.toString());
    }
    if (search.search_text) {
      params.set("search", search.search_text);
    }

    navigate(`${ROUTES.APP.MARKETPLACE}?${params.toString()}`);
  }, [navigate]);

  // Get listing type name
  const getListingTypeName = useCallback((listingTypeId: number | null) => {
    if (!listingTypeId || !listingTypes) return t("common.not_available");
    const type = listingTypes.find((t) => t.id === listingTypeId);
    return type?.name || t("common.not_available");
  }, [listingTypes, t]);

  // Define table columns
  const columns: ColumnDef<SavedSearch>[] = useMemo(() => [
    {
      id: "name",
      accessorKey: "name",
      header: t("savedSearches.table.name"),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.name}
        </div>
      ),
    },
    {
      id: "listing_type",
      accessorKey: "listing_type_id",
      header: t("savedSearches.table.listing_type"),
      cell: ({ row }) => (
        <div className="text-sm">
          {getListingTypeName(row.listing_type_id)}
        </div>
      ),
    },
    {
      id: "filters",
      header: t("savedSearches.table.filters"),
      cell: ({ row }) => {
        const filters: string[] = [];
        if (row.status) filters.push(`${t("common.status.status")}: ${row.status}`);
        if (row.min_price || row.max_price) {
          const priceRange = [
            row.min_price ? `${row.min_price}` : "",
            row.max_price ? `${row.max_price}` : "",
          ].filter(Boolean).join(" - ");
          filters.push(`${t("savedSearches.table.price")}: ${priceRange} ${row.currency || ""}`);
        }
        if (row.search_text) filters.push(`${t("savedSearches.table.search_text")}: ${row.search_text.substring(0, 20)}...`);

        return (
          <div className="text-xs text-muted-foreground max-w-xs truncate">
            {filters.length > 0 ? filters.join(", ") : t("savedSearches.table.no_filters")}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "is_active",
      header: t("common.status.status"),
      cell: ({ row }) => (
        <Badge
          variant={row.is_active ? "default" : "secondary"}
          className={cn("capitalize")}
        >
          {row.is_active ? t("savedSearches.status.active") : t("savedSearches.status.inactive")}
        </Badge>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: t("savedSearches.table.created_at"),
      cell: ({ row }) => (
        <div className="text-sm">
          {timeFormat(row.created_at, "MM/DD/YYYY")}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-center">
          <CustomTooltip content={t("savedSearches.actions.use")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUseSearch(row)}
            >
              <Play className="w-4 h-4 text-green-600" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content={t("savedSearches.actions.edit")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSearch(row);
                setEditDialogOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content={row.is_active ? t("savedSearches.actions.deactivate") : t("savedSearches.actions.activate")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleActive(row)}
              disabled={isUpdating}
            >
              {row.is_active ? (
                <PowerOff className="w-4 h-4 text-yellow-600" />
              ) : (
                <Power className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </CustomTooltip>
          <CustomTooltip content={t("savedSearches.actions.delete")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSearch(row);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </CustomTooltip>
        </div>
      ),
    },
  ], [t, getListingTypeName, handleUseSearch, handleToggleActive, isUpdating]);

  // Filter searches by search term
  const filteredSearches = useMemo(() => {
    if (!searchTerm) return searches;
    const term = searchTerm.toLowerCase();
    return searches.filter((search) =>
      search.name.toLowerCase().includes(term) ||
      search.search_text?.toLowerCase().includes(term)
    );
  }, [searches, searchTerm]);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold">{t("savedSearches.error.title")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("savedSearches.error.description")}
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("common.retry")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("savedSearches.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("savedSearches.description")}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("savedSearches.actions.create")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("savedSearches.filters.title")}</CardTitle>
          <CardDescription>{t("savedSearches.filters.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("savedSearches.filters.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}>
              <SelectTrigger>
                <SelectValue placeholder={t("savedSearches.filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="active">{t("savedSearches.status.active")}</SelectItem>
                <SelectItem value="inactive">{t("savedSearches.status.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Saved Searches Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("savedSearches.table.title")}</CardTitle>
          <CardDescription>
            {t("savedSearches.table.description", { count: pagination?.total || 0 })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t("common.loading")}
                </p>
              </div>
            </div>
          ) : filteredSearches.length === 0 ? (
            <EmptyState
              icon={<Filter className="w-16 h-16 text-muted-foreground" />}
              title={t("savedSearches.empty.title")}
              description={t("savedSearches.empty.description")}
            />
          ) : (
            <DataTableWithPagination
              columns={columns}
              data={filteredSearches}
              pagination={pagination}
              pageSize={size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{t("savedSearches.dialogs.create.title")}</DialogTitle>
            <DialogDescription>
              {t("savedSearches.dialogs.create.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 px-6">
            <SavedSearchForm
              onSubmit={handleCreate}
              onCancel={() => setCreateDialogOpen(false)}
              isLoading={isCreating}
              listingTypes={listingTypes || []}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{t("savedSearches.dialogs.edit.title")}</DialogTitle>
            <DialogDescription>
              {t("savedSearches.dialogs.edit.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 px-6">
            {selectedSearch && (
              <SavedSearchForm
                initialData={selectedSearch}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setSelectedSearch(null);
                }}
                isLoading={isUpdating}
                listingTypes={listingTypes || []}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("savedSearches.dialogs.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("savedSearches.dialogs.delete.description", { name: selectedSearch?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientSavedSearchPage;
