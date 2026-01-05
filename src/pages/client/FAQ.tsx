import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetFAQsQuery } from '@/store/api/faqApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Loader2, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export default function FAQ() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: faqsData, isLoading: loading } = useGetFAQsQuery({
    page: 1,
    size: 10
  });

  const allFaqs = faqsData?.items || [];

  // Filter FAQs based on search term
  const faqs = searchTerm.trim()
    ? allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : allFaqs;

  const categories = Array.from(new Set(faqs.map(faq => faq.category?.name).filter(Boolean))) as string[];

  // Group FAQs by their category string (as used elsewhere in this component)
  const faqsByCategory = categories.reduce((acc, category) => {
    acc[category] = faqs.filter(faq => faq.category?.name === category);
    return acc;
  }, {} as Record<string, typeof faqs>);

  const uncategorizedFAQs = faqs.filter(faq => !faq.category);

  return (
    <div className="container mx-auto max-w-4xl">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {/* cross icon to clear the search */}
              {searchTerm && (
                <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setSearchTerm('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  {t('faq.category_all')}
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
                {uncategorizedFAQs.length > 0 && (
                  <Badge
                    variant={selectedCategory === 'uncategorized' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('uncategorized')}
                  >
                    Uncategorized
                  </Badge>
                )}
              </div>
            )}
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
            <Accordion type="single" collapsible className="w-full">
              {selectedCategory === 'all' ? (
                <>
                  {categories.map((category) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">{category}</h3>
                      {faqsByCategory[category]?.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id.toString()} className="border-b">
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
                        <AccordionItem key={faq.id.toString()} value={faq.id.toString()} className="border-b">
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
              ) : selectedCategory === 'uncategorized' ? (
                uncategorizedFAQs.map((faq) => (
                  <AccordionItem key={faq.id.toString()} value={faq.id.toString()} className="border-b">
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                faqsByCategory[selectedCategory]?.map((faq) => (
                  <AccordionItem key={faq.id.toString()} value={faq.id.toString()} className="border-b">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

