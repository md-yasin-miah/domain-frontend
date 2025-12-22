import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Building, Globe, Phone, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "@/store/api/profileApi";

export default function ClientProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: profile, isLoading: loading, error: profileError, refetch } = useGetMyProfileQuery(undefined, {
    skip: !user,
  });
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ClientProfile>({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    avatar_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    company_name: '',
    website: '',
    social_links: {},
    id: 0,
    user_id: 0,
    is_verified: false,
    verification_date: '',
    created_at: '',
    updated_at: ''
  });
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // Show error toast if profile fetch fails
  useEffect(() => {
    if (profileError) {
      toast({
        title: t('profile.client.error_loading'),
        description: t('profile.client.error_loading_desc'),
        variant: "destructive"
      });
    }
  }, [profileError, toast, t]);

  const handleSave = async () => {
    if (!profile || !user) return;

    try {
      await updateProfile(formData).unwrap();
      toast({
        title: t('profile.client.success_update'),
        description: t('profile.client.success_update_desc')
      });

      setIsEditing(false);
      // Refetch profile data to get updated information
      refetch();
    } catch (error: any) {
      toast({
        title: t('profile.client.error_update'),
        description: `${t('profile.client.error_update_desc')}: ${error.message || t('common.error')}`,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Básico';
      case 'pro': return 'Profesional';
      case 'enterprise': return 'Empresarial';
      default: return 'Básico';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-24 bg-muted animate-pulse rounded" />
              <div className="h-24 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('profile.client.profile_not_found')}</h3>
            <p className="text-muted-foreground">
              {t('profile.client.profile_not_found_desc')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('profile.client.title')}</h1>
          <p className="text-muted-foreground">{t('profile.client.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={profile.is_verified ? 'default' : 'secondary'}>
            {profile.is_verified ? t('profile.client.verified') : t('profile.client.not_verified')}
          </Badge>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              {t('profile.client.edit_profile')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                if (profile) {
                  setFormData(profile);
                }
              }}>
                {t('profile.client.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? t('profile.client.saving') : t('profile.client.save')}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              {t('profile.client.company_info')}
            </CardTitle>
            <CardDescription>
              {t('profile.client.company_info_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">{t('profile.client.company_name')}</Label>
              <Input
                id="company_name"
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('profile.client.first_name')}</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t('profile.client.last_name')}</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('profile.client.phone')}</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              {t('profile.client.service_info')}
            </CardTitle>
            <CardDescription>
              {t('profile.client.service_info_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">{t('profile.client.website')}</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder={t('profile.client.website_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t('profile.client.bio')}</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                placeholder={t('profile.client.bio_placeholder')}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('profile.client.verification_status')}</Label>
              <div className="flex items-center gap-2">
                <Badge variant={profile.is_verified ? 'default' : 'secondary'}>
                  {profile.is_verified ? t('profile.client.verified') : t('profile.client.not_verified')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            {t('profile.client.address_info')}
          </CardTitle>
          <CardDescription>
            {t('profile.client.address_info_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address_line1">{t('profile.client.address')}</Label>
            <Input
              id="address_line1"
              value={formData.address_line1 || ''}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t('profile.client.city')}</Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">{t('profile.client.country')}</Label>
            <Input
              id="country"
              value={formData.country || ''}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">{t('profile.client.postal_code')}</Label>
            <Input
              id="postal_code"
              value={formData.postal_code || ''}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}