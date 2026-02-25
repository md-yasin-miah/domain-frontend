import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Edit2, Save, X, Loader2, Search, KeyRound, Eye, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useListRolesQuery,
  useListPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetEndpointPermissionsQuery,
  useCreateEndpointPermissionMutation,
  useUpdateEndpointPermissionMutation,
  useDeleteEndpointPermissionMutation,
  type EndpointPermission,
} from '@/store/api/endpointPermissionsApi';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

const PERMISSION_CATEGORY_ORDER = [
  'user_management',
  'domain_management',
  'bidding_management',
  'order_management',
  'support_management',
  'financial_management',
  'system_management',
  'other',
];

export default function RolesPermissions() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [roleSearch, setRoleSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [deleteRoleOpen, setDeleteRoleOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponse | null>(null);

  const [mainTab, setMainTab] = useState<'roles' | 'permissions' | 'endpoint_permissions'>('roles');
  const [showCreatePermissionDialog, setShowCreatePermissionDialog] = useState(false);
  const [epModalOpen, setEpModalOpen] = useState(false);
  const [epModalMode, setEpModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedEp, setSelectedEp] = useState<EndpointPermission | null>(null);
  const [epFormData, setEpFormData] = useState({
    method: 'GET',
    path_pattern: '',
    description: '',
    is_active: true,
    requires_auth: true,
    permission_id: 0,
  });
  const [epToDelete, setEpToDelete] = useState<EndpointPermission | null>(null);
  const [deleteEpOpen, setDeleteEpOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({ name: '', description: '' });
  const [editingPermission, setEditingPermission] = useState<PermissionResponse | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<PermissionResponse | null>(null);
  const [deletePermissionOpen, setDeletePermissionOpen] = useState(false);

  const { data: rolesData = [], isLoading: rolesLoading, error: rolesError, refetch: refetchRoles } = useListRolesQuery({
    search: roleSearch || undefined,
  });
  const {
    data: permissionsData = [],
    isLoading: permissionsLoading,
    error: permissionsError,
    refetch: refetchPermissions,
  } = useListPermissionsQuery({});

  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsToRoleMutation();
  const [removePermission, { isLoading: isRemoving }] = useRemovePermissionFromRoleMutation();
  const [createPermission, { isLoading: isCreatingPermission }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdatingPermission }] = useUpdatePermissionMutation();
  const [deletePermission, { isLoading: isDeletingPermission }] = useDeletePermissionMutation();

  const {
    data: epData = [],
    isLoading: epLoading,
    error: epError,
    refetch: refetchEp,
  } = useGetEndpointPermissionsQuery(
    {},
    { skip: mainTab !== 'endpoint_permissions' }
  );
  const [createEp, { isLoading: isCreatingEp }] = useCreateEndpointPermissionMutation();
  const [updateEp, { isLoading: isUpdatingEp }] = useUpdateEndpointPermissionMutation();
  const [deleteEp, { isLoading: isDeletingEp }] = useDeleteEndpointPermissionMutation();

  const loading =
    rolesLoading ||
    permissionsLoading ||
    (mainTab === 'endpoint_permissions' ? epLoading : false);
  const error = rolesError || permissionsError || epError;

  useEffect(() => {
    if (rolesData.length > 0 && !selectedRole) {
      setSelectedRole(rolesData[0].id);
    }
    if (rolesData.length === 0) setSelectedRole(null);
  }, [rolesData, selectedRole]);

  useEffect(() => {
    if (error) {
      toast({
        title: t('admin.roles_permissions.errors.fetch_error'),
        description: extractErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [error, toast, t]);

  const permissionNameToId = useMemo(() => {
    const map = new Map<string, number>();
    permissionsData.forEach((perm) => map.set(perm.name, perm.id));
    return map;
  }, [permissionsData]);

  const hasPermission = (role: RoleResponse, permissionName: string) =>
    role.permissions.includes(permissionName);
  const getPermissionId = (name: string) => permissionNameToId.get(name) ?? null;

  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, PermissionResponse[]> = {};
    permissionsData.forEach((perm) => {
      const parts = perm.name.split('.');
      const category = parts.length > 1 ? parts[0] : 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(perm);
    });
    Object.keys(grouped).forEach((cat) => grouped[cat].sort((a, b) => a.name.localeCompare(b.name)));
    return grouped;
  }, [permissionsData]);

  const sortedCategoryKeys = useMemo(() => {
    const keys = Object.keys(groupedPermissions);
    return [...keys].sort(
      (a, b) =>
        (PERMISSION_CATEGORY_ORDER.indexOf(a) === -1 ? 999 : PERMISSION_CATEGORY_ORDER.indexOf(a)) -
        (PERMISSION_CATEGORY_ORDER.indexOf(b) === -1 ? 999 : PERMISSION_CATEGORY_ORDER.indexOf(b))
    );
  }, [groupedPermissions]);

  const categoryNames: Record<string, string> = useMemo(
    () => ({
      user_management: t('admin.roles_permissions.categories.user_management'),
      domain_management: t('admin.roles_permissions.categories.domain_management'),
      bidding_management: t('admin.roles_permissions.categories.bidding_management'),
      order_management: t('admin.roles_permissions.categories.order_management'),
      support_management: t('admin.roles_permissions.categories.support_management'),
      financial_management: t('admin.roles_permissions.categories.financial_management'),
      system_management: t('admin.roles_permissions.categories.system_management'),
      other: t('admin.roles_permissions.categories.other'),
    }),
    [t]
  );

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
        await removePermission({ roleId: role.id, permissionId }).unwrap();
        toast({
          title: t('admin.roles_permissions.permission_removed'),
          description: t('admin.roles_permissions.permission_removed_desc'),
        });
      } else {
        const currentIds = role.permissions
          .map(getPermissionId)
          .filter((id): id is number => id !== null);
        await assignPermissions({
          roleId: role.id,
          data: { permission_ids: [...currentIds, permissionId] },
        }).unwrap();
        toast({
          title: t('admin.roles_permissions.permission_assigned'),
          description: t('admin.roles_permissions.permission_assigned_desc'),
        });
      }
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.permission_toggle_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: t('admin.roles_permissions.errors.role_name_required'),
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
      setShowCreateRoleDialog(false);
      refetchRoles();
      toast({
        title: t('admin.roles_permissions.role_created'),
        description: t('admin.roles_permissions.role_created_desc'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.create_error'),
        description: extractErrorMessage(err),
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
      refetchRoles();
      toast({
        title: t('admin.roles_permissions.role_updated'),
        description: t('admin.roles_permissions.role_updated_desc'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.update_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const isSystemRole = (role: RoleResponse) =>
    role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'user';

  const handleDeleteRoleClick = (role: RoleResponse) => {
    if (isSystemRole(role)) {
      toast({
        title: t('admin.roles_permissions.cannot_delete_system'),
        description: t('admin.roles_permissions.cannot_delete_system_desc'),
        variant: 'destructive',
      });
      return;
    }
    setRoleToDelete(role);
    setDeleteRoleOpen(true);
  };

  const handleDeleteRoleConfirm = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id).unwrap();
      if (selectedRole === roleToDelete.id) {
        const remaining = rolesData.filter((r) => r.id !== roleToDelete.id);
        setSelectedRole(remaining.length > 0 ? remaining[0].id : null);
      }
      setDeleteRoleOpen(false);
      setRoleToDelete(null);
      refetchRoles();
      toast({
        title: t('admin.roles_permissions.role_deleted'),
        description: t('admin.roles_permissions.role_deleted_desc'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.delete_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const handleCreatePermission = async () => {
    if (!newPermission.name.trim()) {
      toast({
        title: t('admin.roles_permissions.errors.permission_name_required'),
        variant: 'destructive',
      });
      return;
    }
    try {
      await createPermission({
        name: newPermission.name.trim(),
        description: newPermission.description.trim() || null,
      }).unwrap();
      setNewPermission({ name: '', description: '' });
      setShowCreatePermissionDialog(false);
      refetchPermissions();
      toast({
        title: t('admin.roles_permissions.permission_created'),
        description: t('admin.roles_permissions.permission_created_desc'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.create_permission_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePermission = async () => {
    if (!editingPermission) return;
    try {
      await updatePermission({
        permissionId: editingPermission.id,
        data: {
          name: editingPermission.name.trim(),
          description: editingPermission.description ?? null,
        },
      }).unwrap();
      setEditingPermission(null);
      refetchPermissions();
      toast({
        title: t('admin.roles_permissions.permission_updated'),
        description: t('admin.roles_permissions.permission_updated_desc'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.update_permission_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const handleDeletePermissionConfirm = async () => {
    if (!permissionToDelete) return;
    try {
      await deletePermission(permissionToDelete.id).unwrap();
      setDeletePermissionOpen(false);
      setPermissionToDelete(null);
      refetchPermissions();
      refetchRoles();
      toast({
        title: t('admin.roles_permissions.permission_deleted'),
        description: t('admin.roles_permissions.permission_deleted_desc'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.errors.delete_permission_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const openEpModal = (mode: 'create' | 'view' | 'edit', item?: EndpointPermission) => {
    setEpModalMode(mode);
    if (mode === 'create') {
      setSelectedEp(null);
      setEpFormData({
        method: 'GET',
        path_pattern: '',
        description: '',
        is_active: true,
        requires_auth: true,
        permission_id: permissionsData[0]?.id ?? 0,
      });
    } else if (item) {
      setSelectedEp(item);
      setEpFormData({
        method: item.method,
        path_pattern: item.path_pattern,
        description: item.description ?? '',
        is_active: item.is_active,
        requires_auth: item.requires_auth,
        permission_id: item.permission_id,
      });
    }
    setEpModalOpen(true);
  };

  const handleCreateEp = async () => {
    if (!epFormData.path_pattern.trim()) {
      toast({
        title: t('admin.roles_permissions.ep_errors.create_error'),
        description: 'Path pattern is required',
        variant: 'destructive',
      });
      return;
    }
    if (!epFormData.permission_id) {
      toast({
        title: t('admin.roles_permissions.ep_errors.create_error'),
        description: 'Permission is required',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createEp({
        method: epFormData.method,
        path_pattern: epFormData.path_pattern.trim(),
        description: epFormData.description.trim() || null,
        is_active: epFormData.is_active,
        requires_auth: epFormData.requires_auth,
        permission_id: epFormData.permission_id,
      }).unwrap();
      setEpModalOpen(false);
      refetchEp();
      toast({
        title: t('admin.roles_permissions.ep_created'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.ep_errors.create_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateEp = async () => {
    if (!selectedEp) return;
    if (!epFormData.path_pattern.trim()) {
      toast({
        title: t('admin.roles_permissions.ep_errors.update_error'),
        description: 'Path pattern is required',
        variant: 'destructive',
      });
      return;
    }
    try {
      await updateEp({
        id: selectedEp.id,
        data: {
          method: epFormData.method,
          path_pattern: epFormData.path_pattern.trim(),
          description: epFormData.description.trim() || null,
          is_active: epFormData.is_active,
          requires_auth: epFormData.requires_auth,
          permission_id: epFormData.permission_id,
        },
      }).unwrap();
      setEpModalOpen(false);
      setSelectedEp(null);
      refetchEp();
      toast({
        title: t('admin.roles_permissions.ep_updated'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.ep_errors.update_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEpConfirm = async () => {
    if (!epToDelete) return;
    try {
      await deleteEp(epToDelete.id).unwrap();
      setDeleteEpOpen(false);
      setEpToDelete(null);
      refetchEp();
      toast({
        title: t('admin.roles_permissions.ep_deleted'),
      });
    } catch (err: unknown) {
      toast({
        title: t('admin.roles_permissions.ep_errors.delete_error'),
        description: extractErrorMessage(err),
        variant: 'destructive',
      });
    }
  };

  const epList = Array.isArray(epData) ? epData : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          {t('admin.roles_permissions.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('admin.roles_permissions.description')}</p>
      </div>

      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as 'roles' | 'permissions' | 'endpoint_permissions')}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('admin.roles_permissions.roles_tab')}
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            {t('admin.roles_permissions.permissions_tab')}
          </TabsTrigger>
          <TabsTrigger value="endpoint_permissions" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            {t('admin.roles_permissions.endpoint_permissions_tab')}
          </TabsTrigger>
        </TabsList>

        {/* ROLES TAB */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.roles_permissions.search_roles_placeholder')}
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.create_role')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('admin.roles_permissions.create_new_role')}</DialogTitle>
                  <DialogDescription>
                    {t('admin.roles_permissions.create_role_description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">{t('admin.roles_permissions.role_name')}</Label>
                    <Input
                      id="role-name"
                      value={newRole.name}
                      onChange={(e) => setNewRole((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={t('admin.roles_permissions.role_name_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-desc">{t('admin.roles_permissions.role_description')}</Label>
                    <Textarea
                      id="role-desc"
                      value={newRole.description}
                      onChange={(e) => setNewRole((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder={t('admin.roles_permissions.role_description_placeholder')}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateRoleDialog(false)}>
                    {t('admin.roles_permissions.cancel')}
                  </Button>
                  <Button onClick={handleCreateRole} disabled={isCreatingRole}>
                    {isCreatingRole ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('admin.roles_permissions.creating')}
                      </>
                    ) : (
                      t('admin.roles_permissions.create_role')
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : rolesData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{t('admin.roles_permissions.no_roles')}</p>
                <Button onClick={() => setShowCreateRoleDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.create_role')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs
              value={selectedRole?.toString() ?? ''}
              onValueChange={(v) => setSelectedRole(Number(v))}
            >
              <TabsList className="flex flex-wrap h-auto gap-2 mb-4">
                {rolesData.map((role) => (
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

              {rolesData.map((role) => (
                <TabsContent key={role.id} value={role.id.toString()} className="mt-0">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {editingRole?.id === role.id ? (
                            <div className="space-y-4">
                              <Input
                                value={editingRole.name}
                                onChange={(e) =>
                                  setEditingRole((prev) => (prev ? { ...prev, name: e.target.value } : null))
                                }
                                disabled={isSystemRole(role)}
                                placeholder={t('admin.roles_permissions.role_name_placeholder')}
                              />
                              <Textarea
                                value={editingRole.description ?? ''}
                                onChange={(e) =>
                                  setEditingRole((prev) => (prev ? { ...prev, description: e.target.value } : null))
                                }
                                placeholder={t('admin.roles_permissions.role_description_placeholder')}
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleUpdateRole} disabled={isUpdatingRole}>
                                  {isUpdatingRole ? (
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
                              <CardTitle className="capitalize">{role.name}</CardTitle>
                              <CardDescription>
                                {role.description || t('admin.roles_permissions.role_description_placeholder')}
                              </CardDescription>
                            </>
                          )}
                        </div>
                        {!editingRole && (
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRole(role)}
                              aria-label={t('admin.roles_permissions.edit')}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {!isSystemRole(role) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteRoleClick(role)}
                                disabled={isDeletingRole}
                                aria-label={t('admin.roles_permissions.delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-6">
                          {sortedCategoryKeys.map((category) => {
                            const perms = groupedPermissions[category];
                            if (!perms?.length) return null;
                            return (
                              <div key={category}>
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                  {categoryNames[category] ?? category}
                                  <Badge variant="outline" className="text-xs">
                                    {perms.filter((p) => hasPermission(role, p.name)).length}/{perms.length}
                                  </Badge>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {perms.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className="flex items-start gap-3 rounded-lg border p-3 bg-card hover:bg-accent/30 transition-colors"
                                    >
                                      <Checkbox
                                        id={`${role.id}-${permission.id}`}
                                        checked={hasPermission(role, permission.name)}
                                        onCheckedChange={() => togglePermission(role, permission.name)}
                                        disabled={
                                          role.name.toLowerCase() === 'admin' || isAssigning || isRemoving
                                        }
                                      />
                                      <div className="flex-1 min-w-0">
                                        <Label
                                          htmlFor={`${role.id}-${permission.id}`}
                                          className="text-sm font-medium cursor-pointer leading-tight"
                                        >
                                          {permission.name}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {permission.description || t('admin.roles_permissions.permission_description_placeholder')}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                      {role.name.toLowerCase() === 'admin' && (
                        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
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
          )}
        </TabsContent>

        {/* PERMISSIONS TAB */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={showCreatePermissionDialog} onOpenChange={setShowCreatePermissionDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.create_permission')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('admin.roles_permissions.create_new_permission')}</DialogTitle>
                  <DialogDescription>
                    {t('admin.roles_permissions.create_permission_description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="perm-name">{t('admin.roles_permissions.permission_name')}</Label>
                    <Input
                      id="perm-name"
                      value={newPermission.name}
                      onChange={(e) => setNewPermission((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={t('admin.roles_permissions.permission_name_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perm-desc">{t('admin.roles_permissions.permission_description')}</Label>
                    <Textarea
                      id="perm-desc"
                      value={newPermission.description}
                      onChange={(e) => setNewPermission((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder={t('admin.roles_permissions.permission_description_placeholder')}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreatePermissionDialog(false)}>
                    {t('admin.roles_permissions.cancel')}
                  </Button>
                  <Button onClick={handleCreatePermission} disabled={isCreatingPermission}>
                    {isCreatingPermission ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('admin.roles_permissions.creating')}
                      </>
                    ) : (
                      t('admin.roles_permissions.create_permission')
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {permissionsLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : permissionsData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <KeyRound className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{t('admin.roles_permissions.no_permissions')}</p>
                <Button onClick={() => setShowCreatePermissionDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.create_permission')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.roles_permissions.permissions_tab')}</CardTitle>
                <CardDescription>
                  {permissionsData.length} {t('admin.roles_permissions.permissions_tab').toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {sortedCategoryKeys.map((category) => {
                      const perms = groupedPermissions[category];
                      if (!perms?.length) return null;
                      return (
                        <div key={category}>
                          <h3 className="text-sm font-semibold mb-3">
                            {categoryNames[category] ?? category}
                          </h3>
                          <div className="space-y-2">
                            {perms.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center justify-between gap-4 rounded-lg border p-3 bg-card"
                              >
                                {editingPermission?.id === permission.id ? (
                                  <>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <Input
                                        value={editingPermission.name}
                                        onChange={(e) =>
                                          setEditingPermission((prev) =>
                                            prev ? { ...prev, name: e.target.value } : null
                                          )
                                        }
                                        placeholder={t('admin.roles_permissions.permission_name_placeholder')}
                                      />
                                      <Input
                                        value={editingPermission.description ?? ''}
                                        onChange={(e) =>
                                          setEditingPermission((prev) =>
                                            prev ? { ...prev, description: e.target.value } : null
                                          )
                                        }
                                        placeholder={t('admin.roles_permissions.permission_description_placeholder')}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={handleUpdatePermission} disabled={isUpdatingPermission}>
                                        {isUpdatingPermission ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Save className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => setEditingPermission(null)}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="min-w-0">
                                      <p className="font-medium text-sm">{permission.name}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {permission.description || '—'}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingPermission(permission)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => {
                                          setPermissionToDelete(permission);
                                          setDeletePermissionOpen(true);
                                        }}
                                        disabled={isDeletingPermission}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ENDPOINT PERMISSIONS TAB */}
        <TabsContent value="endpoint_permissions" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => openEpModal('create')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.roles_permissions.ep_add')}
            </Button>
          </div>

          {mainTab === 'endpoint_permissions' && epLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : epList.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{t('admin.roles_permissions.no_ep')}</p>
                <Button onClick={() => openEpModal('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.ep_add')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.roles_permissions.endpoint_permissions_tab')}</CardTitle>
                <CardDescription>
                  {epList.length} mapping{epList.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Method</th>
                        <th className="h-10 px-4 text-left font-medium">Path</th>
                        <th className="h-10 px-4 text-left font-medium">Permission</th>
                        <th className="h-10 px-4 text-left font-medium">Auth</th>
                        <th className="h-10 px-4 text-left font-medium">Active</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {epList.map((ep) => (
                        <tr key={ep.id} className="border-b last:border-0">
                          <td className="px-4 py-3">
                            <Badge variant="outline">{ep.method}</Badge>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{ep.path_pattern}</td>
                          <td className="px-4 py-3">
                            {ep.permission ? ep.permission.name : `ID ${ep.permission_id}`}
                          </td>
                          <td className="px-4 py-3">{ep.requires_auth ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-3">{ep.is_active ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEpModal('view', ep)}
                                aria-label={t('admin.roles_permissions.edit')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEpModal('edit', ep)}
                                aria-label={t('admin.roles_permissions.edit')}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setEpToDelete(ep);
                                  setDeleteEpOpen(true);
                                }}
                                disabled={isDeletingEp}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Endpoint Permission Modal (Add / View / Edit) */}
      <Dialog open={epModalOpen} onOpenChange={setEpModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {epModalMode === 'create'
                ? t('admin.roles_permissions.ep_create_title')
                : epModalMode === 'view'
                  ? t('admin.roles_permissions.ep_view_title')
                  : t('admin.roles_permissions.ep_edit_title')}
            </DialogTitle>
            <DialogDescription>{t('admin.roles_permissions.ep_modal_description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.roles_permissions.ep_method')}</Label>
                <Select
                  value={epFormData.method}
                  onValueChange={(v) => setEpFormData((prev) => ({ ...prev, method: v }))}
                  disabled={epModalMode === 'view'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.roles_permissions.ep_permission')}</Label>
                <Select
                  value={epFormData.permission_id ? String(epFormData.permission_id) : ''}
                  onValueChange={(v) => setEpFormData((prev) => ({ ...prev, permission_id: Number(v) }))}
                  disabled={epModalMode === 'view'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.roles_permissions.ep_permission_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionsData.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.roles_permissions.ep_path_pattern')}</Label>
              <Input
                value={epFormData.path_pattern}
                onChange={(e) => setEpFormData((prev) => ({ ...prev, path_pattern: e.target.value }))}
                placeholder={t('admin.roles_permissions.ep_path_placeholder')}
                readOnly={epModalMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.roles_permissions.ep_description')}</Label>
              <Textarea
                value={epFormData.description}
                onChange={(e) => setEpFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={t('admin.roles_permissions.ep_description_placeholder')}
                rows={2}
                readOnly={epModalMode === 'view'}
              />
            </div>
            {epModalMode !== 'view' && (
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ep-is-active"
                    checked={epFormData.is_active}
                    onCheckedChange={(v) => setEpFormData((prev) => ({ ...prev, is_active: v === true }))}
                  />
                  <Label htmlFor="ep-is-active">{t('admin.roles_permissions.ep_is_active')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ep-requires-auth"
                    checked={epFormData.requires_auth}
                    onCheckedChange={(v) => setEpFormData((prev) => ({ ...prev, requires_auth: v === true }))}
                  />
                  <Label htmlFor="ep-requires-auth">{t('admin.roles_permissions.ep_requires_auth')}</Label>
                </div>
              </div>
            )}
            {epModalMode === 'view' && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium">Active:</span> {epFormData.is_active ? 'Yes' : 'No'}
                </p>
                <p>
                  <span className="font-medium">Requires auth:</span> {epFormData.requires_auth ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            {epModalMode === 'view' ? (
              <>
                <Button variant="outline" onClick={() => setEpModalOpen(false)}>
                  {t('common.close')}
                </Button>
                <Button onClick={() => setEpModalMode('edit')}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  {t('admin.roles_permissions.edit')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEpModalOpen(false)}>
                  {t('admin.roles_permissions.cancel')}
                </Button>
                {epModalMode === 'create' ? (
                  <Button onClick={handleCreateEp} disabled={isCreatingEp}>
                    {isCreatingEp ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('admin.roles_permissions.creating')}
                      </>
                    ) : (
                      t('admin.roles_permissions.ep_add')
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleUpdateEp} disabled={isUpdatingEp}>
                    {isUpdatingEp ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('admin.roles_permissions.save')}
                      </>
                    ) : (
                      t('admin.roles_permissions.save')
                    )}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Endpoint Permission Confirmation */}
      <AlertDialog open={deleteEpOpen} onOpenChange={setDeleteEpOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('admin.roles_permissions.ep_delete_confirm_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.roles_permissions.ep_delete_confirm')}
              {epToDelete && (
                <div className="mt-3 p-3 rounded-md bg-muted font-mono text-sm">
                  {epToDelete.method} {epToDelete.path_pattern}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEpToDelete(null)}>
              {t('admin.roles_permissions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEpConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingEp}
            >
              {isDeletingEp ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('admin.roles_permissions.deleting')}
                </>
              ) : (
                t('admin.roles_permissions.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={deleteRoleOpen} onOpenChange={setDeleteRoleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.roles_permissions.delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.roles_permissions.delete_confirm')}
              {roleToDelete && (
                <div className="mt-3 p-3 rounded-md bg-muted">
                  <strong>{roleToDelete.name}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>
              {t('admin.roles_permissions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingRole}
            >
              {isDeletingRole ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('admin.roles_permissions.deleting')}
                </>
              ) : (
                t('admin.roles_permissions.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Permission Confirmation */}
      <AlertDialog open={deletePermissionOpen} onOpenChange={setDeletePermissionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('admin.roles_permissions.delete_permission_confirm_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.roles_permissions.delete_permission_confirm')}
              {permissionToDelete && (
                <div className="mt-3 p-3 rounded-md bg-muted">
                  <strong>{permissionToDelete.name}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPermissionToDelete(null)}>
              {t('admin.roles_permissions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePermissionConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingPermission}
            >
              {isDeletingPermission ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('admin.roles_permissions.deleting')}
                </>
              ) : (
                t('admin.roles_permissions.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
