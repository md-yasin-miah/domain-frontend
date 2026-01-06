import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Shield,
  Search,
  Loader2,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import {
  useGetUsersQuery,
  useGetRolesQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useUpdateClientProfileMutation,
} from '@/store/api/userApi';
import CustomTooltip from '@/components/common/CustomTooltip';

// Local User interface matching the component's needs
interface User {
  id: string;
  email: string;
  created_at: string;
  roles: Role[];
  profile?: {
    id: string;
    full_name: string;
    phone_number: string;
    address: string;
    company_name?: string;
    company_address?: string;
    company_details?: string;
    profile_completed: boolean;
  };
}

interface UserFormData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  phone_number: string;
  address: string;
  company_name: string;
  company_address: string;
  company_details: string;
  role_id: string;
}

export default function UserManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // RTK Query hooks
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetUsersQuery({});
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [updateClientProfile] = useUpdateClientProfileMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [assignRole] = useAssignRoleMutation();
  const [removeRole] = useRemoveRoleMutation();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    username: '',
    full_name: '',
    phone_number: '',
    address: '',
    company_name: '',
    company_address: '',
    company_details: '',
    role_id: '',
  });

  // Transform API response to local User format
  const users: User[] = useMemo(() => {
    if (!usersData) return [];

    const items = Array.isArray(usersData) ? usersData : usersData.items || [];

    return items.map((user: UserResponse) => {
      const profile = user.profile;
      const fullName = profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null
        : null;
      const roles = user.roles.map((role: string) => rolesData?.find((r: Role) => r.name === role));
      return {
        id: String(user.id),
        email: user.email,
        created_at: user.created_at,
        roles,
        profile: profile && fullName ? {
          id: String(profile.id),
          full_name: fullName,
          phone_number: profile.phone || '',
          address: profile.address_line1 || '',
          company_name: profile.company_name || undefined,
          company_address: undefined, // Not in UserProfile
          company_details: profile.bio || undefined,
          profile_completed: user.is_profile_complete || false,
        } : undefined,
      };
    });
  }, [usersData, rolesData]);

  const loading = isLoadingUsers || isLoadingRoles;
  const formLoading = isCreatingUser || isDeletingUser;

  const handleCreateUser = async () => {
    if (!formData.email || !formData.password || !formData.username || !formData.full_name || !formData.phone_number || !formData.address) {
      toast({
        title: 'Error',
        description: t('admin.user_management.create_dialog.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create user
      const userResult = await createUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        is_active: true,
      }).unwrap();

      // Create profile if profile data is provided
      if (formData.full_name || formData.phone_number || formData.address) {
        const nameParts = formData.full_name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        await updateClientProfile({
          first_name: firstName,
          last_name: lastName,
          phone: formData.phone_number,
          address_line1: formData.address,
          company_name: formData.company_name || undefined,
          bio: formData.company_details || undefined,
        }).unwrap();
      }

      // Assign role if selected
      if (formData.role_id) {
        await assignRole({
          id: userResult.id,
          roleId: Number(formData.role_id),
        }).unwrap();
      }

      toast({
        title: 'Success',
        description: t('admin.user_management.messages.create_success'),
      });

      setShowCreateDialog(false);
      resetForm();
      refetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error?.data?.detail || error?.message || t('admin.user_management.messages.create_error'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !formData.full_name || !formData.phone_number || !formData.address) {
      toast({
        title: 'Error',
        description: t('admin.user_management.create_dialog.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const userId = Number(selectedUser.id);

      // Update user email/username if changed
      if (formData.email !== selectedUser.email || formData.username) {
        await updateUser({
          id: userId,
          data: {
            email: formData.email !== selectedUser.email ? formData.email : undefined,
            username: formData.username || undefined,
          },
        }).unwrap();
      }

      // Update profile
      const nameParts = formData.full_name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await updateClientProfile({
        first_name: firstName,
        last_name: lastName,
        phone: formData.phone_number,
        address_line1: formData.address,
        company_name: formData.company_name || undefined,
        bio: formData.company_details || undefined,
      }).unwrap();

      toast({
        title: 'Success',
        description: t('admin.user_management.messages.update_success'),
      });

      setShowEditDialog(false);
      resetForm();
      refetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error?.data?.detail || error?.message || t('admin.user_management.messages.update_error'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(Number(userToDelete.id)).unwrap();

      toast({
        title: 'Success',
        description: t('admin.user_management.messages.delete_success'),
      });

      setShowDeleteDialog(false);
      setUserToDelete(null);
      refetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error?.data?.detail || error?.message || t('admin.user_management.messages.delete_error'),
        variant: 'destructive',
      });
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) {
      toast({
        title: 'Error',
        description: t('admin.user_management.messages.select_user_role'),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if user already has this role
      const hasRole = selectedUser.roles.some(r => r.id?.toString() === selectedRoleId);
      if (hasRole) {
        toast({
          title: 'Already Assigned',
          description: t('admin.user_management.messages.role_already_assigned'),
          variant: 'destructive',
        });
        return;
      }

      await assignRole({
        id: Number(selectedUser.id),
        roleId: Number(selectedRoleId),
      }).unwrap();

      toast({
        title: 'Role Assigned',
        description: t('admin.user_management.messages.role_assigned'),
      });

      setShowAssignDialog(false);
      setSelectedUser(null);
      setSelectedRoleId('');
      refetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.detail || error?.message || t('admin.user_management.messages.role_assigned_error'),
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm(t('admin.user_management.messages.remove_role_confirm'))) {
      return;
    }

    try {
      await removeRole({
        id: Number(userId),
        roleId: Number(roleId),
      }).unwrap();

      toast({
        title: 'Role Removed',
        description: t('admin.user_management.messages.role_removed'),
      });

      refetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.detail || error?.message || t('admin.user_management.messages.role_removed_error'),
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    const profile = user.profile;
    setFormData({
      email: user.email,
      password: '',
      username: '', // Not available in current User interface
      full_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      address: profile?.address || '',
      company_name: profile?.company_name || '',
      company_address: profile?.company_address || '',
      company_details: profile?.company_details || '',
      role_id: user.roles[0]?.id?.toString() || '',
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      full_name: '',
      phone_number: '',
      address: '',
      company_name: '',
      company_address: '',
      company_details: '',
      role_id: '',
    });
    setSelectedUser(null);
    setSelectedRoleId('');
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'Customer':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  // Define columns for DataTable
  const columns: ColumnDef<User>[] = [
    {
      id: 'user',
      header: t('admin.user_management.user'),
      accessorKey: 'email',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.profile?.full_name || t('admin.user_management.no_name')}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {row.email}
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'contact',
      header: t('admin.user_management.contact'),
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          {row.profile?.phone_number && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              {row.profile.phone_number}
            </div>
          )}
          {row.profile?.address && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[200px]">{row.profile.address}</span>
            </div>
          )}
          {row.profile?.company_name && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building className="h-3 w-3" />
              {row.profile.company_name}
            </div>
          )}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'roles',
      header: t('admin.user_management.roles'),
      cell: ({ row }) => {
        return <div className="flex flex-wrap gap-2">
          {row.roles.length === 0 ? (
            <Badge variant="outline" className="text-muted-foreground">
              {t('admin.user_management.no_roles')}
            </Badge>
          ) : (
            row.roles.map((role) => (
              <Badge
                key={role.id}
                className={getRoleBadgeColor(role.name)}
                variant="secondary"
              >
                {role.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRole(row.id, role.id.toString());
                  }}
                  className="ml-2 hover:text-destructive"
                  title="Remove role"
                >
                  ×
                </button>
              </Badge>
            ))
          )}
        </div>
      },
      enableSorting: false,
    },
    {
      id: 'created',
      header: t('admin.user_management.created'),
      accessorKey: 'created_at',
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return new Date(date).toLocaleDateString();
      },
      enableSorting: true,
    },
  ];

  // Render actions for each row
  const renderUserActions = (user: User) => (
    <div className="flex justify-end gap-2">
      <Dialog
        open={showAssignDialog && selectedUser?.id === user.id}
        onOpenChange={(open) => {
          setShowAssignDialog(open);
          if (open) {
            setSelectedUser(user);
          } else {
            setSelectedUser(null);
            setSelectedRoleId('');
          }
        }}
      >
        <DialogTrigger asChild>
          <CustomTooltip content={t('admin.user_management.assign_role')}>
            <Button size="sm" variant="outline">
              <UserPlus className="h-4 w-4" />
            </Button>
          </CustomTooltip>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.user_management.assign_role_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.user_management.assign_role_dialog.description')} {user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('admin.user_management.assign_role_dialog.current_roles')}
              </label>
              <div className="flex flex-wrap gap-2">
                {user.roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('admin.user_management.assign_role_dialog.no_roles_assigned')}
                  </p>
                ) : (
                  user.roles.map((role) => (
                    <Badge
                      key={role.id}
                      className={getRoleBadgeColor(role.name)}
                    >
                      {role.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('admin.user_management.assign_role_dialog.select_role')}
              </label>
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.user_management.assign_role_dialog.choose_role')} />
                </SelectTrigger>
                <SelectContent>
                  {rolesData.map((role: Role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignRole} className="w-full">
              {t('admin.user_management.assign_role_dialog.assign')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        size="sm"
        variant="outline"
        onClick={() => openEditDialog(user)}
      >
        <Edit className="h-4 w-4" />
        {/* {t('admin.user_management.edit_user')} */}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          setUserToDelete(user);
          setShowDeleteDialog(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
        {/* {t('admin.user_management.delete_user')} */}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t('admin.user_management.messages.loading')}</p>
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
              <Users className="h-8 w-8" />
              {t('admin.user_management.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('admin.user_management.description')}
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('admin.user_management.create_user')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('admin.user_management.create_dialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('admin.user_management.create_dialog.description')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-email">{t('admin.user_management.create_dialog.email')} *</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-username">{t('admin.user_management.create_dialog.username')} *</Label>
                    <Input
                      id="create-username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-password">{t('admin.user_management.create_dialog.password')} *</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-role">{t('admin.user_management.create_dialog.initial_role')}</Label>
                    <Select
                      value={formData.role_id}
                      onValueChange={(value) => setFormData({ ...formData, role_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.user_management.create_dialog.select_role')} />
                      </SelectTrigger>
                      <SelectContent>
                        {rolesData.map((role: Role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-full-name">{t('admin.user_management.create_dialog.full_name')} *</Label>
                  <Input
                    id="create-full-name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-phone">{t('admin.user_management.create_dialog.phone_number')} *</Label>
                    <Input
                      id="create-phone"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-address">{t('admin.user_management.create_dialog.address')} *</Label>
                  <Textarea
                    id="create-address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-company-name">{t('admin.user_management.create_dialog.company_name')}</Label>
                  <Input
                    id="create-company-name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Company Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-company-address">{t('admin.user_management.create_dialog.company_address')}</Label>
                  <Textarea
                    id="create-company-address"
                    value={formData.company_address}
                    onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                    placeholder="Company address"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-company-details">{t('admin.user_management.create_dialog.company_details')}</Label>
                  <Textarea
                    id="create-company-details"
                    value={formData.company_details}
                    onChange={(e) => setFormData({ ...formData, company_details: e.target.value })}
                    placeholder="Additional company information"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {t('admin.user_management.create_dialog.cancel')}
                </Button>
                <Button onClick={handleCreateUser} disabled={formLoading}>
                  {formLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {t('admin.user_management.create_dialog.create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <CardTitle>{t('admin.user_management.all_users')}</CardTitle>
              <CardDescription>
                {filteredUsers.length} {filteredUsers.length === 1
                  ? t('admin.user_management.users_found')
                  : t('admin.user_management.users_found_plural')}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.user_management.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredUsers}
            columns={columns}
            isLoading={loading}
            emptyMessage={t('admin.user_management.no_users')}
            getRowId={(row) => row.id}
            renderActions={renderUserActions}
            actionsColumnHeader={t('admin.user_management.actions')}
            actionsColumnClassName="text-right"
            enableSorting={true}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.user_management.edit_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.user_management.edit_dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">{t('admin.user_management.create_dialog.email')} *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-full-name">{t('admin.user_management.create_dialog.full_name')} *</Label>
              <Input
                id="edit-full-name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">{t('admin.user_management.create_dialog.phone_number')} *</Label>
              <Input
                id="edit-phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">{t('admin.user_management.create_dialog.address')} *</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company-name">{t('admin.user_management.create_dialog.company_name')}</Label>
              <Input
                id="edit-company-name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company-address">{t('admin.user_management.create_dialog.company_address')}</Label>
              <Textarea
                id="edit-company-address"
                value={formData.company_address}
                onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company-details">{t('admin.user_management.create_dialog.company_details')}</Label>
              <Textarea
                id="edit-company-details"
                value={formData.company_details}
                onChange={(e) => setFormData({ ...formData, company_details: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              {t('admin.user_management.edit_dialog.cancel')}
            </Button>
            <Button onClick={handleUpdateUser} disabled={formLoading}>
              {formLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {t('admin.user_management.edit_dialog.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.user_management.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.user_management.delete_dialog.description')}
              {userToDelete?.email && ` for ${userToDelete.email}`} {t('admin.user_management.delete_dialog.and_data')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>{t('admin.user_management.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {t('admin.user_management.delete_dialog.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
