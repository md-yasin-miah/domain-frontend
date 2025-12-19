import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mockData, mockAuth } from '@/lib/mockData';
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
  X,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  created_at: string;
  roles: Array<{ id: string; name: string; description: string }>;
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

interface Role {
  id: string;
  name: string;
  description: string;
}

interface UserFormData {
  email: string;
  password: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
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
    full_name: '',
    phone_number: '',
    address: '',
    company_name: '',
    company_address: '',
    company_details: '',
    role_id: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        throw rolesError;
      }
      setRoles(rolesData || []);

      // Try to use the Edge Function first (recommended - more secure)
      try {
        const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('get-all-users', {
          method: 'GET',
        });

        if (!edgeFunctionError && edgeFunctionData?.users) {
          // Use the edge function result
          const usersList: User[] = edgeFunctionData.users.map((user: any) => ({
            id: user.id,
            email: user.email || 'No email',
            created_at: user.created_at || new Date().toISOString(),
            roles: (user.roles || []).map((r: any) => ({
              id: r.id,
              name: r.name,
              description: r.description,
            })),
            profile: user.profile ? {
              id: user.profile.id,
              full_name: user.profile.full_name,
              phone_number: user.profile.phone_number,
              address: user.profile.address,
              company_name: user.profile.company_name || undefined,
              company_address: user.profile.company_address || undefined,
              company_details: user.profile.company_details || undefined,
              profile_completed: user.profile.profile_completed || false,
            } : undefined,
          }));
          setUsers(usersList);
          return;
        }
        
        if (edgeFunctionError) {
          console.warn('Error calling get-all-users edge function:', edgeFunctionError);
        }
      } catch (edgeError: any) {
        // Edge function not available - use fallback
        console.log('get-all-users edge function not available, using fallback method');
      }

      // Fallback: Fetch users with their roles and profiles manually
      console.log('Using fallback method to fetch users');
      
      // Use regular client - RLS policies will handle permissions
      const { data: profilesData, error: profilesError } = await supabase
        .from('client_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Don't throw, continue with empty profiles
      }

      // Get all user_roles using regular client - RLS policies will handle permissions
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role:roles (
            id,
            name,
            description
          )
        `);

      if (userRolesError) {
        console.error('Error fetching user roles:', userRolesError);
        // Don't throw, continue with empty roles
      }

      // Combine data: create a map of user_id -> roles
      const userRolesMap = new Map<string, Array<{ id: string; name: string; description: string }>>();
      
      if (userRolesData) {
        userRolesData.forEach((ur: any) => {
          if (ur.user_id && ur.role) {
            if (!userRolesMap.has(ur.user_id)) {
              userRolesMap.set(ur.user_id, []);
            }
            userRolesMap.get(ur.user_id)!.push(ur.role);
          }
        });
      }

      // Build users array from profiles
      const usersList: User[] = (profilesData || []).map((profile: any) => ({
        id: profile.user_id,
        email: profile.email,
        created_at: profile.created_at || new Date().toISOString(),
        roles: userRolesMap.get(profile.user_id) || [],
        profile: {
          id: profile.id,
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          address: profile.address,
          company_name: profile.company_name || undefined,
          company_address: profile.company_address || undefined,
          company_details: profile.company_details || undefined,
          profile_completed: profile.profile_completed || false,
        },
      }));

      console.log('Fetched users:', usersList.length);
      setUsers(usersList);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load users. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.email || !formData.password || !formData.full_name || !formData.phone_number || !formData.address) {
      toast({
        title: 'Error',
        description: t('admin.user_management.create_dialog.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setFormLoading(true);

      // Use Edge Function to create user (checks Admin role from user_roles table)
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address,
          company_name: formData.company_name || null,
          company_address: formData.company_address || null,
          company_details: formData.company_details || null,
          role_id: formData.role_id || null,
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to create user');
      }

      toast({
        title: 'Success',
        description: t('admin.user_management.messages.create_success'),
      });

      setShowCreateDialog(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error.message || t('admin.user_management.messages.create_error'),
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
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
      setFormLoading(true);

      console.log('Updating profile for user_id:', selectedUser.id);
      console.log('Update data:', {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.address,
        company_name: formData.company_name,
        email: formData.email,
      });

      // Use Edge Function for secure update (bypasses RLS)
      try {
        const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('update-user-profile', {
          method: 'POST',
          body: {
            user_id: selectedUser.id,
            email: formData.email,
            profile_data: {
              full_name: formData.full_name,
              phone_number: formData.phone_number,
              address: formData.address,
              company_name: formData.company_name || null,
              company_address: formData.company_address || null,
              company_details: formData.company_details || null,
            }
          }
        });

        if (!edgeFunctionError && edgeFunctionData?.success) {
          console.log('Profile updated via Edge Function:', edgeFunctionData.profile);
          // Skip to email update and success message
        } else if (edgeFunctionError) {
          console.warn('Edge Function error, falling back to direct update:', edgeFunctionError);
          throw edgeFunctionError;
        }
      } catch (edgeError: any) {
        // Edge Function failed - show error
        console.error('Edge Function error:', edgeError);
        throw new Error(edgeError.message || 'Failed to update user profile. Please try again.');
      }

      // Verify the update actually happened
      const { data: updatedProfile, error: verifyError } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', selectedUser.id)
        .single();

      if (verifyError) {
        console.warn('Could not verify update:', verifyError);
      } else {
        console.log('Profile updated successfully:', updatedProfile);
      }

      // Email update is handled by the Edge Function
      if (formData.email !== selectedUser.email) {
        console.log('Email update handled by Edge Function');
      }

      toast({
        title: 'Success',
        description: t('admin.user_management.messages.update_success'),
      });

      setShowEditDialog(false);
      resetForm();
      // Refresh data to show updated values
      await fetchData();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || t('admin.user_management.messages.update_error'),
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setFormLoading(true);

      // Use Edge Function to delete user (checks Admin role from user_roles table)
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: {
          user_id: userToDelete.id,
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to delete user');
      }

      toast({
        title: 'Success',
        description: t('admin.user_management.messages.delete_success'),
      });

      setShowDeleteDialog(false);
      setUserToDelete(null);
      fetchData();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || t('admin.user_management.messages.delete_error'),
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const assignRole = async () => {
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
      const hasRole = selectedUser.roles.some(r => r.id === selectedRoleId);
      if (hasRole) {
        toast({
          title: 'Already Assigned',
          description: t('admin.user_management.messages.role_already_assigned'),
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role_id: selectedRoleId,
        });

      if (error) throw error;

      toast({
        title: 'Role Assigned',
        description: t('admin.user_management.messages.role_assigned'),
      });

      setShowAssignDialog(false);
      setSelectedUser(null);
      setSelectedRoleId('');
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeRole = async (userId: string, roleId: string) => {
    if (!confirm(t('admin.user_management.messages.remove_role_confirm'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) throw error;

      toast({
        title: 'Role Removed',
        description: t('admin.user_management.messages.role_removed'),
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      full_name: user.profile?.full_name || '',
      phone_number: user.profile?.phone_number || '',
      address: user.profile?.address || '',
      company_name: user.profile?.company_name || '',
      company_address: user.profile?.company_address || '',
      company_details: user.profile?.company_details || '',
      role_id: user.roles[0]?.id || '',
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
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
                    <Label htmlFor="create-password">{t('admin.user_management.create_dialog.password')} *</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                    />
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
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.user_management.user')}</TableHead>
                  <TableHead>{t('admin.user_management.contact')}</TableHead>
                  <TableHead>{t('admin.user_management.roles')}</TableHead>
                  <TableHead>{t('admin.user_management.created')}</TableHead>
                  <TableHead className="text-right">{t('admin.user_management.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {t('admin.user_management.no_users')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.profile?.full_name || t('admin.user_management.no_name')}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {user.profile?.phone_number && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {user.profile.phone_number}
                            </div>
                          )}
                          {user.profile?.address && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">{user.profile.address}</span>
                            </div>
                          )}
                          {user.profile?.company_name && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {user.profile.company_name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.roles.length === 0 ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              {t('admin.user_management.no_roles')}
                            </Badge>
                          ) : (
                            user.roles.map((role) => (
                              <Badge
                                key={role.id}
                                className={getRoleBadgeColor(role.name)}
                                variant="secondary"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                {role.name}
                                <button
                                  onClick={() => removeRole(user.id, role.id)}
                                  className="ml-2 hover:text-destructive"
                                  title="Remove role"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
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
                              <Button size="sm" variant="outline">
                                <UserPlus className="h-4 w-4 mr-2" />
                                {t('admin.user_management.assign_role')}
                              </Button>
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
                                      {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
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
                                <Button onClick={assignRole} className="w-full">
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
                            <Edit className="h-4 w-4 mr-2" />
                            {t('admin.user_management.edit_user')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('admin.user_management.delete_user')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
