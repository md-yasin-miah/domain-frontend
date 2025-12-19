import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mockData, mockAuth } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  TrendingUp,
  Loader2, 
  ArrowLeft,
  Save,
  Eye
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
}

interface SEOSettings {
  id?: string;
  post_id: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  robots_meta: string;
  schema_markup: string;
}

export default function BlogSEOManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showSEODialog, setShowSEODialog] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    post_id: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    robots_meta: '',
    schema_markup: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, meta_title, meta_description')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: t('admin.blog.seo.errors.fetch_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSEO = async (post: BlogPost) => {
    setSelectedPost(post);
    setSeoSettings({
      post_id: post.id,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_card: 'summary_large_image',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      canonical_url: '',
      robots_meta: '',
      schema_markup: '',
    });

    try {
      setSeoLoading(true);
      const { data, error } = await supabase
        .from('blog_seo_settings')
        .select('*')
        .eq('post_id', post.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSeoSettings({
          post_id: data.post_id,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: Array.isArray(data.meta_keywords) ? data.meta_keywords.join(', ') : '',
          og_title: data.og_title || '',
          og_description: data.og_description || '',
          og_image: data.og_image || '',
          twitter_card: data.twitter_card || 'summary_large_image',
          twitter_title: data.twitter_title || '',
          twitter_description: data.twitter_description || '',
          twitter_image: data.twitter_image || '',
          canonical_url: data.canonical_url || '',
          robots_meta: data.robots_meta || '',
          schema_markup: data.schema_markup ? JSON.stringify(data.schema_markup, null, 2) : '',
        });
      } else {
        // Use post's basic meta if no SEO settings exist
        setSeoSettings({
          ...seoSettings,
          post_id: post.id,
          meta_title: post.meta_title || post.title,
          og_title: post.meta_title || post.title,
          twitter_title: post.meta_title || post.title,
          meta_description: post.meta_description || '',
          og_description: post.meta_description || '',
          twitter_description: post.meta_description || '',
        });
      }

      setShowSEODialog(true);
    } catch (error: any) {
      console.error('Error fetching SEO settings:', error);
      toast({
        title: t('admin.blog.seo.errors.fetch_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSeoLoading(false);
    }
  };

  const handleSaveSEO = async () => {
    if (!selectedPost) return;

    try {
      setSaving(true);

      const payload = {
        post_id: selectedPost.id,
        meta_title: seoSettings.meta_title || null,
        meta_description: seoSettings.meta_description || null,
        meta_keywords: seoSettings.meta_keywords ? seoSettings.meta_keywords.split(',').map(k => k.trim()) : [],
        og_title: seoSettings.og_title || null,
        og_description: seoSettings.og_description || null,
        og_image: seoSettings.og_image || null,
        twitter_card: seoSettings.twitter_card || 'summary_large_image',
        twitter_title: seoSettings.twitter_title || null,
        twitter_description: seoSettings.twitter_description || null,
        twitter_image: seoSettings.twitter_image || null,
        canonical_url: seoSettings.canonical_url || null,
        robots_meta: seoSettings.robots_meta || null,
        schema_markup: seoSettings.schema_markup ? JSON.parse(seoSettings.schema_markup) : null,
      };

      const { data: existing } = await supabase
        .from('blog_seo_settings')
        .select('id')
        .eq('post_id', selectedPost.id)
        .single();

      let error;
      if (existing) {
        const { error: updateError } = await supabase
          .from('blog_seo_settings')
          .update(payload)
          .eq('post_id', selectedPost.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blog_seo_settings')
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: t('admin.blog.seo.messages.save_success'),
        description: t('admin.blog.seo.messages.save_success_desc'),
      });

      setShowSEODialog(false);
      fetchPosts();
    } catch (error: any) {
      console.error('Error saving SEO settings:', error);
      toast({
        title: t('admin.blog.seo.errors.save_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/blog-manager')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              {t('admin.blog.seo.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('admin.blog.seo.description')}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('admin.blog.seo.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? t('admin.blog.seo.no_results') : t('admin.blog.seo.no_posts')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.blog.seo.table.post')}</TableHead>
                    <TableHead>{t('admin.blog.seo.table.meta_title')}</TableHead>
                    <TableHead>{t('admin.blog.seo.table.status')}</TableHead>
                    <TableHead>{t('admin.blog.seo.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => {
                    const hasSEOSettings = post.meta_title || post.meta_description;
                    return (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="text-sm line-clamp-1">
                              {post.meta_title || post.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {hasSEOSettings ? (
                            <Badge className="bg-green-500">
                              {t('admin.blog.seo.configured')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              {t('admin.blog.seo.not_configured')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSEO(post)}
                            disabled={seoLoading}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t('admin.blog.seo.edit')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings Dialog */}
      <Dialog open={showSEODialog} onOpenChange={setShowSEODialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.blog.seo.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.blog.seo.dialog.description')} {selectedPost?.title}
            </DialogDescription>
          </DialogHeader>
          {seoLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">{t('admin.blog.seo.form.basic_meta')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.meta_title')}</Label>
                    <Input
                      value={seoSettings.meta_title}
                      onChange={(e) => setSeoSettings({ ...seoSettings, meta_title: e.target.value })}
                      placeholder={t('admin.blog.seo.form.meta_title_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.meta_keywords')}</Label>
                    <Input
                      value={seoSettings.meta_keywords}
                      onChange={(e) => setSeoSettings({ ...seoSettings, meta_keywords: e.target.value })}
                      placeholder={t('admin.blog.seo.form.meta_keywords_placeholder')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.blog.seo.form.meta_description')}</Label>
                  <Textarea
                    value={seoSettings.meta_description}
                    onChange={(e) => setSeoSettings({ ...seoSettings, meta_description: e.target.value })}
                    placeholder={t('admin.blog.seo.form.meta_description_placeholder')}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{t('admin.blog.seo.form.open_graph')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.og_title')}</Label>
                    <Input
                      value={seoSettings.og_title}
                      onChange={(e) => setSeoSettings({ ...seoSettings, og_title: e.target.value })}
                      placeholder={t('admin.blog.seo.form.og_title_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.og_image')}</Label>
                    <Input
                      value={seoSettings.og_image}
                      onChange={(e) => setSeoSettings({ ...seoSettings, og_image: e.target.value })}
                      placeholder={t('admin.blog.seo.form.og_image_placeholder')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.blog.seo.form.og_description')}</Label>
                  <Textarea
                    value={seoSettings.og_description}
                    onChange={(e) => setSeoSettings({ ...seoSettings, og_description: e.target.value })}
                    placeholder={t('admin.blog.seo.form.og_description_placeholder')}
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{t('admin.blog.seo.form.twitter')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.twitter_card')}</Label>
                    <Select
                      value={seoSettings.twitter_card}
                      onValueChange={(value) => setSeoSettings({ ...seoSettings, twitter_card: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">{t('admin.blog.seo.form.twitter_card_summary')}</SelectItem>
                        <SelectItem value="summary_large_image">{t('admin.blog.seo.form.twitter_card_large')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.twitter_image')}</Label>
                    <Input
                      value={seoSettings.twitter_image}
                      onChange={(e) => setSeoSettings({ ...seoSettings, twitter_image: e.target.value })}
                      placeholder={t('admin.blog.seo.form.twitter_image_placeholder')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.twitter_title')}</Label>
                    <Input
                      value={seoSettings.twitter_title}
                      onChange={(e) => setSeoSettings({ ...seoSettings, twitter_title: e.target.value })}
                      placeholder={t('admin.blog.seo.form.twitter_title_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.blog.seo.form.twitter_description')}</Label>
                    <Input
                      value={seoSettings.twitter_description}
                      onChange={(e) => setSeoSettings({ ...seoSettings, twitter_description: e.target.value })}
                      placeholder={t('admin.blog.seo.form.twitter_description_placeholder')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{t('admin.blog.seo.form.advanced')}</h3>
                <div className="space-y-2">
                  <Label>{t('admin.blog.seo.form.canonical_url')}</Label>
                  <Input
                    value={seoSettings.canonical_url}
                    onChange={(e) => setSeoSettings({ ...seoSettings, canonical_url: e.target.value })}
                    placeholder={t('admin.blog.seo.form.canonical_url_placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.blog.seo.form.robots_meta')}</Label>
                  <Input
                    value={seoSettings.robots_meta}
                    onChange={(e) => setSeoSettings({ ...seoSettings, robots_meta: e.target.value })}
                    placeholder={t('admin.blog.seo.form.robots_meta_placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.blog.seo.form.schema_markup')}</Label>
                  <Textarea
                    value={seoSettings.schema_markup}
                    onChange={(e) => setSeoSettings({ ...seoSettings, schema_markup: e.target.value })}
                    placeholder={t('admin.blog.seo.form.schema_markup_placeholder')}
                    rows={5}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSEODialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveSEO} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('common.save')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

