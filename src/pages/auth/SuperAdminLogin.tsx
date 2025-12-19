import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockData, mockAuth } from "@/lib/mockData";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreateSuperAdmin from "@/components/admin/CreateSuperAdmin";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  const checkIfLocked = () => {
    if (lockoutTime && new Date() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime.getTime() - new Date().getTime()) / 60000);
      toast({
        title: "Acceso Bloqueado",
        description: `Demasiados intentos fallidos. Intente en ${remainingTime} minutos.`,
        variant: "destructive",
      });
      return true;
    }
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkIfLocked()) return;
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockTime = new Date(Date.now() + LOCKOUT_DURATION);
          setLockoutTime(lockTime);
          toast({
            title: "Acceso Bloqueado",
            description: "Demasiados intentos fallidos. Acceso bloqueado por 15 minutos.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error de Autenticación",
            description: `Credenciales incorrectas. ${MAX_ATTEMPTS - newAttempts} intentos restantes.`,
            variant: "destructive",
          });
        }
        return;
      }

      // Verify admin role
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('user_id', data.user.id);

      const isAdmin = userRoles?.some(ur => (ur.roles as any)?.name === 'Admin');
      
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast({
          title: "Acceso Denegado",
          description: "No tiene permisos de super administrador.",
          variant: "destructive",
        });
        return;
      }

      // Log security event
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'super_admin_login',
          details: { email: data.user.email, ip: 'hidden_for_privacy' },
          severity: 'high'
        }
      });

      toast({
        title: "Acceso Autorizado",
        description: "Bienvenido al panel de super administrador.",
      });

      navigate("/_admin-roc-9b3a2f");
    } catch (error) {
      toast({
        title: "Error del Sistema",
        description: "Error interno. Contacte al soporte técnico.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use edge function for secure super admin creation
      const { data, error } = await supabase.functions.invoke('super-admin-bootstrap', {
        body: {
          email,
          password: newPassword,
          action: 'reset'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Cuenta Creada",
          description: data.message || "Su nueva contraseña ha sido establecida. Puede iniciar sesión.",
        });

        setRequiresPasswordChange(false);
        setEmail("");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(data.message || 'Error al crear super administrador');
      }
    } catch (error) {
      toast({
        title: "Error del Sistema",
        description: "No se pudo crear la cuenta. Contacte al soporte técnico.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Acceso Restringido
          </CardTitle>
          <CardDescription>
            Panel de Super Administrador - ADOMINIOZ
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>ADVERTENCIA:</strong> Área de alta seguridad. Todas las acciones son monitoreadas y registradas.
            </AlertDescription>
          </Alert>

          {!requiresPasswordChange ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email del Super Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@adominioz.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <Alert className="border-warning/20 bg-warning/5">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning">
                    Intentos fallidos: {attempts}/{MAX_ATTEMPTS}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-destructive to-destructive/80"
                disabled={isLoading || checkIfLocked()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Acceder al Panel
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Alert className="border-warning/20 bg-warning/5">
                <Lock className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  <strong>Cambio de Contraseña Requerido</strong><br />
                  Debe establecer una nueva contraseña para continuar.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita la contraseña"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Estableciendo...</span>
                  </div>
                ) : (
                  "Establecer Nueva Contraseña"
                )}
              </Button>

              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setRequiresPasswordChange(false)}
                disabled={isLoading}
              >
                Volver al Login
              </Button>
            </form>
          )}

          {/* Create Super Admin Section */}
          {!requiresPasswordChange && (
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showCreateForm ? 'Ocultar' : 'Crear'} Super Admin
              </Button>
              
              {showCreateForm && (
                <div className="mt-4">
                  <CreateSuperAdmin />
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              ADOMINIOZ (DBA of ROC Worldwide Agency LLC)<br />
              Sistema protegido por medidas de seguridad avanzadas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLogin;