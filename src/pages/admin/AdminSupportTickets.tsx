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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, Eye, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStatusColor, timeFormat } from "@/lib/helperFun";
import {
  useGetTicketsQuery,
  useUpdateTicketMutation,
} from "@/store/api/supportApi";
import { useGetSupportCategoriesQuery } from "@/store/api/categoryApi";
import { useGetUsersQuery } from "@/store/api/userApi";
import SupportTicketDetailsModal from "@/pages/component/SupportTicketDetailsModal";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "all", labelKey: "common.all" },
  { value: "open", labelKey: "common.status.open" },
  { value: "in_progress", labelKey: "common.status.in_progress" },
  { value: "resolved", labelKey: "common.status.resolved" },
  { value: "closed", labelKey: "common.status.closed" },
] as const;

export default function AdminSupportTickets() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTicketForDetail, setSelectedTicketForDetail] =
    useState<SupportTicket | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [updateAssignedToId, setUpdateAssignedToId] = useState<string>("");

  const filters = {
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(categoryFilter !== "all" && { category_id: Number(categoryFilter) }),
  };

  const { data: ticketsData, isLoading: isLoadingTickets } =
    useGetTicketsQuery(filters);
  const { data: categoriesData } = useGetSupportCategoriesQuery({
    is_active: true,
  });
  const { data: usersData } = useGetUsersQuery({ skip: 0, limit: 200 });
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();

  const tickets = ticketsData?.items ?? [];
  const total = ticketsData?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as { items?: Category[] } | undefined)?.items ?? [];
  const users = usersData?.items ?? [];

  const openDetail = (ticket: SupportTicket) => {
    setSelectedTicketForDetail(ticket);
    setDetailModalOpen(true);
  };

  const openUpdateDialog = (ticket: SupportTicket) => {
    setSelectedTicketId(ticket.id);
    setUpdateDialogOpen(true);
    setUpdateStatus(ticket.status);
    setUpdateAssignedToId(ticket.assigned_to_id?.toString() ?? "unassigned");
  };

  const handleUpdate = async () => {
    if (!selectedTicketId) return;
    const data: TicketUpdateRequest = {
      status: updateStatus as SupportTicket["status"],
      assigned_to_id:
        updateAssignedToId === "unassigned" || updateAssignedToId === ""
          ? null
          : Number(updateAssignedToId),
    };
    try {
      await updateTicket({ id: selectedTicketId, data }).unwrap();
      toast({
        title: t("common.success"),
        description: t("admin.support.ticket_updated"),
      });
      setUpdateDialogOpen(false);
      setSelectedTicketId(null);
    } catch (e: unknown) {
      const msg =
        e &&
        typeof e === "object" &&
        "data" in e &&
        e.data &&
        typeof e.data === "object" &&
        "detail" in e.data
          ? String((e.data as { detail: unknown }).detail)
          : t("common.error");
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: msg,
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-7 w-7" />
          {t("admin.support.title", "Support Tickets")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t(
            "admin.support.description",
            "View and manage all support tickets.",
          )}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.support.tickets_list", "Tickets")}</CardTitle>
            <CardDescription>
              {t(
                "admin.support.tickets_list_desc",
                "Filter and manage tickets.",
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue
                  placeholder={t("common.status.status", "Status")}
                />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("support.form.category_label", "Category")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {categories.map((cat: Category) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTickets ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("admin.support.no_tickets", "No tickets found.")}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>{t("common.title", "Title")}</TableHead>
                    <TableHead>{t("common.status.status", "Status")}</TableHead>
                    <TableHead>{t("support.detail.category")}</TableHead>
                    <TableHead>{t("support.detail.created")} By</TableHead>
                    <TableHead>{t("support.detail.assigned_to")}</TableHead>
                    <TableHead>{t("support.detail.created")}</TableHead>
                    <TableHead className="w-[120px]">
                      {t("common.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-muted-foreground">
                        #{ticket.id}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {ticket.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(ticket.status)}
                        >
                          {t(`common.status.${ticket.status}`) || ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.category?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.created_by?.username ??
                          ticket.created_by?.email ??
                          "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.assigned_to?.username ??
                          ticket.assigned_to?.email ??
                          "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {timeFormat(ticket.created_at, "ll")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetail(ticket)}
                            title={t("support.tickets.view_details")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openUpdateDialog(ticket)}
                            title={t(
                              "admin.support.assign_or_status",
                              "Update status / Assign",
                            )}
                          >
                            <UserPlus className="h-4 w-4" />
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
                    {t("common.pagination.showing", "Showing")}{" "}
                    {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, total)} {t("common.of", "of")}{" "}
                    {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      {t("common.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {t("common.next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <SupportTicketDetailsModal
        ticket={selectedTicketForDetail}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("admin.support.update_ticket", "Update Ticket")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "admin.support.update_ticket_desc",
                "Change status or assign to a user.",
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("common.status.status")}</Label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.filter((o) => o.value !== "all").map(
                    (opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("support.detail.assigned_to")}</Label>
              <Select
                value={updateAssignedToId}
                onValueChange={setUpdateAssignedToId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("admin.support.select_user", "Select user")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">
                    {t("admin.support.unassigned", "Unassigned")}
                  </SelectItem>
                  {users.map((u: UserResponse) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.username ?? u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
