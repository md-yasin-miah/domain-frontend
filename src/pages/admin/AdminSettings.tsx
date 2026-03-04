import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Loader2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  type SettingsUpdateRequest,
} from "@/store/api/settingsApi";
import { settingsFormSchema, type SettingsFormData } from "@/schemas/admin/settings.schema";

const COMMISSION_TYPES = ["percentage", "fixed"] as const;

const defaultValues: SettingsFormData = {
  site_name: "",
  site_logo_url: "",
  site_description: "",
  default_currency: "USD",
  support_email: "",
  buyer_commission_percent: 0,
  seller_commission_percent: 0,
  buyer_commission_type: "percentage",
  seller_commission_type: "percentage",
  buyer_commission_fixed: 0,
  seller_commission_fixed: 0,
};

function toStr(v: unknown): string {
  if (v == null) return "";
  return String(v);
}

function toNum(v: unknown): number {
  if (v == null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function AdminSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: settings, isLoading, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!settings) return;
    form.reset({
      site_name: toStr(settings.site_name),
      site_logo_url: toStr(settings.site_logo_url),
      site_description: toStr(settings.site_description),
      default_currency: toStr(settings.default_currency) || "USD",
      support_email: toStr(settings.support_email),
      buyer_commission_percent: toNum(settings.buyer_commission_percent),
      seller_commission_percent: toNum(settings.seller_commission_percent),
      buyer_commission_type: (toStr(settings.buyer_commission_type) || "percentage") as "percentage" | "fixed",
      seller_commission_type: (toStr(settings.seller_commission_type) || "percentage") as "percentage" | "fixed",
      buyer_commission_fixed: toNum(settings.buyer_commission_fixed),
      seller_commission_fixed: toNum(settings.seller_commission_fixed),
    });
  }, [settings, form]);

  const buildPayload = (values: SettingsFormData): SettingsUpdateRequest => {
    const p: SettingsUpdateRequest = {};
    if (values.site_name !== undefined) p.site_name = values.site_name || null;
    if (values.site_logo_url !== undefined) p.site_logo_url = values.site_logo_url || null;
    if (values.site_description !== undefined) p.site_description = values.site_description || null;
    if (values.default_currency !== undefined) p.default_currency = values.default_currency || null;
    if (values.support_email !== undefined) p.support_email = values.support_email || null;
    if (values.buyer_commission_percent !== undefined) p.buyer_commission_percent = toNum(values.buyer_commission_percent);
    if (values.seller_commission_percent !== undefined) p.seller_commission_percent = toNum(values.seller_commission_percent);
    if (values.buyer_commission_type !== undefined) p.buyer_commission_type = values.buyer_commission_type || null;
    if (values.seller_commission_type !== undefined) p.seller_commission_type = values.seller_commission_type || null;
    if (values.buyer_commission_fixed !== undefined) p.buyer_commission_fixed = toNum(values.buyer_commission_fixed);
    if (values.seller_commission_fixed !== undefined) p.seller_commission_fixed = toNum(values.seller_commission_fixed);
    return p;
  };

  const onSubmit = async (values: SettingsFormData) => {
    const payload = buildPayload(values);
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      toast({
        title: t("admin.settings.no_changes", "No changes"),
        description: t("admin.settings.no_changes_desc", "Nothing to save."),
        variant: "default",
      });
      return;
    }
    try {
      await updateSettings(payload).unwrap();
      toast({
        title: t("admin.settings.saved", "Settings saved"),
        description: t("admin.settings.saved_desc", "Website settings have been updated."),
      });
      refetch();
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "data" in err && err.data && typeof (err as { data: { detail?: string } }).data === "object"
          ? (err as { data: { detail?: string } }).data?.detail
          : t("common.error");
      toast({
        title: t("common.error", "Error"),
        description: String(detail),
        variant: "destructive",
      });
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-7 w-7" />
            {t("admin.settings.title", "Settings")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.settings.description", "Website and commission settings.")}
          </p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t("common.save", "Save")}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.settings.general", "General")}</CardTitle>
              <CardDescription>
                {t("admin.settings.general_desc", "Site name, logo, description, currency, and support email.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.settings.site_name", "Site name")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Domain Market" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="default_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.settings.default_currency", "Default currency")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="site_logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.settings.site_logo_url", "Logo URL")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="site_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.settings.site_description", "Site description")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="support_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.settings.support_email", "Support email")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="support@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t("admin.settings.commission", "Commission")}
              </CardTitle>
              <CardDescription>
                {t("admin.settings.commission_desc", "Buyer and seller commission (percentage or fixed).")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-medium">{t("admin.settings.buyer_commission", "Buyer commission")}</h4>
                  <FormField
                    control={form.control}
                    name="buyer_commission_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.settings.commission_type", "Type")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMMISSION_TYPES.map((typeVal) => (
                              <SelectItem key={typeVal} value={typeVal}>
                                {typeVal}
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
                    name="buyer_commission_percent"
                    render={({ field }) => (
                      <FormItem className={form.watch("buyer_commission_type") === "percentage" ? "" : "hidden"}>
                        <FormLabel>{t("admin.settings.percent", "Percent")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.01} value={field.value} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="buyer_commission_fixed"
                    render={({ field }) => (
                      <FormItem className={form.watch("buyer_commission_type") === "fixed" ? "" : "hidden"}>
                        <FormLabel>{t("admin.settings.fixed", "Fixed amount")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.01} value={field.value} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-medium">{t("admin.settings.seller_commission", "Seller commission")}</h4>
                  <FormField
                    control={form.control}
                    name="seller_commission_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.settings.commission_type", "Type")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMMISSION_TYPES.map((typeVal) => (
                              <SelectItem key={typeVal} value={typeVal}>
                                {typeVal}
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
                    name="seller_commission_percent"
                    render={({ field }) => (
                      <FormItem className={form.watch("seller_commission_type") === "percentage" ? "" : "hidden"}>
                        <FormLabel>{t("admin.settings.percent", "Percent")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.01} value={field.value} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seller_commission_fixed"
                    render={({ field }) => (
                      <FormItem className={form.watch("seller_commission_type") === "fixed" ? "" : "hidden"}>
                        <FormLabel>{t("admin.settings.fixed", "Fixed amount")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.01} value={field.value} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
