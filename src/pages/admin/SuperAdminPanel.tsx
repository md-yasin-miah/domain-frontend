import { Settings, Users, Package, TrendingUp, FileText, Image, Video, DollarSign, Shield, Database, Plus, Edit, Trash2, Eye, Upload, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { mockData, mockAuth } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import ContentManager from "@/components/admin/ContentManager";
import MediaLibrary from "@/components/admin/MediaLibrary";
import PaymentEscrow from "@/components/admin/PaymentEscrow";
import RolesPermissions from "@/components/admin/RolesPermissions";
import SuperAdminCMS from "@/components/admin/SuperAdminCMS";
import BrokerVerification from "@/components/admin/BrokerVerification";
import NoIndexHeader from "@/components/SEO/NoIndexHeader";

const SuperAdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalTransactions: 0,
    totalReferrals: 0,
    monthlyRevenue: 0,
    pendingApprovals: 0
  });
  const [contentPages, setContentPages] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [isUploadMediaOpen, setIsUploadMediaOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  // Form states
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    category: '',
    content: '',
    meta_description: '',
    status: 'draft'
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
      fetchContentPages();
      fetchMediaFiles();
    }
  }, [isAdmin]);

  const fetchAdminStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total listings
      const { count: listingsCount } = await supabase
        .from('marketplace_items')
        .select('*', { count: 'exact', head: true });

      // Get referral stats
      const { count: referralsCount } = await supabase
        .from('referral_conversions')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalListings: listingsCount || 0,
        totalTransactions: 0, // Placeholder
        totalReferrals: referralsCount || 0,
        monthlyRevenue: 0, // Placeholder
        pendingApprovals: 0 // Placeholder
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const fetchContentPages = async () => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentPages(data || []);
    } catch (error) {
      console.error('Error fetching content pages:', error);
    }
  };

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
    }
  };

  const handleCreatePage = async () => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .insert([{
          ...pageForm,
          created_by: user?.id,
          content: { html: pageForm.content },
          published_at: pageForm.status === 'published' ? new Date().toISOString() : null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Página creada",
        description: "La página ha sido creada exitosamente",
      });

      setIsCreatePageOpen(false);
      setPageForm({
        title: '',
        slug: '',
        category: '',
        content: '',
        meta_description: '',
        status: 'draft'
      });
      fetchContentPages();
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la página",
        variant: "destructive"
      });
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      toast({
        title: "Página eliminada",
        description: "La página ha sido eliminada exitosamente",
      });

      fetchContentPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la página",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Usuarios", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { title: "Listados Activos", value: stats.totalListings, icon: Package, color: "text-green-600" },
    { title: "Transacciones", value: stats.totalTransactions, icon: DollarSign, color: "text-purple-600" },
    { title: "Referidos", value: stats.totalReferrals, icon: TrendingUp, color: "text-orange-600" },
    { title: "Ingresos del Mes", value: `$${stats.monthlyRevenue}`, icon: DollarSign, color: "text-emerald-600" },
    { title: "Pendientes", value: stats.pendingApprovals, icon: Shield, color: "text-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <div className="py-12 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-roboto font-black text-foreground mb-2">
                Panel Super Administrador
              </h1>
              <p className="text-lg text-muted-foreground">
                Control total de la plataforma y gestión de contenidos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-8 max-w-5xl mx-auto mb-8">
              <TabsTrigger value="cms">CMS</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="brokers">Brokers</TabsTrigger>
              <TabsTrigger value="referrals">Referidos</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            {/* CMS Management */}
            <TabsContent value="cms" className="space-y-4">
              <SuperAdminCMS />
            </TabsContent>

            {/* Content Management */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gestión de Contenido</CardTitle>
                      <CardDescription>
                        Crea y administra páginas, guías y contenido del sitio
                      </CardDescription>
                    </div>
                    <Dialog open={isCreatePageOpen} onOpenChange={setIsCreatePageOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-primary to-secondary">
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Página
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Crear Nueva Página</DialogTitle>
                          <DialogDescription>
                            Agrega una nueva página de contenido al sitio
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Título</label>
                              <Input
                                value={pageForm.title}
                                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                placeholder="Título de la página"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Slug</label>
                              <Input
                                value={pageForm.slug}
                                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                                placeholder="url-amigable"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Categoría</label>
                              <Select value={pageForm.category} onValueChange={(value) => setPageForm({ ...pageForm, category: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="guides">Guías</SelectItem>
                                  <SelectItem value="resources">Recursos</SelectItem>
                                  <SelectItem value="help">Ayuda</SelectItem>
                                  <SelectItem value="blog">Blog</SelectItem>
                                  <SelectItem value="legal">Legal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Estado</label>
                              <Select value={pageForm.status} onValueChange={(value) => setPageForm({ ...pageForm, status: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Borrador</SelectItem>
                                  <SelectItem value="published">Publicado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Meta Descripción</label>
                            <Input
                              value={pageForm.meta_description}
                              onChange={(e) => setPageForm({ ...pageForm, meta_description: e.target.value })}
                              placeholder="Descripción para SEO (160 caracteres max)"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Contenido</label>
                            <Textarea
                              value={pageForm.content}
                              onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                              placeholder="Contenido de la página (HTML permitido)"
                              rows={8}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsCreatePageOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleCreatePage}>
                              Crear Página
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentPages.map((page: any) => (
                      <div key={page.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{page.title}</h3>
                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                              {page.status}
                            </Badge>
                            <Badge variant="outline">{page.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">/{page.slug}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Creado el {new Date(page.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePage(page.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Library */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Biblioteca de Medios</CardTitle>
                      <CardDescription>
                        Gestiona imágenes, videos y archivos multimedia
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mediaFiles.map((file: any) => (
                      <Card key={file.id} className="hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                            {file.mime_type.startsWith('image/') ? (
                              <Image className="w-8 h-8 text-muted-foreground" />
                            ) : (
                              <Video className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <p className="font-medium text-sm truncate">{file.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Management */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Categorías</CardTitle>
                  <CardDescription>
                    Administra categorías de marketplace y contenido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Gestión de categorías - Próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Broker Verification */}
            <TabsContent value="brokers">
              <BrokerVerification />
            </TabsContent>
            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>Programa de Referidos</CardTitle>
                  <CardDescription>
                    Administra comisiones, pagos y configuración del programa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Panel de referidos - Próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestión de Usuarios
                  </CardTitle>
                  <CardDescription>
                    Administrar usuarios, roles y permisos del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{stats.totalUsers}</div>
                          <div className="text-sm text-muted-foreground">Usuarios Totales</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            {stats.totalUsers > 0 ? 1 : 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Administradores</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.max(0, stats.totalUsers - 1)}
                          </div>
                          <div className="text-sm text-muted-foreground">Usuarios Regulares</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">0</div>
                          <div className="text-sm text-muted-foreground">Brokers Activos</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Ver Todos los Usuarios
                      </Button>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Gestionar Roles
                      </Button>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Logs de Seguridad
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración del Sistema
                  </CardTitle>
                  <CardDescription>
                    Ajustes generales y configuraciones avanzadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Configuración General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Modo mantenimiento</span>
                            <Button variant="outline" size="sm">Desactivado</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Registros públicos</span>
                            <Button variant="outline" size="sm">Activados</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Verificación email</span>
                            <Button variant="outline" size="sm">Requerida</Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Configuración Financiera</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Comisión por defecto</span>
                            <Button variant="outline" size="sm">5%</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Moneda principal</span>
                            <Button variant="outline" size="sm">USD</Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Pagos automáticos</span>
                            <Button variant="outline" size="sm">Activados</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración Avanzada
                      </Button>
                      <Button variant="outline">
                        <Globe className="h-4 w-4 mr-2" />
                        SEO y Meta Tags
                      </Button>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Backup y Restauración
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default SuperAdminPanel;