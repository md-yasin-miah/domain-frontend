import { useTranslation } from "react-i18next";
import { Bell, Check, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/store/hooks/useAuth";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  type Notification,
  useGetStreamNotificationsQuery,
} from "@/store/api/notificationApi";
import { cn } from "@/lib/utils";

const NOTIFICATION_LIST_LIMIT = 10;

function formatNotificationTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationDropdown() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !user,
  });
  const { data: notificationsData, isLoading: isLoadingList } =
    useGetNotificationsQuery(
      { skip: 0, limit: NOTIFICATION_LIST_LIMIT },
      { skip: !user }
    );
  const { data: streamNotificationsData, isLoading: isLoadingStream } =
    useGetStreamNotificationsQuery(undefined, {
      skip: !user,
    });
    console.log({streamNotificationsData})

  const unreadCount = unreadData?.unread_count ?? 0;
  const list: Notification[] = notificationsData?.items ?? [];

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full group bg-gray-100 hover:bg-primary/10"
          aria-label={t("notifications.aria_label")}
        >
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground",
                unreadCount > 99 && "px-1.5"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl border bg-background/98 backdrop-blur-xl p-0 shadow-xl z-50"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">
            {t("notifications.title")}
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              {isMarkingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  {t("notifications.mark_all_read")}
                </>
              )}
            </Button>
          )}
        </div>
        <ScrollArea className="h-[280px]">
          {isLoadingList ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                {t("notifications.empty")}
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {list.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                      !n.is_read && "bg-primary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 shrink-0 rounded-full p-0.5",
                        n.is_read ? "text-muted-foreground" : "text-primary"
                      )}
                    >
                      {n.is_read ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="block h-2 w-2 rounded-full bg-primary" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium leading-tight",
                          !n.is_read && "text-foreground"
                        )}
                      >
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatNotificationTime(n.created_at)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
