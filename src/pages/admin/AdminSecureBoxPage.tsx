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
import { LockIcon, Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetSecureBoxListQuery,
  useApproveSecureBoxMutation,
  type SecureBoxItem,
} from "@/store/api/secureBoxApi";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = ["pending", "approved", "rejected", "accessed"] as const;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function truncateContent(content: string | null, maxLen = 80): string {
  if (!content) return "—";
  return content.length <= maxLen ? content : `${content.slice(0, maxLen)}...`;
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "approved" || status === "accessed") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
}

export default function AdminSecureBoxPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [selectedBox, setSelectedBox] = useState<SecureBoxItem | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewedContent, setViewedContent] = useState<string | null>(null);

  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 15,
  });

  const filters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter }),
    }),
    [page, size, statusFilter]
  );

  const { data, isLoading, refetch, error } = useGetSecureBoxListQuery(filters);
  const [approveSecureBox, { isLoading: isSubmitting }] = useApproveSecureBoxMutation();

  const items = data?.items ?? [];
  const rawPagination = data?.pagination;
  const pagination = useMemo(
    () =>
      rawPagination
        ? {
            total: rawPagination.total ?? 0,
            page: rawPagination.page ?? 0,
            total_pages: rawPagination.total_pages ?? 1,
            has_next: rawPagination.has_next ?? false,
            has_previous: rawPagination.has_previous ?? false,
          }
        : undefined,
    [rawPagination]
  );

  const handleOpenApprove = (box: SecureBoxItem) => {
    setSelectedBox(box);
    setActionType("approved");
    setAdminNotes("");
    setRejectionReason("");
  };

  const handleOpenReject = (box: SecureBoxItem) => {
    setSelectedBox(box);
    setActionType("rejected");
    setAdminNotes("");
    setRejectionReason("");
  };

  const handleClose = () => {
    setSelectedBox(null);
    setActionType(null);
    setAdminNotes("");
    setRejectionReason("");
  };

  const handleSubmit = async () => {
    if (!selectedBox || !actionType) return;

    if (actionType === "rejected" && !rejectionReason.trim()) {
      toast({
        title: t("admin.secure_box.rejection_required", "Rejection reason required"),
        description: t("admin.secure_box.rejection_required_desc", "Please provide a reason when rejecting."),
        variant: "destructive",
      });
      return;
    }

    try {
      await approveSecureBox({
        orderId: selectedBox.order_id,
        data: {
          status: actionType,
          admin_notes: adminNotes.trim() || undefined,
          rejection_reason: actionType === "rejected" ? rejectionReason.trim() : undefined,
        },
      }).unwrap();

      toast({
        title: t("admin.secure_box.success", "Success"),
        description:
          actionType === "approved"
            ? t("admin.secure_box.approved_message", "Secure box approved.")
            : t("admin.secure_box.rejected_message", "Secure box rejected."),
      });

      handleClose();
      refetch();
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "data" in err && err.data && typeof (err as { data: { detail?: string } }).data === "object"
          ? (err as { data: { detail?: string } }).data?.detail
          : t("common.error");
      toast({
        title: t("common.error", "Error"),
        description: String(detail),
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<SecureBoxItem>[] = useMemo(
    () => [
      {
        id: "order",
        accessorKey: (row) => row.order?.order_number ?? row.order_id,
        header: t("admin.secure_box.order", "Order"),
        cell: ({ row }) => (
          <span className="font-medium">
            {row.order?.order_number ?? `#${row.order_id}`}
          </span>
        ),
      },
      {
        id: "buyer",
        accessorKey: (row) => row.buyer?.username ?? row.buyer?.email ?? "—",
        header: t("admin.secure_box.buyer", "Buyer"),
        cell: ({ row }) =>
          row.buyer ? `${row.buyer.username ?? row.buyer.email}` : "—",
      },
      {
        id: "seller",
        accessorKey: (row) => row.seller?.username ?? row.seller?.email ?? "—",
        header: t("admin.secure_box.seller", "Seller"),
        cell: ({ row }) =>
          row.seller ? `${row.seller.username ?? row.seller.email}` : "—",
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("admin.secure_box.status", "Status"),
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.status)} className="capitalize">
            {row.status}
          </Badge>
        ),
      },
      {
        id: "content",
        accessorKey: "content",
        header: t("admin.secure_box.content", "Content"),
        cell: ({ row }) => (
          <span 
            className="max-w-[200px] truncate block cursor-pointer hover:text-primary transition-colors" 
            title={t("admin.secure_box.click_to_view", "Click to view full content")}
            onClick={() => setViewedContent(row.content)}
          >
            {truncateContent(row.content)}
          </span>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("admin.secure_box.created", "Created"),
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <LockIcon className="h-7 w-7" />
          {t("admin.secure_box.title", "Secure Box")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.secure_box.description", "Review and approve pending secure box submissions.")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.secure_box.list_title", "All Secure Boxes")}</CardTitle>
            <CardDescription>
              {t("admin.secure_box.list_desc", "Full list of secure boxes. Filter by status.")}
            </CardDescription>
          </div>
          <div className="space-y-2">
            <Label className="sr-only">{t("admin.secure_box.filter_status", "Status")}</Label>
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
                <SelectItem value="all">{t("admin.secure_box.all_statuses", "All statuses")}</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<SecureBoxItem>
            data={items}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.secure_box.no_items", "No secure boxes found.")}
            emptyIcon={<LockIcon className="w-16 h-16 text-muted-foreground" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) =>
              row.status === "pending" ? (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleOpenApprove(row)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {t("admin.secure_box.approve", "Approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleOpenReject(row)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t("admin.secure_box.reject", "Reject")}
                  </Button>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )
            }
            actionsColumnHeader={t("admin.secure_box.actions", "Actions")}
            enableSorting={true}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            error={error}
            errorTitle={t("common.error", "Error")}
            errorDescription={t("admin.secure_box.error_desc", "Failed to load secure boxes.")}
            errorIcon={<LockIcon className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <Dialog open={!!selectedBox && !!actionType} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approved"
                ? t("admin.secure_box.approve_title", "Approve Secure Box")
                : t("admin.secure_box.reject_title", "Reject Secure Box")}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approved"
                ? t("admin.secure_box.approve_desc", "This will allow the buyer to request OTP and access the secure box content.")
                : t("admin.secure_box.reject_desc", "The seller will need to update the content and resubmit for review.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBox && (
              <p className="text-sm text-muted-foreground">
                Order: <strong>{selectedBox.order?.order_number ?? `#${selectedBox.order_id}`}</strong>
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="admin_notes">{t("admin.secure_box.admin_notes", "Admin Notes")} (optional)</Label>
              <Textarea
                id="admin_notes"
                placeholder={t("admin.secure_box.admin_notes_placeholder", "Internal notes (not shown to user)")}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
              />
            </div>
            {actionType === "rejected" && (
              <div className="space-y-2">
                <Label htmlFor="rejection_reason">
                  {t("admin.secure_box.rejection_reason", "Rejection Reason")} *
                </Label>
                <Textarea
                  id="rejection_reason"
                  placeholder={t("admin.secure_box.rejection_reason_placeholder", "Reason shown to seller")}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              variant={actionType === "rejected" ? "destructive" : "default"}
              onClick={handleSubmit}
              disabled={isSubmitting || (actionType === "rejected" && !rejectionReason.trim())}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionType === "approved"
                ? t("admin.secure_box.approved", "Approved")
                : t("admin.secure_box.rejected", "Rejected")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewedContent !== null} onOpenChange={(open) => !open && setViewedContent(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.secure_box.content_details", "Secure Box Content Details")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[60vh]">
              <pre className="text-sm whitespace-pre-wrap font-mono">{viewedContent}</pre>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewedContent(null)}>
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
