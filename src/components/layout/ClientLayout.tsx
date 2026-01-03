import LiveChat from '@/components/LiveChat';
import { Footer } from '@/components/layout/Footer';
import { Header, MenuItem } from '@/components/layout/Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/hooks/useAuth';
import {
  LayoutDashboard,
  ShoppingCart,
  Handshake,
  Gavel,
  Bookmark,
  Package,
  FileText,
  CreditCard,
  Lock,
  MessageSquare,
  HelpCircle,
  Star,
  User,
  Settings,
  Globe,
  Server,
  Smartphone,
} from 'lucide-react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Full menu structure with subitems
  const menuItems: MenuItem[] = [
    {
      title: t('nav.dashboard') || 'Dashboard',
      url: '/client/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('nav.marketplaceListing'),
      url: '#',
      icon: ShoppingCart,
      subItems: [
        {
          title: t('nav.apps'),
          url: '/client/apps',
          icon: Smartphone,
        },
        {
          title: t('nav.domains'),
          url: '/client/domains',
          icon: Server,
        },
        {
          title: t('nav.websites'),
          url: '/client/websites',
          icon: Globe,
        },
      ],
    },
    {
      title: t('nav.offers'),
      url: '/client/offers',
      icon: Handshake,
    },
    {
      title: t('nav.actions'),
      url: '/client/auctions',
      icon: Gavel,
    },
    {
      title: t('nav.savedSearch'),
      url: '/client/saved-search',
      icon: Bookmark,
    },
    {
      title: t('nav.orders'),
      url: '#',
      icon: Package,
      subItems: [
        {
          title: t('nav.allOrders'),
          url: '/client/orders',
          icon: Package,
        },
        {
          title: t('nav.invoice'),
          url: '/client/invoices',
          icon: FileText,
        },
        {
          title: t('nav.payment'),
          url: '/client/payments',
          icon: CreditCard,
        },
        {
          title: t('nav.escrows'),
          url: '/client/escrows',
          icon: Lock,
        },
      ],
    },
  ];

  // User services (when logged in) - Profile and Settings for client layout
  const userServices = user
    ? [
      { title: t('nav.profile'), url: '/client/profile', icon: User },
      { title: t('nav.settings'), url: '/client/profile', icon: Settings },
      { title: t('nav.support'), url: '/client/support', icon: MessageSquare },
      { title: t('nav.reviews'), url: '/client/reviews', icon: Star },
      { title: t('nav.faq'), url: '/client/faq', icon: HelpCircle },
    ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header menuItems={menuItems} userServices={userServices} showDashboard={false} />

      {/* Main Content - Fixed Padding */}
      <main className="min-h-screen">{children}</main>

      {/* Footer Component */}
      <Footer />

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
}
