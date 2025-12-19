import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateClientProfileMutation } from "@/store/api/userApi";

export default function ProfileSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [updateProfile, { isLoading: loading }] = useUpdateClientProfileMutation();
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    email: user?.email || "",
    phone_number: "",
    company_name: "",
    company_address: "",
    company_details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!user) return;

    try {
      await updateProfile({
        userId: user.id,
        profileData: {
          full_name: formData.full_name,
          address: formData.address,
          phone_number: formData.phone_number,
          company_name: formData.company_name || undefined,
          company_address: formData.company_address || undefined,
          company_details: formData.company_details || undefined,
          profile_completed: true,
        },
      }).unwrap();

      toast({
        title: t('profile.setup.success'),
        description: t('profile.setup.success_desc'),
      });

      navigate("/client/dashboard");
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({
        title: t('profile.setup.error'),
        description: error.data || error.message || t('profile.setup.error_desc'),
        variant: "destructive",
      });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t('profile.setup.personal_info')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('profile.setup.full_name')} *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('profile.setup.address')} *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.setup.email')} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">{t('profile.setup.phone_number')} *</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t('profile.setup.company_info')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="company_name">{t('profile.setup.company_name')}</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_address">{t('profile.setup.company_address')}</Label>
                <Input
                  id="company_address"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_details">{t('profile.setup.company_details')}</Label>
                <Textarea
                  id="company_details"
                  name="company_details"
                  value={formData.company_details}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('profile.setup.saving') : t('profile.setup.complete_profile')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
