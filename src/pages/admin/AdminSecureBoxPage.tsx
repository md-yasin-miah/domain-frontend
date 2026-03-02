import { useState } from "react";
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
import { LockIcon, Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPendingSecureBoxesQuery,
  useApproveSecureBoxMutation,
  type SecureBoxItem,
} from "@/store/api/secureBoxApi";

const PAGE_SIZE = 15;

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

export default function AdminSecureBoxPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [selectedBox, setSelectedBox] = useState<SecureBoxItem | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading, refetch } = useGetPendingSecureBoxesQuery({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  const [approveSecureBox, { isLoading: isSubmitting }] = useApproveSecureBoxMutation();

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
        <CardHeader>
          <CardTitle>{t("admin.secure_box.pending_list", "Pending Secure Boxes")}</CardTitle>
          <CardDescription>
            {t("admin.secure_box.pending_desc", "Secure boxes awaiting admin approval.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {t("admin.secure_box.no_pending", "No pending secure boxes.")}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.secure_box.order", "Order")}</TableHead>
                    <TableHead>{t("admin.secure_box.buyer", "Buyer")}</TableHead>
                    <TableHead>{t("admin.secure_box.seller", "Seller")}</TableHead>
                    <TableHead>{t("admin.secure_box.content", "Content")}</TableHead>
                    <TableHead>{t("admin.secure_box.created", "Created")}</TableHead>
                    <TableHead className="text-right">{t("admin.secure_box.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((box) => (
                    <TableRow key={box.id}>
                      <TableCell className="font-medium">
                        {box.order?.order_number ?? `#${box.order_id}`}
                      </TableCell>
                      <TableCell>
                        {box.buyer
                          ? `${box.buyer.username ?? box.buyer.email}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {box.seller
                          ? `${box.seller.username ?? box.seller.email}`
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={box.content ?? undefined}>
                        {truncateContent(box.content)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(box.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleOpenApprove(box)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {t("admin.secure_box.approve", "Approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenReject(box)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t("admin.secure_box.reject", "Reject")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    {t("admin.secure_box.page_info", "Page {{current}} of {{total}} ({{totalCount}} total)", {
                      current: page,
                      total: totalPages,
                      totalCount: total,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      {t("common.previous", "Previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {t("common.next", "Next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
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
    </div>
  );
}
