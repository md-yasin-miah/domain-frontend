import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { mockData, mockAuth } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { 
  FileText, 
  Loader2, 
  ArrowLeft,
  Save,
  Eye
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  tags: string;
  is_published: boolean;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
}

export default function BlogPostCreateEdit() {
  const { id } = useParams<{ id?: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    tags: '',
    is_published: false,
    is_featured: false,
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing && id) {
      fetchPost(id);
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          featured_image: data.featured_image || '',
          category_id: data.category_id || '',
          tags: data.tags ? data.tags.join(', ') : '',
          is_published: data.is_published,
          is_featured: data.is_featured,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching post:', error);
      toast({
        title: t('admin.blog.errors.fetch_error'),
        description: error.message,
        variant: 'destructive',
      });
      navigate('/admin/blog-manager');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    const newSlug = generateSlug(title);
    setFormData({
      ...formData,
      title,
      // Always auto-generate slug from title (user can manually edit if needed)
      slug: newSlug,
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: t('admin.blog.errors.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || null,
        content: formData.content,
        featured_image: formData.featured_image || null,
        category_id: formData.category_id || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      const functionName = isEditing ? 'update-blog-post' : 'create-blog-post';
      const body = isEditing ? { id, ...payload } : payload;

      const { data, error } = await supabase.functions.invoke(functionName, {
        body,
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || t(`admin.blog.errors.${isEditing ? 'update' : 'create'}_error`));
      }

      toast({
        title: t(`admin.blog.messages.${isEditing ? 'update' : 'create'}_success`),
        description: t(`admin.blog.messages.${isEditing ? 'update' : 'create'}_success_desc`),
      });

      navigate('/admin/blog-manager');
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} blog post:`, error);
      toast({
        title: t(`admin.blog.errors.${isEditing ? 'update' : 'create'}_error`),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

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
              <FileText className="h-6 w-6" />
              {isEditing ? t('admin.blog.edit_post') : t('admin.blog.create_post')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? t('admin.blog.edit_post_desc') : t('admin.blog.create_post_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && formData.is_published && (
            <Button variant="outline" asChild>
              <Link to={`/blog/${formData.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                {t('admin.blog.view_post')}
              </Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.blog.form.basic_info')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('admin.blog.form.title')} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t('admin.blog.form.title_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t('admin.blog.form.slug')}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={t('admin.blog.form.slug_placeholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('admin.blog.form.slug_auto_generated') || 'Slug is automatically generated from the title. You can edit it manually if needed.'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">{t('admin.blog.form.excerpt')}</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder={t('admin.blog.form.excerpt_placeholder')}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">{t('admin.blog.form.content')} *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder={t('admin.blog.form.content_placeholder')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.blog.form.media')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="featured_image">{t('admin.blog.form.featured_image')}</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder={t('admin.blog.form.featured_image_placeholder')}
                />
                {formData.featured_image && (
                  <div className="mt-4">
                    <img 
                      src={formData.featured_image} 
                      alt="Featured" 
                      className="max-w-full h-auto rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.blog.form.publish_settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">{t('admin.blog.form.is_published')}</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">{t('admin.blog.form.is_featured')}</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.blog.form.categorization')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">{t('admin.blog.form.category')}</Label>
                <Select
                  value={formData.category_id || undefined}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.blog.form.select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('admin.blog.form.no_category')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">{t('admin.blog.form.tags')}</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder={t('admin.blog.form.tags_placeholder')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.blog.form.seo_basic')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">{t('admin.blog.form.meta_title')}</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder={t('admin.blog.form.meta_title_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">{t('admin.blog.form.meta_description')}</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder={t('admin.blog.form.meta_description_placeholder')}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

