import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/store/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  useGetBlogPostBySlugQuery,
  useGetBlogCommentsQuery,
  useCreateBlogCommentMutation,
  useUpdateBlogCommentMutation,
  useDeleteBlogCommentMutation,
} from "@/store/api/blogApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Tag,
  Eye,
  Clock,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Send,
  Share2,
  BookOpen,
  Sparkles,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 50;

  // Use RTK Query hooks - get post by slug (views are auto-incremented via query param)
  const {
    data: postData,
    isLoading: loading,
    error: postError,
  } = useGetBlogPostBySlugQuery(slug || "", {
    skip: !slug,
  });

  const { data: commentsResponse, isLoading: commentsLoading } =
    useGetBlogCommentsQuery(
      {
        postId: postData?.id || 0,
        params: { skip, limit },
      },
      {
        skip: !postData?.id,
      },
    );

  const [createComment, { isLoading: isCreating }] =
    useCreateBlogCommentMutation();
  const [updateComment, { isLoading: isUpdating }] =
    useUpdateBlogCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] =
    useDeleteBlogCommentMutation();

  const commentsData = commentsResponse?.items || [];

  // Transform post data to match component expects (or use direct)
  const post = postData;

  // Navigate if post not found
  useEffect(() => {
    if (postError && "status" in postError && postError.status === 404) {
      navigate("/blog");
    }
  }, [postError, navigate]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: t("blog.comment_section.login_required"),
        description: "Please log in to comment",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!commentContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      await createComment({
        postId: postData!.id,
        data: { content: commentContent },
      }).unwrap();

      toast({
        title: t("blog.comment_section.success"),
        description: "Comment posted successfully",
      });

      setCommentContent("");
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      toast({
        title: t("blog.comment_section.error"),
        description: error.data?.detail || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment({
        postId: postData!.id,
        commentId,
        data: { content: editContent },
      }).unwrap();

      toast({
        title: "Success",
        description: "Comment updated",
      });
      setEditingComment(null);
      setEditContent("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.detail || "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment({
        postId: postData!.id,
        commentId,
      }).unwrap();

      toast({
        title: "Success",
        description: "Comment deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.detail || "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            {t("blog.loading")}
          </span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Post not found</p>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section with Featured Image */}
      {post.og_image && (
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
          <img
            src={post.og_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 backdrop-blur-sm">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {post.category.name}
                  </Badge>
                )}
                {post.is_featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight drop-shadow-lg">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed drop-shadow-md">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="mb-6 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("blog.back_to_blog") || "Back to Blog"}
        </Button>

        {/* Post Content */}
        <article className="space-y-8">
          {/* Header Section (if no featured image) */}
          {!post.og_image && (
            <div className="space-y-4 pb-6 border-b">
              <div className="flex flex-wrap items-center gap-3">
                {post.category && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {post.category.name}
                  </Badge>
                )}
                {post.is_featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          )}

          {/* Metadata Bar */}
          <Card className="border-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                <div className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    {post.author?.username ||
                      post.author?.username ||
                      post.author?.email ||
                      "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {calculateReadTime(post.content)} {t("blog.read_time")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>
                    {post.view_count || 0} {t("blog.views")}
                  </span>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags - Backend meta_keywords is string, we can split it */}
          {post.meta_keywords && (
            <div className="flex flex-wrap gap-2">
              {post.meta_keywords.split(",").map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:from-primary/20 hover:to-secondary/20 transition-all cursor-pointer"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Main Content */}
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6 md:p-10">
              <div
                className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                  prose-li:my-2 prose-li:text-foreground
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4
                  prose-hr:border-border prose-hr:my-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </article>

        {/* Comments Section */}
        <Card className="border-2 shadow-lg mt-8">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <span>{t("blog.comment_section.title")}</span>
              <Badge variant="secondary" className="ml-2">
                {commentsResponse?.pagination.total || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-8">
            {/* Add Comment Form */}
            {user ? (
              <div className="space-y-4 p-6 rounded-lg border-2 bg-gradient-to-br from-muted/50 to-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">Add a comment</span>
                </div>
                <Textarea
                  placeholder={t("blog.comment_section.comment_placeholder")}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={5}
                  className="resize-none border-2 focus:border-primary transition-colors"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={isCreating || !commentContent.trim()}
                  className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("blog.comment_section.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("blog.comment_section.submit")}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-6 border-2 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                <p className="text-base font-medium mb-2">
                  {t("blog.comment_section.login_required")}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Join the conversation by logging in
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Log In to Comment
                </Button>
              </div>
            )}

            <Separator className="my-8" />

            {/* Comments List */}
            {commentsData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {t("blog.comment_section.no_comments")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {commentsData.map((comment: BlogComment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-base">
                              {comment.user?.name ||
                                comment.user?.username ||
                                "Guest"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>

                          {user && user.id === comment.user_id && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setEditingComment(comment.id);
                                  setEditContent(comment.content);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {editingComment === comment.id ? (
                          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateComment(comment.id)}
                                disabled={isUpdating}
                              >
                                {isUpdating && (
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                )}
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingComment(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-base whitespace-pre-wrap leading-relaxed mb-3">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                    {comment.id !==
                      commentsData[commentsData.length - 1]?.id && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {commentsResponse?.pagination &&
              commentsResponse.pagination.total_pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!commentsResponse.pagination.has_previous}
                    onClick={() => setSkip(Math.max(0, skip - limit))}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-4 text-sm font-medium">
                    Page {commentsResponse.pagination.page + 1} of{" "}
                    {commentsResponse.pagination.total_pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!commentsResponse.pagination.has_next}
                    onClick={() => setSkip(skip + limit)}
                  >
                    Next
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
