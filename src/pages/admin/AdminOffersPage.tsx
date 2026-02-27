import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Handshake, Eye } from "lucide-react";
import { formatCurrency, getStatusColor, timeFormat } from "@/lib/helperFun";
import { useGetOffersQuery } from "@/store/api/offersApi";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";

const STATUS_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "pending", labelKey: "common.status.pending" },
  { value: "accepted", labelKey: "common.status.accepted" },
  { value: "rejected", labelKey: "common.status.rejected" },
  { value: "countered", labelKey: "common.status.countered" },
  { value: "withdrawn", labelKey: "common.status.withdrawn" },
] as const;

export default function AdminOffersPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const filters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter as Offer["status"] }),
    }),
    [page, size, statusFilter]
  );

  const { data: offersData, isLoading, error } = useGetOffersQuery(filters);
  const offers = offersData?.items ?? [];
  const total = offersData?.pagination?.total ?? 0;

  const openDetail = (offer: Offer) => {
    setSelectedOffer(offer);
    setDetailModalOpen(true);
  };

  const columns: ColumnDef<Offer>[] = useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-muted-foreground">#{row.id}</span>
        ),
      },
      {
        id: "listing",
        accessorKey: (row) => row.listing?.title ?? "",
        header: t("offers.table.listing"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium max-w-[180px] truncate">
              {row.listing?.title ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("offers.table.listing_id")}: {row.listing_id}
            </div>
          </div>
        ),
      },
      {
        id: "buyer",
        accessorKey: (row) => row.buyer?.username ?? row.buyer?.email ?? "",
        header: t("offers.table.buyer"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.buyer?.username ?? row.buyer?.email ?? "—"}
          </span>
        ),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("offers.table.amount"),
        cell: ({ row }) => (
          <span className="font-semibold">
            {formatCurrency(row.amount)} {row.currency}
          </span>
        ),
      },
      {
        id: "listing_price",
        accessorKey: (row) => row.listing?.price,
        header: t("offers.table.listing_price"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.listing
              ? formatCurrency(row.listing.price) +
                " " +
                (row.listing.currency ?? "USD")
              : "—"}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("common.status.status"),
        cell: ({ row }) => (
          <Badge variant="outline" className={getStatusColor(row.status)}>
            {t(`common.status.${row.status}`) || row.status}
          </Badge>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("offers.table.created_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {timeFormat(row.created_at, "ll")}
          </span>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Handshake className="h-7 w-7" />
          {t("admin.offers.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.offers.description")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("offers.all_offers", "All Offers")}</CardTitle>
            <CardDescription>
              {t("offers.description", "Manage offers")}{" "}
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                {total} {t("offers.table.total_offers", "total")}
              </span>
            </CardDescription>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              handlePageChange(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("offers.filter_by_status", "Status")} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<Offer>
            data={offers}
            columns={columns}
            pagination={offersData?.pagination}
            isLoading={isLoading}
            emptyMessage={t("offers.empty.no_offers", "No offers found.")}
            emptyIcon={<Handshake className="h-12 w-12 mx-auto opacity-50" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDetail(row)}
                title={t("offers.actions.view")}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            actionsColumnHeader={t("common.actions")}
            enableSorting={true}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            error={error}
            errorTitle={t("orders.error.title")}
            errorDescription={t("orders.error.description")}
            errorIcon={<Handshake className="h-12 w-12 mx-auto opacity-50" />}
          />
        </CardContent>
      </Card>

      {/* Offer Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("offers.detail.title", "Offer")} #{selectedOffer?.id}
            </DialogTitle>
            <DialogDescription>
              {t("offers.detail.description", "Offer details")}
            </DialogDescription>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("offers.table.listing")}
                </p>
                <p className="font-medium">
                  {selectedOffer.listing?.title ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("offers.table.buyer")}
                </p>
                <p>
                  {selectedOffer.buyer?.username ??
                    selectedOffer.buyer?.email ??
                    "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("offers.table.amount")}
                </p>
                <p className="font-semibold">
                  {formatCurrency(selectedOffer.amount)}{" "}
                  {selectedOffer.currency}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("common.status.status")}
                </p>
                <Badge
                  variant="outline"
                  className={getStatusColor(selectedOffer.status)}
                >
                  {t(`common.status.${selectedOffer.status}`) ||
                    selectedOffer.status}
                </Badge>
              </div>
              {selectedOffer.message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("offers.detail.message", "Message")}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedOffer.message}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("offers.table.created_at")}
                  </p>
                  <p className="text-sm">
                    {timeFormat(selectedOffer.created_at, "lll")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("offers.table.expires_at")}
                  </p>
                  <p className="text-sm">
                    {selectedOffer.expires_at
                      ? timeFormat(selectedOffer.expires_at, "lll")
                      : t("offers.table.no_expiry", "No expiry")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
