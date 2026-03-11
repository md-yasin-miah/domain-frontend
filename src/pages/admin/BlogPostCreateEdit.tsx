import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { FileText, Loader2, ArrowLeft, Save, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import {
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useGetBlogPostQuery,
} from "@/store/api/blogApi";
import { useGetBlogCategoriesQuery } from "@/store/api/categoryApi";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  tags: string;
  status: "draft" | "published" | "archived";
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

  const { data: postData, isLoading: postLoading } = useGetBlogPostQuery(
    Number(id),
    { skip: !id },
  );
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetBlogCategoriesQuery({ is_active: true } as any);

  const [createBlogPost, { isLoading: isCreating }] =
    useCreateBlogPostMutation();
  const [updateBlogPost, { isLoading: isUpdating }] =
    useUpdateBlogPostMutation();

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category_id: "",
    tags: "",
    status: "draft",
    is_featured: false,
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    if (isEditing && postData) {
      setFormData({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || "",
        content: postData.content,
        featured_image: postData.og_image || "",
        category_id: postData.category_id?.toString() || "",
        tags: postData.meta_keywords || "",
        status: postData.status || "draft",
        is_featured: postData.is_featured || false,
        meta_title: postData.meta_title || "",
        meta_description: postData.meta_description || "",
      });
    }
  }, [postData, isEditing]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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
        title: t("admin.blog.errors.required_fields", "Required fields are missing"),
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: any = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || null,
        content: formData.content,
        og_image: formData.featured_image || null,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        meta_keywords: formData.tags || null,
        status: formData.status,
        is_featured: formData.is_featured,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      if (isEditing && id) {
        await updateBlogPost({ id: Number(id), data: payload }).unwrap();
      } else {
        await createBlogPost(payload).unwrap();
      }

      toast({
        title: t(
          `admin.blog.messages.${isEditing ? "update" : "create"}_success`,
          `${isEditing ? "Updated" : "Created"} successfully`,
        ),
        description: t(
          `admin.blog.messages.${isEditing ? "update" : "create"}_success_desc`,
          `The blog post has been ${isEditing ? "updated" : "created"}.`,
        ),
      });

      navigate(ROUTES.ADMIN.BLOG_MANAGER);
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} blog post:`,
        error,
      );
      toast({
        title: t(
          `admin.blog.errors.${isEditing ? "update" : "create"}_error`,
          `Failed to ${isEditing ? "update" : "create"} blog post`,
        ),
        description: error?.data?.detail || error.message,
        variant: "destructive",
      });
    }
  };

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.items || [];

  if (postLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.ADMIN.BLOG_MANAGER)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back", "Back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {isEditing
                ? t("admin.blog.edit_post", "Edit Post")
                : t("admin.blog.create_post", "Create Post")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing
                ? t("admin.blog.edit_post_desc", "Edit an existing blog post")
                : t("admin.blog.create_post_desc", "Write and publish a new blog post")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && formData.status === "published" && (
            <Button variant="outline" asChild>
              <Link to={`/blog/${formData.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                {t("admin.blog.view_post", "View Post")}
              </Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.saving", "Saving...")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("common.save", "Save")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.blog.form.basic_info", "Basic Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("admin.blog.form.title", "Title")} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t("admin.blog.form.title_placeholder", "Post title")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("admin.blog.form.slug", "Slug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={t("admin.blog.form.slug_placeholder", "URL-friendly slug")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("admin.blog.form.slug_auto_generated", "Slug is automatically generated from the title. You can edit it manually if needed.")}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">{t("admin.blog.form.excerpt", "Excerpt")}</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder={t("admin.blog.form.excerpt_placeholder", "Small summary of the post")}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">
                  {t("admin.blog.form.content", "Content")} *
                </Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder={t("admin.blog.form.content_placeholder", "Start writing...")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("admin.blog.form.media", "Media")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="featured_image">
                  {t("admin.blog.form.featured_image", "Featured Image")}
                </Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) =>
                    setFormData({ ...formData, featured_image: e.target.value })
                  }
                  placeholder={t("admin.blog.form.featured_image_placeholder", "Image URL")}
                />
                {formData.featured_image && (
                  <div className="mt-4">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="max-w-full h-auto rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
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
              <CardTitle>{t("admin.blog.form.publish_settings", "Publishing Settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">{t("admin.blog.form.status", "Status")}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.blog.form.select_status", "Select Status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t("common.draft", "Draft")}</SelectItem>
                    <SelectItem value="published">{t("common.published", "Published")}</SelectItem>
                    <SelectItem value="archived">{t("common.archived", "Archived")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">
                  {t("admin.blog.form.is_featured", "Feature this post")}
                </Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("admin.blog.form.categorization", "Categorization")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">
                  {t("admin.blog.form.category", "Category")}
                </Label>
                <Select
                  value={formData.category_id || undefined}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category_id: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("admin.blog.form.select_category", "Select Category")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("admin.blog.form.no_category", "No Category")}
                    </SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">{t("admin.blog.form.tags", "Tags")}</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder={t("admin.blog.form.tags_placeholder", "Keywords separated by commas")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("admin.blog.form.seo_basic", "SEO Settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">
                  {t("admin.blog.form.meta_title", "Meta Title")}
                </Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_title: e.target.value })
                  }
                  placeholder={t("admin.blog.form.meta_title_placeholder", "SEO Title")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">
                  {t("admin.blog.form.meta_description", "Meta Description")}
                </Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  placeholder={t(
                    "admin.blog.form.meta_description_placeholder",
                    "SEO description for search engines"
                  )}
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
