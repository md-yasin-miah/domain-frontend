import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetWalletQuery, useGetWalletTransactionsQuery } from '@/store/api/walletApi';
import AddFundModal from '@/components/wallet/AddFundModal';
import { CopyToClipboard } from '@/components/common/CopyToClipboard';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'] as const;

function formatWalletBalance(amount: number | string, currency: string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(isNaN(n) ? 0 : n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: 'medium',
  });
}

export default function ClientWalletPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currency, setCurrency] = useState<string>('USD');
  const [addFundOpen, setAddFundOpen] = useState(false);

  const { data: wallet, isLoading: walletLoading } = useGetWalletQuery(currency);
  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } =
    useGetWalletTransactionsQuery({ currency, skip: 0, limit: 20 });

  // Open Add Fund modal when ?type=add-fund
  useEffect(() => {
    if (searchParams.get('type') === 'add-fund') {
      setAddFundOpen(true);
    }
  }, [searchParams]);

  const handleAddFundSuccess = () => {
    setAddFundOpen(false);
    refetchTransactions();
    if (searchParams.get('type') === 'add-fund') {
      const next = new URLSearchParams(searchParams);
      next.delete('type');
      setSearchParams(next, { replace: true });
    }
  };

  const items = transactions?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('wallet.title') || 'Wallet'}</h1>
          <p className="text-muted-foreground">
            {t('wallet.subtitle') || 'Manage your wallet balance and transactions'}
          </p>
        </div>
        <Button onClick={() => setAddFundOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          {t('wallet.add_fund.title') || 'Add Funds'}
        </Button>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            {t('wallet.balance.title') || 'Balance'}
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
                  {t('wallet.balance.updated') || 'Last updated'}: {formatDate(wallet.updated_at)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {t('wallet.balance.unavailable') || 'Balance unavailable'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('wallet.transactions.title') || 'Recent Transactions'}</CardTitle>
          <CardDescription>
            {t('wallet.transactions.description') || 'Your wallet transaction history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              {t('wallet.transactions.empty') || 'No transactions yet'}
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((txn) => {
                const isCredit = txn.type === 'add_fund' || txn.type === 'credit';
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
                          {txn.type.replace(/_/g, ' ')}
                        </p>
                        {txn.description && (
                          <p className="text-xs text-muted-foreground">{txn.description}</p>
                        )}
                        {txn.reference_id && (
                          <CopyToClipboard
                            tooltipContent={t('wallet.transactions.copy_reference_id')}
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
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={
                        isCredit
                          ? 'font-semibold text-green-600'
                          : 'font-medium text-muted-foreground'
                      }
                    >
                      {isCredit ? '+' : ''}
                      {formatWalletBalance(txn.amount, txn.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddFundModal
        open={addFundOpen}
        onOpenChange={setAddFundOpen}
        onSuccess={handleAddFundSuccess}
      />
    </div>
  );
}
