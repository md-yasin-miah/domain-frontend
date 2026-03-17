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
  Verified,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import {
  useGetVerificationsQuery,
  useVerifyVerificationMutation,
  useRejectVerificationMutation,
  useDeleteVerificationMutation,
  type Verification,
  type VerificationFilters,
} from "@/store/api/verificationApi";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "pending", labelKey: "admin.verifications.status.pending" },
  { value: "verified", labelKey: "admin.verifications.status.verified" },
  { value: "failed", labelKey: "admin.verifications.status.failed" },
] as const;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminVerificationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [verificationToDelete, setVerificationToDelete] =
    useState<Verification | null>(null);

  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: PAGE_SIZE,
  });

  const filters = useMemo<VerificationFilters>(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter }),
    }),
    [page, size, statusFilter]
  );

  const { data: listData, isLoading, error } =
    useGetVerificationsQuery(filters);
  const list = Array.isArray(listData) ? listData : [];
  const hasMore = list.length >= size;
  const total = (page - 1) * size + list.length + (hasMore ? 1 : 0);
  const pagination = useMemo(
    () =>
      list.length > 0
        ? {
            total,
            page: page - 1,
            page_size: size,
            total_pages: Math.max(1, Math.ceil(total / size)),
            has_next: hasMore,
            has_previous: page > 1,
          }
        : undefined,
    [total, page, size, hasMore, list.length]
  );

  const [verifyVerification, { isLoading: isVerifying }] =
    useVerifyVerificationMutation();
  const [rejectVerification, { isLoading: isRejecting }] =
    useRejectVerificationMutation();
  const [deleteVerification, { isLoading: isDeleting }] =
    useDeleteVerificationMutation();

  const handleVerify = async (id: number) => {
    try {
      await verifyVerification(id).unwrap();
      toast({ title: t("admin.verifications.verified") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectVerification(id).unwrap();
      toast({ title: t("admin.verifications.rejected") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const confirmDelete = (v: Verification) => {
    setVerificationToDelete(v);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!verificationToDelete) return;
    try {
      await deleteVerification(verificationToDelete.id).unwrap();
      setDeleteDialogOpen(false);
      setVerificationToDelete(null);
      toast({ title: t("admin.verifications.deleted") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const getStatusVariant = (status: string) => {
    if (status === "verified") return "default";
    if (status === "failed") return "destructive";
    return "secondary";
  };

  const columns: ColumnDef<Verification>[] = useMemo(
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
        id: "listing_id",
        accessorKey: "listing_id",
        header: t("admin.verifications.listing_id"),
        cell: ({ row }) => (
          <Link
            to={ROUTES.ADMIN.LISTINGS_MANAGEMENT + "/view/" + row.listing_id}
            className="text-primary hover:underline"
          >
            #{row.listing_id}
          </Link>
        ),
      },
      {
        id: "verification_type",
        accessorKey: "verification_type",
        header: t("admin.verifications.type"),
        cell: ({ row }) => (
          <Badge variant="outline">{row.verification_type}</Badge>
        ),
      },
      {
        id: "verification_method",
        accessorKey: "verification_method",
        header: t("admin.verifications.method"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.verification_method || "—"}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("common.status.status"),
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.status)}>
            {t(`admin.verifications.status.${row.status}`) || row.status}
          </Badge>
        ),
      },
      {
        id: "verified_at",
        accessorKey: "verified_at",
        header: t("admin.verifications.verified_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.verified_at)}
          </span>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("admin.verifications.created_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.created_at)}
          </span>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Verified className="h-7 w-7" />
          {t("admin.verifications.title", "Verifications")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.verifications.description", "Review and verify listing verifications.")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.verifications.list_title", "Verifications")}</CardTitle>
            <CardDescription>
              {t("admin.verifications.manage")}
            </CardDescription>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              handlePageChange(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<Verification>
            data={list}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.verifications.empty")}
            emptyIcon={<Verified className="h-12 w-12 mx-auto opacity-50" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) => (
              <div className="flex items-center gap-1">
                {/* {row.status === "pending" && ( */}
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700"
                      onClick={() => handleVerify(row.id)}
                      disabled={isVerifying}
                      title={t("admin.verifications.verify")}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleReject(row.id)}
                      disabled={isRejecting}
                      title={t("admin.verifications.reject")}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                {/* )} */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => confirmDelete(row)}
                  disabled={isDeleting}
                  title={t("admin.verifications.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            actionsColumnHeader={t("common.actions")}
            enableSorting={false}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            error={error}
            errorTitle={t("common.error.title", "Error")}
            errorDescription={t("common.error.description", "Something went wrong.")}
            errorIcon={<Verified className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.verifications.delete_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.verifications.delete_confirm_description")}
              {verificationToDelete && (
                <span className="block mt-2 font-medium text-foreground">
                  #{verificationToDelete.id} (listing #{verificationToDelete.listing_id})
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}{" "}
              {t("admin.verifications.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
