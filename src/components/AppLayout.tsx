import { Outlet, Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LiveChat from "@/components/LiveChat";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
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
  Globe,
  Smartphone,
  Code,
  Database,
  Play,
  Gem,
  TrendingUp,
  Award,
  Users,
  FileText,
} from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Categories menu items
  const categoriesItems = [
    {
      title: t("categories.domains"),
      url: "/marketplace/dominios",
      icon: Globe,
      description: t("categories.domains_desc"),
    },
    {
      title: t("categories.websites"),
      url: "/marketplace/sitios",
      icon: Globe,
      description: t("categories.websites_desc"),
    },
    {
      title: t("categories.fba_stores"),
      url: "/marketplace/fba",
      icon: ShoppingCart,
      description: t("categories.fba_stores_desc"),
    },
    {
      title: t("categories.mobile_apps"),
      url: "/marketplace/apps",
      icon: Smartphone,
      description: t("categories.mobile_apps_desc"),
    },
    {
      title: t("categories.ecommerce"),
      url: "/categories/ecommerce",
      icon: ShoppingCart,
      description: t("categories.ecommerce_desc"),
    },
    {
      title: t("categories.software_saas"),
      url: "/categories/software-saas",
      icon: Code,
      description: t("categories.software_saas_desc"),
    },
    {
      title: t("categories.databases"),
      url: "/categories/databases",
      icon: Database,
      description: t("categories.databases_desc"),
    },
    {
      title: t("categories.digital_channels"),
      url: "/categories/digital-channels",
      icon: Play,
      description: t("categories.digital_channels_desc"),
    },
    { title: t("categories.nfts"), url: "/categories/nfts", icon: Gem, description: t("categories.nfts_desc") },
  ];

  // Services menu items
  const servicesItems = [
    {
      title: t("services.valuations"),
      url: "/services/valuations",
      icon: TrendingUp,
      description: t("services.valuations_desc"),
    },
    {
      title: t("services.market_trends"),
      url: "/services/trends",
      icon: Award,
      description: t("services.market_trends_desc"),
    },
    {
      title: t("services.brokers_network"),
      url: "/services/brokers",
      icon: Users,
      description: t("services.brokers_network_desc"),
    },
    {
      title: t("services.referral_program"),
      url: "/services/referrals",
      icon: Award,
      description: t("services.referral_program_desc"),
    },
  ];

  // User services (when logged in)
  const userServices = user
    ? [
      { title: t("user.my_domains"), url: "/user/dominios", icon: Server },
      { title: t("user.invoices"), url: "/user/facturas", icon: CreditCard },
      { title: t("user.support"), url: "/user/soporte", icon: MessageSquare },
    ]
    : [];

  // Resources menu items
  const resourcesItems = [
    { title: t("resources.guides"), url: "/resources/guides", icon: FileText, description: t("resources.guides_desc") },
    {
      title: t("resources.help_center"),
      url: "/resources/help",
      icon: MessageSquare,
      description: t("resources.help_center_desc"),
    },
    { title: t("resources.blog"), url: "/resources/blog", icon: FileText, description: t("resources.blog_desc") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
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
                {t("common.digital_commerce_future")}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Completely Redesigned */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl">
            <div className="flex items-center space-x-1">
              {/* Core Navigation Links */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>{t("nav.home")}</span>
              </NavLink>

              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`
                }
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t("nav.marketplace")}</span>
              </NavLink>

              {/* Enhanced Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[state=open]:bg-muted/80 data-[state=open]:text-foreground"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>Categorías</span>
                    <ChevronDown className="w-3 h-3 transition-transform data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-96 bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl p-2 z-50"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {categoriesItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link
                          to={item.url}
                          className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/80 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[state=open]:bg-muted/80 data-[state=open]:text-foreground"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Servicios</span>
                    <ChevronDown className="w-3 h-3 transition-transform data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-80 bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl p-2 z-50"
                >
                  <div className="space-y-1">
                    {servicesItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link
                          to={item.url}
                          className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/80 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                            <item.icon className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground group-hover:text-secondary transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[state=open]:bg-muted/80 data-[state=open]:text-foreground"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Recursos</span>
                    <ChevronDown className="w-3 h-3 transition-transform data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-80 bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl p-2 z-50"
                >
                  <div className="space-y-1">
                    {resourcesItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link
                          to={item.url}
                          className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/80 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-accent/50 group-hover:bg-accent transition-colors">
                            <item.icon className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground group-hover:text-accent-foreground transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    <DropdownMenuItem asChild>
                      <Link
                        to="/client/dashboard"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    {userServices.map((item) => (
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
                    <span>{t("nav.login")}</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Link to="/auth" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{t("nav.register")}</span>
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
              {/* Main Navigation - Mobile */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider px-2">
                  Navegación Principal
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/"
                    className="flex items-center space-x-3 px-4 py-3 text-sm bg-muted/30 hover:bg-muted/60 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="w-4 h-4 text-primary" />
                    <span className="font-medium">Inicio</span>
                  </Link>

                  <Link
                    to="/marketplace"
                    className="flex items-center space-x-3 px-4 py-3 text-sm bg-muted/30 hover:bg-muted/60 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    <span className="font-medium">Marketplace</span>
                  </Link>
                </div>
              </div>

              {/* Categories - Mobile */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider px-2">Categorías</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categoriesItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className="flex flex-col items-center space-y-2 p-4 bg-muted/30 hover:bg-muted/60 rounded-xl transition-all text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xs font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services - Mobile */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider px-2">Servicios</h3>
                <div className="space-y-1">
                  {servicesItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className="flex items-center space-x-3 px-4 py-3 text-sm bg-secondary/5 hover:bg-secondary/10 border border-secondary/20 rounded-xl transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 text-secondary" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources - Mobile */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-accent-foreground uppercase tracking-wider px-2">Recursos</h3>
                <div className="space-y-1">
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className="flex items-center space-x-3 px-4 py-3 text-sm bg-accent/30 hover:bg-accent/50 rounded-xl transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 text-accent-foreground" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Services - If Logged In */}
              {user && userServices.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider px-2">Mis Servicios</h3>
                  <div className="space-y-1">
                    {userServices.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className="flex items-center space-x-3 px-4 py-3 text-sm bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4 text-primary" />
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
                        {t("nav.login")}
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="w-full justify-center bg-gradient-to-r from-primary to-secondary"
                    >
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        {t("nav.register")}
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

      {/* Main Content - Fixed Padding */}
      <main className="min-h-screen">{children}</main>

      {/* Enhanced Footer - Updated Legal Info */}
      <footer className="bg-muted/30 border-t border-border/40 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img
                src="/lovable-uploads/c4e923e1-17e4-42b9-90b4-d79eed7fcc19.png"
                alt="ADOMINIOZ"
                className="h-8 w-auto"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plataforma líder en trading de activos digitales con máxima seguridad y transparencia. Operamos como
                marketplace con estrictas medidas de protección.
              </p>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">ADOMINIOZ</p>
                <p>(DBA of ROC Worldwide Agency LLC)</p>
                <p>9002 Six Pines Dr Suite 277</p>
                <p>Shenandoah, TX 77380, USA</p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/legal/terminos" className="block text-muted-foreground hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
                <Link
                  to="/legal/privacidad"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de Privacidad
                </Link>
                <Link to="/legal/aml" className="block text-muted-foreground hover:text-primary transition-colors">
                  AML/KYC
                </Link>
                <Link to="/legal/cookies" className="block text-muted-foreground hover:text-primary transition-colors">
                  Política de Cookies
                </Link>
                <Link
                  to="/legal/aviso-legal"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Aviso Legal
                </Link>
                <Link
                  to="/legal/proteccion-datos"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Protección de Datos
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Soporte</h4>
              <div className="space-y-2 text-sm">
                <Link to="/resources/help" className="block text-muted-foreground hover:text-primary transition-colors">
                  Centro de Ayuda
                </Link>
                <Link to="/user/soporte" className="block text-muted-foreground hover:text-primary transition-colors">
                  Sistema de Tickets
                </Link>
                <span className="block text-muted-foreground">Chat en vivo disponible</span>
                <Link
                  to="/resources/guides"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Guías y Tutoriales
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Contacto</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: support@adominioz.com</p>
                <p>ADOMINIOZ - DBA: ROC Worldwide Agency LLC</p>
                <p>9002 Six Pines Dr Suite 277</p>
                <p>Shenandoah, TX 77380, USA</p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Enhanced Legal Protection */}
          <div className="border-t border-border/40 mt-8 pt-8 space-y-4">
            <div className="text-xs text-muted-foreground text-center md:text-left">
              <p>&copy; 2024 ADOMINIOZ (DBA of ROC Worldwide Agency LLC). Todos los derechos reservados.</p>
              <p className="mt-1">Operamos conforme a las leyes federales y estatales aplicables en Estados Unidos.</p>
            </div>

            {/* Risk Warning & Legal Protection */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-warning">⚠️ AVISO DE RIESGO DE INVERSIÓN:</p>
                <p>
                  El trading de activos digitales conlleva riesgos significativos. El valor de las inversiones puede
                  fluctuar y existe la posibilidad de pérdida total o parcial del capital invertido. ADOMINIOZ actúa
                  únicamente como marketplace y no ofrece asesoramiento financiero. Los compradores y vendedores son
                  responsables de sus decisiones de inversión.
                </p>
                <p className="font-medium text-foreground">
                  PROTECCIÓN DE ACTIVOS: Todos los activos, bienes y propiedades intelectuales de ROC Worldwide Agency
                  LLC están protegidos por las leyes de Estados Unidos. Limitamos nuestra responsabilidad conforme a la
                  ley aplicable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default AppLayout;
