import { useMemo } from 'react';
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
  Globe,
  Server,
  Smartphone,
  MessageSquare,
  HelpCircle,
  Star,
  User,
  Settings,
  TrendingUp,
  Users,
  Grid3X3,
  BookOpen,
  Home,
  Verified,
  List,
  MessagesSquare,
  Wallet,
} from 'lucide-react';
import { ROUTES } from "./routes";
import { TFunction } from "i18next";
import { useGetMarketplaceListingTypesQuery } from '@/store/api/marketplaceApi';
import type { LucideIcon } from 'lucide-react';

/** Map listing type slug to menu icon (optional). */
const slugToIcon: Record<string, LucideIcon> = {
  domains: Server,
  domain: Server,
  websites: Globe,
  website: Globe,
  apps: Smartphone,
  app: Smartphone,
};

/** Build Categories subitems from GET /marketplace/listing-types (active only). */
function buildCategorySubItems(listingTypes: { id: number; name: string; slug: string; description: string | null }[]) {
  return listingTypes.map((type) => ({
    title: type.name,
    url: ROUTES.APP.CATEGORIES.BY_SLUG(type.slug),
    icon: slugToIcon[type.slug] ?? Server,
    description: type.description ?? undefined,
  }));
}

/**
 * App menu with Categories subitems loaded from GET /marketplace/listing-types.
 * Use this in AppLayout so the nav reflects active listing types.
 */
export function useAppMenuItems(t: TFunction): MenuItem[] {
  const { data: listingTypes } = useGetMarketplaceListingTypesQuery({ is_active: true });

  return useMemo(() => {
    const types = Array.isArray(listingTypes) ? listingTypes : [];
    return [
    {
      title: t('nav.home'),
      url: ROUTES.ROOT,
      icon: Home,
    },
    {
      title: t('nav.marketplace'),
      url: ROUTES.APP.MARKETPLACE,
      icon: ShoppingCart,
    },
    {
      title: t('nav.categories'),
      url: '#',
      icon: Grid3X3,
      subItems: buildCategorySubItems(types),
    },
    {
      title: t('nav.services'),
      url: '#',
      icon: Settings,
      subItems: [
        {
          title: t('services.valuations'),
          url: ROUTES.APP.VALUATION.ROOT,
          icon: Server,
          description: t('services.valuations_desc'),
        },
        {
          title: t('services.market_trends'),
          url: '/services/trends',
          icon: TrendingUp,
          description: t('services.market_trends_desc'),
        },
        // {
        //   title: t('services.brokers_network'),
        //   url: '/services/brokers',
        //   icon: Users,
        //   description: t('services.brokers_network_desc'),
        // },
        // {
        //   title: t('services.referral_program'),
        //   url: '/services/referrals',
        //   icon: Users,
        //   description: t('services.referral_program_desc'),
        // },
      ],
    },
    {
      title: t('nav.resources'),
      url: '#',
      icon: BookOpen,
      subItems: [
        {
          title: t('resources.help_center'),
          url: ROUTES.APP.HELP_GUIDES.ROOT,
          icon: BookOpen,
          description: t('resources.help_center_desc'),
        },
        {
          title: t('resources.blog'),
          url: ROUTES.APP.BLOG.ROOT,
          icon: BookOpen,
          description: t('resources.blog_desc'),
        },
      ],
    },
  ];
  }, [t, listingTypes]);
}

const getClientMenuItems = (t: TFunction): MenuItem[] => {
  return [
    {
      title: t('nav.dashboard'),
      url: ROUTES.CLIENT.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      title: t('nav.marketplace'),
      url: '#',
      icon: ShoppingCart,
      subItems: [
        {
          title: t('nav.productsVerification'),
          url: ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION,
          icon: Verified,
        },
        {
          title: t('nav.myListings'),
          url: ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS,
          icon: List,
        },
      ],
    },
    {
      title: t('nav.offers'),
      url: ROUTES.CLIENT.OFFERS.INDEX,
      icon: Handshake,
    },
    {
      title: t('nav.auctions'),
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
          url: ROUTES.CLIENT.ORDERS.ALL,
          icon: Package,
        },
        {
          title: t('nav.invoice'),
          url: ROUTES.CLIENT.ORDERS.INVOICES,
          icon: FileText,
        },
        {
          title: t('nav.payment'),
          url: ROUTES.CLIENT.ORDERS.PAYMENTS,
          icon: CreditCard,
        },
        {
          title: t('nav.escrows'),
          url: ROUTES.CLIENT.ORDERS.ESCROWS,
          icon: Lock,
        },
      ],
    },
  ]
}

const getClientServices = (t: TFunction): MenuItem[] => {
  return [
    { title: t('nav.dashboard'), url: ROUTES.CLIENT.DASHBOARD, icon: LayoutDashboard },
    { title: t('nav.profile'), url: ROUTES.CLIENT.PROFILE, icon: User },
    { title: t('nav.settings'), url: ROUTES.CLIENT.PROFILE, icon: Settings },
    { title: t('nav.wallet'), url: ROUTES.CLIENT.WALLET(), icon: Wallet },
    { title: t('nav.support'), url: ROUTES.CLIENT.SUPPORT, icon: MessageSquare },
    { title: t('nav.chat'), url: ROUTES.CLIENT.CHAT.ROOT, icon: MessagesSquare },
    { title: t('nav.reviews'), url: ROUTES.CLIENT.REVIEWS, icon: Star },
    { title: t('nav.faq'), url: ROUTES.CLIENT.FAQ, icon: HelpCircle },
  ];
}

const getAdminServices = (t: TFunction): MenuItem[] => {
  return [
    { title: t('nav.dashboard'), url: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { title: t('nav.profile'), url: ROUTES.ADMIN.PROFILE, icon: User },
    { title: t('nav.settings'), url: ROUTES.ADMIN.SETTINGS, icon: Settings },
    { title: t('nav.dashboard'), url: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  ];
}
export {
  getClientMenuItems,
  getClientServices,
  getAdminServices,
};