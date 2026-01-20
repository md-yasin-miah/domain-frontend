import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/hooks/useAuth";
import { useUpdateClientProfileMutation, useCreateClientProfileMutation } from "@/store/api/userApi";
import { extractErrorMessage, setFormErrors } from "@/lib/errorHandler";
import { profileSetupSchema, type ProfileSetupFormData } from "@/schemas/user/profileSetup.schema";

export default function ProfileSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateClientProfileMutation();
  const [createProfile, { isLoading: isCreating }] = useCreateClientProfileMutation();
  const loading = isUpdating || isCreating;

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      full_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      email: user?.email || "",
      phone_number: "",
      company_name: "",
      website: "",
      bio: "",
    },
  });

  // Update email when user loads
  useEffect(() => {
    if (user?.email) {
      form.setValue('email', user.email);
    }
  }, [user?.email, form]);

  const onSubmit = async (data: ProfileSetupFormData) => {
    if (!user) return;

    try {
      // Map form data to backend API structure
      // Split full_name into first_name and last_name
      const nameParts = data.full_name.trim().split(/\s+/);
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      // Map to backend ProfileCreateRequest structure
      const profileData = {
        first_name: first_name || undefined,
        last_name: last_name || undefined,
        phone: data.phone_number || undefined,
        address_line1: data.address_line1 || undefined,
        address_line2: data.address_line2 || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || undefined,
        postal_code: data.postal_code || undefined,
        company_name: data.company_name || undefined,
        website: data.website || undefined,
        bio: data.bio || undefined,
      };

      // Try to update first, if profile doesn't exist, create it
      try {
        await updateProfile(profileData).unwrap();
      } catch (updateError: unknown) {
        // If profile doesn't exist (404), create it instead
        const error = updateError as { status?: number };
        if (error?.status === 404) {
          await createProfile(profileData).unwrap();
        } else {
          throw updateError;
        }
      }

      toast({
        title: t('profile.setup.success'),
        description: t('profile.setup.success_desc'),
      });

      // Check for return URL, otherwise redirect to dashboard
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl), { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }
    } catch (error: unknown) {
      // Set form field errors dynamically
      const hasFieldErrors = setFormErrors<ProfileSetupFormData>(
        form,
        error,
        undefined,
        ['full_name', 'address_line1', 'address_line2', 'city', 'state', 'country', 'postal_code', 'phone_number', 'company_name', 'website', 'bio']
      );

      // Show general error toast if no field-specific errors were set
      if (!hasFieldErrors) {
        const errorMessage = extractErrorMessage(error);
        toast({
          title: t('profile.setup.error'),
          description: errorMessage || t('profile.setup.error_desc'),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.setup.title')}</CardTitle>
          <CardDescription>
            {t('profile.setup.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('profile.setup.personal_info')}</h3>

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.full_name')} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('profile.setup.full_name_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address_line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.address')} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('profile.setup.address_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address_line2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.address_line2')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('profile.setup.address_line2_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('profile.setup.city')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('profile.setup.city_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('profile.setup.state')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('profile.setup.state_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('profile.setup.country')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('profile.setup.country_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('profile.setup.postal_code')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('profile.setup.postal_code_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.email')} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.phone_number')} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder={t('profile.setup.phone_number_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('profile.setup.company_info')}</h3>

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.company_name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('profile.setup.company_name_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.website')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder={t('profile.setup.website_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.bio')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('profile.setup.bio_placeholder')}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('profile.setup.saving')}
                  </>
                ) : (
                  t('profile.setup.complete_profile')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
