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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Loader2, Pencil, Eye, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
  type Payment,
  type PaymentUpdateRequest,
} from "@/store/api/paymentsApi";
import {
  useAdminListWithdrawalsQuery,
  useAdminUpdateWithdrawalMutation,
  type WithdrawalItem,
} from "@/store/api/withdrawalsApi";
import { ROUTES } from "@/lib/routes";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
];

const WITHDRAWAL_STATUS_OPTIONS = [
  "pending",
  "approved",
  "completed",
  "rejected",
] as const;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatAmount(
  amount: number | string | null,
  currency: string,
): string {
  if (amount == null) return "—";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  }).format(n);
}

function getStatusClass(status: string): string {
  if (status === "completed") return "text-green-600";
  if (status === "failed" || status === "cancelled") return "text-destructive";
  return "";
}

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updateForm, setUpdateForm] = useState<PaymentUpdateRequest>({});
  const [activeTab, setActiveTab] = useState<string>("payments");

  // Withdrawals (admin)
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] =
    useState<string>("all");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalItem | null>(null);
  const [withdrawalUpdateStatus, setWithdrawalUpdateStatus] = useState<
    "approved" | "rejected" | "completed"
  >("approved");
  const [withdrawalRejectionReason, setWithdrawalRejectionReason] =
    useState("");
  const [withdrawalAdminNotes, setWithdrawalAdminNotes] = useState("");

  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 15,
  });
  const {
    page: wPage,
    size: wSize,
    handlePageChange: handleWPageChange,
    handlePageSizeChange: handleWPageSizeChange,
  } = usePagination({ initialPage: 1, initialPageSize: 15 });

  const filters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(paymentMethodFilter !== "all" && {
        payment_method: paymentMethodFilter,
      }),
    }),
    [page, size, statusFilter, paymentMethodFilter],
  );

  const { data, isLoading, refetch, error } = useGetPaymentsQuery(filters);
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const withdrawalFilters = useMemo(
    () => ({
      skip: (wPage - 1) * wSize,
      limit: wSize,
      ...(withdrawalStatusFilter !== "all" && {
        status: withdrawalStatusFilter,
      }),
    }),
    [wPage, wSize, withdrawalStatusFilter],
  );
  const {
    data: withdrawalsData,
    isLoading: withdrawalsLoading,
    error: withdrawalsError,
    refetch: refetchWithdrawals,
  } = useAdminListWithdrawalsQuery(withdrawalFilters);
  const [adminUpdateWithdrawal, { isLoading: isUpdatingWithdrawal }] =
    useAdminUpdateWithdrawalMutation();

  const items = data?.items ?? [];
  const rawPagination = data?.pagination;
  const withdrawalItems = withdrawalsData?.items ?? [];
  const rawWPagination = withdrawalsData?.pagination;
  const pagination = useMemo(
    () =>
      rawPagination
        ? {
            total: rawPagination.total ?? 0,
            page: rawPagination.page ?? 0,
            total_pages: rawPagination.total_pages ?? 1,
            has_next: rawPagination.has_next ?? false,
            has_previous: rawPagination.has_previous ?? false,
          }
        : undefined,
    [rawPagination],
  );
  const withdrawalsPagination = useMemo(
    () =>
      rawWPagination
        ? {
            total: rawWPagination.total ?? 0,
            page: rawWPagination.page ?? 0,
            total_pages: rawWPagination.total_pages ?? 1,
            has_next: rawWPagination.has_next ?? false,
            has_previous: rawWPagination.has_previous ?? false,
          }
        : undefined,
    [rawWPagination],
  );

  const withdrawalColumns: ColumnDef<WithdrawalItem>[] = useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: t("admin.withdrawals.id"),
        cell: ({ row }) => <span className="font-mono text-sm">#{row.id}</span>,
      },
      {
        id: "user",
        accessorKey: (row) =>
          row.user?.username ?? row.user?.email ?? row.user_id,
        header: t("admin.withdrawals.user"),
        cell: ({ row }) =>
          row.user ? (
            <Link
              to={ROUTES.ADMIN.USERS.DETAILS(row.user_id)}
              className="text-primary hover:underline"
            >
              {row.user.username || row.user.email}
            </Link>
          ) : (
            row.user_id
          ),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("admin.withdrawals.amount"),
        cell: ({ row }) => (
          <div>
            <span>{formatAmount(row.amount, row.currency)}</span>
            {row.net_amount != null && (
              <span className="text-xs text-muted-foreground block">
                Net: {formatAmount(row.net_amount, row.currency)}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("admin.withdrawals.status"),
        cell: ({ row }) => (
          <span
            className={cn(
              "capitalize",
              row.status === "completed" && "text-green-600",
              row.status === "rejected" && "text-destructive",
            )}
          >
            {row.status}
          </span>
        ),
      },
      {
        id: "payout_method",
        accessorKey: "payout_method",
        header: t("admin.withdrawals.payout_method"),
        cell: ({ row }) => row.payout_method ?? "—",
      },
      {
        id: "requested_at",
        accessorKey: "requested_at",
        header: t("admin.withdrawals.requested_at"),
        cell: ({ row }) => formatDate(row.requested_at),
      },
    ],
    [t],
  );

  const handleOpenUpdate = (payment: Payment) => {
    setSelectedPayment(payment);
    setUpdateForm({
      status: payment.status,
      transaction_id: payment.transaction_id ?? undefined,
      refund_amount: payment.refund_amount ?? undefined,
      refund_reason: payment.refund_reason ?? undefined,
    });
  };

  const handleCloseUpdate = () => {
    setSelectedPayment(null);
    setUpdateForm({});
  };

  const handleSubmitUpdate = async () => {
    if (!selectedPayment) return;

    try {
      await updatePayment({
        id: selectedPayment.id,
        data: {
          status: updateForm.status,
          transaction_id: updateForm.transaction_id ?? undefined,
          refund_amount:
            updateForm.refund_amount !== undefined &&
            updateForm.refund_amount !== ""
              ? Number(updateForm.refund_amount)
              : undefined,
          refund_reason: updateForm.refund_reason ?? undefined,
        },
      }).unwrap();

      toast({
        title: t("admin.payments.updated"),
        description: t(
          "admin.payments.updated_desc",
          "Payment has been updated successfully.",
        ),
      });

      handleCloseUpdate();
      refetch();
    } catch (err: unknown) {
      const detail =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof (err as { data: { detail?: string } }).data === "object"
          ? (err as { data: { detail?: string } }).data?.detail
          : t("common.error");
      toast({
        title: t("common.error"),
        description: String(detail),
        variant: "destructive",
      });
    }
  };

  const handleOpenWithdrawalUpdate = (w: WithdrawalItem) => {
    setSelectedWithdrawal(w);
    setWithdrawalUpdateStatus(
      w.status === "pending"
        ? "approved"
        : (w.status as "approved" | "rejected" | "completed"),
    );
    setWithdrawalRejectionReason(w.rejection_reason ?? "");
    setWithdrawalAdminNotes(w.admin_notes ?? "");
  };
  const handleCloseWithdrawalUpdate = () => {
    setSelectedWithdrawal(null);
    setWithdrawalRejectionReason("");
    setWithdrawalAdminNotes("");
  };
  const handleSubmitWithdrawalUpdate = async () => {
    if (!selectedWithdrawal) return;
    if (
      withdrawalUpdateStatus === "rejected" &&
      !withdrawalRejectionReason.trim()
    ) {
      toast({
        title: t(
          "admin.withdrawals.rejection_required",
          "Rejection reason required",
        ),
        description: t(
          "admin.withdrawals.rejection_required_desc",
          "Please provide a reason when rejecting.",
        ),
        variant: "destructive",
      });
      return;
    }
    try {
      await adminUpdateWithdrawal({
        withdrawalId: selectedWithdrawal.id,
        data: {
          status: withdrawalUpdateStatus,
          admin_notes: withdrawalAdminNotes.trim() || undefined,
          rejection_reason:
            withdrawalUpdateStatus === "rejected"
              ? withdrawalRejectionReason.trim()
              : undefined,
        },
      }).unwrap();
      toast({
        title: t("admin.withdrawals.updated"),
        description: t(
          "admin.withdrawals.updated_desc",
          "Status has been updated successfully.",
        ),
      });
      handleCloseWithdrawalUpdate();
      refetchWithdrawals();
    } catch (err: unknown) {
      const detail =
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as { data?: { detail?: string } }).data?.detail;
      toast({
        title: t("common.error"),
        description: typeof detail === "string" ? detail : t("common.error"),
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Payment>[] = useMemo(
    () => [
      {
        id: "payment_number",
        accessorKey: "payment_number",
        header: t("admin.payments.payment_number"),
        cell: ({ row }) => (
          <Link
            to={ROUTES.ADMIN.PAYMENT_DETAILS(row.id)}
            className="text-primary hover:underline font-medium"
          >
            {row.payment_number}
          </Link>
        ),
      },
      {
        id: "order",
        accessorKey: (row) => row.order?.order_number ?? row.order_id,
        header: t("admin.payments.order"),
        cell: ({ row }) =>
          row.order ? (
            <Link
              to={ROUTES.ADMIN.ORDERS.DETAILS(row.order.id)}
              className="text-primary hover:underline"
            >
              {row.order.order_number}
            </Link>
          ) : (
            `#${row.order_id}`
          ),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("admin.payments.amount"),
        cell: ({ row }) => (
          <div>
            <span>{formatAmount(row.amount, row.currency)}</span>
            {row.refund_amount != null && Number(row.refund_amount) > 0 && (
              <span className="text-muted-foreground text-xs block">
                Refund: {formatAmount(row.refund_amount, row.currency)}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "payment_method",
        accessorKey: "payment_method",
        header: t("admin.payments.method"),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("admin.payments.status"),
        cell: ({ row }) => (
          <span className={cn("capitalize", getStatusClass(row.status))}>
            {row.status}
          </span>
        ),
      },
      {
        id: "paid_at",
        accessorKey: "paid_at",
        header: t("admin.payments.paid_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.paid_at)}
          </span>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("admin.payments.created"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.created_at)}
          </span>
        ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="h-7 w-7" />
          {t("admin.payments.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.payments.description")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t("admin.payments.tab_payments")}
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            {t("admin.payments.tab_withdrawals")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>
                  {t("admin.payments.list_title")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "admin.payments.list_desc",
                    "Payments across all orders. Filter by status or method.",
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label className="sr-only">
                    {t("admin.payments.filter_status")}
                  </Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      setStatusFilter(v);
                      handlePageChange(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("admin.payments.all_statuses")}
                      </SelectItem>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="sr-only">
                    {t("admin.payments.filter_method")}
                  </Label>
                  <Select
                    value={paymentMethodFilter}
                    onValueChange={(v) => {
                      setPaymentMethodFilter(v);
                      handlePageChange(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("admin.payments.all_methods")}
                      </SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTableWithPagination<Payment>
                data={items}
                columns={columns}
                pagination={pagination}
                isLoading={isLoading}
                emptyMessage={t(
                  "admin.payments.no_payments",
                  "No payments found.",
                )}
                emptyIcon={
                  <CreditCard className="w-16 h-16 text-muted-foreground" />
                }
                getRowId={(row) => String(row.id)}
                renderActions={(row) => (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link
                        to={ROUTES.ADMIN.PAYMENT_DETAILS(row.id)}
                        title={t("admin.payments.view")}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenUpdate(row)}
                      title={t("admin.payments.update")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                actionsColumnHeader={t("admin.payments.actions")}
                enableSorting={true}
                pageSize={size}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                error={error}
                errorTitle={t("common.error")}
                errorDescription={t(
                  "admin.payments.error_desc",
                  "Failed to load payments.",
                )}
                errorIcon={
                  <CreditCard className="w-16 h-16 text-muted-foreground" />
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>
                  {t("admin.withdrawals.list_title")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "admin.withdrawals.list_desc",
                    "Seller withdrawal requests. Approve, reject, or mark as completed.",
                  )}
                </CardDescription>
              </div>
              <div className="space-y-2">
                <Label className="sr-only">
                  {t("admin.withdrawals.filter_status")}
                </Label>
                <Select
                  value={withdrawalStatusFilter}
                  onValueChange={(v) => {
                    setWithdrawalStatusFilter(v);
                    handleWPageChange(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("admin.withdrawals.all_statuses")}
                    </SelectItem>
                    {WITHDRAWAL_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTableWithPagination<WithdrawalItem>
                data={withdrawalItems}
                columns={withdrawalColumns}
                pagination={withdrawalsPagination}
                isLoading={withdrawalsLoading}
                emptyMessage={t(
                  "admin.withdrawals.no_withdrawals",
                  "No withdrawals found.",
                )}
                emptyIcon={
                  <Banknote className="w-16 h-16 text-muted-foreground" />
                }
                getRowId={(row) => String(row.id)}
                renderActions={(row) => (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenWithdrawalUpdate(row)}
                      title={t(
                        "admin.withdrawals.update_status",
                        "Update status",
                      )}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                actionsColumnHeader={t("admin.withdrawals.actions")}
                enableSorting={true}
                pageSize={wSize}
                onPageChange={handleWPageChange}
                onPageSizeChange={handleWPageSizeChange}
                error={withdrawalsError}
                errorTitle={t("common.error")}
                errorDescription={t(
                  "admin.withdrawals.error_desc",
                  "Failed to load withdrawals.",
                )}
                errorIcon={
                  <Banknote className="w-16 h-16 text-muted-foreground" />
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedPayment}
        onOpenChange={(open) => !open && handleCloseUpdate()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("admin.payments.update_title")}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <>
                  {selectedPayment.payment_number} —{" "}
                  {formatAmount(
                    selectedPayment.amount,
                    selectedPayment.currency,
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="update_status">
                {t("admin.payments.status")}
              </Label>
              <Select
                value={updateForm.status ?? ""}
                onValueChange={(v) =>
                  setUpdateForm((f) => ({ ...f, status: v }))
                }
              >
                <SelectTrigger id="update_status">
                  <SelectValue
                    placeholder={t(
                      "admin.payments.select_status",
                      "Select status",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="update_transaction_id">
                {t("admin.payments.transaction_id")}
              </Label>
              <Input
                id="update_transaction_id"
                value={updateForm.transaction_id ?? ""}
                onChange={(e) =>
                  setUpdateForm((f) => ({
                    ...f,
                    transaction_id: e.target.value || undefined,
                  }))
                }
                placeholder="e.g. pi_xxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update_refund_amount">
                {t("admin.payments.refund_amount")}
              </Label>
              <Input
                id="update_refund_amount"
                type="number"
                step="0.01"
                min="0"
                value={updateForm.refund_amount ?? ""}
                onChange={(e) =>
                  setUpdateForm((f) => ({
                    ...f,
                    refund_amount:
                      e.target.value === "" ? undefined : e.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update_refund_reason">
                {t("admin.payments.refund_reason")}
              </Label>
              <Input
                id="update_refund_reason"
                value={updateForm.refund_reason ?? ""}
                onChange={(e) =>
                  setUpdateForm((f) => ({
                    ...f,
                    refund_reason: e.target.value || undefined,
                  }))
                }
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseUpdate}
              disabled={isUpdating}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmitUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedWithdrawal}
        onOpenChange={(open) => !open && handleCloseWithdrawalUpdate()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("admin.withdrawals.update_title")}
            </DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && (
                <>
                  #{selectedWithdrawal.id} —{" "}
                  {formatAmount(
                    selectedWithdrawal.amount,
                    selectedWithdrawal.currency,
                  )}{" "}
                  (
                  {selectedWithdrawal.user?.username ??
                    selectedWithdrawal.user_id}
                  )
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("admin.withdrawals.status")}</Label>
              <Select
                value={withdrawalUpdateStatus}
                onValueChange={(v) =>
                  setWithdrawalUpdateStatus(
                    v as "approved" | "rejected" | "completed",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">
                    {t("admin.withdrawals.status_approved")}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {t("admin.withdrawals.status_rejected")}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t("admin.withdrawals.status_completed")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {withdrawalUpdateStatus === "rejected" && (
              <div className="space-y-2">
                <Label htmlFor="withdrawal_rejection_reason">
                  {t("admin.withdrawals.rejection_reason")}{" "}
                  *
                </Label>
                <Input
                  id="withdrawal_rejection_reason"
                  value={withdrawalRejectionReason}
                  onChange={(e) => setWithdrawalRejectionReason(e.target.value)}
                  placeholder={t(
                    "admin.withdrawals.rejection_placeholder",
                    "Reason shown to seller",
                  )}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="withdrawal_admin_notes">
                {t("admin.withdrawals.admin_notes")}
              </Label>
              <Textarea
                id="withdrawal_admin_notes"
                value={withdrawalAdminNotes}
                onChange={(e) => setWithdrawalAdminNotes(e.target.value)}
                placeholder={t(
                  "admin.withdrawals.admin_notes_placeholder",
                  "Internal notes (optional)",
                )}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseWithdrawalUpdate}
              disabled={isUpdatingWithdrawal}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmitWithdrawalUpdate}
              disabled={isUpdatingWithdrawal}
            >
              {isUpdatingWithdrawal && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
