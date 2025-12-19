import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Database, Download, RotateCcw, Clock, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { mockData, mockAuth } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface Backup {
  id: string;
  backup_type: string;
  backup_scope: string;
  file_path: string;
  file_size: number;
  status: string;
  created_at: string;
  completed_at?: string;
  metadata: any;
}

interface RestoreLog {
  id: string;
  backup_id: string;
  restore_type: string;
  status: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export default function BackupSettings() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [restoreLogs, setRestoreLogs] = useState<RestoreLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledBackups, setScheduledBackups] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState('30');
  const { toast } = useToast();

  const fetchBackups = async () => {
    try {
      // Simulate backup data for now - using mock data
      const mockBackups: Backup[] = [
        {
          id: '1',
          backup_type: 'manual',
          backup_scope: 'full',
          file_path: '/backups/20241201-full-backup.sql',
          file_size: 1500000,
          status: 'completed',
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          metadata: { scope: 'full', triggered_by: 'admin' }
        }
      ];
      setBackups(mockBackups);
    } catch (error: any) {
      console.error('Error fetching backups:', error);
    }
  };

  const fetchRestoreLogs = async () => {
    try {
      // Simulate restore logs for now - using mock data
      const mockLogs: RestoreLog[] = [];
      setRestoreLogs(mockLogs);
    } catch (error: any) {
      console.error('Error fetching restore logs:', error);
    }
  };

  const createManualBackup = async (scope: 'database' | 'storage' | 'full') => {
    try {
      setLoading(true);
      
      // Simulate backup creation with mock data
      const newBackup: Backup = {
        id: Date.now().toString(),
        backup_type: 'manual',
        backup_scope: scope,
        file_path: `/backups/${Date.now()}-${scope}-backup.sql`,
        file_size: Math.floor(Math.random() * 1000000) + 500000,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        metadata: {
          scope,
          triggered_by: 'admin',
          compression: 'gzip'
        }
      };

      toast({
        title: "Backup Iniciado",
        description: `Se ha iniciado el backup ${scope}. Recibirás una notificación cuando complete.`
      });

      // Simulate completion after 3 seconds
      setTimeout(() => {
        newBackup.status = 'completed';
        newBackup.completed_at = new Date().toISOString();
        setBackups(prev => [newBackup, ...prev]);
        
        toast({
          title: "Backup Completado",
          description: `El backup ${scope} se completó exitosamente.`
        });
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo crear el backup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = async (backup: Backup) => {
    try {
      // En una implementación real, esto generaría un URL temporal firmado
      toast({
        title: "Descarga Iniciada",
        description: "Se ha iniciado la descarga del backup. El archivo es muy grande, puede tardar varios minutos."
      });
      
      // Simular descarga
      setTimeout(() => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('# Backup simulado\n# Este es un archivo de ejemplo'));
        element.setAttribute('download', `backup-${backup.id}.sql`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo descargar el backup",
        variant: "destructive"
      });
    }
  };

  const restoreBackup = async (backup: Backup, restoreType: 'staging' | 'production') => {
    try {
      setLoading(true);
      
      // Simulate restore process with mock data
      const newLog: RestoreLog = {
        id: Date.now().toString(),
        backup_id: backup.id,
        restore_type: restoreType,
        status: 'in_progress',
        created_at: new Date().toISOString()
      };

      toast({
        title: "Restauración Iniciada",
        description: `Se ha iniciado la restauración en ${restoreType}. Este proceso puede tardar varios minutos.`
      });

      // Simulate restore process
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        newLog.status = success ? 'completed' : 'failed';
        newLog.error_message = success ? undefined : 'Error simulado en la restauración';
        newLog.completed_at = new Date().toISOString();
        
        setRestoreLogs(prev => [newLog, ...prev]);

        toast({
          title: success ? "Restauración Completada" : "Error en Restauración",
          description: success 
            ? `La restauración en ${restoreType} se completó exitosamente.`
            : `Error en la restauración. Revisa los logs para más detalles.`,
          variant: success ? "default" : "destructive"
        });
      }, 5000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la restauración",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { variant: "default", icon: CheckCircle, color: "text-green-600" },
      in_progress: { variant: "secondary", icon: Clock, color: "text-blue-600" },
      failed: { variant: "destructive", icon: XCircle, color: "text-red-600" }
    };
    
    const config = variants[status] || variants.in_progress;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status === 'completed' ? 'Completado' : 
         status === 'in_progress' ? 'En progreso' : 
         status === 'failed' ? 'Falló' : status}
      </Badge>
    );
  };

  useEffect(() => {
    fetchBackups();
    fetchRestoreLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup y Restauración</h1>
          <p className="text-muted-foreground">Gestiona copias de seguridad y restauraciones del sistema</p>
        </div>
        <Badge variant="secondary">Backup Manager</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Backup Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Backup Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Crear copias de seguridad inmediatas del sistema
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => createManualBackup('database')}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                <Database className="h-4 w-4 mr-2" />
                Backup Base de Datos
              </Button>
              
              <Button 
                onClick={() => createManualBackup('storage')}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                <Shield className="h-4 w-4 mr-2" />
                Backup Storage
              </Button>
              
              <Button 
                onClick={() => createManualBackup('full')}
                disabled={loading}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Backup Completo
              </Button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Los backups completos pueden tardar varios minutos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Backups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Backups Programados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="scheduled">Backups Automáticos</Label>
              <Switch 
                id="scheduled"
                checked={scheduledBackups}
                onCheckedChange={setScheduledBackups}
              />
            </div>

            {scheduledBackups && (
              <>
                <div className="space-y-2">
                  <Label>Frecuencia</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario (3:00 AM)</SelectItem>
                      <SelectItem value="weekly">Semanal (Domingos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Retención</Label>
                  <Select value={retentionDays} onValueChange={setRetentionDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  Próximo backup programado: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('es-ES')}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de Datos</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600">Saludable</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600">Disponible</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Espacio Libre</span>
                <span className="text-sm font-medium">847 GB</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Último Backup</span>
                <span className="text-sm">
                  {backups.length > 0 
                    ? new Date(backups[0].created_at).toLocaleDateString('es-ES')
                    : 'Nunca'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Alcance</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>
                    {new Date(backup.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {backup.backup_type === 'manual' ? 'Manual' : 'Programado'}
                    </Badge>
                  </TableCell>
                  <TableCell>{backup.backup_scope}</TableCell>
                  <TableCell>{formatFileSize(backup.file_size)}</TableCell>
                  <TableCell>{getStatusBadge(backup.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBackup(backup)}
                        disabled={backup.status !== 'completed'}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={backup.status !== 'completed' || loading}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restaurar Backup</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Dónde quieres restaurar este backup? Se recomienda probar primero en staging.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => restoreBackup(backup, 'staging')}>
                              Restaurar en Staging
                            </AlertDialogAction>
                            <AlertDialogAction 
                              onClick={() => restoreBackup(backup, 'production')}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Restaurar en Producción
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Restore Logs */}
      {restoreLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Restauraciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Entorno</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restoreLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.restore_type === 'production' ? 'default' : 'secondary'}>
                        {log.restore_type === 'production' ? 'Producción' : 'Staging'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      {log.error_message && (
                        <span className="text-sm text-red-600">{log.error_message}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}