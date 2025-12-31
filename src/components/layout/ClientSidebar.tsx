import {
  LayoutDashboard,
  User,
  FileText,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { AppSidebar, MenuItem } from './AppSidebar';

const clientMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/client/dashboard',
  },
  {
    title: 'Profile',
    icon: User,
    url: '/client/profile',
  },
  {
    title: 'My Domains',
    icon: Globe,
    url: '/client/dominios',
  },
  {
    title: 'Invoices',
    icon: FileText,
    url: '/client/facturas',
  },
  {
    title: 'FAQ',
    icon: HelpCircle,
    url: '/client/faq',
  },
];

export function ClientSidebar() {
  return (
    <AppSidebar
      title="Client Portal"
      menuItems={clientMenuItems}
      footerType="user-profile"
      collapsible="icon"
    />
  );
}
