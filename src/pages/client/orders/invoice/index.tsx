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
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Receipt,
  Search,
  Loader2,
  Download,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Send,
} from "lucide-react";
import {
  useGetInvoicesQuery,
  useIssueInvoiceMutation,
} from "@/store/api/invoiceApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";
import InvoicePDF from "@/components/invoice/InvoicePDF";
import { generatePDF } from "@/lib/pdfUtils";
import { ordersApi } from "@/store/api/ordersApi";
import { store } from "@/store/index";
import { Tooltip } from "@/components/ui/tooltip";
import CustomTooltip from "@/components/common/CustomTooltip";

type InvoiceStatus = "draft" | "issued" | "paid" | "overdue" | "cancelled";

const AllInvoice = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: InvoiceQueryParams = {
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

    // Filter by current user's invoices (buyer or seller)
    if (user) {
      // You can uncomment these if you want to filter by user role
      // params.buyer_id = user.id; // or params.seller_id = user.id;
    }

    return params;
  }, [page, size, statusFilter, orderIdFilter, user]);

  const {
    data: invoicesData,
    isLoading,
    error,
    refetch,
  } = useGetInvoicesQuery(queryParams);

  const [issueInvoice, { isLoading: isIssuing }] = useIssueInvoiceMutation();

  // Get status label
  const getStatusLabel = useCallback((status: string) => {
    return t(`common.status.${status}`) || status;
  }, [t]);

  // Handle issue invoice
  const handleIssueInvoice = async (invoice: Invoice) => {
    try {
      const result = await issueInvoice(invoice.id).unwrap();

      toast({
        title: t("invoices.issue_success") || "Invoice Issued",
        description:
          t("invoices.issue_success_desc") ||
          `Invoice ${result.invoice_number} has been issued and sent to the buyer.`,
      });

      // Refetch invoices to update the list
      refetch();
    } catch (error: unknown) {
      console.error("Error issuing invoice:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { detail?: string } }).data?.detail
          : t("invoices.issue_error_desc") || "Failed to issue invoice.";

      toast({
        title: t("invoices.issue_error") || "Issue Failed",
        description: errorMessage || t("invoices.issue_error_desc") || "Failed to issue invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle download invoice PDF
  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      // Fetch order data for the invoice using the store dispatch
      const orderResult = await store.dispatch(
        ordersApi.endpoints.getOrder.initiate(invoice.order_id)
      );
      const order = orderResult.data;

      if (!order) {
        toast({
          title: t("invoices.download_error") || "Download Failed",
          description: t("invoices.download_error_desc") || "Order not found for this invoice.",
          variant: "destructive",
        });
        return;
      }

      const filename = `Invoice-${invoice.invoice_number}-${invoice.order_id}.pdf`;

      await generatePDF(
        <InvoicePDF order={order} invoice={invoice} />,
        filename
      );

      toast({
        title: t("invoices.download_success") || "Invoice Downloaded",
        description: t("invoices.download_success_desc") || "Invoice has been downloaded successfully.",
      });
    } catch (error: unknown) {
      console.error("Error downloading invoice:", error);
      toast({
        title: t("invoices.download_error") || "Download Failed",
        description: t("invoices.download_error_desc") || "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Define table columns
  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        id: "invoice_number",
        accessorKey: "invoice_number",
        header: t("invoices.table.invoice_number") || "Invoice Number",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.invoice_number}</span>
          </div>
        ),
      },
      {
        id: "order_id",
        accessorKey: "order_id",
        header: t("invoices.table.order_id") || "Order ID",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">#{row.order_id}</span>
          </div>
        ),
      },
      {
        id: "amount",
        accessorKey: "total_amount",
        header: t("invoices.table.amount") || "Amount",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {formatCurrency(row.total_amount)} {row.currency}
            </span>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("invoices.table.status") || "Status",
        cell: ({ row }) => (
          <Badge
            variant={getStatusBadgeVariant(row.status)}
            className={cn(
              "capitalize",
              row.status === "paid" &&
              "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
              row.status === "overdue" &&
              "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
              row.status === "issued" &&
              "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
            )}
          >
            {getStatusLabel(row.status)}
          </Badge>
        ),
      },
      {
        id: "issue_date",
        accessorKey: "issue_date",
        header: t("invoices.table.issue_date") || "Issue Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {row.issue_date
                ? timeFormat(row.issue_date, "MMM DD, YYYY")
                : "-"}
            </span>
          </div>
        ),
      },
      {
        id: "due_date",
        accessorKey: "due_date",
        header: t("invoices.table.due_date") || "Due Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {row.due_date
                ? timeFormat(row.due_date, "MMM DD, YYYY")
                : "-"}
            </span>
          </div>
        ),
      },
      {
        id: "paid_at",
        accessorKey: "paid_at",
        header: t("invoices.table.paid_at") || "Paid At",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm">
            {row.paid_at ? (
              <>
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-green-600">
                  {timeFormat(row.paid_at, "MMM DD, YYYY")}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("invoices.table.created_at") || "Created At",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{timeFormat(row.created_at, "MMM DD, YYYY")}</span>
          </div>
        ),
      },
    ],
    [t, getStatusLabel]
  );

  // Render actions for each row
  const renderActions = (invoice: Invoice) => {
    const canIssue = invoice.status === "draft";
    const isIssuingThis = isIssuing;

    return (
      <div className="flex items-center gap-1">
        {canIssue && (
          <CustomTooltip
            content={t("invoices.actions.issue") || "Issue Invoice"}
            side="top"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleIssueInvoice(invoice)}
              disabled={isIssuingThis}
            >
              {isIssuingThis ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </CustomTooltip>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.CLIENT.ORDERS.ORDER_DETAILS(invoice.order_id))}
          title={t("invoices.actions.view_order") || "View Order"}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadInvoice(invoice)}
          title={t("invoices.actions.download") || "Download PDF"}
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Receipt className="w-8 h-8 text-primary" />
          {t("invoices.title") || "Invoices"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("invoices.description") || "View and manage all your invoices"}
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t("invoices.table.title") || "Invoices"}</CardTitle>
          <CardDescription>
            {t("invoices.table.description") ||
              "Manage and track all your invoices"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    t("invoices.search_placeholder") ||
                    "Search by invoice number, order ID..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as InvoiceStatus | "all")
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue
                  placeholder={
                    t("invoices.filter_by_status") || "Filter by status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("invoices.filters.all_statuses") || "All Statuses"}
                </SelectItem>
                <SelectItem value="draft">
                  {getStatusLabel("draft")}
                </SelectItem>
                <SelectItem value="issued">
                  {getStatusLabel("issued")}
                </SelectItem>
                <SelectItem value="paid">
                  {getStatusLabel("paid")}
                </SelectItem>
                <SelectItem value="overdue">
                  {getStatusLabel("overdue")}
                </SelectItem>
                <SelectItem value="cancelled">
                  {getStatusLabel("cancelled")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Order ID Filter */}
            <Input
              type="number"
              placeholder={t("invoices.filter_by_order") || "Order ID"}
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
              className="w-full md:w-[150px]"
            />
          </div>

          {/* Table */}
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
                <Receipt className="w-16 h-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("invoices.error.title") || "Error loading invoices"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("invoices.error.description") ||
                      "There was an error loading your invoices. Please try again later."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={invoicesData?.items || []}
                columns={columns}
                isLoading={false}
                emptyMessage={t("invoices.empty.no_invoices") || "No invoices found"}
                emptyIcon={
                  <Receipt className="w-16 h-16 text-muted-foreground" />
                }
                getRowId={(row) => String(row.id)}
                renderActions={renderActions}
                actionsColumnHeader={t("invoices.table.actions") || "Actions"}
                enableSorting={true}
              />

              {/* Pagination */}
              {invoicesData && invoicesData.pagination && (
                <TablePagination
                  pagination={invoicesData.pagination}
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

export default AllInvoice;
