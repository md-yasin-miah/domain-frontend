import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Building, Globe, Phone, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { profileApi } from "@/store/api/profileApi";
import type { UserProfile } from "@/store/api/types";

export default function ClientProfile() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    avatar_url: '',
    address_line1: '',
    city: '',
    country: '',
    postal_code: '',
    company_name: '',
    website: '',
  });

  const fetchClientProfile = useCallback(async () => {
    if (!user) return;
    try {
      const profileData = await dispatch(
        profileApi.endpoints.getMyProfile.initiate(undefined)
      ).unwrap();

      if (profileData) {
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || '',
          address_line1: profileData.address_line1 || '',
          city: profileData.city || '',
          country: profileData.country || '',
          postal_code: profileData.postal_code || '',
          company_name: profileData.company_name || '',
          website: profileData.website || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, dispatch, toast]);

  useEffect(() => {
    fetchClientProfile();
  }, [fetchClientProfile]);

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      await dispatch(
        profileApi.endpoints.updateProfile.initiate({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          address_line1: formData.address_line1,
          city: formData.city,
          country: formData.country,
          postal_code: formData.postal_code,
          company_name: formData.company_name,
          website: formData.website,
        })
      ).unwrap();

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente"
      });

      setIsEditing(false);
      fetchClientProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar el perfil: ${error.message || 'Error desconocido'}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
            <h3 className="text-lg font-semibold mb-2">Perfil No Encontrado</h3>
            <p className="text-muted-foreground">
              No se encontró información del cliente.
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
          <h1 className="text-3xl font-bold">Perfil del Cliente</h1>
          <p className="text-muted-foreground">Gestiona tu información de contacto y configuración</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={profile.is_verified ? 'default' : 'secondary'}>
            {profile.is_verified ? 'Verificado' : 'No Verificado'}
          </Badge>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                if (profile) {
                  setFormData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    phone: profile.phone || '',
                    bio: profile.bio || '',
                    avatar_url: profile.avatar_url || '',
                    address_line1: profile.address_line1 || '',
                    city: profile.city || '',
                    country: profile.country || '',
                    postal_code: profile.postal_code || '',
                    company_name: profile.company_name || '',
                    website: profile.website || '',
                  });
                }
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
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
              Información de la Empresa
            </CardTitle>
            <CardDescription>
              Datos generales de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nombre de la Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
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
              Información del Servicio
            </CardTitle>
            <CardDescription>
              Detalles de tu plan y servicios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">URL del Sitio Web</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Escribe una breve biografía..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado de Verificación</Label>
              <div className="flex items-center gap-2">
                <Badge variant={profile.is_verified ? 'default' : 'secondary'}>
                  {profile.is_verified ? 'Verificado' : 'No Verificado'}
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
            Información de Dirección
          </CardTitle>
          <CardDescription>
            Dirección de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Dirección</Label>
            <Input
              id="address_line1"
              value={formData.address_line1 || ''}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={formData.country || ''}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Código Postal</Label>
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