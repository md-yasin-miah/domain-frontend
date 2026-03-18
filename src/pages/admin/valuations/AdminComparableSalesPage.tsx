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
import { History, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetComparableSalesQuery,
  useCreateComparableSaleMutation,
  useUpdateComparableSaleMutation,
  useDeleteComparableSaleMutation
} from "@/store/api/valuationsApi";

const PAGE_SIZE = 10;
const EXTENSIONS = ["com", "net", "org", "io", "co", "app", "dev"];

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

const defaultForm: ComparableSaleCreateRequest = {
  domain_name: "",
  domain_extension: "com",
  sale_price: 0,
  currency: "USD",
  sale_date: new Date().toISOString().slice(0, 10),
  sale_source: null,
  buyer_type: null,
};

export default function AdminComparableSalesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [extensionFilter, setExtensionFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ComparableSale | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<ComparableSaleCreateRequest>(defaultForm);

  const filters: ComparableSaleFilters = useMemo(
    () => ({
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...(extensionFilter !== "all" && { domain_extension: extensionFilter }),
    }),
    [page, extensionFilter]
  );

  const { data: sales = [], isLoading } = useGetComparableSalesQuery(filters);
  const [createSale] = useCreateComparableSaleMutation();
  const [updateSale] = useUpdateComparableSaleMutation();
  const [deleteSale] = useDeleteComparableSaleMutation();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, sale_date: new Date().toISOString().slice(0, 10) });
    setDialogOpen(true);
  };

  const openEdit = (s: ComparableSale) => {
    setEditing(s);
    setForm({
      domain_name: s.domain_name,
      domain_extension: s.domain_extension,
      sale_price: s.sale_price,
      currency: s.currency || "USD",
      sale_date: s.sale_date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      sale_source: s.sale_source ?? null,
      buyer_type: s.buyer_type ?? null,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        const updateData: ComparableSaleUpdateRequest = {
          sale_price: form.sale_price,
          sale_date: form.sale_date,
          sale_source: form.sale_source ?? null,
          buyer_type: form.buyer_type ?? null,
        };
        await updateSale({ id: editing.id, data: updateData }).unwrap();
        toast({ title: t("common.updated", "Updated") });
      } else {
        await createSale(form).unwrap();
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
      await deleteSale(deleteId).unwrap();
      toast({ title: t("admin.valuations.comparable_deleted") });
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
            <History className="h-7 w-7 text-primary" />
            {t("admin.sidebar.valuations_comparable", "Comparable Sales")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.valuations.comparable_description", "Manage domain sale records used for valuations and market rank.")}
          </p>
        </div>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{t("admin.valuations.tab_comparable")}</CardTitle>
            <CardDescription>
              {t("admin.valuations.comparable_empty", "No comparable sales")} — {sales.length} {t("common.items", "items")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={extensionFilter}
              onValueChange={(v) => {
                setExtensionFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("admin.valuations.filter_extension")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {EXTENSIONS.map((ext) => (
                  <SelectItem key={ext} value={ext}>.{ext}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              {t("common.add")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center text-muted-foreground">
              <History className="mx-auto h-10 w-10 opacity-50 mb-2" />
              <p>{t("admin.valuations.comparable_empty")}</p>
              <Button variant="outline" className="mt-4" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("common.add")}
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>{t("admin.valuations.domain")}</TableHead>
                    <TableHead>{t("admin.valuations.sale_price")}</TableHead>
                    <TableHead>{t("admin.valuations.sale_date")}</TableHead>
                    <TableHead>{t("admin.valuations.sale_source")}</TableHead>
                    <TableHead className="w-[100px]">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-muted-foreground">#{s.id}</TableCell>
                      <TableCell className="font-medium">
                        {s.domain_name}.{s.domain_extension}
                      </TableCell>
                      <TableCell>{formatCurrency(s.sale_price, s.currency)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(s.sale_date)}</TableCell>
                      <TableCell className="text-muted-foreground">{s.sale_source || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(s.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sales.length >= PAGE_SIZE && (
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("common.add")} comparable sale</DialogTitle>
            <DialogDescription>
              {editing ? "Update sale price and metadata." : "Add a new domain sale record."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Domain name</Label>
              <Input
                value={form.domain_name}
                onChange={(e) => setForm((f) => ({ ...f, domain_name: e.target.value }))}
                placeholder="example"
                disabled={!!editing}
              />
            </div>
            <div className="grid gap-2">
              <Label>Extension</Label>
              <Select
                value={form.domain_extension}
                onValueChange={(v) => setForm((f) => ({ ...f, domain_extension: v }))}
                disabled={!!editing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXTENSIONS.map((ext) => (
                    <SelectItem key={ext} value={ext}>.{ext}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Sale price</Label>
              <Input
                type="number"
                min={0}
                value={form.sale_price || ""}
                onChange={(e) => setForm((f) => ({ ...f, sale_price: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Sale date</Label>
              <Input
                type="date"
                value={form.sale_date?.slice(0, 10) ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, sale_date: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Source (optional)</Label>
              <Input
                value={form.sale_source ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, sale_source: e.target.value || null }))}
                placeholder="e.g. Sedo, Afternic"
              />
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
      </Dialog>

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
