import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetFAQsQuery } from '@/store/api/faqApi';
import { useGetFAQCategoriesQuery } from '@/store/api/categoryApi';
import { usePagination } from '@/hooks/usePagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default function FAQ({ publicPage = false }: { publicPage?: boolean }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all' | 'uncategorized'>('all');
  const { page, size, handlePageChange } = usePagination({
    initialPage: 1,
    initialPageSize: PAGE_SIZE,
  });

  const { data: categoriesData } = useGetFAQCategoriesQuery({ limit: 100 });
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.items ?? [];

  const { data: faqsData, isLoading: loading } = useGetFAQsQuery({
    is_active: true,
    public: publicPage,
    skip: (page - 1) * size,
    limit: size,
    category_id:
      selectedCategoryId === 'all'
        ? undefined
        : selectedCategoryId === 'uncategorized'
          ? 0
          : selectedCategoryId,
    search: searchTerm.trim() || undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handlePageChange(1);
  };

  const handleCategorySelect = (id: number | 'all' | 'uncategorized') => {
    setSelectedCategoryId(id);
    handlePageChange(1);
  };

  const faqs = faqsData?.items ?? [];
  const pagination = faqsData?.pagination;
  const total = pagination?.total ?? 0;
  const hasNext = pagination?.has_next ?? false;
  const hasPrevious = pagination?.has_previous ?? false;

  // Group current page FAQs by category for "all" view
  const categoriesFromFaqs = Array.from(
    new Set(faqs.map((faq) => faq.category?.name).filter(Boolean))
  ) as string[];
  const faqsByCategory = categoriesFromFaqs.reduce(
    (acc, category) => {
      acc[category] = faqs.filter((faq) => faq.category?.name === category);
      return acc;
    },
    {} as Record<string, typeof faqs>
  );
  const uncategorizedFAQs = faqs.filter((faq) => !faq.category);

  return (
    <div className="md:container mx-auto md:max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <HelpCircle className="h-8 w-8" />
            {t('faq.title')}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('faq.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('faq.search_placeholder')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => handleSearchChange('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleCategorySelect('all')}
              >
                {t('faq.category_all')}
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
              <Badge
                variant={selectedCategoryId === 'uncategorized' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleCategorySelect('uncategorized')}
              >
                Uncategorized
              </Badge>
            </div>
          </div>

          {/* FAQs List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">{t('faq.loading')}</span>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? t('faq.no_results') : t('faq.no_faqs')}
            </div>
          ) : (
            <>
              <Accordion type="single" collapsible className="w-full">
                {selectedCategoryId === 'all' ? (
                  <>
                    {categoriesFromFaqs.map((category) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">{category}</h3>
                        {faqsByCategory[category]?.map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id.toString()}
                            className="border-b"
                          >
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </div>
                    ))}
                    {uncategorizedFAQs.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">General</h3>
                        {uncategorizedFAQs.map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id.toString()}
                            className="border-b"
                          >
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  faqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id.toString()}
                      className="border-b"
                    >
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                )}
              </Accordion>

              {/* Pagination */}
              {total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {t('common.pagination.showing', 'Showing')}{' '}
                    {(page - 1) * size + 1}–
                    {Math.min(page * size, total)} {t('common.of', 'of')} {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasPrevious}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t('common.previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasNext}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {t('common.next')}
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
