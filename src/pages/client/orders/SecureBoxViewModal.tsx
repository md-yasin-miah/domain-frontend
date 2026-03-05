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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetSecureBoxByOrderQuery,
  useRequestSecureBoxOtpMutation,
  useVerifySecureBoxOtpMutation,
} from "@/store/api/secureBoxApi";

export interface OrderForSecureBoxView {
  id: number;
  order_number: string;
}

interface SecureBoxViewModalProps {
  order: OrderForSecureBoxView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getMessageFromError(err: unknown, fallback: string): string {
  const raw =
    err && typeof err === "object" && "data" in err
      ? (err as { data: unknown }).data
      : null;
  const detail =
    raw && typeof raw === "object" && "detail" in raw
      ? (raw as { detail: unknown }).detail
      : typeof raw === "string"
        ? raw
        : null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const msg = (detail as Array<{ msg?: string }>)
      .map((d) => d?.msg)
      .filter(Boolean)
      .join(" ");
    return msg || fallback;
  }
  return fallback;
}

export function SecureBoxViewModal({
  order,
  open,
  onOpenChange,
}: SecureBoxViewModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [otpCode, setOtpCode] = useState("");
  /** Content shown after successful OTP verify (when GET didn't return content yet) */
  const [contentAfterVerify, setContentAfterVerify] = useState<string | null>(
    null
  );

  const orderId = order?.id ?? 0;
  const {
    data: secureBoxData,
    isLoading: isLoadingSecureBox,
    refetch: refetchSecureBox,
  } = useGetSecureBoxByOrderQuery(orderId, { skip: !orderId || !open });

  const [requestOtp, { isLoading: isRequestingOtp }] =
    useRequestSecureBoxOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] =
    useVerifySecureBoxOtpMutation();

  const secure_box = secureBoxData?.secure_box ?? null;
  const secure_box_available = secureBoxData?.secure_box_available ?? false;
  const can_view_content = secureBoxData?.can_view_content ?? false;
  const already_accessed = secureBoxData?.already_accessed ?? false;

  /** Content to display: from GET (when already_accessed) or from verify response */
  const displayContent =
    contentAfterVerify ??
    (secure_box?.content != null && secure_box.content !== ""
      ? secure_box.content
      : null);

  // Reset local state when modal closes or order changes
  useEffect(() => {
    if (!open) {
      setOtpCode("");
      setContentAfterVerify(null);
    }
  }, [open, orderId]);

  const handleClose = () => {
    if (!isRequestingOtp && !isVerifyingOtp) onOpenChange(false);
  };

  const handleRequestOtp = async () => {
    if (!orderId) return;
    try {
      const res = await requestOtp(orderId).unwrap();
      if (res.already_accessed) {
        toast({
          title: t("orders.secure_box.view_modal.already_accessed", "Already accessed"),
          description: res.message,
        });
        refetchSecureBox();
        return;
      }
      toast({
        title: t("orders.secure_box.view_modal.otp_sent", "OTP sent"),
        description: res.message,
      });
    } catch (err: unknown) {
      toast({
        title: t("common.error", "Error"),
        description: getMessageFromError(err, t("common.error")),
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!orderId || !otpCode.trim()) return;
    try {
      const res = await verifyOtp({
        orderId,
        data: { order_id: orderId, otp_code: otpCode.trim() },
      }).unwrap();
      setContentAfterVerify(res.content);
      setOtpCode("");
      toast({
        title: t("orders.secure_box.view_modal.verified", "Verified"),
        description: t("orders.secure_box.view_modal.content_revealed", "Content is now visible."),
      });
      refetchSecureBox();
    } catch (err: unknown) {
      toast({
        title: t("common.error", "Error"),
        description: getMessageFromError(err, t("common.error")),
        variant: "destructive",
      });
    }
  };

  if (!order) return null;

  const notAvailable =
    !secure_box_available || (!secure_box && !secureBoxData?.message);
  const notApproved =
    secure_box &&
    !can_view_content &&
    ["pending", "rejected"].includes(secure_box.status);
  const needsOtp =
    can_view_content && !displayContent && !already_accessed && !contentAfterVerify;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("orders.secure_box.view_modal.title", "View Secure Box")}
          </DialogTitle>
          <DialogDescription>
            {t("orders.table.order_number")}: {order.order_number}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoadingSecureBox ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              {t("common.loading", "Loading...")}
            </div>
          ) : notAvailable ? (
            <p className="text-sm text-muted-foreground py-4">
              {secureBoxData?.message ??
                t(
                  "orders.secure_box.view_modal.not_available",
                  "Secure box is not available for this order."
                )}
            </p>
          ) : notApproved ? (
            <p className="text-sm text-muted-foreground py-4">
              {t(
                "orders.secure_box.view_modal.not_approved",
                "This secure box is not approved yet. You cannot view content until an admin approves it."
              )}
            </p>
          ) : displayContent ? (
            <div className="space-y-2">
              {already_accessed && !contentAfterVerify && (
                <p className="text-xs text-muted-foreground">
                  {t(
                    "orders.secure_box.view_modal.already_accessed_badge",
                    "You have previously accessed this content."
                  )}
                </p>
              )}
              <Label>{t("orders.secure_box.content_label", "Content")}</Label>
              <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap break-words">
                {displayContent}
              </div>
            </div>
          ) : needsOtp ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t(
                  "orders.secure_box.view_modal.request_otp_desc",
                  "Request a one-time code to your email to view the secure box content."
                )}
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp}
                >
                  {isRequestingOtp && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {t("orders.secure_box.view_modal.request_otp", "Request OTP")}
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="secure-box-otp">
                    {t("orders.secure_box.view_modal.enter_otp", "Enter OTP code")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="secure-box-otp"
                      placeholder={t(
                        "orders.secure_box.view_modal.otp_placeholder",
                        "Enter code from email"
                      )}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={!otpCode.trim() || isVerifyingOtp}
                    >
                      {isVerifyingOtp && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {t("orders.secure_box.view_modal.verify", "Verify")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close", "Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
