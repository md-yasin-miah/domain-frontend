import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Search,
  Loader2,
  Plus,
  Edit,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  useGetAdminGuideArticlesQuery,
  useGetAdminGuideCategoriesQuery,
} from "@/store/api/guidesApi";
import { ROUTES } from "@/lib/routes";

const PAGE_SIZE = 20;

export default function AdminGuideArticlesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [isPublishedFilter, setIsPublishedFilter] = useState<string>("all");

  const { data: categoriesData } = useGetAdminGuideCategoriesQuery({ limit: 200 });
  const categories = useMemo(() => categoriesData?.items ?? [], [categoriesData]);

  const { data, isLoading, error, refetch } = useGetAdminGuideArticlesQuery({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    category_id: categoryId === "" ? undefined : categoryId,
    is_published:
      isPublishedFilter === "all"
        ? undefined
        : isPublishedFilter === "published",
    q: searchTerm.trim() || undefined,
  });

  const articles = data?.items ?? [];
  const pagination = data?.pagination;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN.ROOT)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              {t("admin.sidebar.guides_articles", "Guide Articles")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("admin.guides.articles_description", "Manage guide articles")}
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(ROUTES.ADMIN.GUIDES.ARTICLE_EDIT("new"))}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.guides.add_article", "Add Article")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={categoryId === "" ? "all" : String(categoryId)}
              onValueChange={(v) => {
                setCategoryId(v === "all" ? "" : Number(v));
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("admin.guides.filter_category", "Category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.guides.all_categories", "All categories")}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={isPublishedFilter}
              onValueChange={(v) => {
                setIsPublishedFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("admin.guides.filter_status", "Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.guides.all_status", "All")}</SelectItem>
                <SelectItem value="published">{t("admin.guides.published", "Published")}</SelectItem>
                <SelectItem value="draft">{t("admin.guides.draft", "Draft")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-destructive py-4">
              {t("common.error")}:{" "}
              {"data" in (error as object)
                ? String((error as { data?: { detail?: string } }).data?.detail)
                : String(error)}
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.guides.title", "Title")}</TableHead>
                    <TableHead>{t("admin.guides.slug", "Slug")}</TableHead>
                    <TableHead>{t("admin.guides.category", "Category")}</TableHead>
                    <TableHead>{t("admin.guides.status", "Status")}</TableHead>
                    <TableHead>{t("admin.guides.views", "Views")}</TableHead>
                    <TableHead>{t("admin.guides.updated", "Updated")}</TableHead>
                    <TableHead className="w-[100px]">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((art) => (
                    <TableRow key={art.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {art.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {art.slug}
                      </TableCell>
                      <TableCell>
                        {art.category ? art.category.name : "—"}
                      </TableCell>
                      <TableCell>
                        {art.is_published ? (
                          <Badge variant="default">{t("admin.guides.published", "Published")}</Badge>
                        ) : (
                          <Badge variant="secondary">{t("admin.guides.draft", "Draft")}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{art.view_count ?? 0}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(art.updated_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(ROUTES.ADMIN.GUIDES.ARTICLE_EDIT(art.id))
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination && (pagination.has_next || page > 0) && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    {t("common.total")}: {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.has_previous}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      {t("common.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.has_next}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {t("common.next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          {!isLoading && !error && articles.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {t("admin.guides.no_articles")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
