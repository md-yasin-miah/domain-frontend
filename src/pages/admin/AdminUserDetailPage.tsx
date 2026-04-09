import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Globe,
  Calendar,
  Link2,
  Users,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPublicProfileQuery,
  useUpdateUserProfileAdminMutation,
  type ClientProfile,
} from "@/store/api/profileApi";
import { useGetUserQuery } from "@/store/api/userApi";
import { ROUTES } from "@/lib/routes";

const emptyFormData = (): Partial<ClientProfile> => ({
  first_name: "",
  last_name: "",
  phone: "",
  bio: "",
  avatar_url: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  company_name: "",
  website: "",
  social_links: {},
});

function profileToFormData(profile: ClientProfile): Partial<ClientProfile> {
  return {
    ...profile,
    first_name: profile.first_name ?? "",
    last_name: profile.last_name ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    avatar_url: profile.avatar_url ?? "",
    address_line1: profile.address_line1 ?? "",
    address_line2: profile.address_line2 ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    country: profile.country ?? "",
    postal_code: profile.postal_code ?? "",
    company_name: profile.company_name ?? "",
    website: profile.website ?? "",
    social_links: profile.social_links ?? {},
  };
}

export default function AdminUserDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = id ? parseInt(id, 10) : NaN;
  const isValidId = !isNaN(userId) && userId > 0;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientProfile>>(emptyFormData());

  const { data: user, isLoading: loadingUser } = useGetUserQuery(userId, {
    skip: !isValidId,
  });
  const {
    data: profile,
    isLoading: loadingProfile,
    error: profileError,
    isError,
    refetch,
  } = useGetPublicProfileQuery(userId, { skip: !isValidId });

  const [updateProfileAdmin, { isLoading: saving }] = useUpdateUserProfileAdminMutation();

  const loading = loadingUser || loadingProfile;
  const hasProfile = !!profile;
  const is404 = isError && (profileError as { status?: number })?.status === 404;

  useEffect(() => {
    if (profile) {
      setFormData(profileToFormData(profile));
    } else if (is404) {
      setFormData(emptyFormData());
    }
  }, [profile, is404]);

  useEffect(() => {
    if (profileError && !is404) {
      toast({
        title: t("profile.client.error_loading"),
        description: t("profile.client.error_loading_desc"),
        variant: "destructive",
      });
    }
  }, [profileError, is404, toast, t]);

  const handleSave = async () => {
    if (!isValidId) return;

    const payload = {
      first_name: formData.first_name || undefined,
      last_name: formData.last_name || undefined,
      phone: formData.phone || undefined,
      bio: formData.bio || undefined,
      avatar_url: formData.avatar_url || undefined,
      address_line1: formData.address_line1 || undefined,
      address_line2: formData.address_line2 || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      postal_code: formData.postal_code || undefined,
      company_name: formData.company_name || undefined,
      website: formData.website || undefined,
      social_links:
        formData.social_links && Object.keys(formData.social_links).length > 0
          ? formData.social_links
          : null,
    };

    const cleanedData = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );

    try {
      await updateProfileAdmin({ userId, data: cleanedData }).unwrap();
      toast({
        title: t("profile.client.success_update"),
        description: t("profile.client.success_update_desc"),
      });
      setIsEditing(false);
      refetch();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof (err as { data: { detail?: string } }).data === "object"
          ? String((err as { data: { detail?: string } }).data?.detail ?? t("common.error"))
          : t("common.error");
      toast({
        title: t("profile.client.error_update"),
        description: message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    if (profile) setFormData(profileToFormData(profile));
    else setFormData(emptyFormData());
  };

  if (!isValidId) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t("admin.user_detail.invalid_id")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading && !user && !profile) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-24 bg-muted animate-pulse rounded" />
              <div className="h-24 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError && !is404) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t("profile.client.error_loading_desc")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (is404) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {user?.username ?? user?.email ?? `User #${userId}`}
            </CardTitle>
            <CardDescription>
              {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t("profile.client.profile_not_found")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName =
    profile?.first_name || profile?.last_name
      ? [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim()
      : user?.username ?? user?.email ?? `User #${userId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              {displayName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user?.email}
              {user?.roles?.length ? (
                <span className="flex gap-1 ml-2">
                  {user.roles.map((r: string) => (
                    <Badge key={r} variant="secondary">
                      {r}
                    </Badge>
                  ))}
                </span>
              ) : null}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {hasProfile && (
            <Badge variant={profile?.is_verified ? "default" : "secondary"}>
              {profile?.is_verified ? t("profile.client.verified") : t("profile.client.not_verified")}
            </Badge>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>{t("profile.client.edit_profile")}</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm}>
                {t("profile.client.cancel")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? t("profile.client.saving") : t("profile.client.save")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              {t("profile.client.company_info")}
            </CardTitle>
            <CardDescription>{t("profile.client.company_info_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar_url">{t("profile.client.avatar_url")}</Label>
              <Input
                id="avatar_url"
                type="url"
                value={formData.avatar_url ?? ""}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                readOnly={!isEditing}
                placeholder={t("profile.client.avatar_url_placeholder")}
              />
              {formData.avatar_url && (
                <div className="mt-2">
                  <img
                    src={formData.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">{t("profile.client.company_name")}</Label>
              <Input
                id="company_name"
                value={formData.company_name ?? ""}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">{t("profile.client.first_name")}</Label>
              <Input
                id="first_name"
                value={formData.first_name ?? ""}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t("profile.client.last_name")}</Label>
              <Input
                id="last_name"
                value={formData.last_name ?? ""}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("profile.client.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone ?? ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                readOnly={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              {t("profile.client.service_info")}
            </CardTitle>
            <CardDescription>{t("profile.client.service_info_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">{t("profile.client.website")}</Label>
              <Input
                id="website"
                value={formData.website ?? ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                readOnly={!isEditing}
                placeholder={t("profile.client.website_placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t("profile.client.bio")}</Label>
              <Textarea
                id="bio"
                value={formData.bio ?? ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                readOnly={!isEditing}
                placeholder={t("profile.client.bio_placeholder")}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.client.verification_status")}</Label>
              <Badge variant={profile?.is_verified ? "default" : "secondary"}>
                {profile?.is_verified ? t("profile.client.verified") : t("profile.client.not_verified")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            {t("profile.client.address_info")}
          </CardTitle>
          <CardDescription>{t("profile.client.address_info_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address_line1">{t("profile.client.address")}</Label>
            <Input
              id="address_line1"
              value={formData.address_line1 ?? ""}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              readOnly={!isEditing}
              placeholder={t("profile.client.address_placeholder")}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address_line2">{t("profile.client.address_line2")}</Label>
            <Input
              id="address_line2"
              value={formData.address_line2 ?? ""}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              readOnly={!isEditing}
              placeholder={t("profile.client.address_line2_placeholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t("profile.client.city")}</Label>
            <Input
              id="city"
              value={formData.city ?? ""}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">{t("profile.client.state")}</Label>
            <Input
              id="state"
              value={formData.state ?? ""}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">{t("profile.client.country")}</Label>
            <Input
              id="country"
              value={formData.country ?? ""}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">{t("profile.client.postal_code")}</Label>
            <Input
              id="postal_code"
              value={formData.postal_code ?? ""}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            {t("profile.client.social_links")}
          </CardTitle>
          <CardDescription>{t("profile.client.social_links_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {["facebook", "twitter", "linkedin", "instagram", "github", "youtube"].map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`social_${key}`}>{t(`profile.client.social_${key}`)}</Label>
              <Input
                id={`social_${key}`}
                type="url"
                value={formData.social_links?.[key] ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, [key]: e.target.value },
                  })
                }
                readOnly={!isEditing}
                placeholder={`https://${key}.com/username`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
