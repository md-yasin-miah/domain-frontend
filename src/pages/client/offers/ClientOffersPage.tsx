import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  Handshake,
  Loader2,
  Check,
  X,
  RotateCcw,
  Trash2,
  Eye,
} from "lucide-react";
import { useGetOffersQuery } from "@/store/api/offersApi";
import { useAuth } from "@/store/hooks/useAuth";
import { useOfferActions } from "@/pages/client/offers/hooks/useOfferActions";
import { getOfferPermissions } from "@/utils/offerPermissions";
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
import CustomTooltip from "@/components/common/CustomTooltip";
import { offerCounterSchema, type OfferCounterFormData } from "@/schemas/marketplace/offer.schema";

type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "countered"
  | "withdrawn";

const ClientOffersPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "all">("all");
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);

  // React Hook Form for counter offer
  const counterForm = useForm<OfferCounterFormData>({
    resolver: zodResolver(offerCounterSchema),
    defaultValues: {
      amount: undefined,
      message: "",
    },
  });
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: ClientFiltersParams = {
      skip: (page - 1) * size,
      limit: size,
    };
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
    return params;
  }, [page, size, statusFilter]);

  const {
    data: offersData,
    isLoading,
    error,
    refetch,
  } = useGetOffersQuery(queryParams);

  const {
    handleAccept,
    handleReject,
    handleCounter,
    handleWithdraw,
    isAccepting,
    isRejecting,
    isCountering,
    isWithdrawing,
  } = useOfferActions({
    onSuccess: () => refetch(),
  });

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
  const onAccept = (offerId: number) => {
    handleAccept(offerId, refetch);
  };

  const onReject = (offerId: number) => {
    handleReject(offerId, refetch);
  };

  const onCounter = async (data: OfferCounterFormData) => {
    if (!selectedOffer) {
      toast({
        title: t("offers.actions.counter_error"),
        description: t("offers.actions.counter_error_desc"),
        variant: "destructive",
      });
      return;
    }

    await handleCounter(
      selectedOffer,
      data,
      {
        refetch,
        form: counterForm,
        onSuccess: () => {
          setCounterDialogOpen(false);
          setSelectedOffer(null);
        },
      }
    );
  };

  const onWithdraw = (offerId: number) => {
    handleWithdraw(offerId, refetch);
  };

  // Render actions for each row
  const renderActions = (offer: Offer) => {
    const { canAccept, canReject, canCounter, canWithdraw } = getOfferPermissions(offer.status, user.id, offer.buyer_id);

    return (
      <div className="flex items-center gap-1 justify-center">
        {canAccept && (
          <CustomTooltip
            content={t("offers.actions.accept")}
            side="top"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAccept(offer.id)}
              disabled={isAccepting}
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
          </CustomTooltip>
        )}
        {canReject && (
          <CustomTooltip
            content={t("offers.actions.reject")}
            side="top"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReject(offer.id)}
              disabled={isRejecting}
            >
              <X className="w-4 h-4 text-red-600" />
            </Button>
          </CustomTooltip>
        )}
        {canCounter && (
          <CustomTooltip
            content={t("offers.actions.counter")}
            side="top"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedOffer(offer.id);
                setCounterDialogOpen(true);
              }}
            >
              <RotateCcw className="w-4 h-4 text-blue-600" />
            </Button>
          </CustomTooltip>
        )}
        {canWithdraw && (
          <CustomTooltip
            content={t("offers.actions.withdraw")}
            side="top"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWithdraw(offer.id)}
              disabled={isWithdrawing}
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </Button>
          </CustomTooltip>
        )}
        <CustomTooltip
          content={t("offers.actions.view")}
          side="top"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.CLIENT.OFFERS.DETAILS(offer.id))}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </CustomTooltip>
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
          {error ? (
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
            <DataTableWithPagination
              data={offersData?.items || []}
              columns={columns}
              pagination={offersData?.pagination}
              isLoading={isLoading}
              emptyMessage={t("offers.empty.no_offers")}
              emptyIcon={<Handshake className="w-16 h-16 text-muted-foreground" />}
              getRowId={(row) => String(row.id)}
              renderActions={renderActions}
              actionsColumnHeader={t("offers.table.actions")}
              enableSorting={true}
              pageSize={size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              error={error}
              errorTitle={t("offers.error.title")}
              errorDescription={t("offers.error.description")}
              errorIcon={<Handshake className="w-16 h-16 text-muted-foreground" />}
            />
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
            counterForm.reset();
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
          <Form {...counterForm}>
            <form onSubmit={counterForm.handleSubmit(onCounter)} className="space-y-4 py-4">
              <FormField
                control={counterForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("offers.actions.counter_dialog.amount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t(
                          "offers.actions.counter_dialog.amount_placeholder"
                        )}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={counterForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("offers.actions.counter_dialog.message")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "offers.actions.counter_dialog.message_placeholder"
                        )}
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCounterDialogOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isCountering}
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
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ClientOffersPage;
