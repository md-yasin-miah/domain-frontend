import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Search, Download, Calendar, CreditCard, Filter, Eye } from "lucide-react";

const Facturas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('2024');

  // Sample invoices data
  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      description: "Renovación dominio mitiendaonline.com",
      amount: 15.99,
      status: "Pagada",
      paymentMethod: "Tarjeta de crédito",
      dueDate: "2024-01-15",
      category: "Dominios"
    },
    {
      id: "INV-2024-002",
      date: "2024-01-20",
      description: "Hosting Premium - Plan Anual",
      amount: 129.99,
      status: "Pagada",
      paymentMethod: "PayPal",
      dueDate: "2024-01-20",
      category: "Hosting"
    },
    {
      id: "INV-2024-003",
      date: "2024-02-01",
      description: "SSL Certificate - mitiendaonline.com",
      amount: 59.99,
      status: "Pendiente",
      paymentMethod: "Transferencia",
      dueDate: "2024-02-15",
      category: "Seguridad"
    },
    {
      id: "INV-2024-004",
      date: "2024-02-10",
      description: "Registro dominio blogpersonal.net",
      amount: 12.99,
      status: "Vencida",
      paymentMethod: "Tarjeta de crédito",
      dueDate: "2024-02-10",
      category: "Dominios"
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesYear = invoice.date.startsWith(filterYear);

    return matchesSearch && matchesStatus && matchesYear;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagada': return 'bg-green-500';
      case 'pendiente': return 'bg-yellow-500';
      case 'vencida': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pagada': return 'default';
      case 'pendiente': return 'secondary';
      case 'vencida': return 'destructive';
      default: return 'outline';
    }
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'Pagada').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'Pendiente').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Receipt className="w-8 h-8 text-primary" />
            Facturas y Pagos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona todas tus facturas y pagos
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">TOTAL FACTURADO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">En {filterYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">PAGADO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Facturas completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">PENDIENTE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Por pagar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por número de factura o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pagada">Pagadas</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="vencida">Vencidas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterYear} onValueChange={setFilterYear}>
          <SelectTrigger className="w-full md:w-32">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Invoice Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(invoice.status)}`} />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{invoice.id}</h3>
                      <Badge variant={getStatusBadge(invoice.status)}>
                        {invoice.status}
                      </Badge>
                      <Badge variant="outline">{invoice.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {invoice.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Fecha: {invoice.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {invoice.paymentMethod}
                      </span>
                      {invoice.status !== 'Pagada' && (
                        <span className="flex items-center gap-1">
                          Vence: {invoice.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${invoice.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {invoice.status === 'Pagada' ? 'Pagado' : 'Por pagar'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    {invoice.status === 'Pendiente' && (
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Pagar ahora
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No se encontraron facturas</h3>
          <p className="text-muted-foreground">
            Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default Facturas;