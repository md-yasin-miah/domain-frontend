import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";
import {
  useGetMarketplaceListingTypesQuery,
  useCreateMarketplaceListingTypeMutation,
  useUpdateMarketplaceListingTypeMutation,
  useDeleteMarketplaceListingTypeMutation,
  type ListingType,
  type ListingTypeCreateRequest,
} from "@/store/api/marketplaceApi";
import { ROUTES } from "@/lib/routes";

type ModalMode = "create" | "view" | "edit";

interface FormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  icon: string;
}

const defaultFormData: FormData = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  icon: "",
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminListingCategories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedType, setSelectedType] = useState<ListingType | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ListingType | null>(null);

  const { data: typesData, isLoading, error, refetch } =
    useGetMarketplaceListingTypesQuery();
  const [createType, { isLoading: isCreating }] =
    useCreateMarketplaceListingTypeMutation();
  const [updateType, { isLoading: isUpdating }] =
    useUpdateMarketplaceListingTypeMutation();
  const [deleteType, { isLoading: isDeleting }] =
    useDeleteMarketplaceListingTypeMutation();

  const types: ListingType[] = useMemo(() => {
    if (!typesData) return [];
    return Array.isArray(typesData) ? typesData : [];
  }, [typesData]);

  const filteredTypes = useMemo(
    () =>
      types.filter(
        (type) =>
          type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (type.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ?? false)
      ),
    [types, searchTerm]
  );

  const resetForm = () => {
    setFormData(defaultFormData);
    setSelectedType(null);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const openModal = (mode: ModalMode, type?: ListingType) => {
    setModalMode(mode);
    if (mode === "create") {
      resetForm();
      setSelectedType(null);
    } else if (type) {
      setSelectedType(type);
      setFormData({
        name: type.name,
        slug: type.slug,
        description: type.description ?? "",
        is_active: type.is_active,
        icon: type.icon ?? "",
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
        title: t("admin.listing_types.errors.required_name", "Name is required"),
        variant: "destructive",
      });
      return;
    }
    try {
      const payload: ListingTypeCreateRequest = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || generateSlug(formData.name),
        description: formData.description.trim() || undefined,
        is_active: formData.is_active,
        icon: formData.icon.trim() || undefined,
      };
      await createType(payload).unwrap();
      toast({
        title: t("admin.listing_types.messages.create_success", "Listing type created"),
      });
      closeModal();
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { detail?: string } }).data?.detail ??
                (err instanceof Error ? err.message : String(err))
            )
          : String(err);
      toast({
        title: t("admin.listing_types.errors.create_error", "Failed to create"),
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedType || !formData.name.trim()) {
      toast({
        title: t("admin.listing_types.errors.required_name", "Name is required"),
        variant: "destructive",
      });
      return;
    }
    try {
      await updateType({
        id: selectedType.id,
        data: {
          name: formData.name.trim(),
          slug: formData.slug.trim() || generateSlug(formData.name),
          description: formData.description.trim() || undefined,
          is_active: formData.is_active,
          icon: formData.icon.trim() || undefined,
        },
      }).unwrap();
      toast({
        title: t("admin.listing_types.messages.update_success", "Listing type updated"),
      });
      closeModal();
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { detail?: string } }).data?.detail ??
                (err instanceof Error ? err.message : String(err))
            )
          : String(err);
      toast({
        title: t("admin.listing_types.errors.update_error", "Failed to update"),
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    try {
      await deleteType(typeToDelete.id).unwrap();
      toast({
        title: t("admin.listing_types.messages.delete_success", "Listing type deleted"),
      });
      setShowDeleteDialog(false);
      setTypeToDelete(null);
      refetch();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data?: { detail?: string } }).data?.detail ??
                (err instanceof Error ? err.message : String(err))
            )
          : String(err);
      toast({
        title: t("admin.listing_types.errors.delete_error", "Failed to delete"),
        description: msg,
        variant: "destructive",
      });
    }
  };

  const errorMessage =
    error && typeof error === "object" && "data" in error
      ? String(
          (error as { data?: { detail?: string } }).data?.detail ?? String(error)
        )
      : error
        ? String(error)
        : null;

  const isViewMode = modalMode === "view";
  const isEditMode = modalMode === "edit";
  const isCreateMode = modalMode === "create";

  const modalTitle = isCreateMode
    ? t("admin.listing_types.create_title", "Create listing type")
    : isViewMode
      ? t("admin.listing_types.view_title", "View listing type")
      : t("admin.listing_types.edit_title", "Edit listing type");

  const modalDescription = isCreateMode
    ? t("admin.listing_types.create_description", "Add a new listing type (e.g. Domain, Website).")
    : isViewMode
      ? t("admin.listing_types.view_description", "View listing type details")
      : t("admin.listing_types.edit_description", "Update listing type details");

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
              {t("admin.listing_types.title", "Listing types")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("admin.listing_types.description", "Manage marketplace listing types (e.g. Domain, Website).")}
            </p>
          </div>
        </div>
        <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal("create")}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.listing_types.create_button", "Create listing type")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>{modalDescription}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-name">{t("admin.listing_types.form.name", "Name")} *</Label>
                <Input
                  id="modal-name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t("admin.listing_types.form.name_placeholder", "e.g. Domain")}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-slug">{t("admin.listing_types.form.slug", "Slug")}</Label>
                <Input
                  id="modal-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder={t("admin.listing_types.form.slug_placeholder", "e.g. domain")}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-description">
                  {t("admin.listing_types.form.description", "Description")}
                </Label>
                <Textarea
                  id="modal-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder={t("admin.listing_types.form.description_placeholder", "Optional description")}
                  rows={3}
                  readOnly={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-icon">{t("admin.listing_types.form.icon", "Icon")}</Label>
                <Input
                  id="modal-icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder={t("admin.listing_types.form.icon_placeholder", "Icon name or class")}
                  readOnly={isViewMode}
                />
              </div>
              {!isViewMode && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="modal-active">
                    {t("admin.listing_types.form.is_active", "Active")}
                  </Label>
                  <Switch
                    id="modal-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              )}
              {isViewMode && (
                <div className="flex items-center gap-2">
                  <Label>{t("admin.listing_types.form.is_active", "Active")}</Label>
                  <Badge variant={formData.is_active ? "default" : "secondary"}>
                    {formData.is_active ? t("common.yes", "Yes") : t("common.no", "No")}
                  </Badge>
                </div>
              )}
            </div>
            <DialogFooter>
              {isViewMode ? (
                <>
                  <Button variant="outline" onClick={closeModal}>
                    {t("common.close")}
                  </Button>
                  <Button onClick={() => setModalMode("edit")}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("common.edit", "Edit")}
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
                        t("admin.listing_types.create_submit", "Create")
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
                        t("common.save", "Save")
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
                placeholder={t("admin.listing_types.search_placeholder", "Search by name or slug...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {errorMessage ? (
              <div className="text-center py-8 text-destructive">
                {t("admin.listing_types.fetch_error", "Error loading listing types")}: {errorMessage}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTypes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? t("admin.listing_types.no_results", "No listing types match your search")
                  : t("admin.listing_types.empty", "No listing types yet. Create one to get started.")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.listing_types.table.name", "Name")}</TableHead>
                    <TableHead>{t("admin.listing_types.table.slug", "Slug")}</TableHead>
                    <TableHead>{t("admin.listing_types.table.description", "Description")}</TableHead>
                    <TableHead>{t("admin.listing_types.table.status", "Status")}</TableHead>
                    <TableHead>{t("admin.listing_types.table.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {type.slug}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {type.description || "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={type.is_active ? "default" : "secondary"}>
                          {type.is_active ? t("common.active", "Active") : t("common.inactive", "Inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal("view", type)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal("edit", type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTypeToDelete(type);
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
              {t("admin.listing_types.delete_title", "Delete listing type?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "admin.listing_types.delete_description",
                "This cannot be undone. You cannot delete a listing type that is used by any listings."
              )}
              {typeToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{typeToDelete.name}</strong> ({typeToDelete.slug})
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
