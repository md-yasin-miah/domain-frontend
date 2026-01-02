import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from './ClientSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: t('auth.logout_success') || 'Logged out',
        description: t('auth.logout_success_desc') || 'You have been logged out successfully',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: t('auth.logout_error') || 'Error',
        description: t('auth.logout_error_desc') || 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const userInitials = user?.email
    ? user.email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase()
    : 'U';

  const userName =
    user?.profile?.first_name && user?.profile?.last_name
      ? `${user.profile.first_name} ${user.profile.last_name}`
      : user?.email || 'User';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <ClientSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6 shadow-sm">
            <SidebarTrigger className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-muted/60">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile?.avatar_url || undefined} alt={userName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl p-2 z-50"
                  align="end"
                  forceMount
                >
                  <div className="px-3 py-2 border-b border-border/40">
                    <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/client/profile"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">{t('client.profile') || 'Profile'}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/client/profile"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span>{t('client.settings') || 'Settings'}</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('auth.logout') || 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
