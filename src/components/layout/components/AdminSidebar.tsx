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
  Save,
} from 'lucide-react';
import { AppSidebar, MenuItem } from './AppSidebar';

const adminMenuItems: MenuItem[] = [
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
  return (
    <AppSidebar
      title="Admin Panel"
      menuItems={adminMenuItems}
      footerType="simple"
      collapsible="icon"
    />
  );
}
