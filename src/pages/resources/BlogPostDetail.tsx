import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useGetBlogPostBySlugQuery, useGetBlogCommentsQuery } from '@/store/api/blogApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Sparkles
} from 'lucide-react';

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
  replies?: BlogComment[];
}

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Use RTK Query hooks - get post by slug (views are auto-incremented via query param)
  const { data: postData, isLoading: loading, error: postError } = useGetBlogPostBySlugQuery(slug || '', {
    skip: !slug,
  });
  const { data: commentsData = [], isLoading: commentsLoading } = useGetBlogCommentsQuery(postData?.id || 0, {
    skip: !postData?.id,
  });

  // Transform post data to match component interface
  const post: BlogPost | null = postData ? {
    id: String(postData.id),
    title: postData.title,
    slug: postData.slug,
    excerpt: postData.excerpt || null,
    content: postData.content,
    featured_image: postData.og_image || null,
    category_id: postData.category_id ? String(postData.category_id) : null,
    category: postData.category ? {
      id: String(postData.category.id),
      name: postData.category.name,
      slug: postData.category.slug,
    } : undefined,
    tags: [], // Backend doesn't have tags field
    author_id: String(postData.author_id),
    author: postData.author ? {
      email: postData.author.email,
      profile: {
        full_name: postData.author.username, // Use username as fallback
      },
    } : undefined,
    is_published: postData.status === 'published',
    is_featured: postData.is_featured || false,
    published_at: postData.published_at || postData.created_at,
    view_count: postData.view_count || 0,
    created_at: postData.created_at,
  } : null;

  // Transform comments data
  const comments: BlogComment[] = Array.isArray(commentsData) ? commentsData.map(comment => ({
    id: String(comment.id),
    post_id: postData?.id ? String(postData.id) : '',
    user_id: comment.user_id ? String(comment.user_id) : null,
    parent_id: comment.parent_id ? String(comment.parent_id) : null,
    author_name: comment.author_name,
    author_email: comment.author_email,
    content: comment.content,
    is_approved: comment.is_approved,
    is_spam: comment.is_spam,
    created_at: comment.created_at,
    replies: comment.replies || [],
  })) : [];

  // Navigate if post not found
  useEffect(() => {
    if (postError && 'status' in postError && postError.status === 404) {
      navigate('/blog');
    }
  }, [postError, navigate]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: t('blog.comment_section.login_required'),
        description: 'Please log in to comment',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!commentContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCommentLoading(true);
      // TODO: Implement comment creation mutation when API is ready
      // For now, just show success message
      toast({
        title: t('blog.comment_section.success'),
        description: t('blog.comment_section.pending_approval'),
      });

      setCommentContent('');
    } catch (error: unknown) {
      console.error('Error submitting comment:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: t('blog.comment_section.error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      toast({
        title: t('blog.comment_section.login_required'),
        description: 'Please log in to reply',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!replyContent.trim()) {
      return;
    }

    try {
      setCommentLoading(true);
      // TODO: Implement reply creation mutation when API is ready
      // For now, just show success message
      toast({
        title: t('blog.comment_section.success'),
        description: t('blog.comment_section.pending_approval'),
      });

      setReplyContent('');
      setReplyingTo(null);
    } catch (error: unknown) {
      console.error('Error submitting reply:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: t('blog.comment_section.error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{t('blog.loading')}</span>
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
            <Button onClick={() => navigate('/blog')}>
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
      {post.featured_image && (
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
          <img
            src={post.featured_image}
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
          onClick={() => navigate('/blog')}
          className="mb-6 hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('blog.back_to_blog') || 'Back to Blog'}
        </Button>

        {/* Post Content */}
        <article className="space-y-8">
          {/* Header Section (if no featured image) */}
          {!post.featured_image && (
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
                  <span className="font-medium">{post.author?.profile?.full_name || post.author?.email || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{calculateReadTime(post.content)} {t('blog.read_time')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count || 0} {t('blog.views')}</span>
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

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:from-primary/20 hover:to-secondary/20 transition-all cursor-pointer"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
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
              <span>{t('blog.comment_section.title')}</span>
              <Badge variant="secondary" className="ml-2">
                {comments.length}
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
                  placeholder={t('blog.comment_section.comment_placeholder')}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={5}
                  className="resize-none border-2 focus:border-primary transition-colors"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={commentLoading || !commentContent.trim()}
                  className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {commentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('blog.comment_section.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('blog.comment_section.submit')}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-6 border-2 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                <p className="text-base font-medium mb-2">
                  {t('blog.comment_section.login_required')}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Join the conversation by logging in
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Log In to Comment
                </Button>
              </div>
            )}

            <Separator className="my-8" />

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {t('blog.comment_section.no_comments')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-semibold text-base">{comment.author_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-base whitespace-pre-wrap leading-relaxed mb-3">{comment.content}</p>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 hover:bg-primary/10"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {t('blog.comment_section.reply')}
                          </Button>
                        )}

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 ml-4 p-4 rounded-lg border-2 bg-muted/30 space-y-3">
                            <Textarea
                              placeholder={t('blog.comment_section.comment_placeholder')}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={3}
                              className="resize-none border-2 focus:border-primary transition-colors"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={commentLoading || !replyContent.trim()}
                                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                              >
                                {t('blog.comment_section.submit')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                              >
                                {t('common.cancel')}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-6 ml-4 space-y-4 border-l-4 border-primary/20 pl-6">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors flex-shrink-0">
                                  <User className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-medium text-sm">{reply.author_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {comment.id !== comments[comments.length - 1]?.id && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

