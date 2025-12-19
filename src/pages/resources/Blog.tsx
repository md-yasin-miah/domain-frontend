import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight, Tag, TrendingUp, Eye, BookOpen, Filter, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useGetBlogPostsQuery } from "@/store/api/blogApi";
import { useGetBlogCategoriesQuery } from "@/store/api/categoryApi";
import type { BlogPost as ApiBlogPost } from "@/store/api/types";
import type { Category } from "@/store/api/categoryApi";
import { Loader2 } from "lucide-react";

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
  description: string | null;
}

const Blog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: postsData, isLoading: postsLoading } = useGetBlogPostsQuery({});
  const { data: categoriesData, isLoading: categoriesLoading } = useGetBlogCategoriesQuery({});

  const loading = postsLoading || categoriesLoading;

  // Handle paginated response or array response
  const postsArray = Array.isArray(postsData)
    ? postsData
    : (postsData?.items || []);

  const posts: BlogPost[] = postsArray.map((post: ApiBlogPost) => ({
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || null,
    content: post.content,
    featured_image: post.featured_image || null,
    category_id: null, // Will be set from category relationship if available
    category: undefined, // Will be populated from category relationship if available
    tags: [], // Tags not in API response
    author_id: String(post.author_id),
    author: {
      email: undefined,
      profile: { full_name: 'Admin User' },
    },
    is_published: post.status === 'published',
    is_featured: false, // Not in API response
    published_at: post.published_at || post.created_at,
    view_count: post.view_count || 0,
    created_at: post.created_at,
  }));

  // Handle paginated response or array response for categories
  const categoriesArray = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData?.items || []);

  const categories: BlogCategory[] = categoriesArray.map((cat: Category) => ({
    id: String(cat.id),
    name: cat.name,
    slug: cat.slug,
    description: cat.description || null,
  }));

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "uncategorized" && !post.category_id) ||
      post.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.is_featured);
  const regularPosts = filteredPosts.filter(post => !post.is_featured);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-8 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed mb-8">
            {t('blog.subtitle')}
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('blog.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
              <Filter className="w-4 h-4 mr-2" />
              {t('common.filter')}
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12 px-6 border-b border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all"
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "border-primary/20 hover:bg-primary/5"
                }
              >
                {t('blog.category_all')}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "border-primary/20 hover:bg-primary/5"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{t('blog.loading')}</span>
        </div>
      ) : featuredPosts.length > 0 ? (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              {t('blog.featured')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.slice(0, 3).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/blog/${post.slug}`)}>
                  {post.featured_image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    {post.category && (
                      <Badge variant="outline" className="mb-2 w-fit">
                        {post.category.name}
                      </Badge>
                    )}
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author?.profile?.full_name || post.author?.email || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {calculateReadTime(post.content)} {t('blog.read_time')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.view_count || 0} {t('blog.views')}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t('blog.read_more')} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Recent Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t('blog.recent')}</h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? t('blog.no_results') : t('blog.no_posts')}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/blog/${post.slug}`)}>
                  {post.featured_image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    {post.category && (
                      <Badge variant="outline" className="mb-2 w-fit">
                        {post.category.name}
                      </Badge>
                    )}
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author?.profile?.full_name || post.author?.email || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {calculateReadTime(post.content)} {t('blog.read_time')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.view_count || 0} {t('blog.views')}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t('blog.read_more')} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
