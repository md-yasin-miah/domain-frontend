import { useState, useEffect, ReactNode } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LucideIcon, ChevronRight, LogOut } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/store/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export interface MenuSubItem {
  title: string;
  url: string;
}

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  url: string;
  subItems?: MenuSubItem[];
}

export interface AppSidebarProps {
  title: string;
  menuItems: MenuItem[];
  footerType?: 'simple' | 'user-profile';
  collapsible?: 'icon' | 'offcanvas' | 'none';
  className?: string;
}

export function AppSidebar({
  title,
  menuItems,
  footerType = 'simple',
  collapsible = 'icon',
  className,
}: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '#' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  // Initialize open submenus if any subitem is active
  const getInitialOpenSubmenus = (): Record<string, boolean> => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some((sub) => isActive(sub.url));
        if (hasActiveSubItem) {
          initial[item.url] = true;
        }
      }
    });
    return initial;
  };

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() =>
    getInitialOpenSubmenus()
  );

  // Update open submenus when location changes (for nested routes)
  useEffect(() => {
    const updated: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some((sub) => {
          const path = sub.url;
          if (location.pathname === path) return true;
          // Check if pathname starts with the path followed by / (for nested routes)
          if (path !== '#' && location.pathname.startsWith(path + '/')) return true;
          return false;
        });
        if (hasActiveSubItem) {
          updated[item.url] = true;
        }
      }
    });
    setOpenSubmenus((prev) => ({ ...prev, ...updated }));
  }, [location.pathname, menuItems]);

  const toggleSubmenu = (itemUrl: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemUrl]: !prev[itemUrl],
    }));
  };

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

  const isItemActive = (item: MenuItem) => {
    if (isActive(item.url)) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => isActive(sub.url));
    }
    return false;
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

  const renderFooter = () => {
    if (footerType === 'user-profile') {
      return (
        <SidebarFooter className="border-t border-sidebar-border/50 bg-sidebar-background/50 backdrop-blur-sm">
          <div className="flex flex-col gap-2 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start transition-all duration-200 text-destructive/80 hover:text-destructive hover:bg-destructive/10 hover:shadow-sm group"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && <span>{t('auth.logout') || 'Logout'}</span>}
            </Button>
          </div>
        </SidebarFooter>
      );
    }

    return (
      <SidebarFooter className="border-t border-sidebar-border/50 bg-sidebar-background/50 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={t('auth.logout') || 'Logout'}
              className={cn(
                'w-full transition-all duration-200',
                'text-destructive/80 hover:text-destructive',
                'hover:bg-destructive/10 hover:shadow-sm',
                'group'
              )}
            >
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && <span>{t('auth.logout') || 'Logout'}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    );
  };

  return (
    <Sidebar
      collapsible={collapsible}
      className={cn(
        'border-r border-sidebar-border/50 bg-gradient-to-b from-sidebar-background to-sidebar-background/95 backdrop-blur-sm',
        className
      )}
    >
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-sidebar-foreground uppercase tracking-wider">
            {title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = openSubmenus[item.url] || false;
                const itemIsActive = isItemActive(item);

                if (hasSubItems && !isCollapsed) {
                  return (
                    <Collapsible
                      key={item.url}
                      open={isOpen}
                      onOpenChange={() => toggleSubmenu(item.url)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={itemIsActive}
                            className={cn(
                              'group relative w-full transition-all duration-200',
                              'hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground',
                              'data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
                              'data-[active=true]:font-semibold data-[active=true]:shadow-sm',
                              'data-[active=true]:rounded-s-lg',
                              'data-[active=true]:before:absolute data-[active=true]:before:left-0',
                              'data-[active=true]:before:top-0 data-[active=true]:before:h-full',
                              'data-[active=true]:before:w-0.5 data-[active=true]:before:bg-primary',
                              'data-[active=true]:before:rounded-none'
                            )}
                          >
                            <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            <span className="flex-1 text-left">{item.title}</span>
                            <ChevronRight
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isOpen && 'rotate-90'
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                          <SidebarMenuSub className="ml-2 mt-1 space-y-0.5 border-l-2 border-sidebar-border/30 pl-2">
                            {item.subItems?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(subItem.url)}
                                  className={cn(
                                    'transition-all duration-200',
                                    'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                                    'hover:translate-x-1',
                                    'data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
                                    'data-[active=true]:font-medium data-[active=true]:shadow-sm',
                                    'data-[active=true]:before:absolute data-[active=true]:before:left-0',
                                    'data-[active=true]:before:top-1/2 data-[active=true]:before:-translate-y-1/2',
                                    'data-[active=true]:before:h-1.5 data-[active=true]:before:w-1.5',
                                    'data-[active=true]:before:bg-primary data-[active=true]:before:rounded-full',
                                    'data-[active=true]:before:-left-3'
                                  )}
                                >
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={itemIsActive}
                      tooltip={item.title}
                      className={cn(
                        'relative w-full transition-all duration-200',
                        'hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground',
                        'hover:shadow-sm hover:scale-[1.02]',
                        'data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
                        'data-[active=true]:font-semibold data-[active=true]:shadow-sm',
                        'data-[active=true]:rounded-sm data-[active=true]:rounded-s-none',
                        'data-[active=true]:before:absolute data-[active=true]:before:left-0',
                        'data-[active=true]:before:top-0 data-[active=true]:before:h-full',
                        'data-[active=true]:before:w-0.5 data-[active=true]:before:bg-primary',
                        'data-[active=true]:before:rounded-none'
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4 transition-transform duration-200" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {renderFooter()}
    </Sidebar>
  );
}

