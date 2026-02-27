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
import { Bell, Loader2, CheckCheck, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  type Notification,
  type NotificationFilters,
} from "@/store/api/notificationApi";
import { cn } from "@/lib/utils";

function formatNotificationTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

const READ_FILTER_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "unread", labelKey: "notifications.filter_unread" },
  { value: "read", labelKey: "notifications.filter_read" },
] as const;

export default function AdminNotificationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [readFilter, setReadFilter] = useState<string>("all");
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const filters = useMemo<NotificationFilters>(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(readFilter === "unread" && { is_read: false }),
      ...(readFilter === "read" && { is_read: true }),
    }),
    [page, size, readFilter]
  );

  const { data: notificationsData, isLoading, error } =
    useGetNotificationsQuery(filters);
  const { data: unreadData } = useGetUnreadCountQuery();
  const notifications = notificationsData?.items ?? [];
  const total = notificationsData?.pagination?.total ?? 0;
  const unreadCount = unreadData?.unread_count ?? 0;

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationsMutation();

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
      toast({ title: t("notifications.marked_read") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast({ title: t("notifications.all_marked_read") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id).unwrap();
      toast({ title: t("notifications.deleted") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
      setDeleteAllDialogOpen(false);
      toast({ title: t("notifications.all_deleted") });
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" });
    }
  };

  const columns: ColumnDef<Notification>[] = useMemo(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: t("notifications.table.title"),
        cell: ({ row }) => (
          <div className="max-w-[240px]">
            <p
              className={cn(
                "font-medium truncate",
                !row.is_read && "text-foreground"
              )}
            >
              {row.title}
            </p>
            {row.message && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {row.message}
              </p>
            )}
          </div>
        ),
      },
      {
        id: "notification_type",
        accessorKey: "notification_type",
        header: t("notifications.table.type"),
        cell: ({ row }) => (
          <Badge variant="outline" className="font-normal">
            {row.notification_type}
          </Badge>
        ),
      },
      {
        id: "is_read",
        accessorKey: "is_read",
        header: t("notifications.table.status"),
        cell: ({ row }) => (
          <Badge
            variant={row.is_read ? "secondary" : "default"}
            className="capitalize"
          >
            {row.is_read
              ? t("notifications.read", "Read")
              : t("notifications.unread", "Unread")}
          </Badge>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("notifications.table.created_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatNotificationTime(row.created_at)}
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
          <Bell className="h-7 w-7" />
          {t("admin.notifications.title", "Notifications")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.notifications.description", "View and manage your notifications.")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("notifications.title", "Notifications")}</CardTitle>
            <CardDescription>
              {t("admin.notifications.manage")}{" "}
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                {total} {t("notifications.total", "total")}
                {unreadCount > 0 && (
                  <> · {unreadCount} {t("notifications.unread", "unread")}</>
                )}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={readFilter}
              onValueChange={(v) => {
                setReadFilter(v);
                handlePageChange(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("notifications.filter")} />
              </SelectTrigger>
              <SelectContent>
                {READ_FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
              >
                {isMarkingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    {t("notifications.mark_all_read")}
                  </>
                )}
              </Button>
            )}
            {total > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteAllDialogOpen(true)}
                disabled={isDeletingAll}
                className="text-destructive hover:text-destructive"
              >
                {isDeletingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("notifications.delete_all")}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<Notification>
            data={notifications}
            columns={columns}
            pagination={notificationsData?.pagination}
            isLoading={isLoading}
            emptyMessage={t("notifications.empty")}
            emptyIcon={<Bell className="h-12 w-12 mx-auto opacity-50" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) => (
              <div className="flex items-center gap-1">
                {!row.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMarkAsRead(row.id)}
                    title={t("notifications.mark_read")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(row.id)}
                  title={t("notifications.delete")}
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
            errorIcon={<Bell className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("notifications.delete_all_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("notifications.delete_all_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingAll}
            >
              {isDeletingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {t("notifications.delete_all")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
