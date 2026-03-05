import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateSecureBoxMutation,
  useUpdateSecureBoxMutation,
  useGetSecureBoxByOrderQuery,
} from "@/store/api/secureBoxApi";

export interface OrderForSecureBox {
  id: number;
  order_number: string;
}

interface SecureBoxDialogProps {
  order: OrderForSecureBox | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function getMessageFromError(err: unknown, fallback: string): string {
  const raw = err && typeof err === "object" && "data" in err ? (err as { data: unknown }).data : null;
  const detail =
    raw && typeof raw === "object" && "detail" in raw
      ? (raw as { detail: unknown }).detail
      : typeof raw === "string"
        ? raw
        : null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const msg = (detail as Array<{ msg?: string }>).map((d) => d?.msg).filter(Boolean).join(" ");
    return msg || fallback;
  }
  return fallback;
}

export function SecureBoxDialog({ order, open, onOpenChange, onSuccess }: SecureBoxDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const orderId = order?.id ?? 0;
  const { data: secureBoxByOrder, isLoading: isLoadingSecureBox, refetch: refetchSecureBox } =
    useGetSecureBoxByOrderQuery(orderId, { skip: !orderId || !open });

  const existingSecureBox = secureBoxByOrder?.secure_box ?? null;
  const canUpdate =
    !!existingSecureBox && ["pending", "rejected"].includes(existingSecureBox.status);
  const isUpdateMode = canUpdate;
  /** Exists but not editable (e.g. approved, accessed) */
  const existsNoEdit = !!existingSecureBox && !canUpdate;

  const [createSecureBox, { isLoading: isCreating }] = useCreateSecureBoxMutation();
  const [updateSecureBox, { isLoading: isUpdating }] = useUpdateSecureBoxMutation();
  const isSubmitting = isCreating || isUpdating;

  // Pre-fill content when existing secure box is available; clear when create mode or still loading
  useEffect(() => {
    if (!open || !order) return;
    if (isLoadingSecureBox) {
      setContent("");
      return;
    }
    if (existingSecureBox && canUpdate) {
      setContent(existingSecureBox.content ?? "");
    } else {
      setContent("");
    }
  }, [open, order?.id, existingSecureBox, canUpdate, isLoadingSecureBox]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) setContent("");
  }, [open]);

  const handleClose = () => {
    if (!isSubmitting) onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!order || !content.trim()) return;
    try {
      if (isUpdateMode) {
        await updateSecureBox({ orderId: order.id, data: { content: content.trim() } }).unwrap();
        toast({
          title: t("orders.secure_box.updated", "Secure Box Updated"),
          description: t(
            "orders.secure_box.updated_desc",
            "Your secure box content has been updated and resubmitted for approval."
          ),
        });
      } else {
        await createSecureBox({ orderId: order.id, data: { content: content.trim() } }).unwrap();
        toast({
          title: t("orders.secure_box.created", "Secure Box Created"),
          description: t(
            "orders.secure_box.created_desc",
            "Your secure box has been submitted for admin approval."
          ),
        });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const message = getMessageFromError(err, t("common.error"));
      const isAlreadyExists =
        /secure box already exists|use PUT to update/i.test(message) || message.includes("already exists");

      if (isAlreadyExists && order) {
        await refetchSecureBox();
        toast({
          title: t("orders.secure_box.already_exists_title", "Secure Box Exists"),
          description: t(
            "orders.secure_box.already_exists_desc",
            "A secure box already exists for this order. You can update the content below."
          ),
        });
        return;
      }
      toast({
        title: t("common.error", "Error"),
        description: message,
        variant: "destructive",
      });
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existsNoEdit
              ? t("orders.secure_box.view_title", "Secure Box")
              : isUpdateMode
                ? t("orders.secure_box.update_title", "Update Secure Box")
                : t("orders.secure_box.create_title", "Create Secure Box")}
          </DialogTitle>
          <DialogDescription>
            {existsNoEdit
              ? t(
                  "orders.secure_box.exists_no_edit_desc",
                  "This secure box has already been submitted and approved. You cannot edit it."
                )
              : isUpdateMode
                ? t(
                    "orders.secure_box.update_desc",
                    "Update the content below. It will be resubmitted for admin approval."
                  )
                : t(
                    "orders.secure_box.create_desc",
                    "Add the content for this order. Admin will review and approve before the buyer can access it."
                  )}
            <span className="block mt-1 font-medium">
              {t("orders.table.order_number")}: {order.order_number}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoadingSecureBox ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              {t("common.loading", "Loading...")}
            </div>
          ) : existsNoEdit ? (
            <p className="text-sm text-muted-foreground py-4">
              {t(
                "orders.secure_box.exists_no_edit_message",
                "The secure box for this order is no longer editable. It has been approved or already accessed."
              )}
            </p>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="secure-box-content">
                {t("orders.secure_box.content_label", "Content")}
              </Label>
              <Textarea
                id="secure-box-content"
                placeholder={t(
                  "orders.secure_box.content_placeholder",
                  "Enter secure box content..."
                )}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {existsNoEdit ? t("common.close", "Close") : t("common.cancel", "Cancel")}
          </Button>
          {!existsNoEdit && (
            <Button
              onClick={handleSubmit}
              disabled={isLoadingSecureBox || !content.trim() || isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isUpdateMode
                ? t("orders.secure_box.update_submit", "Update & Resubmit")
                : t("orders.secure_box.submit", "Submit for Approval")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
