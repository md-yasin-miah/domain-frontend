import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mockData, mockAuth } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Role {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

export default function RolesPermissions() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData, rolePermsData] = await Promise.all([
        supabase.from('roles').select('*').order('name'),
        supabase.from('permissions').select('*').order('category, name'),
        supabase.from('role_permissions').select('role_id, permission_id'),
      ]);

      if (rolesData.error) throw rolesData.error;
      if (permissionsData.error) throw permissionsData.error;
      if (rolePermsData.error) throw rolePermsData.error;

      setRoles(rolesData.data || []);
      setPermissions(permissionsData.data || []);
      setRolePermissions(rolePermsData.data || []);

      if (rolesData.data && rolesData.data.length > 0 && !selectedRole) {
        setSelectedRole(rolesData.data[0].id);
      }
    } catch (error: any) {
      toast({
        title: t('admin.roles_permissions.errors.fetch_error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    return rolePermissions.some(
      rp => rp.role_id === roleId && rp.permission_id === permissionId
    );
  };

  const togglePermission = async (roleId: string, permissionId: string) => {
    const exists = hasPermission(roleId, permissionId);

    try {
      // Use Edge Function to toggle permission (checks Admin role from user_roles table)
      const { data, error } = await supabase.functions.invoke('toggle-role-permission', {
        body: {
          role_id: roleId,
          permission_id: permissionId,
          action: exists ? 'remove' : 'assign',
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to toggle permission');
      }

      // Update local state
      if (exists) {
        setRolePermissions(prev =>
          prev.filter(rp => !(rp.role_id === roleId && rp.permission_id === permissionId))
        );

        toast({
          title: t('admin.roles_permissions.permission_removed'),
          description: t('admin.roles_permissions.permission_removed_desc'),
        });
      } else {
        setRolePermissions(prev => [...prev, { role_id: roleId, permission_id: permissionId }]);

        toast({
          title: t('admin.roles_permissions.permission_assigned'),
          description: t('admin.roles_permissions.permission_assigned_desc'),
        });
      }
    } catch (error: any) {
      toast({
        title: t('admin.roles_permissions.errors.permission_toggle_error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const createRole = async () => {
    if (!newRole.name) {
      toast({
        title: t('admin.roles_permissions.errors.role_name_required'),
        description: t('admin.roles_permissions.errors.role_name_required'),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Use Edge Function to create role (checks Admin role from user_roles table)
      const { data, error } = await supabase.functions.invoke('create-role', {
        body: {
          name: newRole.name,
          description: newRole.description || '',
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to create role');
      }

      setRoles(prev => [...prev, data.role]);
      setNewRole({ name: '', description: '' });
      setShowCreateDialog(false);

      toast({
        title: t('admin.roles_permissions.role_created'),
        description: t('admin.roles_permissions.role_created_desc'),
      });
    } catch (error: any) {
      toast({
        title: t('admin.roles_permissions.errors.create_error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateRole = async () => {
    if (!editingRole) return;

    try {
      // Use Edge Function to update role (checks Admin role from user_roles table)
      const { data, error } = await supabase.functions.invoke('update-role', {
        body: {
          role_id: editingRole.id,
          name: editingRole.name,
          description: editingRole.description || '',
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to update role');
      }

      setRoles(prev =>
        prev.map(r => (r.id === editingRole.id ? data.role : r))
      );
      setEditingRole(null);

      toast({
        title: t('admin.roles_permissions.role_updated'),
        description: t('admin.roles_permissions.role_updated_desc'),
      });
    } catch (error: any) {
      toast({
        title: t('admin.roles_permissions.errors.update_error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteRole = async (roleId: string, isSystemRole: boolean) => {
    if (isSystemRole) {
      toast({
        title: t('admin.roles_permissions.cannot_delete_system'),
        description: t('admin.roles_permissions.cannot_delete_system_desc'),
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(t('admin.roles_permissions.delete_confirm'))) {
      return;
    }

    try {
      // Use Edge Function to delete role (checks Admin role from user_roles table)
      const { data, error } = await supabase.functions.invoke('delete-role', {
        body: {
          role_id: roleId,
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to delete role');
      }

      setRoles(prev => prev.filter(r => r.id !== roleId));
      if (selectedRole === roleId) {
        setSelectedRole(roles.find(r => r.id !== roleId)?.id || null);
      }

      toast({
        title: t('admin.roles_permissions.role_deleted'),
        description: t('admin.roles_permissions.role_deleted_desc'),
      });
    } catch (error: any) {
      toast({
        title: t('admin.roles_permissions.errors.delete_error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categoryNames: Record<string, string> = {
    user_management: t('admin.roles_permissions.categories.user_management'),
    domain_management: t('admin.roles_permissions.categories.domain_management'),
    bidding_management: t('admin.roles_permissions.categories.bidding_management'),
    order_management: t('admin.roles_permissions.categories.order_management'),
    support_management: t('admin.roles_permissions.categories.support_management'),
    financial_management: t('admin.roles_permissions.categories.financial_management'),
    system_management: t('admin.roles_permissions.categories.system_management'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">{t('admin.roles_permissions.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              {t('admin.roles_permissions.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('admin.roles_permissions.description')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.create_role')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.roles_permissions.create_new_role')}</DialogTitle>
                  <DialogDescription>
                    {t('admin.roles_permissions.create_role_description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('admin.roles_permissions.role_name')}</Label>
                    <Input
                      id="name"
                      value={newRole.name}
                      onChange={e => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('admin.roles_permissions.role_name_placeholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{t('admin.roles_permissions.role_description')}</Label>
                    <Textarea
                      id="description"
                      value={newRole.description}
                      onChange={e => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('admin.roles_permissions.role_description_placeholder')}
                    />
                  </div>
                  <Button onClick={createRole} className="w-full">
                    {t('admin.roles_permissions.create_role')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs value={selectedRole || undefined} onValueChange={setSelectedRole}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto">
          {roles.map(role => (
            <TabsTrigger key={role.id} value={role.id} className="flex items-center gap-2">
              {role.name}
              {role.is_system_role && (
                <Badge variant="secondary" className="text-xs">
                  {t('admin.roles_permissions.system')}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map(role => (
          <TabsContent key={role.id} value={role.id} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingRole?.id === role.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editingRole.name}
                          onChange={e =>
                            setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)
                          }
                          disabled={role.is_system_role}
                        />
                        <Textarea
                          value={editingRole.description || ''}
                          onChange={e =>
                            setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)
                          }
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={updateRole}>
                            <Save className="h-4 w-4 mr-2" />
                            {t('admin.roles_permissions.save')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingRole(null)}>
                            <X className="h-4 w-4 mr-2" />
                            {t('admin.roles_permissions.cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle>{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </>
                    )}
                  </div>
                  {!editingRole && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRole(role)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {!role.is_system_role && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteRole(role.id, role.is_system_role)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          {categoryNames[category] || category}
                          <Badge variant="outline">
                            {perms.filter(p => hasPermission(role.id, p.id)).length}/{perms.length}
                          </Badge>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {perms.map(permission => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                              <Checkbox
                                id={`${role.id}-${permission.id}`}
                                checked={hasPermission(role.id, permission.id)}
                                onCheckedChange={() => togglePermission(role.id, permission.id)}
                                disabled={role.name === 'Admin'}
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`${role.id}-${permission.id}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {role.name === 'Admin' && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      {t('admin.roles_permissions.admin_full_access')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
