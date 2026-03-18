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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { TrendingUp, Loader2, Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetMarketTrendsQuery,
  useCreateMarketTrendMutation,
  useUpdateMarketTrendMutation,
  useDeleteMarketTrendMutation,
  useGetMarketTrendsInsightsQuery,
  type MarketTrend,
  type MarketTrendFilters,
  type MarketTrendCreateRequest,
  type MarketTrendUpdateRequest,
} from "@/store/api/valuationApi";

const PAGE_SIZE = 10;
const TREND_TYPES = ["domain_extension", "category"];

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

const defaultForm: MarketTrendCreateRequest = {
  trend_type: "domain_extension",
  trend_key: ".com",
  period_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  period_end: new Date().toISOString().slice(0, 10),
  average_sale_price: 0,
  median_sale_price: 0,
  total_sales_count: 0,
  total_sales_volume: 0,
  currency: "USD",
};

export default function AdminMarketTrendsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [trendTypeFilter, setTrendTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MarketTrend | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<MarketTrendCreateRequest>(defaultForm);

  const filters: MarketTrendFilters = useMemo(
    () => ({
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...(trendTypeFilter !== "all" && { trend_type: trendTypeFilter }),
    }),
    [page, trendTypeFilter]
  );

  const { data: trends = [], isLoading } = useGetMarketTrendsQuery(filters);
  const { data: insights, isLoading: loadingInsights } = useGetMarketTrendsInsightsQuery();
  const [createTrend] = useCreateMarketTrendMutation();
  const [updateTrend] = useUpdateMarketTrendMutation();
  const [deleteTrend] = useDeleteMarketTrendMutation();

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...defaultForm,
      period_end: new Date().toISOString().slice(0, 10),
      period_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
    setDialogOpen(true);
  };

  const openEdit = (trend: MarketTrend) => {
    setEditing(trend);
    setForm({
      trend_type: trend.trend_type,
      trend_key: trend.trend_key,
      period_start: trend.period_start?.slice(0, 10) ?? defaultForm.period_start,
      period_end: trend.period_end?.slice(0, 10) ?? defaultForm.period_end,
      average_sale_price: trend.average_sale_price,
      median_sale_price: trend.median_sale_price,
      total_sales_count: trend.total_sales_count,
      total_sales_volume: trend.total_sales_volume,
      price_change_percentage: trend.price_change_percentage ?? null,
      sales_count_change_percentage: trend.sales_count_change_percentage ?? null,
      currency: trend.currency || "USD",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        const updateData: MarketTrendUpdateRequest = {
          average_sale_price: form.average_sale_price,
          median_sale_price: form.median_sale_price,
          total_sales_count: form.total_sales_count,
          total_sales_volume: form.total_sales_volume,
          price_change_percentage: form.price_change_percentage ?? null,
          sales_count_change_percentage: form.sales_count_change_percentage ?? null,
        };
        await updateTrend({ id: editing.id, data: updateData }).unwrap();
        toast({ title: t("common.updated", "Updated") });
      } else {
        await createTrend(form).unwrap();
        toast({ title: t("common.created", "Created") });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteTrend(deleteId).unwrap();
      toast({ title: t("admin.valuations.trend_deleted") });
      setDeleteId(null);
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_0%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="relative flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            {t("admin.sidebar.valuations_trends", "Market Trends")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.valuations.trends_description", "Manage market trend data by extension or category.")}
          </p>
        </div>
      </div>

      {insights && (
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Market Insights
            </CardTitle>
            <CardDescription>
              Generated {insights.generated_at ? new Date(insights.generated_at).toLocaleString() : "—"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingInsights ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {insights.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
                )}
                {insights.key_trends?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key trends</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {insights.key_trends.map((trend, i) => (
                        <li key={i}>{trend}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {insights.extension_highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {insights.extension_highlights.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {h.extension}: {h.insight}
                      </Badge>
                    ))}
                  </div>
                )}
                {insights.recommendations?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {insights.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{t("admin.valuations.tab_trends")}</CardTitle>
            <CardDescription>
              {trends.length} {t("common.items", "items")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={trendTypeFilter}
              onValueChange={(v) => {
                setTrendTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("admin.valuations.filter_trend_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {TREND_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              {t("common.add")}
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : trends.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center text-muted-foreground">
              <TrendingUp className="mx-auto h-10 w-10 opacity-50 mb-2" />
              <p>{t("admin.valuations.trends_empty")}</p>
              {/* <Button variant="outline" className="mt-4" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("common.add")}
              </Button> */}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>{t("admin.valuations.trend_type")}</TableHead>
                    <TableHead>{t("admin.valuations.trend_key")}</TableHead>
                    <TableHead>{t("admin.valuations.period")}</TableHead>
                    <TableHead>{t("admin.valuations.avg_price")}</TableHead>
                    <TableHead className="w-[100px]">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trends.map((trend) => (
                    <TableRow key={trend.id}>
                      <TableCell className="font-mono text-muted-foreground">#{trend.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{trend.trend_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{trend.trend_key}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(trend.period_start)} – {formatDate(trend.period_end)}
                      </TableCell>
                      <TableCell>{formatCurrency(trend.average_sale_price, trend.currency)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(trend)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(trend.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {trends.length >= PAGE_SIZE && (
                <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    {t("common.previous")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>
                    {t("common.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("common.add")} market trend</DialogTitle>
            <DialogDescription>
              {editing ? "Update prices and metrics." : "Add a new market trend record."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Trend type</Label>
                <Select
                  value={form.trend_type}
                  onValueChange={(v) => setForm((f) => ({ ...f, trend_type: v }))}
                  disabled={!!editing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TREND_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Trend key (e.g. .com)</Label>
                <Input
                  value={form.trend_key}
                  onChange={(e) => setForm((f) => ({ ...f, trend_key: e.target.value }))}
                  placeholder=".com"
                  disabled={!!editing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Period start</Label>
                <Input
                  type="date"
                  value={form.period_start?.slice(0, 10) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Period end</Label>
                <Input
                  type="date"
                  value={form.period_end?.slice(0, 10) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Average sale price</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.average_sale_price ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, average_sale_price: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Median sale price</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.median_sale_price ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, median_sale_price: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Total sales count</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.total_sales_count ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, total_sales_count: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Total sales volume</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.total_sales_volume ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, total_sales_volume: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit}>
              {editing ? t("common.update") : t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
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
