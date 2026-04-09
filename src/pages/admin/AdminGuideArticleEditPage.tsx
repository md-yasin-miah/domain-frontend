import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { BookOpen, Loader2, ArrowLeft, Save, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/lib/routes";
import {
  useGetAdminGuideArticleByIdQuery,
  useGetAdminGuideCategoriesQuery,
  useCreateGuideArticleMutation,
  useUpdateGuideArticleMutation,
} from "@/store/api/guidesApi";
import { useMemo } from "react";

interface GuideArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  is_published: boolean;
  requires_auth: boolean;
  order: number;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

const defaultFormData: GuideArticleFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category_id: "",
  is_published: false,
  requires_auth: false,
  order: 0,
  meta_title: "",
  meta_description: "",
  og_image: "",
};

function slugify(text: string): string {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminGuideArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "new" || !id;
  const articleId = isNew ? undefined : Number(id);

  const { data: article, isLoading: articleLoading } =
    useGetAdminGuideArticleByIdQuery(articleId!, { skip: isNew || !articleId });
  const { data: categoriesData } = useGetAdminGuideCategoriesQuery({
    limit: 200,
  });
  const categories = useMemo(
    () => categoriesData?.items ?? [],
    [categoriesData],
  );

  const [createArticle, { isLoading: isCreating }] =
    useCreateGuideArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] =
    useUpdateGuideArticleMutation();

  const [formData, setFormData] =
    useState<GuideArticleFormData>(defaultFormData);

  useEffect(() => {
    if (!isNew && article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        content: article.content ?? "",
        excerpt: article.excerpt ?? "",
        category_id: article.category_id ? String(article.category_id) : "",
        is_published: article.is_published ?? false,
        requires_auth: article.requires_auth ?? false,
        order: article.order ?? 0,
        meta_title: article.meta_title ?? "",
        meta_description: article.meta_description ?? "",
        og_image: article.og_image ?? "",
      });
    }
  }, [article, isNew]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.content?.trim()) {
      toast({
        title: t("admin.guides.errors.required"),
        description: t(
          "admin.guides.errors.title_content_required",
          "Title and content are required.",
        ),
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug?.trim() || slugify(formData.title),
        content: formData.content,
        excerpt: formData.excerpt?.trim() || null,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        is_published: formData.is_published,
        requires_auth: formData.requires_auth,
        order: formData.order,
        meta_title: formData.meta_title?.trim() || null,
        meta_description: formData.meta_description?.trim() || null,
        og_image: formData.og_image?.trim() || null,
      };

      if (isNew) {
        await createArticle(payload).unwrap();
        toast({
          title: t("admin.guides.created"),
          description: t(
            "admin.guides.created_desc",
            "Guide article was created successfully.",
          ),
        });
      } else if (articleId) {
        await updateArticle({ article_id: articleId, data: payload }).unwrap();
        toast({
          title: t("admin.guides.updated"),
          description: t(
            "admin.guides.updated_desc",
            "Guide article was updated successfully.",
          ),
        });
      }
      navigate(ROUTES.ADMIN.GUIDES.ARTICLES);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { detail?: string } }).data?.detail
          : String(err);
      toast({
        title: t("admin.guides.save_error"),
        description: message,
        variant: "destructive",
      });
    }
  };

  const isSaving = isCreating || isUpdating;

  if (!isNew && articleLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.ADMIN.GUIDES.ARTICLES)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              {isNew
                ? t("admin.guides.add_article")
                : t("admin.guides.edit_article")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isNew
                ? t(
                    "admin.guides.edit_article_create_desc",
                    "Create a new guide article",
                  )
                : t(
                    "admin.guides.edit_article_edit_desc",
                    "Edit this guide article",
                  )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && formData.is_published && formData.slug && (
            <Button variant="outline" asChild>
              <Link
                to={ROUTES.APP.HELP_GUIDES.ARTICLE(formData.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t("admin.guides.view_article")}
              </Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.saving")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("common.save")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("admin.guides.form.basic")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t("admin.guides.title")} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t(
                    "admin.guides.form.title_placeholder",
                    "Article title",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("admin.guides.slug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder={t(
                    "admin.guides.form.slug_placeholder",
                    "url-slug",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">
                  {t("admin.guides.form.excerpt")}
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "admin.guides.form.excerpt_placeholder",
                    "Short summary",
                  )}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">
                  {t("admin.guides.form.content")} *
                </Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  placeholder={t(
                    "admin.guides.form.content_placeholder",
                    "Article content...",
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("admin.guides.form.media")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="og_image">
                  {t("admin.guides.form.og_image")}
                </Label>
                <Input
                  id="og_image"
                  value={formData.og_image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      og_image: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
                {formData.og_image && (
                  <div className="mt-2">
                    <img
                      src={formData.og_image}
                      alt="Preview"
                      className="max-w-full h-auto rounded border max-h-40 object-cover"
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
              <CardTitle>
                {t("admin.guides.form.publish")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">
                  {t("admin.guides.form.is_published")}
                </Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_published: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requires_auth">
                  {t("admin.guides.form.requires_auth")}
                </Label>
                <Switch
                  id="requires_auth"
                  checked={formData.requires_auth}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, requires_auth: checked }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">
                  {t("admin.guides.form.order")}
                </Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("admin.guides.form.category")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.category_id || "none"}
                onValueChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: v === "none" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "admin.guides.form.select_category",
                      "Select category",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("admin.guides.form.no_category")}
                  </SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("admin.guides.form.seo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">
                  {t("admin.guides.form.meta_title")}
                </Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_title: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "admin.guides.form.meta_title_placeholder",
                    "SEO title",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">
                  {t("admin.guides.form.meta_description")}
                </Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "admin.guides.form.meta_description_placeholder",
                    "SEO description",
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
