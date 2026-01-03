import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Search, Plus, Clock, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { useAuth } from "@/store/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Soporte = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: '',
    message: '',
    clientName: '',
    websiteUrl: '',
    email: '',
    name: ''
  });

  const [tab, setTab] = useState(user ? 'tickets' : 'create');

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Sample support tickets data
  const tickets = [
    {
      id: "TKT-2024-001",
      subject: "Problema con configuración DNS",
      category: "Técnico",
      priority: "Alta",
      status: "Abierto",
      created: "2024-01-15",
      updated: "2024-01-16",
      messages: 3,
      agent: "Carlos Técnico"
    },
    {
      id: "TKT-2024-002",
      subject: "Consulta sobre renovación de dominio",
      category: "Facturación",
      priority: "Media",
      status: "En progreso",
      created: "2024-01-12",
      updated: "2024-01-14",
      messages: 5,
      agent: "María Soporte"
    },
    {
      id: "TKT-2024-003",
      subject: "Certificado SSL no se activa",
      category: "Técnico",
      priority: "Alta",
      status: "Resuelto",
      created: "2024-01-10",
      updated: "2024-01-11",
      messages: 7,
      agent: "Luis Técnico"
    },
    {
      id: "TKT-2024-004",
      subject: "Solicitud de cambio de plan",
      category: "Ventas",
      priority: "Baja",
      status: "Cerrado",
      created: "2024-01-08",
      updated: "2024-01-09",
      messages: 2,
      agent: "Ana Ventas"
    }
  ];

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'abierto': return 'bg-blue-500';
      case 'en progreso': return 'bg-yellow-500';
      case 'resuelto': return 'bg-green-500';
      case 'cerrado': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'abierto': return 'default';
      case 'en progreso': return 'secondary';
      case 'resuelto': return 'default';
      case 'cerrado': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baja': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleCreateTicket = () => {
    // Validate required fields for non-authenticated users
    if (!user && (!newTicket.email || !newTicket.name)) {
      toast({
        title: "❌ Campos requeridos",
        description: "Por favor ingresa tu nombre y email para crear el ticket",
        variant: "destructive"
      });
      return;
    }

    // Handle ticket creation
    console.log('Creating ticket:', newTicket);
    toast({
      title: "✅ Ticket creado",
      description: "Tu ticket de soporte ha sido creado exitosamente. Te contactaremos pronto.",
    });

    // Reset form
    setNewTicket({ subject: '', category: '', priority: '', message: '', clientName: '', websiteUrl: '', email: '', name: '' });
  };

  const handleContactSubmit = () => {
    // Handle contact form submission
    console.log('Contact form:', contactForm);
    toast({
      title: "✅ Mensaje enviado",
      description: "Hemos recibido tu mensaje. Te responderemos pronto.",
    });

    // Reset form
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Soporte Técnico
          </h1>
          <p className="text-muted-foreground mt-2">
            Obtén ayuda rápida y eficiente para todos tus problemas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Mis Tickets</TabsTrigger>
          <TabsTrigger value="create">Nuevo Ticket</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conocimientos</TabsTrigger>
        </TabsList>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="mt-6">
          {!user ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tus tickets</h3>
                <p className="text-muted-foreground mb-4">
                  Para ver el historial de tus tickets, inicia sesión. También puedes crear un ticket sin registrarte.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setTab('create')}>
                    Crear ticket sin cuenta
                  </Button>
                  <Button onClick={() => setTab('create')}>
                    Nuevo Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar tickets por asunto o número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        {/* Ticket Info */}
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`} />
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                              <Badge variant={getStatusBadge(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>#{ticket.id}</span>
                              <span>Categoría: {ticket.category}</span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {ticket.messages} mensajes
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Creado: {ticket.created}</span>
                              <span>Actualizado: {ticket.updated}</span>
                              {ticket.agent && <span>Agente: {ticket.agent}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                          {ticket.status !== 'Cerrado' && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              Responder
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tienes tickets</h3>
                  <p className="text-muted-foreground mb-4">
                    ¿Necesitas ayuda? Crea tu primer ticket de soporte
                  </p>
                  <Button onClick={() => setTab('create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Ticket
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Create Ticket Tab */}
        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Ticket</CardTitle>
              <CardDescription>
                Describe tu problema y nuestro equipo te ayudará lo antes posible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!user && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    💡 <strong>Consejo:</strong> No necesitas iniciar sesión para crear un ticket. Solo completa el formulario con tu información de contacto.
                  </p>
                </div>
              )}

              {!user && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre *</label>
                    <Input
                      placeholder="Tu nombre completo"
                      value={newTicket.name}
                      onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={newTicket.email}
                      onChange={(e) => setNewTicket({ ...newTicket, email: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asunto *</label>
                  <Input
                    placeholder="Describe brevemente tu problema"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría *</label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Soporte Técnico</SelectItem>
                      <SelectItem value="facturacion">Facturación</SelectItem>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="general">Consulta General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente / Empresa</label>
                  <Input
                    placeholder="Nombre del cliente o empresa"
                    value={newTicket.clientName}
                    onChange={(e) => setNewTicket({ ...newTicket, clientName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sitio Web (URL)</label>
                <Input
                  placeholder="https://ejemplo.com"
                  value={newTicket.websiteUrl}
                  onChange={(e) => setNewTicket({ ...newTicket, websiteUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción del problema</label>
                <Textarea
                  placeholder="Describe tu problema con el mayor detalle posible..."
                  rows={6}
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                />
              </div>

              <Button
                onClick={handleCreateTicket}
                className="bg-primary hover:bg-primary/90"
                disabled={
                  !newTicket.subject ||
                  !newTicket.category ||
                  !newTicket.message ||
                  (!user && (!newTicket.email || !newTicket.name))
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Ticket
              </Button>

              {!user && (
                <p className="text-xs text-muted-foreground">
                  * Campos requeridos. Recibirás una copia del ticket en tu email.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contacto Directo</CardTitle>
              <CardDescription>
                ¿Prefieres contactarnos directamente? Completa el formulario y te responderemos pronto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre completo *</label>
                  <Input
                    placeholder="Tu nombre"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Asunto *</label>
                <Input
                  placeholder="¿En qué podemos ayudarte?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mensaje *</label>
                <Textarea
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <Button
                onClick={handleContactSubmit}
                className="bg-primary hover:bg-primary/90"
                disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>

              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">Otros canales de contacto</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">soporte@adominioz.com</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Teléfono</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Horario</p>
                    <p className="font-medium">Lun - Vie: 9:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Chat en vivo</p>
                    <p className="font-medium">Disponible 24/7</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FAQ Categories */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Preguntas Frecuentes</CardTitle>
                <CardDescription>
                  Respuestas a las preguntas más comunes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Guías de Configuración</CardTitle>
                <CardDescription>
                  Tutoriales paso a paso para configurar tus servicios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Solución de Problemas</CardTitle>
                <CardDescription>
                  Resuelve problemas comunes por ti mismo
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Artículos Populares</h3>
            <div className="space-y-3">
              {[
                "¿Cómo configurar los registros DNS de mi dominio?",
                "Instalación de certificado SSL",
                "¿Cómo renovar mi dominio automáticamente?",
                "Configuración de correo electrónico",
                "Migración de hosting a nuestros servidores"
              ].map((article, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-medium">{article}</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Soporte;