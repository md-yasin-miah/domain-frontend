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
  Shield,
  Search,
  Loader2,
  Eye,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  User,
  Unlock,
  ArrowLeftRight,
} from "lucide-react";
import {
  useGetEscrowsQuery,
  useReleaseEscrowMutation,
  useRefundEscrowMutation,
} from "@/store/api/escrowApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { ROUTES } from "@/lib/routes";
import CustomTooltip from "@/components/common/CustomTooltip";
import EmptyState from "@/components/common/EmptyState";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { extractErrorMessage } from "@/lib/errorHandler";

type EscrowStatus = "pending" | "released" | "refunded" | "disputed";

interface EscrowFilters {
  skip?: number;
  limit?: number;
  status?: string;
  order_id?: number;
  buyer_id?: number;
  seller_id?: number;
}

const ClientEscrowsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EscrowStatus | "all">("all");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);
  const [releaseReason, setReleaseReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: EscrowFilters = {
      skip: (page - 1) * size,
      limit: size,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (orderIdFilter) {
      const orderId = parseInt(orderIdFilter, 10);
      if (!isNaN(orderId)) {
        params.order_id = orderId;
      }
    }

    return params;
  }, [page, size, statusFilter, orderIdFilter]);

  const {
    data: escrowsData,
    isLoading,
    error,
    refetch,
  } = useGetEscrowsQuery(queryParams);

  const [releaseEscrow, { isLoading: isReleasing }] = useReleaseEscrowMutation();
  const [refundEscrow, { isLoading: isRefunding }] = useRefundEscrowMutation();

  // Handle paginated or array response
  const escrows = useMemo(() => {
    if (!escrowsData) return [];
    if (Array.isArray(escrowsData)) return escrowsData;
    return escrowsData.items || [];
  }, [escrowsData]);

  // Get status label helper
  const getStatusLabel = useCallback((status: string) => {
    return t(`escrows.status.${status}`) || status;
  }, [t]);

  // Get status color helper
  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-600",
      released: "text-green-600",
      refunded: "text-red-600",
      disputed: "text-orange-600",
    };
    return colors[status] || "text-gray-600";
  }, []);

  // Check if user can release/refund escrow
  const canReleaseEscrow = useCallback((escrow: Escrow) => {
    return escrow.status === "pending" &&
      (user?.id === escrow.seller_id || user?.roles?.some(r => r === "admin"));
  }, [user]);

  const canRefundEscrow = useCallback((escrow: Escrow) => {
    return (escrow.status === "pending" || escrow.status === "disputed") &&
      (user?.roles?.some(r => r === "admin"));
  }, [user]);

  // Handle release escrow
  const handleReleaseEscrow = async () => {
    if (!selectedEscrow) return;

    try {
      await releaseEscrow({
        id: selectedEscrow.id,
        data: {
          release_reason: releaseReason || undefined,
        },
      }).unwrap();
      toast({
        title: t("escrows.actions.release_success"),
        description: t("escrows.actions.release_success_desc"),
      });
      setReleaseDialogOpen(false);
      setReleaseReason("");
      setSelectedEscrow(null);
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("escrows.actions.release_error"),
        description: errorMessage || t("escrows.actions.release_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle refund escrow
  const handleRefundEscrow = async () => {
    if (!selectedEscrow) return;

    try {
      await refundEscrow({
        id: selectedEscrow.id,
        data: {
          refund_reason: refundReason || undefined,
        },
      }).unwrap();
      toast({
        title: t("escrows.actions.refund_success"),
        description: t("escrows.actions.refund_success_desc"),
      });
      setRefundDialogOpen(false);
      setRefundReason("");
      setSelectedEscrow(null);
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("escrows.actions.refund_error"),
        description: errorMessage || t("escrows.actions.refund_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Define table columns
  const columns: ColumnDef<Escrow>[] = useMemo(() => [
    {
      id: "escrow_number",
      accessorKey: "escrow_number",
      header: t("escrows.table.escrow_number"),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.escrow_number}
        </div>
      ),
    },
    {
      id: "order",
      accessorKey: "order",
      header: t("escrows.table.order"),
      cell: ({ row }) => {
        const order = row.order;
        return (
          <div className="flex items-center gap-2">
            {order ? (
              <>
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.order_number}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                {t("common.not_available")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: t("escrows.table.amount"),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">
            {formatCurrency(row.amount)} {row.currency}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("escrows.table.platform_fee")}: {formatCurrency(row.platform_fee)} {row.currency}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("escrows.table.seller_amount")}: {formatCurrency(row.seller_amount)} {row.currency}
          </div>
        </div>
      ),
    },
    {
      id: "parties",
      header: t("escrows.table.parties"),
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">
              {t("escrows.table.buyer")}: {row.buyer?.email || `#${row.buyer_id}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">
              {t("escrows.table.seller")}: {row.seller?.email || `#${row.seller_id}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("common.status.status"),
      cell: ({ row }) => (
        <Badge
          variant={getStatusBadgeVariant(row.status)}
          className={cn("capitalize", getStatusColor(row.status))}
        >
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      id: "held_at",
      accessorKey: "held_at",
      header: t("escrows.table.held_at"),
      cell: ({ row }) => (
        <div className="text-sm">
          {timeFormat(row.held_at, "MM/DD/YYYY")}
        </div>
      ),
    },
    {
      id: "released_at",
      accessorKey: "released_at",
      header: t("escrows.table.released_at"),
      cell: ({ row }) => (
        <div className="text-sm">
          {row.released_at ? (
            timeFormat(row.released_at, "MM/DD/YYYY")
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("common.actions"),
      cell: ({ row }) => {
        const canRelease = canReleaseEscrow(row);
        const canRefund = canRefundEscrow(row);

        return (
          <div className="flex items-center gap-1 justify-center">
            {row.order && (
              <CustomTooltip content={t("escrows.actions.view_order")}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.CLIENT.ORDERS.ORDER_DETAILS(row.order_id))}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </CustomTooltip>
            )}
            {canRelease && (
              <CustomTooltip content={t("escrows.actions.release")}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEscrow(row);
                    setReleaseDialogOpen(true);
                  }}
                  disabled={isReleasing}
                >
                  <Unlock className="w-4 h-4 text-green-600" />
                </Button>
              </CustomTooltip>
            )}
            {canRefund && (
              <CustomTooltip content={t("escrows.actions.refund")}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEscrow(row);
                    setRefundDialogOpen(true);
                  }}
                  disabled={isRefunding}
                >
                  <ArrowLeftRight className="w-4 h-4 text-red-600" />
                </Button>
              </CustomTooltip>
            )}
          </div>
        );
      },
    },
  ], [t, navigate, getStatusLabel, getStatusColor, canReleaseEscrow, canRefundEscrow, isReleasing, isRefunding]);

  // Filter escrows by search term
  const filteredEscrows = useMemo(() => {
    if (!searchTerm) return escrows;
    const term = searchTerm.toLowerCase();
    return escrows.filter((escrow) =>
      escrow.escrow_number.toLowerCase().includes(term) ||
      escrow.order?.order_number?.toLowerCase().includes(term) ||
      escrow.buyer?.email?.toLowerCase().includes(term) ||
      escrow.seller?.email?.toLowerCase().includes(term)
    );
  }, [escrows, searchTerm]);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold">{t("escrows.error.title")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("escrows.error.description")}
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
          <h1 className="text-3xl font-bold tracking-tight">{t("escrows.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("escrows.description")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("escrows.filters.title")}</CardTitle>
          <CardDescription>{t("escrows.filters.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("escrows.filters.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EscrowStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder={t("escrows.filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="pending">{getStatusLabel("pending")}</SelectItem>
                <SelectItem value="released">{getStatusLabel("released")}</SelectItem>
                <SelectItem value="refunded">{getStatusLabel("refunded")}</SelectItem>
                <SelectItem value="disputed">{getStatusLabel("disputed")}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={t("escrows.filters.order_id_placeholder")}
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
              type="number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Escrows Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("escrows.table.title")}</CardTitle>
          <CardDescription>
            {t("escrows.table.description", { count: escrowsData?.pagination?.total || 0 })}
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
          ) : filteredEscrows.length === 0 ? (
            <EmptyState
              icon={<Shield className="w-16 h-16 text-muted-foreground" />}
              title={t("escrows.empty.title")}
              description={t("escrows.empty.description")}
            />
          ) : (
            <DataTableWithPagination
              columns={columns}
              data={filteredEscrows}
              pagination={escrowsData?.pagination}
              pageSize={size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Release Escrow Dialog */}
      <AlertDialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("escrows.dialogs.release.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("escrows.dialogs.release.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {selectedEscrow && (
              <div className="space-y-2">
                <Label>{t("escrows.dialogs.release.amount")}</Label>
                <p className="text-sm font-medium">
                  {formatCurrency(selectedEscrow.amount)} {selectedEscrow.currency}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="release-reason">{t("escrows.dialogs.release.reason")}</Label>
              <Textarea
                id="release-reason"
                value={releaseReason}
                onChange={(e) => setReleaseReason(e.target.value)}
                placeholder={t("escrows.dialogs.release.reason_placeholder")}
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReleaseEscrow}
              disabled={isReleasing}
            >
              {isReleasing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("escrows.actions.release")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Escrow Dialog */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("escrows.dialogs.refund.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("escrows.dialogs.refund.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {selectedEscrow && (
              <div className="space-y-2">
                <Label>{t("escrows.dialogs.refund.amount")}</Label>
                <p className="text-sm font-medium">
                  {formatCurrency(selectedEscrow.amount)} {selectedEscrow.currency}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="refund-reason">{t("escrows.dialogs.refund.reason")}</Label>
              <Textarea
                id="refund-reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder={t("escrows.dialogs.refund.reason_placeholder")}
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRefundEscrow}
              disabled={isRefunding}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRefunding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.processing")}
                </>
              ) : (
                t("escrows.actions.refund")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientEscrowsPage;
