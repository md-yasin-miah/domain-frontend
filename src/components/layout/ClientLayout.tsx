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
import { ROUTES } from '@/lib/constant';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Full menu structure with subitems
  const menuItems: MenuItem[] = [
    {
      title: t('nav.dashboard'),
      url: ROUTES.CLIENT.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      title: t('nav.marketplaceListing'),
      url: '#',
      icon: ShoppingCart,
      subItems: [
        {
          title: t('nav.apps'),
          url: ROUTES.CLIENT.APPS,
          icon: Smartphone,
        },
        {
          title: t('nav.domains'),
          url: ROUTES.CLIENT.DOMAINS,
          icon: Server,
        },
        {
          title: t('nav.websites'),
          url: ROUTES.CLIENT.WEBSITES,
          icon: Globe,
        },
      ],
    },
    {
      title: t('nav.offers'),
      url: ROUTES.CLIENT.OFFERS,
      icon: Handshake,
    },
    {
      title: t('nav.actions'),
      url: ROUTES.CLIENT.AUCTIONS,
      icon: Gavel,
    },
    {
      title: t('nav.savedSearch'),
      url: ROUTES.CLIENT.SAVED_SEARCH,
      icon: Bookmark,
    },
    {
      title: t('nav.orders'),
      url: '#',
      icon: Package,
      subItems: [
        {
          title: t('nav.allOrders'),
          url: ROUTES.CLIENT.ORDERS,
          icon: Package,
        },
        {
          title: t('nav.invoice'),
          url: ROUTES.CLIENT.INVOICES,
          icon: FileText,
        },
        {
          title: t('nav.payment'),
          url: ROUTES.CLIENT.PAYMENTS,
          icon: CreditCard,
        },
        {
          title: t('nav.escrows'),
          url: ROUTES.CLIENT.ESCROWS,
          icon: Lock,
        },
      ],
    },
  ];

  // User services (when logged in) - Profile and Settings for client layout
  const userServices = user
    ? [
      { title: t('nav.profile'), url: ROUTES.CLIENT.PROFILE, icon: User },
      { title: t('nav.settings'), url: ROUTES.CLIENT.PROFILE, icon: Settings },
      { title: t('nav.support'), url: ROUTES.CLIENT.SUPPORT, icon: MessageSquare },
      { title: t('nav.reviews'), url: ROUTES.CLIENT.REVIEWS, icon: Star },
      { title: t('nav.faq'), url: ROUTES.CLIENT.FAQ, icon: HelpCircle },
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
