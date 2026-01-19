import { useState, useMemo } from "react";
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
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Handshake,
  Loader2,
  Check,
  X,
  MessageSquare,
  RotateCcw,
  Trash2,
  Eye,
} from "lucide-react";
import {
  useGetOffersQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCounterOfferMutation,
  useWithdrawOfferMutation,
} from "@/store/api/offersApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusColor,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";

type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "countered"
  | "withdrawn";

const ClientOffersPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "all">("all");
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: ClientFiltersParams = {
      page,
      size,
    };
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    return params;
  }, [page, size, statusFilter, searchTerm]);

  const {
    data: offersData,
    isLoading,
    error,
    refetch,
  } = useGetOffersQuery(queryParams);

  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [counterOffer, { isLoading: isCountering }] = useCounterOfferMutation();
  const [withdrawOffer, { isLoading: isWithdrawing }] =
    useWithdrawOfferMutation();

  // Define table columns
  const columns: ColumnDef<Offer>[] = useMemo(() => {
    // Get status label helper
    const getStatusLabel = (status: string) => {
      return t(`common.status.${status}`) || status;
    };

    return [
      {
        id: "id",
        accessorKey: "id",
        header: t("offers.table.offer_id"),
        cell: ({ row }) => <div className="font-medium">#{row.id}</div>,
      },
      {
        id: "listing",
        accessorKey: (row) => row.listing?.title || "",
        header: t("offers.table.listing"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.listing?.title || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {t("offers.table.listing_id")}: {row.listing_id}
            </div>
          </div>
        ),
      },
      {
        id: "buyer",
        accessorKey: (row) => row.buyer?.username || row.buyer?.email || "",
        header: t("offers.table.buyer"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.buyer?.username || row.buyer?.email || "N/A"}
            </div>
          </div>
        ),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("offers.table.amount"),
        cell: ({ row }) => (
          <div className="font-medium">
            {formatCurrency(row.amount)} {row.currency}
          </div>
        ),
      },
      {
        id: "listing_price",
        accessorKey: (row) => row.listing?.price || 0,
        header: t("offers.table.listing_price"),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatCurrency(row.listing?.price || 0)}{" "}
            {row.listing?.currency || "USD"}
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
            className={cn(
              "capitalize",
              getStatusColor(row.status),
              "text-white"
            )}
          >
            {getStatusLabel(row.status)}
          </Badge>
        ),
      },
      {
        id: "expires_at",
        accessorKey: "expires_at",
        header: t("offers.table.expires_at"),
        cell: ({ row }) => (
          <div className="text-sm">
            {row.expires_at
              ? timeFormat(row.expires_at, "MM/DD/YYYY")
              : t("offers.table.no_expiry")}
          </div>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("offers.table.created_at"),
        cell: ({ row }) => (
          <div className="text-sm">
            {timeFormat(row.created_at, "MM/DD/YYYY")}
          </div>
        ),
      },
    ];
  }, [t]);

  // Handle offer actions
  const handleAccept = async (offerId: number) => {
    try {
      await acceptOffer(offerId).unwrap();
      toast({
        title: t("offers.actions.accept_success"),
        description: t("offers.actions.accept_success_desc"),
      });
      refetch();
    } catch (error) {
      toast({
        title: t("offers.actions.accept_error"),
        description: t("offers.actions.accept_error_desc"),
        variant: "destructive",
      });
    }
  };

  const handleReject = async (offerId: number) => {
    try {
      await rejectOffer(offerId).unwrap();
      toast({
        title: t("offers.actions.reject_success"),
        description: t("offers.actions.reject_success_desc"),
      });
      refetch();
    } catch (error) {
      toast({
        title: error?.data?.detail || t("offers.actions.reject_error"),
        description: t("offers.actions.reject_error_desc"),
        variant: "destructive",
      });
    }
  };

  const handleCounter = async () => {
    if (!selectedOffer || !counterAmount) {
      toast({
        title: t("offers.actions.counter_error"),
        description: t("offers.actions.counter_error_desc"),
        variant: "destructive",
      });
      return;
    }

    try {
      await counterOffer({
        id: selectedOffer,
        data: {
          amount: parseFloat(counterAmount),
          message: counterMessage || undefined,
        },
      }).unwrap();
      toast({
        title: t("offers.actions.counter_success"),
        description: t("offers.actions.counter_success_desc"),
      });
      setCounterDialogOpen(false);
      setCounterAmount("");
      setCounterMessage("");
      setSelectedOffer(null); // Clear selected offer to prevent details modal from opening
      refetch();
    } catch (error) {
      toast({
        title: error?.data?.detail || t("offers.actions.counter_error"),
        description: t("offers.actions.counter_error_desc"),
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async (offerId: number) => {
    try {
      await withdrawOffer(offerId).unwrap();
      toast({
        title: t("offers.actions.withdraw_success"),
        description: t("offers.actions.withdraw_success_desc"),
      });
      refetch();
    } catch (error) {
      toast({
        title: error?.data?.detail || t("offers.actions.withdraw_error"),
        description: t("offers.actions.withdraw_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Render actions for each row
  const renderActions = (offer: Offer) => {
    const canAccept = offer.status === "pending";
    const canReject = offer.status === "pending";
    const canCounter = offer.status === "pending";
    const canWithdraw = offer.status === "pending";

    return (
      <div className="flex items-center gap-1">
        {canAccept && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAccept(offer.id)}
            disabled={isAccepting}
            title={t("offers.actions.accept")}
          >
            <Check className="w-4 h-4 text-green-600" />
          </Button>
        )}
        {canReject && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReject(offer.id)}
            disabled={isRejecting}
            title={t("offers.actions.reject")}
          >
            <X className="w-4 h-4 text-red-600" />
          </Button>
        )}
        {canCounter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOffer(offer.id);
              setCounterDialogOpen(true);
            }}
            title={t("offers.actions.counter")}
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </Button>
        )}
        {canWithdraw && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleWithdraw(offer.id)}
            disabled={isWithdrawing}
            title={t("offers.actions.withdraw")}
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.CLIENT.OFFERS.DETAILS(offer.id))}
          title={t("offers.actions.view")}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      {/* Offers Table */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              <CardTitle>{t("offers.all_offers")}</CardTitle>
              <CardDescription>
                {t("offers.description")}{" "}
                <span className="text-xs bg-primary/10 px-2 py-1 rounded-md">
                  {offersData?.pagination?.total || 0}{" "}
                  {t("offers.table.total_offers")}
                </span>
              </CardDescription>
            </div>
            {/* Filters and Search */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("offers.search_placeholder")}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handlePageChange(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value as OfferStatus | "all");
                      handlePageChange(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("offers.filter_by_status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("common.status.all")}
                      </SelectItem>
                      <SelectItem value="pending">
                        {t("common.status.pending")}
                      </SelectItem>
                      <SelectItem value="accepted">
                        {t("common.status.accepted")}
                      </SelectItem>
                      <SelectItem value="rejected">
                        {t("common.status.rejected")}
                      </SelectItem>
                      <SelectItem value="countered">
                        {t("common.status.countered")}
                      </SelectItem>
                      <SelectItem value="withdrawn">
                        {t("common.status.withdrawn")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
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
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <Handshake className="w-16 h-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("offers.error.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("offers.error.description")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={offersData?.items || []}
                columns={columns}
                isLoading={false}
                emptyMessage={t("offers.empty.no_offers")}
                emptyIcon={
                  <Handshake className="w-16 h-16 text-muted-foreground" />
                }
                getRowId={(row) => String(row.id)}
                renderActions={renderActions}
                actionsColumnHeader={t("offers.table.actions")}
                enableSorting={true}
              />

              {/* Pagination */}
              {offersData && offersData.pagination && (
                <TablePagination
                  pagination={offersData.pagination}
                  pageSize={size}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Counter Offer Dialog */}
      <Dialog
        open={counterDialogOpen}
        onOpenChange={(open) => {
          setCounterDialogOpen(open);
          if (!open) {
            // Clear selected offer when closing counter dialog to prevent details modal from opening
            setSelectedOffer(null);
            setCounterAmount("");
            setCounterMessage("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("offers.actions.counter_dialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("offers.actions.counter_dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("offers.actions.counter_dialog.amount")}
              </label>
              <Input
                type="number"
                placeholder={t(
                  "offers.actions.counter_dialog.amount_placeholder"
                )}
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("offers.actions.counter_dialog.message")}
              </label>
              <Textarea
                placeholder={t(
                  "offers.actions.counter_dialog.message_placeholder"
                )}
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCounterDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleCounter}
              disabled={isCountering || !counterAmount}
            >
              {isCountering ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("offers.actions.countering")}
                </>
              ) : (
                t("offers.actions.counter_submit")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ClientOffersPage;
