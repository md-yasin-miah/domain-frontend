import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2, Calendar, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useGetGuideArticleBySlugQuery } from "@/store/api/guidesApi";

export default function GuideArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data: article, isLoading, error } =
    useGetGuideArticleBySlugQuery(
      { slug: slug ?? "", increment_view: true },
      { skip: !slug }
    );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("guides.not_found", "Article not found.")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">{t("common.loading", "Loading...")}</span>
      </div>
    );
  }

  const is401 = error && typeof error === "object" && "status" in error && (error as { status: number }).status === 401;

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          {is401
            ? t("guides.login_required", "Please log in to view this guide.")
            : t("guides.not_found", "Article not found.")}
        </p>
        <div className="flex gap-2">
          {is401 && (
            <Button asChild variant="default">
              <Link to="/auth">{t("auth.login", "Log in")}</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to={ROUTES.APP.HELP_GUIDES.ROOT}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("guides.back_to_guides", "Back to Guides")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
          <Link to={ROUTES.APP.HELP_GUIDES.ROOT} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("guides.back_to_guides", "Back to Guides")}
          </Link>
        </Button>

        {article.category && (
          <p className="text-sm text-primary font-medium mb-2">
            <Link to={ROUTES.APP.HELP_GUIDES.CATEGORY(article.category.slug)}>
              {article.category.name}
            </Link>
          </p>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          {article.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at)}
            </span>
          )}
          {article.view_count != null && article.view_count > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.view_count} {t("guides.views", "views")}
            </span>
          )}
          {article.created_by?.name && (
            <span>{article.created_by.name}</span>
          )}
        </div>

        {article.excerpt && (
          <p className="text-lg text-muted-foreground border-l-4 border-primary/30 pl-4 mb-8">
            {article.excerpt}
          </p>
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none guide-article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}
