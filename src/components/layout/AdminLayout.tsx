import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6 shadow-sm">
            <SidebarTrigger className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
export default AdminLayout;
