import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
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
  Building,
  Eye,
  Verified,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import {
  useGetUsersQuery,
  useGetRolesQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useAssignRolesMutation,
  useRemoveRoleMutation,
  useUpdateClientProfileMutation,
} from "@/store/api/userApi";
import { ROUTES } from "@/lib/routes";
import { MultiSelect } from "@/components/common/MultiSelect";
import { usePagination } from "@/hooks/usePagination";

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
    is_verified: boolean;
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
  const navigate = useNavigate();
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // RTK Query hooks
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    skip: (page - 1) * size,
    limit: size,
    search: debouncedSearch.trim() || undefined,
    role: roleFilter.trim() || undefined,
  });
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateClientProfile] = useUpdateClientProfileMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [assignRoles] = useAssignRolesMutation();
  const [removeRole] = useRemoveRoleMutation();

  // Local state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    username: "",
    full_name: "",
    phone_number: "",
    address: "",
    company_name: "",
    company_address: "",
    company_details: "",
    role_id: "",
  });

  // Pagination from API (getUsers returns PaginatedResponse)
  const pagination = useMemo(() => {
    if (!usersData || Array.isArray(usersData)) return undefined;
    const p = usersData.pagination;
    return p
      ? {
          total: p.total,
          page: p.page,
          total_pages: p.total_pages,
          has_next: p.has_next,
          has_previous: p.has_previous,
        }
      : undefined;
  }, [usersData]);

  // Transform API response to local User format
  const users: User[] = useMemo(() => {
    if (!usersData) return [];

    const items = Array.isArray(usersData) ? usersData : usersData.items || [];

    return items.map((user: UserResponse) => {
      const profile = user.profile;
      const fullName = profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
          null
        : null;
      const roles = user.roles.map((role: string) =>
        rolesData?.find((r: Role) => r.name === role),
      );
      return {
        id: String(user.id),
        email: user.email,
        created_at: user.created_at,
        roles,
        profile:
          profile && fullName
            ? {
                id: String(profile.id),
                full_name: fullName,
                phone_number: profile.phone || "",
                address: profile.address_line1 || "",
                company_name: profile.company_name || undefined,
                company_address: undefined, // Not in UserProfile
                company_details: profile.bio || undefined,
                profile_completed: user.is_profile_complete || false,
                is_verified: profile.is_verified,
              }
            : undefined,
      };
    });
  }, [usersData, rolesData]);

  const loading = isLoadingUsers || isLoadingRoles;
  const formLoading = isCreatingUser || isDeletingUser;

  const handleCreateUser = async () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.full_name ||
      !formData.phone_number ||
      !formData.address
    ) {
      toast({
        title: "Error",
        description: t("admin.user_management.create_dialog.required_fields"),
        variant: "destructive",
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
        const nameParts = formData.full_name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        await updateClientProfile({
          first_name: firstName,
          last_name: lastName,
          phone: formData.phone_number,
          address_line1: formData.address,
          company_name: formData.company_name || undefined,
          bio: formData.company_details || undefined,
        }).unwrap();
      }

      // Assign role(s) if selected
      if (formData.role_id) {
        await assignRoles({
          id: userResult.id,
          roleIds: [Number(formData.role_id)],
        }).unwrap();
      }

      toast({
        title: "Success",
        description: t("admin.user_management.messages.create_success"),
      });

      setShowCreateDialog(false);
      resetForm();
      refetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description:
          error?.data?.detail ||
          error?.message ||
          t("admin.user_management.messages.create_error"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(Number(userToDelete.id)).unwrap();

      toast({
        title: "Success",
        description: t("admin.user_management.messages.delete_success"),
      });

      setShowDeleteDialog(false);
      setUserToDelete(null);
      refetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description:
          error?.data?.detail ||
          error?.message ||
          t("admin.user_management.messages.delete_error"),
        variant: "destructive",
      });
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;

    try {
      await assignRoles({
        id: Number(selectedUser.id),
        roleIds: selectedRoleIds,
      }).unwrap();

      toast({
        title: t("admin.user_management.messages.role_assigned"),
        description: t(
          "admin.user_management.assign_role_dialog.roles_updated",
          "Roles updated successfully.",
        ),
      });

      setShowAssignDialog(false);
      setSelectedUser(null);
      setSelectedRoleIds([]);
      refetchUsers();
    } catch (error: unknown) {
      const err = error as { data?: { detail?: string }; message?: string };
      toast({
        title: t("common.error", "Error"),
        description:
          err?.data?.detail ||
          err?.message ||
          t("admin.user_management.messages.role_assigned_error"),
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm(t("admin.user_management.messages.remove_role_confirm"))) {
      return;
    }

    try {
      await removeRole({
        id: Number(userId),
        roleId: Number(roleId),
      }).unwrap();

      toast({
        title: "Role Removed",
        description: t("admin.user_management.messages.role_removed"),
      });

      refetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.detail ||
          error?.message ||
          t("admin.user_management.messages.role_removed_error"),
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      username: "",
      full_name: "",
      phone_number: "",
      address: "",
      company_name: "",
      company_address: "",
      company_details: "",
      role_id: "",
    });
    setSelectedUser(null);
    setSelectedRoleIds([]);
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case "Admin":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "Customer":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  // Define columns for DataTable
  const columns: ColumnDef<User>[] = [
    {
      id: "user",
      header: t("admin.user_management.user"),
      accessorKey: "email",
      cell: ({ row }) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {row.profile?.full_name || t("admin.user_management.no_name")}
            <Badge variant={row.profile?.is_verified ? "success" : "secondary"}>
              {row.profile?.is_verified
                ? t("common.status.verified")
                : t("common.status.not_verified")}
            </Badge>
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
      id: "contact",
      header: t("admin.user_management.contact"),
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
              <span className="truncate max-w-[200px]">
                {row.profile.address}
              </span>
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
      id: "roles",
      header: t("admin.user_management.roles"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-2">
            {row.roles.length === 0 ? (
              <Badge variant="outline" className="text-muted-foreground">
                {t("admin.user_management.no_roles")}
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
        );
      },
      enableSorting: false,
    },
    {
      id: "created",
      header: t("admin.user_management.created"),
      accessorKey: "created_at",
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
            setSelectedRoleIds(
              user.roles
                .filter((r): r is Role => r != null && r.id != null)
                .map((r) => r.id),
            );
          } else {
            setSelectedUser(null);
            setSelectedRoleIds([]);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            title={t("admin.user_management.assign_role")}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("admin.user_management.assign_role_dialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("admin.user_management.assign_role_dialog.description")}{" "}
              {user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("admin.user_management.assign_role_dialog.current_roles")}
              </label>
              <div className="flex flex-wrap gap-2">
                {user.roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "admin.user_management.assign_role_dialog.no_roles_assigned",
                    )}
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
                {t("admin.user_management.assign_role_dialog.select_roles")}
              </label>
              <MultiSelect
                options={(rolesData ?? []).map((role: Role) => ({
                  value: role.id,
                  label: role.name,
                  description: role.description ?? undefined,
                }))}
                value={selectedRoleIds}
                onChange={(ids) => setSelectedRoleIds(ids.map(Number))}
                placeholder={t(
                  "admin.user_management.assign_role_dialog.choose_role",
                )}
                emptyMessage={t(
                  "admin.user_management.assign_role_dialog.no_roles_available",
                  "No roles available",
                )}
                triggerClassName="w-full"
              />
            </div>
            <Button onClick={handleAssignRoles} className="w-full">
              {t("admin.user_management.assign_role_dialog.assign")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate(ROUTES.ADMIN.USERS.DETAILS(Number(user.id)))}
      >
        <Eye className="h-4 w-4" />
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
          <p className="text-muted-foreground">
            {t("admin.user_management.messages.loading")}
          </p>
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
              {t("admin.user_management.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("admin.user_management.description")}
            </p>
          </div>
          <div>
            <Link to={ROUTES.ADMIN.USERS.VERIFICATIONS.LIST} className="mr-4">
              <Button>
                <Verified className="h-4 w-4 mr-2" />
                Verifications
              </Button>
            </Link>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("admin.user_management.create_user")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {t("admin.user_management.create_dialog.title")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("admin.user_management.create_dialog.description")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-email">
                        {t("admin.user_management.create_dialog.email")} *
                      </Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-username">
                        {t("admin.user_management.create_dialog.username")} *
                      </Label>
                      <Input
                        id="create-username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-password">
                        {t("admin.user_management.create_dialog.password")} *
                      </Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-role">
                        {t("admin.user_management.create_dialog.initial_role")}
                      </Label>
                      <Select
                        value={formData.role_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, role_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "admin.user_management.create_dialog.select_role",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesData.map((role: Role) => (
                            <SelectItem
                              key={role.id}
                              value={role.id.toString()}
                            >
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-full-name">
                      {t("admin.user_management.create_dialog.full_name")} *
                    </Label>
                    <Input
                      id="create-full-name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-phone">
                        {t("admin.user_management.create_dialog.phone_number")}{" "}
                        *
                      </Label>
                      <Input
                        id="create-phone"
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-address">
                      {t("admin.user_management.create_dialog.address")} *
                    </Label>
                    <Textarea
                      id="create-address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="123 Main St, City, State, ZIP"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-company-name">
                      {t("admin.user_management.create_dialog.company_name")}
                    </Label>
                    <Input
                      id="create-company-name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_name: e.target.value,
                        })
                      }
                      placeholder="Company Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-company-address">
                      {t("admin.user_management.create_dialog.company_address")}
                    </Label>
                    <Textarea
                      id="create-company-address"
                      value={formData.company_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_address: e.target.value,
                        })
                      }
                      placeholder="Company address"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-company-details">
                      {t("admin.user_management.create_dialog.company_details")}
                    </Label>
                    <Textarea
                      id="create-company-details"
                      value={formData.company_details}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_details: e.target.value,
                        })
                      }
                      placeholder="Additional company information"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    {t("admin.user_management.create_dialog.cancel")}
                  </Button>
                  <Button onClick={handleCreateUser} disabled={formLoading}>
                    {formLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {t("admin.user_management.create_dialog.create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <CardTitle>{t("admin.user_management.all_users")}</CardTitle>
                <CardDescription>
                  {pagination
                    ? `${pagination.total} ${
                        pagination.total === 1
                          ? t("admin.user_management.users_found")
                          : t("admin.user_management.users_found_plural")
                      }`
                    : `${users.length} ${
                        users.length === 1
                          ? t("admin.user_management.users_found")
                          : t("admin.user_management.users_found_plural")
                      }`}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative flex-1 min-w-0 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.user_management.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handlePageChange(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={roleFilter || "all"}
                onValueChange={(v) => {
                  setRoleFilter(v === "all" ? "" : v);
                  handlePageChange(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue
                    placeholder={t(
                      "admin.user_management.filter_by_role",
                      "Filter by role",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all", "All")}</SelectItem>
                  {(rolesData ?? []).map((role: Role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<User>
            data={users}
            columns={columns}
            pagination={pagination}
            isLoading={loading}
            emptyMessage={t("admin.user_management.no_users")}
            getRowId={(row) => row.id}
            renderActions={renderUserActions}
            actionsColumnHeader={t("admin.user_management.actions")}
            enableSorting={true}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            error={usersError}
            errorTitle={t("common.error.title", "Error")}
            errorDescription={t(
              "common.error.description",
              "Something went wrong.",
            )}
            errorIcon={<Users className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.user_management.delete_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.user_management.delete_dialog.description")}
              {userToDelete?.email && ` for ${userToDelete.email}`}{" "}
              {t("admin.user_management.delete_dialog.and_data")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              {t("admin.user_management.delete_dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={formLoading}
            >
              {formLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {t("admin.user_management.delete_dialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
