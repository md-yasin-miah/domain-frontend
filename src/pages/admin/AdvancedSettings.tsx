import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AdvancedSettings() {
  const { settings, loading, updateSetting, getSettingValue } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    for (const [key, value] of Object.entries(formData)) {
      await updateSetting(key, value, 'Configuración avanzada actualizada');
    }
    setFormData({});
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData({});
    setHasChanges(false);
  };

  const getValue = (key: string, defaultValue: any = '') => {
    return formData[key] !== undefined ? formData[key] : getSettingValue(key, defaultValue);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Configuración Avanzada</h1>
          <Badge variant="secondary">Cargando...</Badge>
        </div>
        <div className="grid gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración Avanzada</h1>
          <p className="text-muted-foreground">Gestiona parámetros avanzados del sistema y marketplace</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Cambios sin guardar
            </Badge>
          )}
          <Badge variant="secondary">Admin Portal</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Flags del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="brokers-enabled">Módulo de Brokers</Label>
              <Switch 
                id="brokers-enabled"
                checked={getValue('brokers_enabled', true)}
                onCheckedChange={(checked) => handleChange('brokers_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured-listings">Promociones Destacadas</Label>
              <Switch 
                id="featured-listings"
                checked={getValue('featured_listings_enabled', true)}
                onCheckedChange={(checked) => handleChange('featured_listings_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="market-trends">Market Trends</Label>
              <Switch 
                id="market-trends"
                checked={getValue('market_trends_enabled', true)}
                onCheckedChange={(checked) => handleChange('market_trends_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="referral-program">Programa de Referidos</Label>
              <Switch 
                id="referral-program"
                checked={getValue('referral_program_enabled', true)}
                onCheckedChange={(checked) => handleChange('referral_program_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="domain-parking">Parking de Dominios</Label>
              <Switch 
                id="domain-parking"
                checked={getValue('domain_parking_enabled', false)}
                onCheckedChange={(checked) => handleChange('domain_parking_enabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Parámetros de Negocio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marketplace-commission">Comisión Marketplace (%)</Label>
              <Input 
                id="marketplace-commission"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={getValue('marketplace_commission', 2.5)}
                onChange={(e) => handleChange('marketplace_commission', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auction-increment">Incremento Mínimo Puja ($)</Label>
              <Input 
                id="auction-increment"
                type="number"
                min="1"
                value={getValue('auction_min_increment', 50)}
                onChange={(e) => handleChange('auction_min_increment', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-expiry">Caducidad Listados (días)</Label>
              <Select 
                value={getValue('listing_expiry_days', '90')}
                onValueChange={(value) => handleChange('listing_expiry_days', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 días</SelectItem>
                  <SelectItem value="60">60 días</SelectItem>
                  <SelectItem value="90">90 días</SelectItem>
                  <SelectItem value="180">180 días</SelectItem>
                  <SelectItem value="365">1 año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured-listing-fee">Tarifa Promoción ($)</Label>
              <Input 
                id="featured-listing-fee"
                type="number"
                min="0"
                value={getValue('featured_listing_fee', 99)}
                onChange={(e) => handleChange('featured_listing_fee', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Rendimiento del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
              <Input 
                id="session-timeout"
                type="number"
                min="15"
                max="480"
                value={getValue('session_timeout_minutes', 120)}
                onChange={(e) => handleChange('session_timeout_minutes', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-limit">Límite Peticiones/min</Label>
              <Input 
                id="rate-limit"
                type="number"
                min="10"
                max="1000"
                value={getValue('rate_limit_per_minute', 100)}
                onChange={(e) => handleChange('rate_limit_per_minute', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cache-enabled">Cache Habilitado</Label>
              <Switch 
                id="cache-enabled"
                checked={getValue('cache_enabled', true)}
                onCheckedChange={(checked) => handleChange('cache_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-mode">Modo Debug</Label>
              <Switch 
                id="debug-mode"
                checked={getValue('debug_mode', false)}
                onCheckedChange={(checked) => handleChange('debug_mode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Integraciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-gateway">Estado Pasarela de Pagos</Label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm">Stripe Conectado</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kyc-provider">Proveedor KYC/AML</Label>
              <Select 
                value={getValue('kyc_provider', 'jumio')}
                onValueChange={(value) => handleChange('kyc_provider', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jumio">Jumio</SelectItem>
                  <SelectItem value="onfido">Onfido</SelectItem>
                  <SelectItem value="sumsub">Sum&Substance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-provider">Proveedor Email</Label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm">Resend Conectado</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-id">Google Analytics ID</Label>
              <Input 
                id="analytics-id"
                placeholder="GA4-XXXXXXXXX-X"
                value={getValue('google_analytics_id', '')}
                onChange={(e) => handleChange('google_analytics_id', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Configuración Sensible</h3>
              <p className="text-sm text-amber-700 mt-1">
                Los cambios en estas configuraciones afectan el funcionamiento global de la plataforma. 
                Asegúrate de probar en staging antes de aplicar en producción.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || loading}
          className="min-w-32"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={!hasChanges}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Descartar
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              Restaurar Valores por Defecto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Restaurar configuración por defecto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción restaurará todas las configuraciones avanzadas a sus valores por defecto. 
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>
                Restaurar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}