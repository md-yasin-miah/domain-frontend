import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { Header } from './components/Header';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard
} from 'lucide-react';
import { MenuItem } from './components/AppSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t } = useTranslation();

  // Admin menu items - minimal since sidebar handles navigation
  const adminMenuItems: MenuItem[] = [];

  // Admin user services - quick access to admin features
  const adminUserServices: MenuItem[] = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            menuItems={adminMenuItems}
            userServices={adminUserServices}
            showDashboard={false}
            leftSlot={
              <SidebarTrigger className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105" />
            }
          />
          <main className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
export default AdminLayout;
