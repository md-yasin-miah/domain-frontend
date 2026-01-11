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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  author_id: string;
  author?: {
    email: string;
    profile?: {
      full_name: string;
    };
  };
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function BlogManager() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:blog_categories(id, name, slug)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch author profiles separately
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from("client_profiles")
            .select("full_name, email")
            .eq("user_id", post.author_id)
            .single();

          return {
            ...post,
            author: {
              email: profile?.email || undefined,
              profile: profile ? { full_name: profile.full_name } : undefined,
            },
          };
        })
      );

      setPosts(postsWithAuthors);
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      toast({
        title: t("admin.blog.errors.fetch_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      setFormLoading(true);

      const { data, error } = await supabase.functions.invoke(
        "delete-blog-post",
        {
          body: {
            id: postToDelete.id,
          },
        }
      );

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || t("admin.blog.errors.delete_error"));
      }

      toast({
        title: t("admin.blog.messages.delete_success"),
        description: t("admin.blog.messages.delete_success_desc"),
      });

      setShowDeleteDialog(false);
      setPostToDelete(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      toast({
        title: t("admin.blog.errors.delete_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
              <Link to="/admin/blog-manager/create">
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

            {loading ? (
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
                          {post.author?.profile?.full_name ||
                            post.author?.email ||
                            "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {post.is_published ? (
                            <Badge className="bg-green-500">
                              <Check className="h-3 w-3 mr-1" />
                              {t("admin.blog.published")}
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
                      <TableCell>{post.view_count || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {post.is_published && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/blog-manager/edit/${post.id}`}>
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

      {/* Delete Dialog */}
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
              disabled={formLoading}
            >
              {formLoading ? (
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
