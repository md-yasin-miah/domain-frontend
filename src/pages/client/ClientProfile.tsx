import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Building, Globe, Phone, Mail, Calendar } from "lucide-react";
import { mockData, mockAuth } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface ClientProfile {
  id: string;
  company_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  hosting_plan: string;
  domain_status: string;
  services: string[];
  monthly_fee: number;
  contract_start_date: string;
  contract_end_date?: string;
  status: string;
  notes?: string;
  metadata: any;
}

export default function ClientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    notes: ''
  });

  useEffect(() => {
    fetchClientProfile();
  }, []);

  const fetchClientProfile = async () => {
    if (!user) return;
    try {
      const profileData = await mockData.getClientProfile(user.id);
      
      if (profileData) {
        const mockProfile: ClientProfile = {
          id: profileData.id,
          company_name: profileData.company_name || '',
          contact_person: profileData.full_name || '',
          contact_email: user.email || '',
          contact_phone: profileData.phone_number || '',
          website_url: '',
          hosting_plan: 'Standard',
          domain_status: 'Active',
          services: [],
          monthly_fee: 0,
          contract_start_date: new Date().toISOString(),
          status: 'Active',
          notes: '',
          metadata: {},
        };
        setProfile(mockProfile);
        setFormData({
          contact_person: mockProfile.contact_person,
          contact_email: mockProfile.contact_email,
          contact_phone: mockProfile.contact_phone || '',
          website_url: mockProfile.website_url || '',
          notes: mockProfile.notes || ''
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
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      await mockData.updateClientProfile(user.id, {
        full_name: formData.contact_person,
        phone_number: formData.contact_phone,
      });

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente"
      });

      setIsEditing(false);
      fetchClientProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar el perfil: ${error.message}`,
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
          <Badge variant={getStatusColor(profile.status)}>
            {profile.status === 'active' ? 'Activo' : profile.status}
          </Badge>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setFormData({
                  contact_person: profile.contact_person || '',
                  contact_email: profile.contact_email || '',
                  contact_phone: profile.contact_phone || '',
                  website_url: profile.website_url || '',
                  notes: profile.notes || ''
                });
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
              <Label>Nombre de la Empresa</Label>
              <Input value={profile.company_name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Persona de Contacto</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
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
              <Label htmlFor="website_url">URL del Sitio Web</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                disabled={!isEditing}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Plan de Hosting</Label>
              <Input value={getPlanName(profile.hosting_plan)} disabled />
            </div>
            <div className="space-y-2">
              <Label>Estado del Dominio</Label>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(profile.domain_status)}>
                  {profile.domain_status === 'active' ? 'Activo' : 
                   profile.domain_status === 'pending' ? 'Pendiente' : profile.domain_status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tarifa Mensual</Label>
              <Input value={`$${profile.monthly_fee}`} disabled />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Información del Contrato
          </CardTitle>
          <CardDescription>
            Fechas y términos del contrato
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Fecha de Inicio</Label>
            <Input 
              value={new Date(profile.contract_start_date).toLocaleDateString('es-ES')} 
              disabled 
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha de Fin</Label>
            <Input 
              value={profile.contract_end_date ? 
                new Date(profile.contract_end_date).toLocaleDateString('es-ES') : 
                'Sin fecha de fin'
              } 
              disabled 
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales</CardTitle>
          <CardDescription>
            Información adicional o comentarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={!isEditing}
            placeholder="Agregar notas o comentarios..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}