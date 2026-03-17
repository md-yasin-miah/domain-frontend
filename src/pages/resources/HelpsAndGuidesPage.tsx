import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  BookOpen,
  Loader2,
  ArrowRight,
  FolderOpen,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import {
  useGetPublicGuideCategoriesQuery,
  useGetGuideArticlesQuery,
} from "@/store/api/guidesApi";
import FAQ from "../client/FAQ";

const PAGE_SIZE = 24;

export default function GuidesPage() {
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetPublicGuideCategoriesQuery();

  const categoryIdFromSlug =
    categorySlug && categoriesData?.categories
      ? categoriesData.categories.find((c) => c.slug === categorySlug)?.id
      : undefined;

  const { data: articlesData, isLoading: articlesLoading } =
    useGetGuideArticlesQuery({
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      category_id: categoryIdFromSlug,
      q: searchTerm.trim() || undefined,
    });

  const categories = categoriesData?.categories ?? [];
  const articles = articlesData?.items ?? [];
  const pagination = articlesData?.pagination;
  const loading = categoriesLoading || articlesLoading;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <section className="py-16 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("guides.title", "Guides & Help")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t(
              "guides.subtitle",
              "Browse categories and articles to get started.",
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t(
                  "guides.search_placeholder",
                  "Search articles...",
                )}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="pl-10 h-11"
              />
            </div>
          </div>
          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.CLIENT.SUPPORT}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Crear Ticket de Soporte
              </Button>
            </Link>
            <Link to={ROUTES.CLIENT.CHAT.ROOT}>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 hover:bg-primary/5"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat en Vivo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-8 px-6 border-b border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={!categorySlug ? "default" : "outline"}
                size="sm"
                onClick={() => navigate(ROUTES.APP.HELP_GUIDES.ROOT)}
              >
                {t("guides.all_categories", "All")}
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categorySlug === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    navigate(ROUTES.APP.HELP_GUIDES.CATEGORY(cat.slug))
                  }
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                {t("common.loading", "Loading...")}
              </span>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t("guides.no_articles", "No articles found.")}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={ROUTES.APP.HELP_GUIDES.ARTICLE(article.slug)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-2 text-lg">
                          {article.title}
                        </CardTitle>
                        {article.category && (
                          <CardDescription>
                            {article.category.name}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {article.published_at
                              ? formatDate(article.published_at)
                              : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            {t("guides.read", "Read")}
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
              {pagination &&
                (pagination.has_next || pagination.has_previous) && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={!pagination.has_previous}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      {t("common.previous", "Previous")}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!pagination.has_next}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {t("common.next", "Next")}
                    </Button>
                  </div>
                )}
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <FAQ publicPage={true} />
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Necesitas Más Ayuda?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte especializado está disponible 24/7 para
            ayudarte con cualquier consulta específica.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Chat en Vivo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Respuesta inmediata para consultas urgentes
              </p>
              <Link to={ROUTES.CLIENT.CHAT.ROOT}>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                support@adominioz.com
              </p>
              <Link to={`mailto:support@adominioz.com`}>
                <Button variant="outline" size="sm">
                  Send Email
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sistema de tickets para seguimiento detallado
              </p>
              <Link to={ROUTES.CLIENT.SUPPORT}>
                <Button variant="outline" size="sm">
                  Create Ticket
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
