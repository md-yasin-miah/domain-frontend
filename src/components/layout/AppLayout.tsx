import LiveChat from '@/components/LiveChat';
import { Footer } from '@/components/layout/Footer';
import { Header, MenuItem } from '@/components/layout/Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  ShoppingCart,
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
  Grid3X3,
  Settings,
  BookOpen,
  Home,
} from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Full menu structure with subitems
  const menuItems: MenuItem[] = [
    {
      title: t('nav.home'),
      url: '/',
      icon: Home,
    },
    {
      title: t('nav.marketplace'),
      url: '/marketplace',
      icon: ShoppingCart,
    },
    {
      title: t('nav.categories'),
      url: '#',
      icon: Grid3X3,
      subItems: [
        {
          title: t('categories.domains'),
          url: '/marketplace/dominios',
          icon: Server,
          description: t('categories.domains_desc'),
        },
        {
          title: t('categories.websites'),
          url: '/marketplace/sitios',
          icon: Globe,
          description: t('categories.websites_desc'),
        },
        {
          title: t('categories.fba_stores'),
          url: '/marketplace/fba',
          icon: Smartphone,
          description: t('categories.fba_stores_desc'),
        },
        {
          title: t('categories.mobile_apps'),
          url: '/marketplace/apps',
          icon: Code,
          description: t('categories.mobile_apps_desc'),
        },
        {
          title: t('categories.ecommerce'),
          url: '/categories/ecommerce',
          icon: ShoppingCart,
          description: t('categories.ecommerce_desc'),
        },
        {
          title: t('categories.software_saas'),
          url: '/categories/software-saas',
          icon: Code,
          description: t('categories.software_saas_desc'),
        },
        {
          title: t('categories.databases'),
          url: '/categories/databases',
          icon: Database,
          description: t('categories.databases_desc'),
        },
        {
          title: t('categories.digital_channels'),
          url: '/categories/digital-channels',
          icon: Globe,
          description: t('categories.digital_channels_desc'),
        },
        {
          title: t('categories.nfts'),
          url: '/categories/nfts',
          icon: Gem,
          description: t('categories.nfts_desc'),
        },
      ],
    },
    {
      title: 'Servicios',
      url: '#',
      icon: Settings,
      subItems: [
        {
          title: t('services.valuations'),
          url: '/services/valuations',
          icon: Server,
          description: t('services.valuations_desc'),
        },
        {
          title: t('services.market_trends'),
          url: '/services/trends',
          icon: TrendingUp,
          description: t('services.market_trends_desc'),
        },
        {
          title: t('services.brokers_network'),
          url: '/services/brokers',
          icon: Users,
          description: t('services.brokers_network_desc'),
        },
        {
          title: t('services.referral_program'),
          url: '/services/referrals',
          icon: Users,
          description: t('services.referral_program_desc'),
        },
      ],
    },
    {
      title: 'Recursos',
      url: '#',
      icon: BookOpen,
      subItems: [
        {
          title: t('resources.guides'),
          url: '/resources/guides',
          icon: BookOpen,
          description: t('resources.guides_desc'),
        },
        {
          title: t('resources.help_center'),
          url: '/resources/help',
          icon: BookOpen,
          description: t('resources.help_center_desc'),
        },
        {
          title: t('resources.blog'),
          url: '/resources/blog',
          icon: BookOpen,
          description: t('resources.blog_desc'),
        },
      ],
    },
  ];

  // User services (when logged in) - for backward compatibility
  const userServices = user
    ? [
      { title: t('user.my_domains'), url: '/user/dominios', icon: Server },
      { title: t('user.invoices'), url: '/user/facturas', icon: CreditCard },
      { title: t('user.support'), url: '/user/soporte', icon: MessageSquare },
    ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header menuItems={menuItems} userServices={userServices} />

      {/* Main Content - Fixed Padding */}
      <main className="min-h-screen">{children}</main>

      {/* Footer Component */}
      <Footer />

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default AppLayout;
