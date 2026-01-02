import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  ShoppingCart,
  Grid3X3,
  Settings,
  BookOpen,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Server,
  CreditCard,
  MessageSquare,
  LucideIcon,
} from 'lucide-react';

export interface MenuSubItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
  subItems?: MenuSubItem[];
}

interface HeaderProps {
  menuItems: MenuItem[];
  userServices?: MenuItem[];
  showDashboard?: boolean;
}

export function Header({ menuItems, userServices, showDashboard = true }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenuItems, setExpandedMenuItems] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* Enhanced Header with Professional Design */}
      <header className="sticky top-0 h-16 flex items-center bg-background/95 backdrop-blur-xl border-b border-border/40 z-50 px-4 lg:px-6 shadow-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo Section - Enhanced */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex flex-col items-start hover:opacity-80 transition-opacity group">
              <img
                src="/lovable-uploads/c4e923e1-17e4-42b9-90b4-d79eed7fcc19.png"
                alt="ADOMINIOZ"
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              {/* Tagline below logo */}
              <span className="text-xs text-muted-foreground font-medium mt-1 hidden sm:block">
                {t('common.digital_commerce_future')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Completely Redesigned */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl">
            <div className="flex items-center space-x-1">
              {/* Render menu items - simple links and dropdowns */}
              {menuItems.map((item) => {
                // If item has subItems, render as dropdown
                if (item.subItems && item.subItems.length > 0) {
                  return (
                    <DropdownMenu key={item.title}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[state=open]:bg-muted/80 data-[state=open]:text-foreground"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="w-3 h-3 transition-transform data-[state=open]:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className={`${item.subItems.length > 5 ? 'w-96' : 'w-80'} bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl p-2 z-50`}
                      >
                        <div className={item.subItems.length > 5 ? 'grid grid-cols-2 gap-1' : 'space-y-1'}>
                          {item.subItems?.map((subItem) => (
                            <DropdownMenuItem key={subItem.title} asChild>
                              <Link
                                to={subItem.url}
                                className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/80 transition-all group"
                              >
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                  <subItem.icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-foreground group-hover:text-accent-foreground transition-colors">
                                    {subItem.title}
                                  </div>
                                  {subItem.description && (
                                    <div className="text-xs text-muted-foreground mt-1 leading-tight">{subItem.description}</div>
                                  )}
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                // Otherwise, render as simple NavLink
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}

            </div>
          </nav>

          {/* Right Section - Enhanced Auth & User Menu */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher - Desktop */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {user ? (
              /* Enhanced User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-muted/60 data-[state=open]:bg-muted/80"
                  >
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-3 h-3 hidden sm:block transition-transform data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl p-2 z-50"
                >
                  <div className="px-3 py-2 border-b border-border/40">
                    <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Usuario verificado</p>
                  </div>

                  <div className="py-2">
                    {showDashboard && (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/client/dashboard"
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {userServices?.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link
                          to={item.url}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                          <span>{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Enhanced Authentication Buttons - Better Visual Hierarchy */
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
                >
                  <Link to="/auth" className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>{t('nav.login')}</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Link to="/auth" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{t('nav.register')}</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted/60"
              aria-label="Menú móvil"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu - Improved UX */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40 animate-fade-in">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex-1 px-4 py-6 space-y-6">
              {/* Dynamic Menu Items - Mobile */}
              {menuItems.map((item) => {
                // If item has subItems, render as expandable section
                if (item.subItems && item.subItems.length > 0) {
                  const isExpanded = expandedMenuItems[item.title] || false;
                  const isGridLayout = item.subItems.length > 5;

                  return (
                    <div key={item.title} className="space-y-3">
                      <button
                        onClick={() => setExpandedMenuItems(prev => ({ ...prev, [item.title]: !prev[item.title] }))}
                        className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-primary uppercase tracking-wider hover:bg-muted/30 rounded-lg transition-all"
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className={isGridLayout ? 'grid grid-cols-2 gap-2' : 'space-y-1'}>
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              to={subItem.url}
                              className={`flex ${isGridLayout ? 'flex-col items-center space-y-2 text-center' : 'items-center space-x-3'} p-4 bg-muted/30 hover:bg-muted/60 rounded-xl transition-all`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className={`p-2 rounded-lg bg-primary/10 ${isGridLayout ? '' : 'shrink-0'}`}>
                                <subItem.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className={isGridLayout ? 'mt-1' : 'flex-1'}>
                                <span className={`${isGridLayout ? 'text-xs' : 'text-sm'} font-medium`}>
                                  {subItem.title}
                                </span>
                                {!isGridLayout && subItem.description && (
                                  <div className="text-xs text-muted-foreground mt-1 leading-tight">
                                    {subItem.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Otherwise, render as simple link
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="flex items-center space-x-3 px-4 py-3 text-sm bg-muted/30 hover:bg-muted/60 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}

              {/* User Services - If Logged In */}
              {user && userServices && userServices.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider px-2">
                    {t('nav.profile') || 'Mis Servicios'}
                  </h3>
                  <div className="space-y-1">
                    {userServices.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className="flex items-center space-x-3 px-4 py-3 text-sm bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Authentication Buttons - Mobile Only */}
              {!user && (
                <div className="pt-4 border-t border-border/40">
                  <div className="flex flex-col space-y-3">
                    <Button variant="outline" size="lg" asChild className="w-full justify-center">
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        {t('nav.login')}
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="w-full justify-center bg-gradient-to-r from-primary to-secondary"
                    >
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        {t('nav.register')}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Language Selector - Mobile */}
              <div className="pt-3 border-t border-border/40 sm:hidden">
                <div className="px-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

