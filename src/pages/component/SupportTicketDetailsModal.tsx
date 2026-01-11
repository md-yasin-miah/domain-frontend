import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// SupportTicket type is defined globally in types/api/support.d.ts
import { getStatusColor, timeFormat } from "@/lib/helperFun";

interface SupportTicketDetailsModalProps {
  ticket: SupportTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportTicketDetailsModal: React.FC<SupportTicketDetailsModalProps> = ({
  ticket,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  if (!ticket) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return "default";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "default";
      case "closed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-6">
            <DialogTitle className="text-2xl">{ticket.title}</DialogTitle>
            <Badge
              variant={getStatusBadge(ticket.status)}
              className={getStatusColor(ticket.status)}
            >
              {getStatusLabel(ticket.status)}
            </Badge>
          </div>
          <DialogDescription>
            {t("support.detail.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">
              {t("support.detail.description_label")}
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <Separator />

          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold mb-2">
              {t("support.detail.category")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {ticket.category?.name || t("support.no_category")}
            </p>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">
                {t("support.detail.created")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {timeFormat(ticket.created_at, "lll")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">
                {t("support.detail.updated")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {timeFormat(ticket.updated_at, "lll")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Created By */}
          {ticket.created_by && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  {t("support.detail.created")} By
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">{t("common.name")}</span>:{" "}
                  {ticket.created_by.username} <br />
                  <span className="font-semibold">
                    {t("common.email")}
                  </span>: {ticket.created_by.email}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Assigned To */}
          {ticket.assigned_to ? (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  {t("support.detail.assigned_to")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {ticket.assigned_to.username || ticket.assigned_to.email}
                </p>
              </div>
              <Separator />
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  {t("support.detail.assigned_to")}
                </h3>
                <p className="text-sm text-muted-foreground italic">
                  Not assigned
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDetailsModal;
