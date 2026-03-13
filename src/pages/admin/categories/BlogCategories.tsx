import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  FolderTree,
  Search,
  Loader2,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
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
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} from "@/store/api/categoryApi";

type ModalMode = "create" | "view" | "edit";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

const defaultFormData: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogCategories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const { data, isLoading, error, refetch } = useGetBlogCategoriesQuery({});
  const [createCategory, { isLoading: isCreating }] =
    useCreateBlogCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateBlogCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteBlogCategoryMutation();

  const categories: Category[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data)
      ? data
      : ((data as { items: Category[] }).items ?? []);
  }, [data]);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false),
      ),
    [categories, searchTerm],
  );

  const formLoading = isCreating || isUpdating || isDeleting;

  const resetForm = () => {
    setFormData(defaultFormData);
    setSelectedCategory(null);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const openModal = (mode: ModalMode, category?: Category) => {
    setModalMode(mode);
    if (mode === "create") {
      resetForm();
      setSelectedCategory(null);
    } else if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: t("admin.blog.categories.errors.required_fields"),
        variant: "destructive",
      });
      return;
    }
    try {
      await createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim() || generateSlug(formData.name),
        description: formData.description.trim() || undefined,
        type: "blog",
      }).unwrap();
      toast({
        title: t("admin.blog.categories.messages.create_success"),
        description: t("admin.blog.categories.messages.create_success_desc"),
      });
      closeModal();
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { detail?: string } }).data?.detail ??
                (err as unknown as Error).message,
            )
          : String(err);
      toast({
        title: t("admin.blog.categories.errors.create_error"),
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast({
        title: t("admin.blog.categories.errors.required_fields"),
        variant: "destructive",
      });
      return;
    }
    try {
      await updateCategory({
        id: selectedCategory.id,
        data: {
          name: formData.name.trim(),
          slug: formData.slug.trim() || generateSlug(formData.name),
          description: formData.description.trim() || undefined,
        },
      }).unwrap();
      toast({
        title: t("admin.blog.categories.messages.update_success"),
        description: t("admin.blog.categories.messages.update_success_desc"),
      });
      closeModal();
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { detail?: string } }).data?.detail ??
                (err as unknown as Error).message,
            )
          : String(err);
      toast({
        title: t("admin.blog.categories.errors.update_error"),
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast({
        title: t("admin.blog.categories.messages.delete_success"),
        description: t("admin.blog.categories.messages.delete_success_desc"),
      });
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { detail?: string } }).data?.detail ??
                (err as unknown as Error).message,
            )
          : String(err);
      toast({
        title: t("admin.blog.categories.errors.delete_error"),
        description: msg,
        variant: "destructive",
      });
    }
  };

  const errorMessage =
    error && typeof error === "object" && "data" in error
      ? String(
          (error as { data?: { detail?: string } }).data?.detail ??
            (error as unknown as Error).message,
        )
      : error
        ? String(error)
        : null;

  const isViewMode = modalMode === "view";
  const isEditMode = modalMode === "edit";
  const isCreateMode = modalMode === "create";

  const modalTitle = isCreateMode
    ? t("admin.blog.categories.create_dialog.title")
    : isViewMode
      ? t("admin.blog.categories.view_dialog.title")
      : t("admin.blog.categories.edit_dialog.title");

  const modalDescription = isCreateMode
    ? t("admin.blog.categories.create_dialog.description")
    : isViewMode
      ? t("admin.blog.categories.view_dialog.description")
      : t("admin.blog.categories.edit_dialog.description");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN.ROOT)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FolderTree className="h-6 w-6" />
              {t("admin.blog.categories.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("admin.blog.categories.description")}
            </p>
          </div>
        </div>
        <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal("create")}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.blog.categories.create_category")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>{modalDescription}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-name">
                  {t("admin.blog.categories.form.name")} *
                </Label>
                <Input
                  id="modal-name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t("admin.blog.categories.form.name_placeholder")}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-slug">
                  {t("admin.blog.categories.form.slug")}
                </Label>
                <Input
                  id="modal-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder={t("admin.blog.categories.form.slug_placeholder")}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-description">
                  {t("admin.blog.categories.form.description")}
                </Label>
                <Textarea
                  id="modal-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "admin.blog.categories.form.description_placeholder",
                  )}
                  rows={3}
                  readOnly={isViewMode}
                />
              </div>
            </div>
            <DialogFooter>
              {isViewMode ? (
                <>
                  <Button variant="outline" onClick={closeModal}>
                    {t("common.close")}
                  </Button>
                  <Button onClick={() => setModalMode("edit")}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("admin.blog.categories.edit_dialog.update")}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={closeModal}>
                    {t("common.cancel")}
                  </Button>
                  {isCreateMode ? (
                    <Button onClick={handleCreate} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("common.loading")}
                        </>
                      ) : (
                        t("admin.blog.categories.create_dialog.create")
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("common.loading")}
                        </>
                      ) : (
                        t("admin.blog.categories.edit_dialog.update")
                      )}
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("admin.blog.categories.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {errorMessage ? (
              <div className="text-center py-8 text-destructive">
                {t("admin.blog.categories.errors.fetch_error")}: {errorMessage}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? t("admin.blog.categories.no_results")
                  : t("admin.blog.categories.no_categories")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t("admin.blog.categories.table.name")}
                    </TableHead>
                    <TableHead>
                      {t("admin.blog.categories.table.slug")}
                    </TableHead>
                    <TableHead>
                      {t("admin.blog.categories.table.description")}
                    </TableHead>
                    <TableHead>
                      {t("admin.blog.categories.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal("view", category)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal("edit", category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCategoryToDelete(category);
                              setShowDeleteDialog(true);
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
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.blog.categories.delete_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.blog.categories.delete_dialog.description")}
              {categoryToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{categoryToDelete.name}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
