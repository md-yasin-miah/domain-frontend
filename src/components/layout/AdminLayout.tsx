import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminSidebar } from './components/AdminSidebar';
import { Header } from './components/Header';
import { ROUTES } from '@/lib/routes';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Settings,
  UserCircle,
} from 'lucide-react';
import { MenuItem } from './components/AppSidebar';
import { getAdminServices } from '@/lib/menu';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t } = useTranslation();

  // Admin menu items - minimal since sidebar handles navigation
  const adminMenuItems: MenuItem[] = [];

  // Admin user services - quick access to admin features
  const adminUserServices: MenuItem[] = getAdminServices(t);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <ScrollToTop />
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            menuItems={adminMenuItems}
            userServices={adminUserServices}
            leftSlot={
              <SidebarTrigger className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105" />
            }
            navigationType="admin"
          />
          <main
            data-scroll-root
            className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-8"
          >
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
