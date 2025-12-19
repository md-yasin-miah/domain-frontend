import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  LayoutDashboard,
  Settings,
  FileText,
  ShoppingCart,
  HelpCircle,
  List,
  TrendingUp,
  Database,
  Lock,
  Save,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const adminMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/admin/dashboard',
  },
  {
    title: 'User Management',
    icon: Users,
    url: '/admin/users',
  },
  {
    title: 'Roles & Permissions',
    icon: Shield,
    url: '/admin/roles-and-permissions',
  },
  {
    title: 'Configuration',
    icon: Settings,
    url: '/admin/config',
  },
  {
    title: 'Advanced Settings',
    icon: Settings,
    url: '/admin/advanced-settings',
  },
  {
    title: 'SEO Settings',
    icon: TrendingUp,
    url: '/admin/seo-settings',
  },
  {
    title: 'Backup & Restore',
    icon: Save,
    url: '/admin/backup-settings',
  },
  {
    title: 'Blog Manager',
    icon: FileText,
    url: '/admin/blog-manager',
    subItems: [
      { title: 'All Posts', url: '/admin/blog-manager' },
      { title: 'Categories', url: '/admin/blog-manager/categories' },
      { title: 'Comments', url: '/admin/blog-manager/comments' },
      { title: 'SEO Management', url: '/admin/blog-manager/seo' },
    ],
  },
  {
    title: 'FAQ Manager',
    icon: HelpCircle,
    url: '/admin/faq-manager',
  },
  {
    title: 'Marketplace Admin',
    icon: ShoppingCart,
    url: '/admin/marketplace',
  },
  {
    title: 'Listings Management',
    icon: List,
    url: '/admin/gestion-listados',
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: t('auth.logout_success') || 'Logged out',
        description: t('auth.logout_success_desc') || 'You have been successfully logged out',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: t('auth.logout_error') || 'Logout Error',
        description: error.message || t('auth.logout_error_desc') || 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url) || (item.subItems && item.subItems.some(sub => isActive(sub.url)))}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                  {!isCollapsed && item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={t('auth.logout') || 'Logout'}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>{t('auth.logout') || 'Logout'}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
