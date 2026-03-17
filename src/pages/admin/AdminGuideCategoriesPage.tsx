import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Search,
  Loader2,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import {
  useGetAdminGuideCategoriesQuery,
  useCreateGuideCategoryMutation,
  useUpdateGuideCategoryMutation,
  useDeleteGuideCategoryMutation,
} from "@/store/api/guidesApi";
import { ROUTES } from "@/lib/routes";

type ModalMode = "create" | "edit";

interface FormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  order: number;
}

const defaultFormData: FormData = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  order: 0,
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminGuideCategoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedQ = useDebouncedValue(searchTerm, 300);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<GuideCategory | null>(null);

  const { data, isLoading, error, refetch } = useGetAdminGuideCategoriesQuery({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    q: debouncedQ.trim() || undefined,
  });
  const [createCategory, { isLoading: isCreating }] = useCreateGuideCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateGuideCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteGuideCategoryMutation();

  const categories = useMemo(() => data?.items ?? [], [data]);
  const pagination = data?.pagination;

  const resetForm = () => setFormData(defaultFormData);

  const openModal = (mode: ModalMode, cat?: GuideCategory) => {
    setModalMode(mode);
    if (mode === "create") {
      resetForm();
      setSelectedCategory(null);
    } else if (cat) {
      setSelectedCategory(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? "",
        is_active: cat.is_active,
        order: cat.order,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
    setSelectedCategory(null);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: t("admin.guides.category_required"), variant: "destructive" });
      return;
    }
    try {
      if (modalMode === "create") {
        await createCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim() || generateSlug(formData.name),
          description: formData.description.trim() || undefined,
          is_active: formData.is_active,
          order: formData.order,
        }).unwrap();
        toast({ title: t("admin.guides.category_created") });
      } else if (selectedCategory) {
        await updateCategory({
          category_id: selectedCategory.id,
          data: {
            name: formData.name.trim(),
            slug: formData.slug.trim() || generateSlug(formData.name),
            description: formData.description.trim() || undefined,
            is_active: formData.is_active,
            order: formData.order,
          },
        }).unwrap();
        toast({ title: t("admin.guides.category_updated") });
      }
      closeModal();
      refetch();
    } catch (err: unknown) {
      const detail = err && typeof err === "object" && "data" in err ? (err as { data?: { detail?: string } }).data?.detail : undefined;
      const msg = typeof detail === "string" ? detail : (err instanceof Error ? err.message : String(err));
      toast({ title: t("common.error"), description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast({ title: t("admin.guides.category_deleted") });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err: unknown) {
      const detail = err && typeof err === "object" && "data" in err ? (err as { data?: { detail?: string } }).data?.detail : undefined;
      const msg = typeof detail === "string" ? detail : (err instanceof Error ? err.message : String(err));
      toast({ title: t("common.error"), description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN.ROOT)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              {t("admin.sidebar.guides_categories", "Guide Categories")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("admin.guides.categories_description", "Manage guide categories")}
            </p>
          </div>
        </div>
        <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal("create")}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.guides.add_category", "Add Category")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalMode === "create"
                  ? t("admin.guides.add_category", "Add Category")
                  : t("admin.guides.edit_category", "Edit Category")}
              </DialogTitle>
              <DialogDescription>
                {t("admin.guides.category_form_description", "Name and slug are required.")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.guides.name", "Name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t("admin.guides.name_placeholder", "Category name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("admin.guides.slug", "Slug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="category-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("admin.guides.description", "Description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="order">{t("admin.guides.order", "Order")}</Label>
                <Input
                  id="order"
                  type="number"
                  className="w-24"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">{t("admin.guides.active", "Active")}</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((p) => ({ ...p, is_active: !!checked }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeModal}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {modalMode === "create" ? t("common.create") : t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search", "Search")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-9"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchTerm("");
                    setPage(1);
                  }}
                  aria-label={t("admin.translations.clear_search", "Clear search")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-destructive py-4">
              {t("common.error")}:{" "}
              {"data" in (error as object) ? String((error as { data?: { detail?: string } }).data?.detail) : String(error)}
            </p>
          ) : (
            <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.guides.name", "Name")}</TableHead>
                  <TableHead>{t("admin.guides.slug", "Slug")}</TableHead>
                  <TableHead>{t("admin.guides.order", "Order")}</TableHead>
                  <TableHead>{t("admin.guides.active", "Active")}</TableHead>
                  <TableHead className="w-[120px]">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell>{cat.order}</TableCell>
                    <TableCell>{cat.is_active ? t("common.yes") : t("common.no")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openModal("edit", cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCategoryToDelete(cat);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pagination && (pagination.has_next || pagination.has_previous) && (
              <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {t("common.page", "Page")} {pagination.page + 1} {t("common.of", "of")} {pagination.total_pages} ({pagination.total} {t("admin.guides.total_categories", "categories")})
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.has_previous}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t("common.previous", "Previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.has_next}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t("common.next", "Next")}
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
          {!isLoading && !error && categories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t("admin.guides.no_categories")}</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.guides.delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.guides.delete_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
