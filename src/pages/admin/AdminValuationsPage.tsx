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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DollarSign,
  Loader2,
  Trash2,
  BarChart3,
  TrendingUp,
  History,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetValuationsQuery,
  useDeleteValuationMutation,
  useGetComparableSalesQuery,
  useDeleteComparableSaleMutation,
  useGetMarketTrendsQuery,
  useDeleteMarketTrendMutation,
  type Valuation,
  type ComparableSale,
  type MarketTrend,
  type ValuationFilters,
  type ComparableSaleFilters,
  type MarketTrendFilters,
} from "@/store/api/valuationApi";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    dateStyle: "short",
  });
}

export default function AdminValuationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [valuationTypeFilter, setValuationTypeFilter] = useState<string>("all");
  const [compExtensionFilter, setCompExtensionFilter] = useState<string>("");
  const [trendTypeFilter, setTrendTypeFilter] = useState<string>("");
  const [pageV, setPageV] = useState(1);
  const [pageC, setPageC] = useState(1);
  const [pageM, setPageM] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "valuation" | "comparable" | "trend"; id: number } | null
  >(null);

  const filtersV: ValuationFilters = useMemo(
    () => ({
      skip: (pageV - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...(valuationTypeFilter !== "all" && { valuation_type: valuationTypeFilter }),
    }),
    [pageV, valuationTypeFilter]
  );
  const filtersC: ComparableSaleFilters = useMemo(
    () => ({
      skip: (pageC - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...(compExtensionFilter && { domain_extension: compExtensionFilter }),
    }),
    [pageC, compExtensionFilter]
  );
  const filtersM: MarketTrendFilters = useMemo(
    () => ({
      skip: (pageM - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...(trendTypeFilter && { trend_type: trendTypeFilter }),
    }),
    [pageM, trendTypeFilter]
  );

  const { data: valuations = [], isLoading: loadingV } =
    useGetValuationsQuery(filtersV);
  const { data: comparableSales = [], isLoading: loadingC } =
    useGetComparableSalesQuery(filtersC);
  const { data: marketTrends = [], isLoading: loadingM } =
    useGetMarketTrendsQuery(filtersM);

  const [deleteValuation] = useDeleteValuationMutation();
  const [deleteComparableSale] = useDeleteComparableSaleMutation();
  const [deleteMarketTrend] = useDeleteMarketTrendMutation();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "valuation") {
        await deleteValuation(deleteTarget.id).unwrap();
        toast({ title: t("admin.valuations.deleted") });
      } else if (deleteTarget.type === "comparable") {
        await deleteComparableSale(deleteTarget.id).unwrap();
        toast({ title: t("admin.valuations.comparable_deleted") });
      } else {
        await deleteMarketTrend(deleteTarget.id).unwrap();
        toast({ title: t("admin.valuations.trend_deleted") });
      }
      setDeleteTarget(null);
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <DollarSign className="h-7 w-7" />
          {t("admin.valuations.title", "Valuations")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.valuations.description", "Manage valuations, comparable sales, and market trends.")}
        </p>
      </div>

      <Card>
        <Tabs defaultValue="valuations">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="valuations">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t("admin.valuations.tab_valuations")}
              </TabsTrigger>
              <TabsTrigger value="comparable">
                <History className="h-4 w-4 mr-2" />
                {t("admin.valuations.tab_comparable")}
              </TabsTrigger>
              <TabsTrigger value="trends">
                <TrendingUp className="h-4 w-4 mr-2" />
                {t("admin.valuations.tab_trends")}
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="valuations">
              <div className="flex justify-between items-center mb-4">
                <Select
                  value={valuationTypeFilter}
                  onValueChange={(v) => {
                    setValuationTypeFilter(v);
                    setPageV(1);
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
              </div>
              {loadingV ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : valuations.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  {t("admin.valuations.empty")}
                </p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("admin.valuations.domain")}</TableHead>
                        <TableHead>{t("admin.valuations.estimated_value")}</TableHead>
                        <TableHead>{t("admin.valuations.listing_id")}</TableHead>
                        <TableHead>{t("admin.valuations.calculated_at")}</TableHead>
                        <TableHead className="w-[80px]">{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(valuations as Valuation[]).map((v) => (
                        <TableRow key={v.id}>
                          <TableCell className="font-mono">#{v.id}</TableCell>
                          <TableCell>
                            {v.domain_name}
                            {v.domain_extension ? `.${v.domain_extension}` : ""}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(v.estimated_value, v.currency)}
                          </TableCell>
                          <TableCell>
                            {v.listing_id ? (
                              <Link
                                to={ROUTES.ADMIN.LISTINGS_MANAGEMENT + "/view/" + v.listing_id}
                                className="text-primary hover:underline"
                              >
                                #{v.listing_id}
                              </Link>
                            ) : "—"}
                          </TableCell>
                          <TableCell>{formatDate(v.calculated_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                setDeleteTarget({ type: "valuation", id: v.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(valuations as Valuation[]).length >= PAGE_SIZE && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageV <= 1}
                        onClick={() => setPageV((p) => p - 1)}
                      >
                        {t("common.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageV((p) => p + 1)}
                      >
                        {t("common.next")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="comparable">
              <div className="flex justify-between items-center mb-4">
                <Select
                  value={compExtensionFilter || "all"}
                  onValueChange={(v) => {
                    setCompExtensionFilter(v === "all" ? "" : v);
                    setPageC(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("admin.valuations.filter_extension")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="com">.com</SelectItem>
                    <SelectItem value="net">.net</SelectItem>
                    <SelectItem value="org">.org</SelectItem>
                    <SelectItem value="io">.io</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {loadingC ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : comparableSales.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  {t("admin.valuations.comparable_empty")}
                </p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("admin.valuations.domain")}</TableHead>
                        <TableHead>{t("admin.valuations.sale_price")}</TableHead>
                        <TableHead>{t("admin.valuations.sale_date")}</TableHead>
                        <TableHead>{t("admin.valuations.sale_source")}</TableHead>
                        <TableHead className="w-[80px]">{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(comparableSales as ComparableSale[]).map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono">#{s.id}</TableCell>
                          <TableCell>
                            {s.domain_name}.{s.domain_extension}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(s.sale_price, s.currency)}
                          </TableCell>
                          <TableCell>{formatDate(s.sale_date)}</TableCell>
                          <TableCell>{s.sale_source || "—"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                setDeleteTarget({ type: "comparable", id: s.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(comparableSales as ComparableSale[]).length >= PAGE_SIZE && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageC <= 1}
                        onClick={() => setPageC((p) => p - 1)}
                      >
                        {t("common.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageC((p) => p + 1)}
                      >
                        {t("common.next")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="trends">
              <div className="flex justify-between items-center mb-4">
                <Select
                  value={trendTypeFilter || "all"}
                  onValueChange={(v) => {
                    setTrendTypeFilter(v === "all" ? "" : v);
                    setPageM(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("admin.valuations.filter_trend_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="domain_extension">domain_extension</SelectItem>
                    <SelectItem value="category">category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {loadingM ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : marketTrends.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  {t("admin.valuations.trends_empty")}
                </p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("admin.valuations.trend_type")}</TableHead>
                        <TableHead>{t("admin.valuations.trend_key")}</TableHead>
                        <TableHead>{t("admin.valuations.period")}</TableHead>
                        <TableHead>{t("admin.valuations.avg_price")}</TableHead>
                        <TableHead className="w-[80px]">{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(marketTrends as MarketTrend[]).map((trend) => (
                        <TableRow key={trend.id}>
                          <TableCell className="font-mono">#{trend.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{trend.trend_type}</Badge>
                          </TableCell>
                          <TableCell>{trend.trend_key}</TableCell>
                          <TableCell>
                            {formatDate(trend.period_start)} – {formatDate(trend.period_end)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(trend.average_sale_price, trend.currency)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                setDeleteTarget({ type: "trend", id: trend.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(marketTrends as MarketTrend[]).length >= PAGE_SIZE && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageM <= 1}
                        onClick={() => setPageM((p) => p - 1)}
                      >
                        {t("common.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageM((p) => p + 1)}
                      >
                        {t("common.next")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.valuations.delete_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.valuations.delete_confirm_description")}
            </AlertDialogDescription>
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
