import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  useListRolesQuery,
  useListPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useGetRolePermissionsQuery,
  type RoleResponse,
  type PermissionResponse,
} from '@/store/api/rolesPermissionsApi';
import { extractErrorMessage } from '@/lib/errorHandler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Extended Permission type with category for grouping
interface PermissionWithCategory extends PermissionResponse {
  category?: string;
}

export default function RolesPermissions() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // RTK Query hooks
  const { data: rolesData = [], isLoading: rolesLoading, error: rolesError } = useListRolesQuery({});
  const { data: permissionsData = [], isLoading: permissionsLoading, error: permissionsError } = useListPermissionsQuery({});
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsToRoleMutation();
  const [removePermission, { isLoading: isRemoving }] = useRemovePermissionFromRoleMutation();

  // Local state
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{ id: number; isSystemRole: boolean } | null>(null);

  const loading = rolesLoading || permissionsLoading;
  const error = rolesError || permissionsError;

  // Set initial selected role
  useEffect(() => {
    if (rolesData.length > 0 && !selectedRole) {
      setSelectedRole(rolesData[0].id);
    }
  }, [rolesData, selectedRole]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: t('admin.roles_permissions.errors.fetch_error'),
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [error, toast, t]);

  // Create permission name to ID mapping
  const permissionNameToId = useMemo(() => {
    const map = new Map<string, number>();
    permissionsData.forEach(perm => {
      map.set(perm.name, perm.id);
    });
    return map;
  }, [permissionsData]);

  // Check if role has permission (by permission name)
  const hasPermission = (role: RoleResponse, permissionName: string): boolean => {
    return role.permissions.includes(permissionName);
  };

  // Get permission ID by name
  const getPermissionId = (permissionName: string): number | null => {
    return permissionNameToId.get(permissionName) || null;
  };

  const togglePermission = async (role: RoleResponse, permissionName: string) => {
    const permissionId = getPermissionId(permissionName);
    if (!permissionId) {
      toast({
        title: t('admin.roles_permissions.errors.permission_toggle_error'),
        description: 'Permission not found',
        variant: 'destructive',
      });
      return;
    }

    const exists = hasPermission(role, permissionName);

    try {
      if (exists) {
        // Remove permission
        await removePermission({
          roleId: role.id,
          permissionId,
        }).unwrap();

        toast({
          title: t('admin.roles_permissions.permission_removed'),
          description: t('admin.roles_permissions.permission_removed_desc'),
        });
      } else {
        // Get current permissions and add the new one
        const currentPermissionIds = role.permissions
          .map(name => getPermissionId(name))
          .filter((id): id is number => id !== null);

        const updatedPermissionIds = [...currentPermissionIds, permissionId];

        await assignPermissions({
          roleId: role.id,
          data: { permission_ids: updatedPermissionIds },
        }).unwrap();

        toast({
          title: t('admin.roles_permissions.permission_assigned'),
          description: t('admin.roles_permissions.permission_assigned_desc'),
        });
      }
    } catch (error: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.permission_toggle_error'),
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: t('admin.roles_permissions.errors.role_name_required'),
        description: t('admin.roles_permissions.errors.role_name_required'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await createRole({
        name: newRole.name.trim(),
        description: newRole.description.trim() || null,
      }).unwrap();

      setNewRole({ name: '', description: '' });
      setShowCreateDialog(false);

      toast({
        title: t('admin.roles_permissions.role_created'),
        description: t('admin.roles_permissions.role_created_desc'),
      });
    } catch (error: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.create_error'),
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      await updateRole({
        roleId: editingRole.id,
        data: {
          name: editingRole.name.trim(),
          description: editingRole.description || null,
        },
      }).unwrap();

      setEditingRole(null);

      toast({
        title: t('admin.roles_permissions.role_updated'),
        description: t('admin.roles_permissions.role_updated_desc'),
      });
    } catch (error: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.update_error'),
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (role: RoleResponse) => {
    const isSystemRole = role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'user';
    if (isSystemRole) {
      toast({
        title: t('admin.roles_permissions.cannot_delete_system'),
        description: t('admin.roles_permissions.cannot_delete_system_desc'),
        variant: 'destructive',
      });
      return;
    }

    setRoleToDelete({ id: role.id, isSystemRole });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.id).unwrap();

      if (selectedRole === roleToDelete.id) {
        const remainingRoles = rolesData.filter(r => r.id !== roleToDelete.id);
        setSelectedRole(remainingRoles.length > 0 ? remainingRoles[0].id : null);
      }

      setDeleteConfirmOpen(false);
      setRoleToDelete(null);

      toast({
        title: t('admin.roles_permissions.role_deleted'),
        description: t('admin.roles_permissions.role_deleted_desc'),
      });
    } catch (error: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.delete_error'),
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  // Group permissions by category (if category exists in permission name or use 'other')
  // Since API doesn't return category, we'll group by prefix in permission name
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, PermissionResponse[]> = {};
    permissionsData.forEach(perm => {
      // Extract category from permission name (e.g., "user_management.create" -> "user_management")
      const parts = perm.name.split('.');
      const category = parts.length > 1 ? parts[0] : 'other';

      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(perm);
    });

    // Sort permissions within each category
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [permissionsData]);

  const categoryNames: Record<string, string> = {
    user_management: t('admin.roles_permissions.categories.user_management'),
    domain_management: t('admin.roles_permissions.categories.domain_management'),
    bidding_management: t('admin.roles_permissions.categories.bidding_management'),
    order_management: t('admin.roles_permissions.categories.order_management'),
    support_management: t('admin.roles_permissions.categories.support_management'),
    financial_management: t('admin.roles_permissions.categories.financial_management'),
    system_management: t('admin.roles_permissions.categories.system_management'),
    other: t('admin.roles_permissions.categories.other', { defaultValue: 'Other' }),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t('admin.roles_permissions.loading')}</p>
        </div>
      </div>
    );
  }

  const selectedRoleData = rolesData.find(r => r.id === selectedRole);
  const isSystemRole = (role: RoleResponse) => role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'user';

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
                  <Button onClick={handleCreateRole} className="w-full" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('admin.roles_permissions.creating', { defaultValue: 'Creating...' })}
                      </>
                    ) : (
                      t('admin.roles_permissions.create_role')
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs value={selectedRole?.toString() || undefined} onValueChange={(value) => setSelectedRole(Number(value))}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto">
          {rolesData.map(role => (
            <TabsTrigger key={role.id} value={role.id.toString()} className="flex items-center gap-2">
              {role.name}
              {isSystemRole(role) && (
                <Badge variant="secondary" className="text-xs">
                  {t('admin.roles_permissions.system')}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {rolesData.map(role => (
          <TabsContent key={role.id} value={role.id.toString()} className="mt-6">
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
                          disabled={isSystemRole(role)}
                        />
                        <Textarea
                          value={editingRole.description || ''}
                          onChange={e =>
                            setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)
                          }
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateRole} disabled={isUpdating}>
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
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
                      {!isSystemRole(role) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(role)}
                          disabled={isDeleting}
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
                            {perms.filter(p => hasPermission(role, p.name)).length}/{perms.length}
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
                                checked={hasPermission(role, permission.name)}
                                onCheckedChange={() => togglePermission(role, permission.name)}
                                disabled={role.name.toLowerCase() === 'admin' || isAssigning || isRemoving}
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`${role.id}-${permission.id}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {permission.description || 'No description'}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.roles_permissions.delete_confirm_title', { defaultValue: 'Delete Role' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.roles_permissions.delete_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>
              {t('admin.roles_permissions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('admin.roles_permissions.deleting', { defaultValue: 'Deleting...' })}
                </>
              ) : (
                t('admin.roles_permissions.delete', { defaultValue: 'Delete' })
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
