import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Package, MoreHorizontal, FileText, CreditCard, Shield, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "@/store/api/ordersApi";
import {
  formatCurrency,
  timeFormat,
  getStatusColor,
  getStatusLabel,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/usePagination";

const STATUS_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "pending", labelKey: "common.status.pending" },
  { value: "payment_pending", labelKey: "common.status.payment_pending" },
  { value: "payment_received", labelKey: "common.status.payment_received" },
  { value: "in_progress", labelKey: "common.status.in_progress" },
  { value: "completed", labelKey: "common.status.completed" },
  { value: "cancelled", labelKey: "common.status.cancelled" },
  { value: "refunded", labelKey: "common.status.refunded" },
  { value: "disputed", labelKey: "common.status.disputed" },
] as const;

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const filters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter }),
    }),
    [page, size, statusFilter]
  );

  const { data: ordersData, isLoading, error } = useGetOrdersQuery(filters);
  const orders = ordersData?.items ?? [];
  const total = ordersData?.pagination?.total ?? 0;

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        id: "order_number",
        accessorKey: "order_number",
        header: t("orders.table.order_number"),
        cell: ({ row }) => (
          <Link
            to={ROUTES.ADMIN.ORDERS.DETAILS(row.id)}
            className="text-primary hover:underline font-medium"
          >
            {row.order_number}
          </Link>
        ),
      },
      {
        id: "listing",
        accessorKey: (row) => row.listing?.title ?? "",
        header: t("orders.table.listing"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.listing?.title ?? "—"}</div>
            <div className="text-xs text-muted-foreground">ID: {row.listing_id}</div>
          </div>
        ),
      },
      {
        id: "buyer",
        accessorKey: (row) => row.buyer?.username || row.buyer?.email || "",
        header: t("orders.table.buyer"),
        cell: ({ row }) =>
          row.buyer?.username || row.buyer?.email || "—",
      },
      {
        id: "seller",
        accessorKey: (row) => row.seller?.username || row.seller?.email || "",
        header: t("orders.table.seller"),
        cell: ({ row }) =>
          row.seller?.username || row.seller?.email || "—",
      },
      {
        id: "final_price",
        accessorKey: "final_price",
        header: t("orders.table.price"),
        cell: ({ row }) => (
          <span>
            {formatCurrency(row.final_price)} {row.currency}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("common.status.status"),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={cn("capitalize", getStatusColor(row.status))}
          >
            {getStatusLabel(row.status, t)}
          </Badge>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("orders.table.created_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {timeFormat(row.created_at, "MM/DD/YYYY HH:mm")}
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
          <ShoppingCart className="h-7 w-7" />
          {t("admin.orders.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.orders.description")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.orders.all_orders")}</CardTitle>
            <CardDescription>
              {t("admin.orders.manage_orders")}{" "}
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                {total} {t("admin.orders.total")}
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
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("orders.filter_by_status")} />
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
          <DataTableWithPagination<Order>
            data={orders}
            columns={columns}
            pagination={ordersData?.pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.orders.empty")}
            emptyIcon={<Package className="w-16 h-16 text-muted-foreground" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to={ROUTES.ADMIN.ORDERS.DETAILS(row.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t("admin.orders.view_order")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={ROUTES.ADMIN.ORDERS.INVOICES(row.id)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {t("admin.orders.view_invoice")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={ROUTES.ADMIN.ORDERS.PAYMENTS(row.id)}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {t("admin.orders.view_payment")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={ROUTES.ADMIN.ORDERS.ESCROWS(row.id)}
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      {t("admin.orders.view_escrow")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            actionsColumnHeader={t("orders.table.actions")}
            enableSorting={true}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            error={error}
            errorTitle={t("orders.error.title")}
            errorDescription={t("orders.error.description")}
            errorIcon={<Package className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
