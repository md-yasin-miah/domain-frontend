import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  FileText,
  Search,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  XCircle,
  FolderTree,
  MessageSquare,
  TrendingUp,
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
import { Link } from "react-router-dom";
import {
  useGetBlogPostsQuery,
  useDeleteBlogPostMutation,
} from "@/store/api/blogApi";

export default function BlogManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const { data, isLoading, error, refetch } = useGetBlogPostsQuery({
    skip: 0,
    limit: 100,
  });
  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

  const posts: BlogPost[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : (data as { items: BlogPost[] }).items;
  }, [data]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      ),
    [posts, searchTerm]
  );

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete.id).unwrap();
      toast({
        title: t("admin.blog.messages.delete_success"),
        description: t("admin.blog.messages.delete_success_desc"),
      });
      setShowDeleteDialog(false);
      setPostToDelete(null);
      refetch();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { detail?: string } }).data?.detail ?? (err as unknown as Error).message)
          : String(err);
      toast({
        title: t("admin.blog.errors.delete_error"),
        description: message,
        variant: "destructive",
      });
    }
  };

  const errorMessage =
    error && typeof error === "object" && "data" in error
      ? String((error as { data?: { detail?: string } }).data?.detail ?? (error as unknown as Error).message)
      : error ? String(error) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("admin.blog.title")}
              </CardTitle>
              <CardDescription>{t("admin.blog.description")}</CardDescription>
            </div>
            <Button asChild>
              <Link to="/admin/blog-manager/all-posts/create">
                <Plus className="h-4 w-4 mr-2" />
                {t("admin.blog.create_post")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button variant="outline" asChild className="h-auto p-4">
                <Link to="/admin/blog-manager/categories">
                  <FolderTree className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {t("admin.blog.categories.title")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("admin.blog.categories.manage")}
                    </div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4">
                <Link to="/admin/blog-manager/comments">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {t("admin.blog.comments.title")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("admin.blog.comments.manage")}
                    </div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4">
                <Link to="/admin/blog-manager/seo">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {t("admin.blog.seo.title")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("admin.blog.seo.manage")}
                    </div>
                  </div>
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("admin.blog.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {errorMessage ? (
              <div className="text-center py-8 text-destructive">
                {t("admin.blog.errors.fetch_error")}: {errorMessage}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? t("admin.blog.no_results")
                  : t("admin.blog.no_posts")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.blog.table.title")}</TableHead>
                    <TableHead>{t("admin.blog.table.category")}</TableHead>
                    <TableHead>{t("admin.blog.table.author")}</TableHead>
                    <TableHead>{t("common.status.status")}</TableHead>
                    <TableHead>{t("admin.blog.table.views")}</TableHead>
                    <TableHead>{t("admin.blog.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-md">
                        <div className="font-medium">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {post.excerpt}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {post.category ? (
                          <Badge variant="outline">{post.category.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {post.author?.username ||
                            post.author?.email ||
                            "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {post.status === "published" ? (
                            <Badge className="bg-green-500">
                              <Check className="h-3 w-3 mr-1" />
                              {t("admin.blog.published")}
                            </Badge>
                          ) : post.status === "archived" ? (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              {t("admin.blog.archived")}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              {t("admin.blog.unpublished")}
                            </Badge>
                          )}
                          {post.is_featured && (
                            <Badge variant="outline" className="text-xs">
                              {t("admin.blog.featured")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{post.view_count ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {post.status === "published" && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/blog-manager/all-posts/edit/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPostToDelete(post);
                              setShowDeleteDialog(true);
                            }}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.blog.delete_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.blog.delete_dialog.description")}
              {postToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{postToDelete.title}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
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
