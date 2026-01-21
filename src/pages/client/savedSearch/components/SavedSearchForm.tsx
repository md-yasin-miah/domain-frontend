import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { extractErrorMessage, setFormErrors } from "@/lib/errorHandler";
import { ListingType } from "@/store/api/marketplaceApi";
import { savedSearchSchema, type SavedSearchFormData } from "@/schemas/marketplace/savedSearch.schema";

interface SavedSearchFormProps {
  initialData?: SavedSearch;
  onSubmit: (data: SavedSearchFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  listingTypes: ListingType[];
}

const SavedSearchForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  listingTypes,
}: SavedSearchFormProps) => {
  const { t } = useTranslation();

  const form = useForm<SavedSearchFormData>({
    resolver: zodResolver(savedSearchSchema),
    defaultValues: {
      name: initialData?.name || "",
      listing_type_id: initialData?.listing_type_id || null,
      status: initialData?.status || null,
      min_price: initialData?.min_price || null,
      max_price: initialData?.max_price || null,
      currency: initialData?.currency || null,
      domain_extension: initialData?.domain_extension || null,
      min_domain_age: initialData?.min_domain_age || null,
      max_domain_age: initialData?.max_domain_age || null,
      min_traffic: initialData?.min_traffic || null,
      max_traffic: initialData?.max_traffic || null,
      min_revenue: initialData?.min_revenue || null,
      max_revenue: initialData?.max_revenue || null,
      search_text: initialData?.search_text || null,
    },
  });

  const handleSubmit = async (data: SavedSearchFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const hasFieldErrors = setFormErrors<SavedSearchFormData>(
        form,
        error,
        {},
        Object.keys(data) as (keyof SavedSearchFormData)[]
      );

      if (!hasFieldErrors) {
        const errorMessage = extractErrorMessage(error);
        // Error toast will be handled by parent component
        throw error;
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("savedSearches.form.basic_info")}</h3>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("savedSearches.form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("savedSearches.form.name_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="search_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("savedSearches.form.search_text")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("savedSearches.form.search_text_placeholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("savedSearches.form.search_text_description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Listing Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("savedSearches.form.listing_filters")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="listing_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.listing_type")}</FormLabel>
                    <Select
                      value={field.value?.toString() || undefined}
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("savedSearches.form.listing_type_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {listingTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.status")}</FormLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => field.onChange(value || null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("savedSearches.form.status_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">{t("common.status.draft")}</SelectItem>
                        <SelectItem value="active">{t("common.status.active")}</SelectItem>
                        <SelectItem value="sold">{t("common.status.sold")}</SelectItem>
                        <SelectItem value="expired">{t("common.status.expired")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Price Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("savedSearches.form.price_filters")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="min_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.min_price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("savedSearches.form.min_price_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.max_price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("savedSearches.form.max_price_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.currency")}</FormLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => field.onChange(value || null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("savedSearches.form.currency_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Domain Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("savedSearches.form.domain_filters")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="domain_extension"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.domain_extension")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("savedSearches.form.domain_extension_placeholder")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("savedSearches.form.domain_extension_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_domain_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.min_domain_age")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("savedSearches.form.min_domain_age_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_domain_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.max_domain_age")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("savedSearches.form.max_domain_age_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Traffic & Revenue Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("savedSearches.form.traffic_revenue_filters")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_traffic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.min_traffic")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("savedSearches.form.min_traffic_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_traffic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.max_traffic")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("savedSearches.form.max_traffic_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.min_revenue")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("savedSearches.form.min_revenue_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("savedSearches.form.max_revenue")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("savedSearches.form.max_revenue_placeholder")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-4 pt-4 pb-4 border-t bg-background shrink-0">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("common.processing")}
              </>
            ) : (
              initialData ? t("common.update") : t("common.create")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SavedSearchForm;

