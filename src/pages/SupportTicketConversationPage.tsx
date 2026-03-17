import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, ArrowLeft, MessageSquare, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/hooks/useAuth";
import { getStatusColor, timeFormat } from "@/lib/helperFun";
import {
  useGetTicketQuery,
  useAddTicketReplyMutation,
} from "@/store/api/supportApi";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

function getStatusBadge(status: string) {
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
}

function getUserLabel(u: SupportTicketReply["user"]) {
  return (
    u?.name ||
    (u as { username?: string })?.username ||
    (u as { email?: string })?.email ||
    ""
  );
}

function getInitials(u: SupportTicketReply["user"]): string {
  const name = (u as { name?: string })?.name;
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  const username = (u as { username?: string })?.username;
  if (username && username.trim()) return username.slice(0, 2).toUpperCase();
  const email = (u as { email?: string })?.email;
  if (email && email.trim()) return email.slice(0, 2).toUpperCase();
  return "?";
}

export default function SupportTicketConversationPage() {
  const { ticketId: ticketIdParam } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ticketId = ticketIdParam != null ? parseInt(ticketIdParam, 10) : null;
  const isAdmin = location.pathname.includes("/admin/");

  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const {
    data: ticket,
    isLoading,
    refetch,
  } = useGetTicketQuery(
    { id: ticketId!, include_replies: true },
    { skip: ticketId == null || isNaN(ticketId) },
  );
  const [addReply, { isLoading: isSubmitting }] = useAddTicketReplyMutation();

  const replies = ticket?.replies ?? [];
  const visibleReplies = isAdmin
    ? replies
    : replies.filter((r) => !r.is_internal);
  const isClosed = ticket?.status === "closed";
  const canReply = !isClosed && message.trim().length > 0;

  const backRoute = isAdmin ? ROUTES.ADMIN.SUPPORT : ROUTES.CLIENT.SUPPORT;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleReplies.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketId == null || isNaN(ticketId) || !canReply) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      await addReply({
        ticketId,
        data: { message: trimmed, is_internal: isAdmin ? isInternal : false },
      }).unwrap();
      toast({
        title: t("support.reply.sent", "Reply sent"),
        description: t(
          "support.reply.sent_description",
          "Your message has been added to the ticket.",
        ),
      });
      setMessage("");
      setIsInternal(false);
      refetch();
    } catch (err: unknown) {
      const detail =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof (err.data as { detail?: string }).detail === "string"
          ? (err.data as { detail: string }).detail
          : t("common.error", "Something went wrong");
      toast({
        variant: "destructive",
        title: t("common.error", "Error"),
        description: detail,
      });
    }
  };

  const getStatusLabel = (status: string) =>
    t(`common.status.${status}`) || status;

  if (ticketIdParam == null || isNaN(ticketId!) || ticketId == null) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto py-6">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              {t("support.invalid_ticket", "Invalid ticket ID")}
            </p>
            <Button variant="outline" onClick={() => navigate(backRoute)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back", "Back")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto py-6 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto py-6">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              {t("support.ticket_not_found", "Ticket not found")}
            </p>
            <Button variant="outline" onClick={() => navigate(backRoute)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back", "Back")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl mx-auto rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Chat header */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(backRoute)}
          className="shrink-0 h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-semibold truncate text-lg">{ticket.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
            {ticket.category && <span>{ticket.category.name}</span>}
            <span>•</span>
            <span>{timeFormat(ticket.created_at, "ll")}</span>
            {ticket.assigned_to && (
              <>
                <span>•</span>
                <span>
                  {t("support.detail.assigned_to")}:{" "}
                  {getUserLabel(ticket.assigned_to) ||
                    t("support.unknown_user", "Unknown")}
                </span>
              </>
            )}
          </div>
        </div>
        <Badge
          variant={getStatusBadge(ticket.status)}
          className={cn("shrink-0", getStatusColor(ticket.status))}
        >
          {getStatusLabel(ticket.status)}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {ticket.priority}
        </Badge>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {/* Initial ticket description as first message */}
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {ticket.created_by ? getInitials(ticket.created_by) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-medium text-sm">
                {ticket.created_by
                  ? getUserLabel(ticket.created_by) ||
                    t("support.unknown_user", "Unknown")
                  : t("support.ticket_author", "Ticket author")}
              </span>
              <span className="text-xs text-muted-foreground">
                {timeFormat(ticket.created_at, "lll")}
              </span>
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted/80 px-4 py-2.5 text-sm whitespace-pre-wrap w-fit">
              {ticket.description}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("support.detail.description_label", "Description")}
            </p>
          </div>
        </div>

        {/* Replies */}
        {visibleReplies.map((reply) => {
          const isMe = currentUser && reply.user_id === currentUser.id;
          return (
            <div
              key={reply.id}
              className={cn("flex gap-3", isMe && "justify-end")}
            >
              {!isMe && (
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback
                    className={cn(
                      "text-xs",
                      reply.is_internal
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                        : "bg-muted",
                    )}
                  >
                    {getInitials(reply.user)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "flex-1 min-w-0 max-w-[85%]",
                  isMe && "flex flex-col items-end",
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm w-fit",
                    reply.is_internal
                      ? "rounded-tl-sm bg-amber-500/15 border border-amber-500/30"
                      : isMe
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm bg-muted/80",
                  )}
                >
                  {reply.is_internal && (
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-medium mb-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      {t("support.internal_note", "Internal note")}
                    </div>
                  )}
                  <p
                    className={reply.is_internal ? "text-muted-foreground" : ""}
                  >
                    {reply.message}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-baseline gap-2 mb-1",
                    isMe && "flex-row-reverse",
                  )}
                >
                  <span className="text-[10px] mt-1 text-muted-foreground">
                    {timeFormat(reply.created_at, "lll")}
                  </span>
                </div>
              </div>
              {isMe && (
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {currentUser?.username?.slice(0, 2).toUpperCase() ?? "Me"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose area */}
      {!isClosed ? (
        <footer className="shrink-0 border-t bg-background p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Textarea
                placeholder={t(
                  "support.reply.placeholder",
                  "Type your reply...",
                )}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="min-h-[80px] resize-none rounded-2xl border-2 focus-visible:ring-2"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!canReply || isSubmitting}
                className="shrink-0 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="reply-internal"
                  checked={isInternal}
                  onCheckedChange={(v) => setIsInternal(!!v)}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="reply-internal"
                  className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {t(
                    "support.reply.internal_note",
                    "Internal note (visible only to staff)",
                  )}
                </label>
              </div>
            )}
          </form>
        </footer>
      ) : (
        <footer className="shrink-0 border-t bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground italic text-center">
            {t(
              "support.ticket_closed_no_reply",
              "This ticket is closed. You cannot add new replies.",
            )}
          </p>
        </footer>
      )}
    </div>
  );
}
