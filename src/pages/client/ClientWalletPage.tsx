import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
} from "@/store/api/walletApi";
import {
  useGetWithdrawalBalanceQuery,
  useCreateWithdrawalMutation,
  useListMyWithdrawalsQuery,
} from "@/store/api/withdrawalsApi";
import AddFundModal from "@/components/wallet/AddFundModal";
import { CopyToClipboard } from "@/components/common/CopyToClipboard";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/usePagination";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD"] as const;
const PAYOUT_METHODS = ["bank_transfer", "stripe", "paypal", "other"] as const;

function formatWalletBalance(
  amount: number | string,
  currency: string,
): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(isNaN(n) ? 0 : n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ClientWalletPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currency, setCurrency] = useState<string>("USD");
  const [addFundOpen, setAddFundOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("balance");

  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPayoutMethod, setWithdrawPayoutMethod] =
    useState<string>("bank_transfer");
  const [withdrawPayoutDetails, setWithdrawPayoutDetails] = useState("");

  const { data: wallet, isLoading: walletLoading } =
    useGetWalletQuery(currency);
  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useGetWalletTransactionsQuery({ currency, skip: 0, limit: 20 });

  const { data: withdrawalBalance, isLoading: balanceLoading } =
    useGetWithdrawalBalanceQuery(currency);
  const [createWithdrawal, { isLoading: isCreatingWithdrawal }] =
    useCreateWithdrawalMutation();
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });
  const {
    data: withdrawalsData,
    isLoading: withdrawalsLoading,
    refetch: refetchWithdrawals,
  } = useListMyWithdrawalsQuery({
    skip: (page - 1) * size,
    limit: size,
  });

  const withdrawalItems = withdrawalsData?.items ?? [];
  const withdrawalPagination = withdrawalsData?.pagination;

  // Open Add Fund modal when ?type=add-fund
  useEffect(() => {
    if (searchParams.get("type") === "add-fund") {
      setAddFundOpen(true);
    }
  }, [searchParams]);

  const handleAddFundSuccess = () => {
    setAddFundOpen(false);
    refetchTransactions();
    if (searchParams.get("type") === "add-fund") {
      const next = new URLSearchParams(searchParams);
      next.delete("type");
      setSearchParams(next, { replace: true });
    }
  };

  const handleRequestWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: t("wallet.withdraw.amount_required", "Invalid amount"),
        description: t(
          "wallet.withdraw.amount_required_desc",
          "Enter a positive amount.",
        ),
        variant: "destructive",
      });
      return;
    }
    const available = Number(withdrawalBalance?.earnings_available ?? 0);
    if (amount > available) {
      toast({
        title: t("wallet.withdraw.insufficient", "Insufficient balance"),
        description: t(
          "wallet.withdraw.insufficient_desc",
          "Available: {{amount}}",
          {
            amount: formatWalletBalance(available, currency),
          },
        ),
        variant: "destructive",
      });
      return;
    }
    try {
      let payout_details: Record<string, unknown> | undefined;
      if (withdrawPayoutDetails.trim()) {
        try {
          payout_details = JSON.parse(withdrawPayoutDetails.trim()) as Record<
            string,
            unknown
          >;
        } catch {
          payout_details = { notes: withdrawPayoutDetails.trim() };
        }
      }
      await createWithdrawal({
        amount,
        currency,
        payout_method: withdrawPayoutMethod,
        payout_details,
      }).unwrap();
      toast({
        title: t("wallet.withdraw.success", "Withdrawal requested"),
        description: t(
          "wallet.withdraw.success_desc",
          "Your withdrawal request has been submitted.",
        ),
      });
      setWithdrawAmount("");
      setWithdrawPayoutDetails("");
      refetchWithdrawals();
    } catch (err: unknown) {
      const detail =
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as { data?: { detail?: string } }).data?.detail;
      toast({
        title: t("common.error", "Error"),
        description: typeof detail === "string" ? detail : t("common.error"),
        variant: "destructive",
      });
    }
  };

  const items = transactions?.items ?? [];
  const availableToWithdraw = Number(
    withdrawalBalance?.earnings_available ?? 0,
  );

  const withdrawalColumns: ColumnDef<(typeof withdrawalItems)[0]>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: t("wallet.withdraw.table_id", "ID"),
      cell: ({ row }) => <span className="font-mono text-sm">#{row.id}</span>,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: t("wallet.withdraw.table_amount", "Amount"),
      cell: ({ row }) => formatWalletBalance(row.amount, row.currency),
    },
    {
      id: "net_amount",
      accessorKey: "net_amount",
      header: t("wallet.withdraw.table_net", "Net"),
      cell: ({ row }) =>
        row.net_amount != null
          ? formatWalletBalance(row.net_amount, row.currency)
          : "—",
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("wallet.withdraw.table_status", "Status"),
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
      id: "requested_at",
      accessorKey: "requested_at",
      header: t("wallet.withdraw.table_requested", "Requested"),
      cell: ({ row }) => formatDateTime(row.requested_at),
    },
  ];

  const pagination = withdrawalPagination
    ? {
        total: withdrawalPagination.total ?? 0,
        page: withdrawalPagination.page ?? 0,
        total_pages: withdrawalPagination.total_pages ?? 1,
        has_next: withdrawalPagination.has_next ?? false,
        has_previous: withdrawalPagination.has_previous ?? false,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("wallet.title") || "Wallet"}
          </h1>
          <p className="text-muted-foreground">
            {t("wallet.subtitle") ||
              "Manage your wallet balance and transactions"}
          </p>
        </div>
        <Button onClick={() => setAddFundOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          {t("wallet.add_fund.title") || "Add Funds"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="balance" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {t("wallet.tab_balance", "Balance")}
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            {t("wallet.tab_withdraw", "Withdraw")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                {t("wallet.balance.title") || "Balance"}
              </CardTitle>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <div className="h-10 w-32 bg-muted animate-pulse rounded" />
              ) : wallet ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {formatWalletBalance(wallet.balance, wallet.currency)}
                  </div>
                  {wallet.updated_at && (
                    <p className="text-xs text-muted-foreground">
                      {t("wallet.balance.updated") || "Last updated"}:{" "}
                      {formatDate(wallet.updated_at)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t("wallet.balance.unavailable") || "Balance unavailable"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("wallet.transactions.title") || "Recent Transactions"}
              </CardTitle>
              <CardDescription>
                {t("wallet.transactions.description") ||
                  "Your wallet transaction history"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  {t("wallet.transactions.empty") || "No transactions yet"}
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((txn) => {
                    const isCredit =
                      txn.type === "add_fund" || txn.type === "credit";
                    return (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between py-3 px-3 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {isCredit ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="space-y-1 min-w-0">
                            <p className="font-medium text-sm capitalize">
                              {txn.type.replace(/_/g, " ")}
                            </p>
                            <p className="flex items-center gap-1">
                              <small>Reference ID:</small>
                              {txn.reference_id && (
                                <CopyToClipboard
                                  tooltipContent={t(
                                    "wallet.transactions.copy_reference_id",
                                  )}
                                  textToCopy={txn.reference_id}
                                  className="gap-1.5"
                                  variant="ghost"
                                  size="icon"
                                >
                                  <span className="text-xs text-muted-foreground font-mono truncate">
                                    {txn.reference_id}
                                  </span>
                                </CopyToClipboard>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(txn.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={
                              isCredit
                                ? "font-semibold text-green-600"
                                : "font-medium text-muted-foreground"
                            }
                          >
                            {isCredit ? "+" : ""}
                            {formatWalletBalance(txn.amount, txn.currency)}
                          </span>
                          {txn.description && (
                            <p className="text-xs text-end text-muted-foreground whitespace-pre-line">
                              {txn.description.replace(".", ".\n")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                {t(
                  "wallet.withdraw.earnings_title",
                  "Earnings available to withdraw",
                )}
              </CardTitle>
              <CardDescription>
                {t(
                  "wallet.withdraw.earnings_desc",
                  "Withdraw released escrow funds (seller earnings). Commission may apply.",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {balanceLoading ? (
                <div className="h-20 bg-muted animate-pulse rounded" />
              ) : withdrawalBalance ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "wallet.withdraw.available",
                          "Available to withdraw",
                        )}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatWalletBalance(
                          withdrawalBalance.earnings_available,
                          currency,
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        {t("wallet.withdraw.total_earned", "Total earned")}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatWalletBalance(
                          withdrawalBalance.total_earned,
                          currency,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="font-medium">
                      {t("wallet.withdraw.request_title", "Request withdrawal")}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="withdraw_amount">
                          {t("wallet.withdraw.amount_label", "Amount")} (
                          {currency})
                        </Label>
                        <Input
                          id="withdraw_amount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdraw_method">
                          {t("wallet.withdraw.payout_method", "Payout method")}
                        </Label>
                        <Select
                          value={withdrawPayoutMethod}
                          onValueChange={setWithdrawPayoutMethod}
                        >
                          <SelectTrigger id="withdraw_method">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYOUT_METHODS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="withdraw_details">
                        {t(
                          "wallet.withdraw.payout_details",
                          "Payout details (optional JSON)",
                        )}
                      </Label>
                      <Input
                        id="withdraw_details"
                        placeholder='{"account": "...", "bank": "..."}'
                        value={withdrawPayoutDetails}
                        onChange={(e) =>
                          setWithdrawPayoutDetails(e.target.value)
                        }
                      />
                    </div>
                    <Button
                      onClick={handleRequestWithdrawal}
                      disabled={
                        isCreatingWithdrawal || availableToWithdraw <= 0
                      }
                    >
                      {isCreatingWithdrawal && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {t("wallet.withdraw.submit", "Request withdrawal")}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t(
                    "wallet.withdraw.balance_unavailable",
                    "Balance unavailable.",
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("wallet.withdraw.history_title", "My withdrawal requests")}
              </CardTitle>
              <CardDescription>
                {t(
                  "wallet.withdraw.history_desc",
                  "List of your withdrawal requests and their status.",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTableWithPagination
                data={withdrawalItems}
                columns={withdrawalColumns}
                pagination={pagination}
                isLoading={withdrawalsLoading}
                emptyMessage={t(
                  "wallet.withdraw.no_withdrawals",
                  "No withdrawals yet",
                )}
                emptyIcon={
                  <Banknote className="w-16 h-16 text-muted-foreground" />
                }
                getRowId={(row) => String(row.id)}
                pageSize={size}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddFundModal
        open={addFundOpen}
        onOpenChange={setAddFundOpen}
        onSuccess={handleAddFundSuccess}
      />
    </div>
  );
}
