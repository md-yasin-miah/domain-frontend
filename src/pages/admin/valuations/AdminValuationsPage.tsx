import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { BarChart3, Trash2, History, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetValuationsQuery,
  useDeleteValuationMutation,
} from "@/store/api/valuationsApi";
import { ROUTES } from "@/lib/routes";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { usePagination } from "@/hooks/usePagination";
import type { ColumnDef } from "@/components/ui/data-table";

function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, { dateStyle: "short" });
}

export default function AdminValuationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [valuationTypeFilter, setValuationTypeFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const filters: ValuationFilters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(valuationTypeFilter !== "all" && { valuation_type: valuationTypeFilter }),
    }),
    [page, size, valuationTypeFilter]
  );

  const { data: valuations = [], isLoading } = useGetValuationsQuery(filters);
  const [deleteValuation] = useDeleteValuationMutation();
  const items = valuations as Valuation[];

  const pagination = useMemo(() => {
    const total = (page - 1) * size + items.length;
    const hasNext = items.length >= size;
    const hasPrevious = page > 1;
    const totalPages = Math.max(1, hasNext ? page + 1 : page);
    if (totalPages <= 1 && !hasPrevious) return undefined;
    return {
      total,
      page: page - 1,
      total_pages: totalPages,
      has_next: hasNext,
      has_previous: hasPrevious,
    };
  }, [page, size, items.length]);

  const handleDelete = async () => {
    if (deleteTarget == null) return;
    try {
      await deleteValuation(deleteTarget).unwrap();
      toast({ title: t("admin.valuations.deleted") });
      setDeleteTarget(null);
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const columns: ColumnDef<Valuation>[] = useMemo(
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
        id: "domain_name",
        accessorKey: (row) => row.domain_name,
        header: t("admin.valuations.domain"),
        cell: ({ row }) => (
          <span className="font-medium">
            {row.domain_name}
          </span>
        ),
      },
      {
        id: "domain_extension",
        accessorKey: "domain_extension",
        header: t("admin.valuations.domain_extension", "Extension"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.domain_extension ? `.${row.domain_extension}` : "—"}
          </span>
        ),
      },
      {
        id: "estimated_value",
        accessorKey: "estimated_value",
        header: t("admin.valuations.estimated_value"),
        cell: ({ row }) => formatCurrency(row.estimated_value, row.currency),
      },
      {
        id: "listing_id",
        accessorKey: "listing_id",
        header: t("admin.valuations.listing_id"),
        cell: ({ row }) =>
          row.listing_id ? (
            <Link
              to={`${ROUTES.ADMIN.LISTINGS_MANAGEMENT}/view/${row.listing_id}`}
              className="text-primary hover:underline"
            >
              #{row.listing_id}
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "calculated_at",
        accessorKey: "calculated_at",
        header: t("admin.valuations.calculated_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.calculated_at)}</span>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_0%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="relative flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            {t("admin.valuations.title", "Valuations")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.valuations.description", "Manage valuations, comparable sales, and market trends.")}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="outline" size="sm" asChild>
              <Link to={ROUTES.ADMIN.VALUATIONS.COMPARABLE_SALES}>
                <History className="h-4 w-4 mr-1" />
                {t("admin.sidebar.valuations_comparable", "Comparable Sales")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={ROUTES.ADMIN.VALUATIONS.MARKET_TRENDS}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {t("admin.sidebar.valuations_trends", "Market Trends")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{t("admin.valuations.tab_valuations")}</CardTitle>
            <CardDescription>
              {pagination ? `${pagination.total} ${t("common.items", "items")}` : `${items.length} ${t("common.items", "items")}`}
            </CardDescription>
          </div>
          <Select
            value={valuationTypeFilter}
            onValueChange={(v) => {
              setValuationTypeFilter(v);
              handlePageChange(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="domain">domain</SelectItem>
              <SelectItem value="website">website</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<Valuation>
            data={items}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.valuations.empty")}
            emptyIcon={<BarChart3 className="h-10 w-10 text-muted-foreground" />}
            getRowId={(row) => String(row.id)}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            renderActions={(row) => (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(row.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            actionsColumnHeader={t("common.actions")}
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteTarget != null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.valuations.delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("admin.valuations.delete_confirm_description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("admin.valuations.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
