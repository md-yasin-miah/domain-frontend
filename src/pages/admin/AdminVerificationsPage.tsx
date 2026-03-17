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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Verified,
  Loader2,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import {
  useGetVerificationRequestsQuery,
  useApproveUserVerificationMutation,
  useRejectUserVerificationMutation,
  type UserVerificationRequest,
} from "@/store/api/verificationApi";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "pending", labelKey: "admin.verifications.status.pending" },
  { value: "approved", labelKey: "admin.verifications.status.approved" },
  { value: "rejected", labelKey: "admin.verifications.status.rejected" },
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
  const [actionDialog, setActionDialog] = useState<{
    type: "approve" | "reject";
    request: UserVerificationRequest;
  } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: PAGE_SIZE,
  });

  const params = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      status_filter: statusFilter === "all" ? undefined : statusFilter,
    }),
    [page, size, statusFilter]
  );

  const { data: listData, isLoading, error, refetch } =
    useGetVerificationRequestsQuery(params);
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

  const [approveUser, { isLoading: isApproving }] =
    useApproveUserVerificationMutation();
  const [rejectUser, { isLoading: isRejecting }] =
    useRejectUserVerificationMutation();

  const handleApprove = async () => {
    if (!actionDialog || actionDialog.type !== "approve") return;
    try {
      await approveUser({
        user_id: actionDialog.request.user_id,
        body: adminNotes.trim() ? { admin_notes: adminNotes.trim() } : undefined,
      }).unwrap();
      toast({ title: t("admin.verifications.verified", "User verified") });
      setActionDialog(null);
      setAdminNotes("");
      refetch();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { detail?: string } }).data?.detail)
          : t("common.error", "Error");
      toast({ title: msg, variant: "destructive" });
    }
  };

  const handleReject = async () => {
    if (!actionDialog || actionDialog.type !== "reject") return;
    try {
      await rejectUser({
        user_id: actionDialog.request.user_id,
        body: adminNotes.trim() ? { admin_notes: adminNotes.trim() } : undefined,
      }).unwrap();
      toast({ title: t("admin.verifications.rejected", "Request rejected") });
      setActionDialog(null);
      setAdminNotes("");
      refetch();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { detail?: string } }).data?.detail)
          : t("common.error", "Error");
      toast({ title: msg, variant: "destructive" });
    }
  };

  const getStatusVariant = (status: string) => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    return "secondary";
  };

  const columns: ColumnDef<UserVerificationRequest>[] = useMemo(
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
        id: "user_id",
        accessorKey: "user_id",
        header: t("admin.verifications.user", "User"),
        cell: ({ row }) => (
          <Link
            to={ROUTES.ADMIN.USER_DETAILS(row.user_id)}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <User className="h-4 w-4" />
            #{row.user_id}
          </Link>
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
        id: "requested_at",
        accessorKey: "requested_at",
        header: t("admin.verifications.requested_at", "Requested"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.requested_at)}
          </span>
        ),
      },
      {
        id: "reviewed_at",
        accessorKey: "reviewed_at",
        header: t("admin.verifications.reviewed_at", "Reviewed"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.reviewed_at)}
          </span>
        ),
      },
      {
        id: "admin_notes",
        accessorKey: "admin_notes",
        header: t("admin.verifications.admin_notes", "Notes"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm max-w-[200px] truncate block">
            {row.admin_notes || "—"}
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
          {t("admin.verifications.title", "Account Verifications")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t(
            "admin.verifications.description",
            "Review and approve or reject user account verification requests."
          )}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>
              {t("admin.verifications.list_title", "Verification Requests")}
            </CardTitle>
            <CardDescription>
              {t(
                "admin.verifications.manage",
                "Approve or reject pending requests to verify user accounts."
              )}
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
          <DataTableWithPagination<UserVerificationRequest>
            data={list}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.verifications.empty", "No verification requests.")}
            emptyIcon={<Verified className="h-12 w-12 mx-auto opacity-50" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) => (
              <div className="flex items-center gap-1">
                {row.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700"
                      onClick={() =>
                        setActionDialog({ type: "approve", request: row })
                      }
                      disabled={isApproving}
                      title={t("admin.verifications.approve", "Approve")}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        setActionDialog({ type: "reject", request: row })
                      }
                      disabled={isRejecting}
                      title={t("admin.verifications.reject", "Reject")}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
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

      <Dialog
        open={!!actionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setActionDialog(null);
            setAdminNotes("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.type === "approve"
                ? t("admin.verifications.approve_title", "Approve verification")
                : t("admin.verifications.reject_title", "Reject verification")}
            </DialogTitle>
            <DialogDescription>
              {actionDialog && (
                <>
                  {t("admin.verifications.user_id", "User")}: #{actionDialog.request.user_id}
                  {actionDialog.type === "approve"
                    ? " — " +
                      t(
                        "admin.verifications.approve_desc",
                        "This will mark the user's profile as verified."
                      )
                    : " — " +
                      t(
                        "admin.verifications.reject_desc",
                        "The user's verification request will be rejected."
                      )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="admin_notes">
              {t("admin.verifications.admin_notes_optional", "Admin notes (optional)")}
            </Label>
            <Textarea
              id="admin_notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t("admin.verifications.admin_notes_placeholder", "Notes for the user...")}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog(null);
                setAdminNotes("");
              }}
            >
              {t("common.cancel")}
            </Button>
            {actionDialog?.type === "approve" ? (
              <Button
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("admin.verifications.approve", "Approve")}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("admin.verifications.reject", "Reject")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
