import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, UserPlus, Eye, Ban, CheckCircle, AlertTriangle, Users } from "lucide-react";

const AdminUsuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: "1",
      name: "Carlos Rodriguez",
      email: "carlos@example.com",
      type: "Seller",
      status: "Verified",
      joinDate: "2024-01-15",
      totalTransactions: "$125,000",
      kycStatus: "Approved",
      lastLogin: "2024-01-20"
    },
    {
      id: "2",
      name: "Maria González",
      email: "maria@example.com",
      type: "Buyer",
      status: "Pending",
      joinDate: "2024-01-18",
      totalTransactions: "$45,000",
      kycStatus: "Pending",
      lastLogin: "2024-01-19"
    },
    {
      id: "3",
      name: "David Chen",
      email: "david@example.com",
      type: "Seller",
      status: "Verified",
      joinDate: "2024-01-10",
      totalTransactions: "$89,500",
      kycStatus: "Approved",
      lastLogin: "2024-01-20"
    },
    {
      id: "4",
      name: "Ana Silva",
      email: "ana@example.com",
      type: "Buyer",
      status: "Suspended",
      joinDate: "2024-01-12",
      totalTransactions: "$12,000",
      kycStatus: "Rejected",
      lastLogin: "2024-01-17"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-100 text-green-800">Verificado</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "Suspended":
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra usuarios, verificaciones KYC y estados de cuenta</p>
        </div>
        <Badge variant="secondary">Admin Portal</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Usuarios</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Verificados</p>
                <p className="text-2xl font-bold">982</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold">185</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Suspendidos</p>
                <p className="text-2xl font-bold">80</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Transacciones</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                  <TableCell className="font-medium">{user.totalTransactions}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsuarios;