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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Languages, Loader2, Plus, Pencil, Trash2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetLanguagesQuery,
  useListTranslationsQuery,
  useAddTranslationMutation,
  useUpdateTranslationMutation,
  useBulkUpdateTranslationsMutation,
  useDeleteTranslationMutation,
  type TranslationItem,
} from "@/store/api/i18nApi";

export default function AdminTranslationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [localeFilter, setLocaleFilter] = useState<string>("all");
  const [keySearch, setKeySearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<TranslationItem | null>(null);
  const [bulkKey, setBulkKey] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<TranslationItem | null>(null);

  const [addKey, setAddKey] = useState("");
  const [addValue, setAddValue] = useState("");
  const [addLocale, setAddLocale] = useState("en");
  const [editValue, setEditValue] = useState("");
  const [bulkValues, setBulkValues] = useState<Record<string, string>>({});

  const { data: languagesData } = useGetLanguagesQuery();
  const languages = languagesData?.languages ?? [];
  const { data: listData, isLoading, refetch } = useListTranslationsQuery({
    locale: localeFilter === "all" ? undefined : localeFilter,
    skip: 0,
    limit: 500,
  });
  const items = listData ?? [];

  const [addTranslation, { isLoading: isAdding }] = useAddTranslationMutation();
  const [updateTranslation, { isLoading: isUpdating }] = useUpdateTranslationMutation();
  const [bulkUpdate, { isLoading: isBulkUpdating }] = useBulkUpdateTranslationsMutation();
  const [deleteTranslation, { isLoading: isDeleting }] = useDeleteTranslationMutation();

  const filteredItems = useMemo(() => {
    if (!keySearch.trim()) return items;
    const lower = keySearch.trim().toLowerCase();
    return items.filter((r) => r.key.toLowerCase().includes(lower));
  }, [items, keySearch]);

  const handleAdd = async () => {
    if (!addKey.trim() || !addValue.trim()) {
      toast({
        title: t("admin.translations.key_value_required", "Key and value required"),
        variant: "destructive",
      });
      return;
    }
    try {
      await addTranslation({
        key: addKey.trim(),
        value: addValue.trim(),
        locale: addLocale,
      }).unwrap();
      toast({
        title: t("admin.translations.added", "Translation added"),
      });
      setAddOpen(false);
      setAddKey("");
      setAddValue("");
      refetch();
    } catch (err: unknown) {
      const detail = err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail;
      toast({
        title: t("common.error", "Error"),
        description: typeof detail === "string" ? detail : t("common.error"),
        variant: "destructive",
      });
    }
  };

  const handleEditOpen = (row: TranslationItem) => {
    setEditItem(row);
    setEditValue(row.value);
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    try {
      await updateTranslation({
        key: editItem.key,
        locale: editItem.locale,
        value: editValue,
      }).unwrap();
      toast({ title: t("admin.translations.updated", "Translation updated") });
      setEditItem(null);
      refetch();
    } catch (err: unknown) {
      const detail = err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail;
      toast({
        title: t("common.error", "Error"),
        description: typeof detail === "string" ? detail : t("common.error"),
        variant: "destructive",
      });
    }
  };

  const handleBulkOpen = (key: string) => {
    setBulkKey(key);
    const byLocale: Record<string, string> = {};
    items.filter((r) => r.key === key).forEach((r) => { byLocale[r.locale] = r.value; });
    languages.forEach((lang) => {
      if (!(lang.code in byLocale)) byLocale[lang.code] = "";
    });
    setBulkValues(byLocale);
  };

  const handleBulkSave = async () => {
    if (!bulkKey) return;
    const translations: Record<string, string> = {};
    Object.entries(bulkValues).forEach(([locale, value]) => {
      if (value.trim()) translations[locale] = value.trim();
    });
    if (Object.keys(translations).length === 0) {
      toast({
        title: t("admin.translations.at_least_one_locale", "Add at least one translation"),
        variant: "destructive",
      });
      return;
    }
    try {
      await bulkUpdate({ key: bulkKey, translations }).unwrap();
      toast({ title: t("admin.translations.bulk_updated", "Translations updated") });
      setBulkKey(null);
      refetch();
    } catch (err: unknown) {
      const detail = err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail;
      toast({
        title: t("common.error", "Error"),
        description: typeof detail === "string" ? detail : t("common.error"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await deleteTranslation({ key: deleteItem.key, locale: deleteItem.locale }).unwrap();
      toast({ title: t("admin.translations.deleted", "Translation deleted") });
      setDeleteItem(null);
      refetch();
    } catch (err: unknown) {
      const detail = err && typeof err === "object" && "data" in err && (err as { data?: { detail?: string } }).data?.detail;
      toast({
        title: t("common.error", "Error"),
        description: typeof detail === "string" ? detail : t("common.error"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Languages className="h-7 w-7" />
          {t("admin.translations.title", "Translations")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.translations.description", "Manage translation strings. Add in English first, then translate for other locales.")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.translations.list_title", "Translation strings")}</CardTitle>
            <CardDescription>
              {t("admin.translations.list_desc", "Dot notation keys, e.g. common.save, nav.home")}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={localeFilter} onValueChange={setLocaleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("admin.translations.locale", "Locale")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.translations.all_locales", "All locales")}</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={t("admin.translations.search_key", "Search by key")}
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              className="w-[200px]"
            />
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.translations.add", "Add string")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              {t("common.loading", "Loading...")}
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              {t("admin.translations.empty", "No translations found.")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.translations.key", "Key")}</TableHead>
                  <TableHead>{t("admin.translations.locale", "Locale")}</TableHead>
                  <TableHead>{t("admin.translations.value", "Value")}</TableHead>
                  <TableHead className="w-[180px]">{t("common.actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((row) => (
                  <TableRow key={`${row.key}-${row.locale}`}>
                    <TableCell className="font-mono text-sm">{row.key}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1">
                        {languages.find((l) => l.code === row.locale)?.flag ?? ""} {row.locale}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground" title={row.value}>
                      {row.value}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditOpen(row)} title={t("common.edit", "Edit")}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleBulkOpen(row.key)} title={t("admin.translations.bulk_edit", "Edit all locales")}>
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteItem(row)} title={t("common.delete", "Delete")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.translations.add_title", "Add translation")}</DialogTitle>
            <DialogDescription>
              {t("admin.translations.add_desc", "Use dot notation for key, e.g. common.save")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("admin.translations.key", "Key")}</Label>
              <Input placeholder="common.save" value={addKey} onChange={(e) => setAddKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.translations.locale", "Locale")}</Label>
              <Select value={addLocale} onValueChange={setAddLocale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.code} – {lang.native_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("admin.translations.value", "Value")}</Label>
              <Input placeholder="Save" value={addValue} onChange={(e) => setAddValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={isAdding}>{t("common.cancel", "Cancel")}</Button>
            <Button onClick={handleAdd} disabled={isAdding}>
              {isAdding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("admin.translations.add", "Add string")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit single dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.translations.edit_title", "Edit translation")}</DialogTitle>
            <DialogDescription>
              {editItem && <span className="font-mono">{editItem.key} ({editItem.locale})</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("admin.translations.value", "Value")}</Label>
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)} disabled={isUpdating}>{t("common.cancel", "Cancel")}</Button>
            <Button onClick={handleEditSave} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.save", "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk edit dialog */}
      <Dialog open={!!bulkKey} onOpenChange={(open) => !open && setBulkKey(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.translations.bulk_title", "Edit all locales")}</DialogTitle>
            <DialogDescription>
              {bulkKey && <span className="font-mono">{bulkKey}</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {languages.map((lang) => (
              <div key={lang.code} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {lang.flag} {lang.code} – {lang.native_name}
                </Label>
                <Input
                  value={bulkValues[lang.code] ?? ""}
                  onChange={(e) => setBulkValues((prev) => ({ ...prev, [lang.code]: e.target.value }))}
                  placeholder={lang.native_name}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkKey(null)} disabled={isBulkUpdating}>{t("common.cancel", "Cancel")}</Button>
            <Button onClick={handleBulkSave} disabled={isBulkUpdating}>
              {isBulkUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.save", "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.translations.delete_confirm_title", "Delete translation?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItem && (
                <>
                  {t("admin.translations.delete_confirm_desc", "This will remove the string for this key and locale. Other locales for the same key are not affected.")}
                  <span className="block mt-2 font-mono text-sm">{deleteItem.key} ({deleteItem.locale})</span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
