import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { mockData, mockAuth } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Search,
  Loader2,
  Check,
  X,
  Trash2,
  ArrowLeft,
  Eye,
  AlertTriangle,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogComment {
  id: string;
  post_id: string;
  user_id: string | null;
  parent_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  is_approved: boolean;
  is_spam: boolean;
  created_at: string;
  post?: {
    title: string;
    slug: string;
  };
}

export default function BlogCommentManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<BlogComment | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("blog_comments")
        .select(
          `
          *,
          post:blog_posts(title, slug)
        `
        )
        .order("created_at", { ascending: false });

      if (filterStatus === "approved") {
        query = query.eq("is_approved", true).eq("is_spam", false);
      } else if (filterStatus === "pending") {
        query = query.eq("is_approved", false).eq("is_spam", false);
      } else if (filterStatus === "spam") {
        query = query.eq("is_spam", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      toast({
        title: t("admin.blog.comments.errors.fetch_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (comment: BlogComment) => {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("blog_comments")
        .update({ is_approved: true, is_spam: false })
        .eq("id", comment.id);

      if (error) throw error;

      toast({
        title: t("admin.blog.comments.messages.approve_success"),
        description: t("admin.blog.comments.messages.approve_success_desc"),
      });

      fetchData();
    } catch (error: any) {
      console.error("Error approving comment:", error);
      toast({
        title: t("admin.blog.comments.errors.approve_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (comment: BlogComment) => {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("blog_comments")
        .update({ is_approved: false })
        .eq("id", comment.id);

      if (error) throw error;

      toast({
        title: t("admin.blog.comments.messages.reject_success"),
        description: t("admin.blog.comments.messages.reject_success_desc"),
      });

      fetchData();
    } catch (error: any) {
      console.error("Error rejecting comment:", error);
      toast({
        title: t("admin.blog.comments.errors.reject_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkSpam = async (comment: BlogComment) => {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("blog_comments")
        .update({ is_spam: true, is_approved: false })
        .eq("id", comment.id);

      if (error) throw error;

      toast({
        title: t("admin.blog.comments.messages.spam_success"),
        description: t("admin.blog.comments.messages.spam_success_desc"),
      });

      fetchData();
    } catch (error: any) {
      console.error("Error marking comment as spam:", error);
      toast({
        title: t("admin.blog.comments.errors.spam_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentToDelete.id);

      if (error) throw error;

      toast({
        title: t("admin.blog.comments.messages.delete_success"),
        description: t("admin.blog.comments.messages.delete_success_desc"),
      });

      setShowDeleteDialog(false);
      setCommentToDelete(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast({
        title: t("admin.blog.comments.errors.delete_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredComments = comments.filter(
    (comment) =>
      comment.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.post?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/blog-manager")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              {t("admin.blog.comments.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("admin.blog.comments.description")}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("admin.blog.comments.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("admin.blog.comments.filter.all")}
                  </SelectItem>
                  <SelectItem value="approved">
                    {t("admin.blog.comments.filter.approved")}
                  </SelectItem>
                  <SelectItem value="pending">
                    {t("admin.blog.comments.filter.pending")}
                  </SelectItem>
                  <SelectItem value="spam">
                    {t("admin.blog.comments.filter.spam")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? t("admin.blog.comments.no_results")
                  : t("admin.blog.comments.no_comments")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t("admin.blog.comments.table.author")}
                    </TableHead>
                    <TableHead>{t("admin.blog.comments.table.post")}</TableHead>
                    <TableHead>
                      {t("admin.blog.comments.table.comment")}
                    </TableHead>
                    <TableHead>{t("common.status.status")}</TableHead>
                    <TableHead>{t("admin.blog.comments.table.date")}</TableHead>
                    <TableHead>
                      {t("admin.blog.comments.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {comment.author_name}
                          </div>
                          {comment.author_email && (
                            <div className="text-sm text-muted-foreground">
                              {comment.author_email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {comment.post ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() =>
                              navigate(`/blog/${comment.post?.slug}`)
                            }
                          >
                            {comment.post.title}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">
                          {comment.content}
                        </p>
                        {comment.parent_id && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {t("admin.blog.comments.reply")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {comment.is_spam ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {t("admin.blog.comments.spam")}
                          </Badge>
                        ) : comment.is_approved ? (
                          <Badge className="bg-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            {t("admin.blog.comments.approved")}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {t("admin.blog.comments.pending")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!comment.is_approved && !comment.is_spam && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(comment)}
                              disabled={actionLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {comment.is_approved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(comment)}
                              disabled={actionLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {!comment.is_spam && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkSpam(comment)}
                              disabled={actionLoading}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCommentToDelete(comment);
                              setShowDeleteDialog(true);
                            }}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.blog.comments.delete_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.blog.comments.delete_dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
