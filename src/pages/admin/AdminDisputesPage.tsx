import { useState, useMemo, useEffect } from "react";
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
  DialogHeader,
  DialogTitle,
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
  ShieldAlert,
  Loader2,
  MessageSquare,
  CheckCircle,
  Trash2,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import {
  useGetDisputesQuery,
  useGetDisputeQuery,
  useGetDisputeCommentsQuery,
  useUpdateDisputeMutation,
  useResolveDisputeMutation,
  useAddDisputeCommentMutation,
  useDeleteDisputeMutation,
  type Dispute,
  type DisputeFilters,
  type DisputeComment,
} from "@/store/api/disputesApi";
import { ROUTES } from "@/lib/routes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const STATUS_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "open", labelKey: "admin.disputes.status.open" },
  { value: "in_review", labelKey: "admin.disputes.status.in_review" },
  { value: "resolved", labelKey: "admin.disputes.status.resolved" },
] as const;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminDisputesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolveResolution, setResolveResolution] = useState("");
  const [resolveAction, setResolveAction] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentInternal, setCommentInternal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disputeToDelete, setDisputeToDelete] = useState<Dispute | null>(null);

  useEffect(() => {
    const focusId = (location.state as { focusDisputeId?: number } | null)?.focusDisputeId;
    if (focusId == null) return;
    setSelectedDisputeId(focusId);
    setDetailOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const filters = useMemo<DisputeFilters>(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter }),
    }),
    [page, size, statusFilter]
  );

  const { data: disputesData, isLoading, error } = useGetDisputesQuery(filters);
  const disputes = disputesData?.items ?? [];
  const pagination = disputesData?.pagination;

  const { data: disputeDetail } = useGetDisputeQuery(selectedDisputeId!, {
    skip: !selectedDisputeId,
  });
  const { data: comments = [], isLoading: commentsLoading } =
    useGetDisputeCommentsQuery(
      {
        disputeId: selectedDisputeId!,
        include_internal: true,
      },
      { skip: !selectedDisputeId || !detailOpen }
    );

  const [updateDispute, { isLoading: isUpdating }] = useUpdateDisputeMutation();
  const [resolveDispute, { isLoading: isResolving }] = useResolveDisputeMutation();
  const [addComment, { isLoading: isAddingComment }] =
    useAddDisputeCommentMutation();
  const [deleteDispute, { isLoading: isDeleting }] = useDeleteDisputeMutation();

  const openDetail = (d: Dispute) => {
    setSelectedDisputeId(d.id);
    setDetailOpen(true);
  };

  const handleResolve = async () => {
    if (!selectedDisputeId || !resolveResolution.trim()) return;
    try {
      await resolveDispute({
        id: selectedDisputeId,
        resolution: resolveResolution.trim(),
        resolution_action: resolveAction.trim() || undefined,
      }).unwrap();
      toast({ title: t("admin.disputes.resolved") });
      setResolveDialogOpen(false);
      setResolveResolution("");
      setResolveAction("");
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const handleAddComment = async () => {
    if (!selectedDisputeId || !newComment.trim()) return;
    try {
      await addComment({
        id: selectedDisputeId,
        comment: newComment.trim(),
        is_internal: commentInternal,
      }).unwrap();
      setNewComment("");
      toast({ title: t("admin.disputes.comment_added") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const confirmDelete = (d: Dispute) => {
    setDisputeToDelete(d);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!disputeToDelete) return;
    try {
      await deleteDispute(disputeToDelete.id).unwrap();
      setDeleteDialogOpen(false);
      setDisputeToDelete(null);
      if (selectedDisputeId === disputeToDelete.id) {
        setDetailOpen(false);
        setSelectedDisputeId(null);
      }
      toast({ title: t("admin.disputes.deleted") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const getStatusVariant = (status: string) => {
    if (status === "resolved") return "default";
    if (status === "open") return "secondary";
    return "outline";
  };

  const columns: ColumnDef<Dispute>[] = useMemo(
    () => [
      {
        id: "dispute_number",
        accessorKey: "dispute_number",
        header: t("admin.disputes.dispute_number"),
        cell: ({ row }) => (
          <span className="font-mono font-medium">{row.dispute_number}</span>
        ),
      },
      {
        id: "order_id",
        accessorKey: "order_id",
        header: t("admin.disputes.order_id"),
        cell: ({ row }) => (
          <Link
            to={ROUTES.ADMIN.ORDERS.DETAILS(row.order_id)}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            #{row.order_id}
          </Link>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: t("admin.disputes.title"),
        cell: ({ row }) => (
          <span className="max-w-[200px] truncate block">{row.title}</span>
        ),
      },
      {
        id: "dispute_type",
        accessorKey: "dispute_type",
        header: t("admin.disputes.type"),
        cell: ({ row }) => (
          <Badge variant="outline">{row.dispute_type}</Badge>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("common.status.status"),
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.status)}>
            {t(`admin.disputes.status.${row.status}`) || row.status}
          </Badge>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("admin.disputes.created_at"),
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
          <ShieldAlert className="h-7 w-7" />
          {t("admin.disputes.title", "Disputes")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.disputes.description", "View and resolve order disputes.")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.disputes.list_title", "Disputes")}</CardTitle>
            <CardDescription>{t("admin.disputes.manage")}</CardDescription>
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
          <DataTableWithPagination<Dispute>
            data={disputes}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.disputes.empty")}
            emptyIcon={<ShieldAlert className="h-12 w-12 mx-auto opacity-50" />}
            getRowId={(row) => String(row.id)}
            onRowClick={openDetail}
            renderActions={(row) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(row);
                  }}
                  disabled={isDeleting}
                  title={t("admin.disputes.delete")}
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
            errorIcon={<ShieldAlert className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {disputeDetail?.dispute_number ?? t("admin.disputes.detail")}
            </DialogTitle>
            <DialogDescription>
              {disputeDetail?.title}
            </DialogDescription>
          </DialogHeader>
          {disputeDetail && (
            <div className="flex flex-col gap-4 flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("admin.disputes.order_id")}: </span>
                  <Link
                    to={ROUTES.ADMIN.ORDERS.DETAILS(disputeDetail.order_id)}
                    className="text-primary hover:underline"
                  >
                    #{disputeDetail.order_id}
                  </Link>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("common.status.status")}: </span>
                  <Badge variant={getStatusVariant(disputeDetail.status)}>
                    {disputeDetail.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">{t("admin.disputes.description_label")}: </span>
                  <p className="mt-1">{disputeDetail.description}</p>
                </div>
                {disputeDetail.status === "resolved" && (
                  <>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">{t("admin.disputes.resolution")}: </span>
                      <p className="mt-1">{disputeDetail.resolution ?? "—"}</p>
                    </div>
                    {disputeDetail.resolution_action && (
                      <div>
                        <span className="text-muted-foreground">{t("admin.disputes.resolution_action")}: </span>
                        {disputeDetail.resolution_action}
                      </div>
                    )}
                    {disputeDetail.resolved_at && (
                      <div>
                        <span className="text-muted-foreground">{t("admin.disputes.resolved_at")}: </span>
                        {formatDate(disputeDetail.resolved_at)}
                      </div>
                    )}
                  </>
                )}
              </div>

              {disputeDetail.status !== "resolved" && (
                <Button
                  onClick={() => setResolveDialogOpen(true)}
                  disabled={isResolving}
                >
                  {isResolving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {t("admin.disputes.resolve")}
                </Button>
              )}

              <Separator />

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t("admin.disputes.comments")}
                </h4>
                <ScrollArea className="h-[200px] rounded border p-3">
                  {commentsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto my-4" />
                  ) : (comments as DisputeComment[]).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("admin.disputes.no_comments")}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {(comments as DisputeComment[]).map((c) => (
                        <li key={c.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {c.user?.username ?? c.user?.email ?? `User #${c.user_id}`}
                            </span>
                            {c.is_internal && (
                              <Badge variant="secondary" className="text-xs">
                                {t("admin.disputes.internal")}
                              </Badge>
                            )}
                            <span className="text-muted-foreground text-xs">
                              {formatDate(c.created_at)}
                            </span>
                          </div>
                          <p className="mt-0.5">{c.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder={t("admin.disputes.add_comment_placeholder")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commentInternal}
                        onChange={(e) => setCommentInternal(e.target.checked)}
                        className="rounded"
                      />
                      {t("admin.disputes.internal_comment")}
                    </label>
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isAddingComment}
                    >
                      {isAddingComment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-1" />
                      )}
                      {t("admin.disputes.add_comment")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.disputes.resolve_title")}</DialogTitle>
            <DialogDescription>
              {t("admin.disputes.resolve_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{t("admin.disputes.resolution")}</Label>
              <Textarea
                value={resolveResolution}
                onChange={(e) => setResolveResolution(e.target.value)}
                placeholder={t("admin.disputes.resolution_placeholder")}
                rows={4}
                className="mt-2"
              />
            </div>
            <div>
              <Label>{t("admin.disputes.resolution_action")}</Label>
              <Select
                value={resolveAction || "none"}
                onValueChange={(v) => setResolveAction(v === "none" ? "" : v)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("admin.disputes.resolution_action_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  <SelectItem value="refund">{t("admin.disputes.action_refund")}</SelectItem>
                  <SelectItem value="partial_refund">{t("admin.disputes.action_partial_refund")}</SelectItem>
                  <SelectItem value="favor_buyer">{t("admin.disputes.action_favor_buyer")}</SelectItem>
                  <SelectItem value="favor_seller">{t("admin.disputes.action_favor_seller")}</SelectItem>
                  <SelectItem value="other">{t("admin.disputes.action_other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!resolveResolution.trim() || isResolving}
            >
              {isResolving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}{" "}
              {t("admin.disputes.resolve")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.disputes.delete_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.disputes.delete_confirm_description")}
              {disputeToDelete && (
                <span className="block mt-2 font-medium text-foreground">
                  {disputeToDelete.dispute_number}
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
              {t("admin.disputes.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
