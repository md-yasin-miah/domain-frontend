import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
  const { toast } = useToast();
  const { user } = useAuth();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateClientProfileMutation();
  const [createProfile, { isLoading: isCreating }] = useCreateClientProfileMutation();
  const loading = isUpdating || isCreating;

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      full_name: "",
      address: "",
      email: user?.email || "",
      phone_number: "",
      company_name: "",
      company_address: "",
      company_details: "",
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
        address_line1: data.address || undefined,
        address_line2: data.company_address || undefined,
        company_name: data.company_name || undefined,
        bio: data.company_details || undefined,
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

      navigate("/client/dashboard");
    } catch (error: unknown) {
      // Set form field errors dynamically
      const hasFieldErrors = setFormErrors<ProfileSetupFormData>(
        form,
        error,
        undefined,
        ['full_name', 'address', 'phone_number', 'company_name', 'company_address', 'company_details']
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
                  name="address"
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
                  name="company_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.company_address')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('profile.setup.company_address_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('profile.setup.company_details')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('profile.setup.company_details_placeholder')}
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
