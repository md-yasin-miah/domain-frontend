import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Database, Globe, Bell, Users, FileText, Lock } from "lucide-react";

const AdminConfig = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Administra configuraciones globales de la plataforma</p>
        </div>
        <Badge variant="secondary">Admin Portal</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Autenticación de dos factores obligatoria</Label>
              <Switch id="two-factor" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="kyc-required">KYC requerido para transacciones</Label>
              <Switch id="kyc-required" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="escrow-mandatory">Escrow obligatorio</Label>
              <Switch id="escrow-mandatory" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-verification">Monto mínimo para verificación adicional</Label>
              <Input id="min-verification" type="number" placeholder="10000" />
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Configuración de Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Comisión de plataforma (%)</Label>
              <Input id="commission" type="number" placeholder="2.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-listing">Valor mínimo de listado</Label>
              <Input id="min-listing" type="number" placeholder="100" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-approve">Auto-aprobar listados verificados</Label>
              <Switch id="auto-approve" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-mode">Modo mantenimiento</Label>
              <Switch id="maintenance-mode" />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Configuración Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Tiempo de sesión (minutos)</Label>
              <Input id="session-timeout" type="number" placeholder="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-limit">Límite de peticiones por minuto</Label>
              <Input id="rate-limit" type="number" placeholder="100" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-mode">Modo debug</Label>
              <Switch id="debug-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cache-enabled">Cache habilitado</Label>
              <Switch id="cache-enabled" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* SEO & Meta Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              SEO y Meta Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Título por defecto</Label>
              <Input id="meta-title" placeholder="ADOMINIOZ - Tu sitio web" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-description">Descripción por defecto</Label>
              <Input id="meta-description" placeholder="Descripción de tu sitio web" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-keywords">Palabras clave</Label>
              <Input id="meta-keywords" placeholder="keyword1, keyword2, keyword3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-analytics">Google Analytics ID</Label>
              <Input id="google-analytics" placeholder="GA-XXXXXXXXX-X" />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Configuración de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Estado de la base de datos</Label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm">Conexión activa</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Ejecutar Backup
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Logs de Sistema
            </Button>
          </CardContent>
        </Card>

        {/* Backup & Restoration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Backup y Restauración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Backup automático</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cada 24 horas</span>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Último backup</Label>
              <p className="text-sm text-muted-foreground">Hace 2 horas</p>
            </div>
            <Button variant="outline" className="w-full">
              Crear Backup Manual
            </Button>
            <Button variant="outline" className="w-full">
              Restaurar desde Backup
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Alertas por email</Label>
              <Switch id="email-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-alerts">Alertas por SMS</Label>
              <Switch id="sms-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="transaction-alerts">Alertas de transacciones</Label>
              <Switch id="transaction-alerts" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Umbral de alerta ($)</Label>
              <Input id="alert-threshold" type="number" placeholder="50000" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Configuración Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nombre del sitio</Label>
              <Input id="site-name" defaultValue="ADOMINIOZ" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email de soporte</Label>
              <Input id="support-email" type="email" placeholder="support@adominioz.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-file-size">Tamaño máximo de archivo (MB)</Label>
              <Input id="max-file-size" type="number" placeholder="10" />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button>Guardar Configuración</Button>
            <Button variant="outline">Restablecer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConfig;