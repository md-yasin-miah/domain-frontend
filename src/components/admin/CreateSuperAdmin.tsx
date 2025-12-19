import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { mockData, mockAuth } from '@/lib/mockData';
import { Loader2, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CreateSuperAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateSuperAdmin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      console.log('Calling super-admin-bootstrap function...');
      
      const { data, error } = await supabase.functions.invoke('super-admin-bootstrap', {
        body: {
          email,
          password,
          action: 'create'
        }
      });

      console.log('Response:', { data, error });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      setResult(data);

      if (data.success) {
        toast({
          title: "¡Éxito!",
          description: data.message || "Super Admin creado exitosamente",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al crear Super Admin",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      const errorMessage = error.message || 'Error desconocido';
      setResult({ 
        success: false, 
        error: error.name || 'UNKNOWN_ERROR',
        message: errorMessage,
        details: error 
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSuperAdmin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('super-admin-bootstrap', {
        body: {
          email,
          password,
          action: 'check'
        }
      });

      if (error) throw error;
      setResult(data);

      toast({
        title: "Verificación Completa",
        description: data.message,
      });
    } catch (error: any) {
      console.error('Error checking super admin:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSuperAdmin = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('super-admin-bootstrap', {
        body: {
          email,
          password,
          action: 'reset'
        }
      });

      if (error) throw error;
      setResult(data);

      if (data.success) {
        toast({
          title: 'Contraseña Actualizada',
          description: data.message || 'Se ha restablecido la contraseña del Super Admin.',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'No se pudo restablecer la contraseña',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error resetting super admin password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error desconocido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Crear Super Administrador
          </CardTitle>
          <CardDescription>
            Usa esta herramienta para crear el primer Super Admin del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@adominioz.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña temporal"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleCreateSuperAdmin}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Super Admin'
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCheckSuperAdmin}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Verificar'
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleResetSuperAdmin}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Restablecer Contraseña'
              )}
            </Button>
          </div>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <strong>{result.success ? 'Éxito' : 'Error'}:</strong> {result.message}
                    {result.user_id && (
                      <div className="text-xs mt-1 text-muted-foreground">
                        User ID: {result.user_id}
                      </div>
                    )}
                    {result.error && (
                      <div className="text-xs mt-1 text-red-600">
                        Código: {result.error}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Una vez creado el Super Admin, podrás acceder en:
              <br />
              <code className="text-sm bg-muted px-1 rounded">/sys-admin-login</code>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}