import { useTranslation } from "react-i18next";
import { usePagination } from "@/hooks/usePagination";
import { useGetReviewsQuery } from "@/store/api/reviewsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i <= full
              ? "fill-amber-400 text-amber-500"
              : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}

export default function ClientReviews() {
  const { t } = useTranslation();
  const { page, size, handlePageChange } = usePagination({
    initialPage: 1,
    initialPageSize: PAGE_SIZE,
  });

  const { data, isLoading, error } = useGetReviewsQuery({
    skip: (page - 1) * size,
    limit: size,
  });

  const items = data && !Array.isArray(data) ? data.items : (Array.isArray(data) ? data : []);
  const pagination = data && !Array.isArray(data) ? data.pagination : null;
  const total = pagination?.total ?? 0;
  const hasNext = pagination?.has_next ?? false;
  const hasPrevious = pagination?.has_previous ?? false;

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          {t("client.reviews.title", "My reviews")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("client.reviews.description", "Reviews you have written for orders.")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("client.reviews.list_title", "All reviews")}</CardTitle>
          <CardDescription>
            {t("client.reviews.list_description", "Your order reviews and ratings.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
              {t("client.reviews.error", "Failed to load reviews. Please try again.")}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">
                {t("client.reviews.empty_title", "No reviews yet")}
              </p>
              <p className="text-sm mt-1">
                {t("client.reviews.empty_description", "Reviews you leave on completed orders will appear here.")}
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {items.map((review: Review) => (
                  <li key={review.id}>
                    <Card className="border bg-card">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                            {review.comment ? (
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {review.comment}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                {t("client.reviews.no_comment", "No comment")}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                              <span>
                                {t("client.reviews.order_id", "Order")} #{review.order_id}
                              </span>
                              <span>
                                {t("client.reviews.listing_id", "Listing")} #{review.listing_id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>

              {total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {t("common.pagination.showing", "Showing")}{" "}
                    {(page - 1) * size + 1}–
                    {Math.min(page * size, total)} {t("common.of", "of")} {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasPrevious}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t("common.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasNext}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {t("common.next")}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
