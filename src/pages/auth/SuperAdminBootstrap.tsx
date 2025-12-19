import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertTriangle, Loader2, Info } from "lucide-react";
import { mockData, mockAuth } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface BootstrapResponse {
  success: boolean;
  message: string;
  user_id?: string;
  email?: string;
  error?: string;
  details?: string;
  already_exists?: boolean;
  created_new?: boolean;
}

export default function SuperAdminBootstrap() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<BootstrapResponse | null>(null);
  const { toast } = useToast();

  const handleCreateSuperAdmin = async () => {
    if (!email || !password) {
      toast({
        title: "❌ Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "❌ Error", 
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('🚀 Iniciando bootstrap del Super Admin...');
      console.log('📧 Email:', email);
      
      const { data, error } = await supabase.functions.invoke('super-admin-bootstrap', {
        body: {
          email: email.trim(),
          password: password
        }
      });

      console.log('📨 Respuesta recibida:', { data, error });

      if (error) {
        console.error('❌ Error en función:', error);
        throw new Error(`Error de función: ${error.message || 'Error desconocido'}`);
      }

      const response = data as BootstrapResponse;
      setResult(response);

      if (response && response.success) {
        setSuccess(true);
        
        if (response.already_exists) {
          toast({
            title: "⚠️ Ya Existe",
            description: "El Super Admin ya existe en el sistema",
          });
        } else {
          toast({
            title: "🎉 ¡Éxito!",
            description: "Super Admin creado correctamente",
          });
        }
      } else {
        throw new Error(response?.message || 'Error desconocido en la respuesta');
      }

    } catch (error: any) {
      console.error('💥 Error completo:', error);
      
      const errorMessage = error.message || 'Error interno del sistema';
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });

      setResult({
        success: false,
        message: errorMessage,
        error: 'BOOTSTRAP_FAILED'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSuperAdmin = async () => {
    if (!email || !password) {
      toast({ title: '❌ Error', description: 'Ingresa email y nueva contraseña', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('super-admin-bootstrap', {
        body: { email: email.trim(), password, action: 'reset' }
      });
      if (error) throw error;
      const response = data as BootstrapResponse;
      setResult(response);
      if (response.success) {
        setSuccess(true);
        toast({ title: '🔑 Contraseña actualizada', description: response.message || 'Se restableció la contraseña del Super Admin.' });
      } else {
        throw new Error(response.message || 'Error al restablecer contraseña');
      }
    } catch (error: any) {
      toast({ title: '❌ Error', description: error.message || 'Error desconocido', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!result?.success) {
      toast({
        title: "❌ Error",
        description: "Primero debes crear el Super Admin",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🔐 Intentando login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No se pudo autenticar');
      }

      // Verificar rol admin
      console.log('🔍 Verificando permisos admin...');
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin');

      if (!roles || roles.length === 0) {
        throw new Error('Usuario sin permisos de administrador');
      }

      toast({
        title: "🎉 Login Exitoso",
        description: "Redirigiendo al panel de administración...",
      });

      // Redirección al panel admin
      setTimeout(() => {
        window.location.href = "/_admin-roc-9b3a2f";
      }, 1500);

    } catch (error: any) {
      console.error('❌ Error en login:', error);
      toast({
        title: "❌ Error de Login",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Bootstrap Super Admin
          </CardTitle>
          <CardDescription className="text-lg">
            Configuración Inicial del Sistema ADOMINIOZ
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Status Alert */}
          {success && result ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>🎉 ¡Configuración Exitosa!</strong><br/>
                {result.already_exists 
                  ? 'Super Admin ya configurado en el sistema'
                  : 'Super Admin creado correctamente'
                }
                {result.user_id && (
                  <div className="mt-2 text-sm font-mono bg-green-100 p-2 rounded">
                    ID: {result.user_id}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : !loading ? (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>📋 Instrucciones:</strong><br/>
                1. Ingresa las credenciales del Super Admin<br/>
                2. Haz clic en "Crear Super Admin"<br/>
                3. Una vez creado, haz login para acceder al panel
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Error Display */}
          {result && !result.success && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>❌ Error:</strong><br/>
                {result.message}<br/>
                {result.details && (
                  <div className="mt-2 text-sm font-mono bg-red-100 p-2 rounded">
                    {result.details}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold">Email del Super Admin</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                className="mt-1"
                placeholder="admin@adominioz.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                className="mt-1"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleCreateSuperAdmin}
                className="w-full h-12 text-lg"
                disabled={loading || success}
                variant={success ? "outline" : "default"}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creando Super Admin...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    ✅ Super Admin Configurado
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    🚀 Crear Super Admin
                  </>
                )}
              </Button>

              <Button 
                onClick={handleResetSuperAdmin}
                variant="secondary"
                className="w-full h-12 text-lg"
                disabled={loading}
              >
                🔑 Restablecer Contraseña
              </Button>

              {success && (
                <Button 
                  onClick={handleLogin}
                  variant="secondary"
                  className="w-full h-12 text-lg"
                >
                  🔐 Iniciar Sesión y Acceder al Panel
                </Button>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p className="font-semibold">ADOMINIOZ</p>
            <p>DBA of ROC Worldwide Agency LLC</p>
            <p className="text-xs mt-2">Sistema de Administración v3.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}