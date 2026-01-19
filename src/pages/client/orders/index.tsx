import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { Search, Package, Loader2, Eye, FileText } from "lucide-react";
import { useGetOrdersQuery } from "@/store/api/ordersApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusColor,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import { usePagination } from "@/hooks/usePagination";

type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

const AllOrdersPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: OrderFilters = {
      skip: (page - 1) * size,
      limit: size,
    };
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    return params;
  }, [page, size, statusFilter, searchTerm]);

  const { data: ordersData, isLoading, error } = useGetOrdersQuery(queryParams);
  // Define table columns
  const columns: ColumnDef<Order>[] = useMemo(() => {
    // Get status label helper
    const getStatusLabel = (status: string) => {
      return t(`common.status.${status}`) || status;
    };

    return [
      {
        id: "order_number",
        accessorKey: "order_number",
        header: t("orders.table.order_number"),
        cell: ({ row }) => (
          <div className="font-medium">
            <Link
              to={`${ROUTES.CLIENT.ORDERS.INDEX}/${row.id}`}
              className="text-primary hover:underline"
            >
              {row.order_number}
            </Link>
          </div>
        ),
      },
      {
        id: "listing",
        accessorKey: (row) => row.listing?.title || "",
        header: t("orders.table.listing"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.listing?.title || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {t("orders.table.listing_id")}: {row.listing_id}
            </div>
          </div>
        ),
      },
      {
        id: "buyer",
        accessorKey: (row) => row.buyer?.username || row.buyer?.email || "",
        header: t("orders.table.buyer"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.buyer?.username || row.buyer?.email || "N/A"}
            </div>
          </div>
        ),
      },
      {
        id: "seller",
        accessorKey: (row) => row.seller?.username || row.seller?.email || "",
        header: t("orders.table.seller"),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.seller?.username || row.seller?.email || "N/A"}
            </div>
          </div>
        ),
      },
      {
        id: "final_price",
        accessorKey: "final_price",
        header: t("orders.table.price"),
        cell: ({ row }) => (
          <div className="font-medium">
            {formatCurrency(row.final_price)} {row.currency}
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
        id: "created_at",
        accessorKey: "created_at",
        header: t("orders.table.created_at"),
        cell: ({ row }) => (
          <div className="text-sm">
            {timeFormat(row.created_at, "MM/DD/YYYY")}
          </div>
        ),
      },
    ];
  }, [t]);

  // Render actions for each row
  const renderActions = (order: Order) => (
    <Button variant="ghost" size="sm" asChild>
      <Link to={ROUTES.CLIENT.ORDERS.ORDER_DETAILS(order.id)}>
        <Eye className="w-4 h-4" />
      </Link>
    </Button>
  );

  return (
    <div className="space-y-6 container mx-auto">
      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              <CardTitle>{t("orders.all_orders")}</CardTitle>
              <CardDescription>
                {t("orders.description")}{" "}
                <span className="text-xs  bg-primary/10 px-2 py-1 rounded-md">
                  {ordersData?.pagination?.total || 0}{" "}
                  {t("orders.table.total_orders")}
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
                      placeholder={t("orders.search_placeholder")}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handlePageChange(1); // Reset to first page on search
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value as OrderStatus | "all");
                      handlePageChange(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("orders.filter_by_status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("common.status.all")}
                      </SelectItem>
                      <SelectItem value="pending">
                        {t("common.status.pending")}
                      </SelectItem>
                      <SelectItem value="processing">
                        {t("common.status.processing")}
                      </SelectItem>
                      <SelectItem value="completed">
                        {t("common.status.completed")}
                      </SelectItem>
                      <SelectItem value="cancelled">
                        {t("common.status.cancelled")}
                      </SelectItem>
                      <SelectItem value="refunded">
                        {t("common.status.refunded")}
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
                <Package className="w-16 h-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("orders.error.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("orders.error.description")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={ordersData?.items || []}
                columns={columns}
                isLoading={false}
                emptyMessage={t("orders.empty.no_orders")}
                emptyIcon={
                  <Package className="w-16 h-16 text-muted-foreground" />
                }
                getRowId={(row) => String(row.id)}
                renderActions={renderActions}
                actionsColumnHeader={t("orders.table.actions")}
                enableSorting={true}
              />

              {/* Pagination */}
              {ordersData && ordersData.pagination && (
                <TablePagination
                  pagination={ordersData.pagination}
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
    </div>
  );
};

export default AllOrdersPage;
