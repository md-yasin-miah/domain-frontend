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
  FolderTree, 
  Search, 
  Loader2, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

export default function BlogCategories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<BlogCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: t('admin.blog.categories.errors.fetch_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
    setEditingCategory(null);
  };

  const handleCreate = async () => {
    if (!formData.name) {
      toast({
        title: t('admin.blog.categories.errors.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setFormLoading(true);

      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('admin.blog.categories.messages.create_success'),
        description: t('admin.blog.categories.messages.create_success_desc'),
      });

      setShowCreateDialog(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: t('admin.blog.categories.errors.create_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name) {
      toast({
        title: t('admin.blog.categories.errors.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setFormLoading(true);

      const { data, error } = await supabase
        .from('blog_categories')
        .update({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description || null,
        })
        .eq('id', editingCategory.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('admin.blog.categories.messages.update_success'),
        description: t('admin.blog.categories.messages.update_success_desc'),
      });

      setShowEditDialog(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: t('admin.blog.categories.errors.update_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setFormLoading(true);

      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', categoryToDelete.id);

      if (error) throw error;

      toast({
        title: t('admin.blog.categories.messages.delete_success'),
        description: t('admin.blog.categories.messages.delete_success_desc'),
      });

      setShowDeleteDialog(false);
      setCategoryToDelete(null);
      fetchData();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: t('admin.blog.categories.errors.delete_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <FolderTree className="h-6 w-6" />
              {t('admin.blog.categories.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('admin.blog.categories.description')}
            </p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.blog.categories.create_category')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.blog.categories.create_dialog.title')}</DialogTitle>
              <DialogDescription>
                {t('admin.blog.categories.create_dialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('admin.blog.categories.form.name')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t('admin.blog.categories.form.name_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t('admin.blog.categories.form.slug')}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={t('admin.blog.categories.form.slug_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('admin.blog.categories.form.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('admin.blog.categories.form.description_placeholder')}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreate} disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('admin.blog.categories.create_dialog.create')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('admin.blog.categories.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? t('admin.blog.categories.no_results') : t('admin.blog.categories.no_categories')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.blog.categories.table.name')}</TableHead>
                    <TableHead>{t('admin.blog.categories.table.slug')}</TableHead>
                    <TableHead>{t('admin.blog.categories.table.description')}</TableHead>
                    <TableHead>{t('admin.blog.categories.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{category.slug}</code>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description || '-'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCategoryToDelete(category);
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.blog.categories.edit_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.blog.categories.edit_dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('admin.blog.categories.form.name')} *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t('admin.blog.categories.form.name_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">{t('admin.blog.categories.form.slug')}</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder={t('admin.blog.categories.form.slug_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t('admin.blog.categories.form.description')}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('admin.blog.categories.form.description_placeholder')}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdate} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('admin.blog.categories.edit_dialog.update')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.blog.categories.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.blog.categories.delete_dialog.description')}
              {categoryToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{categoryToDelete.name}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

