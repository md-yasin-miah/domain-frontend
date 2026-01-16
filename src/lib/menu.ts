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
  Code,
  Database,
  Gem,
  TrendingUp,
  Users,
  Grid3X3,
  BookOpen,
  Home,
  Verified,
  List,
} from 'lucide-react';
import { ROUTES } from "./routes";
import { TFunction } from "i18next";

const getAppMenuItems = (t: TFunction): MenuItem[] => {
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
      subItems: [
        {
          title: t('categories.domains'),
          url: ROUTES.APP.CATEGORIES.DOMAINS,
          icon: Server,
          description: t('categories.domains_desc'),
        },
        {
          title: t('categories.websites'),
          url: ROUTES.APP.CATEGORIES.WEBSITES,
          icon: Globe,
          description: t('categories.websites_desc'),
        },
        {
          title: t('categories.fba_stores'),
          url: ROUTES.APP.CATEGORIES.FBA_STORES,
          icon: Smartphone,
          description: t('categories.fba_stores_desc'),
        },
        {
          title: t('categories.mobile_apps'),
          url: ROUTES.APP.CATEGORIES.APPS,
          icon: Code,
          description: t('categories.mobile_apps_desc'),
        },
        {
          title: t('categories.ecommerce'),
          url: ROUTES.APP.CATEGORIES.E_COMMERCE,
          icon: ShoppingCart,
          description: t('categories.ecommerce_desc'),
        },
        {
          title: t('categories.software_saas'),
          url: ROUTES.APP.CATEGORIES.SOFTWARE_SAAS,
          icon: Code,
          description: t('categories.software_saas_desc'),
        },
        {
          title: t('categories.databases'),
          url: ROUTES.APP.CATEGORIES.DATABASES,
          icon: Database,
          description: t('categories.databases_desc'),
        },
        {
          title: t('categories.digital_channels'),
          url: ROUTES.APP.CATEGORIES.DIGITAL_CHANNELS,
          icon: Globe,
          description: t('categories.digital_channels_desc'),
        },
        {
          title: t('categories.nfts'),
          url: ROUTES.APP.CATEGORIES.NFTs,
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
        {
          title: t('nav.apps'),
          url: ROUTES.CLIENT.MARKETPLACE.APPS,
          icon: Smartphone,
        },
        {
          title: t('nav.domains'),
          url: ROUTES.CLIENT.MARKETPLACE.DOMAINS,
          icon: Server,
        },
        {
          title: t('nav.websites'),
          url: ROUTES.CLIENT.MARKETPLACE.WEBSITES,
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
          url: ROUTES.CLIENT.ORDERS.INDEX,
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
    { title: t('nav.profile'), url: ROUTES.CLIENT.PROFILE, icon: User },
    { title: t('nav.settings'), url: ROUTES.CLIENT.PROFILE, icon: Settings },
    { title: t('nav.support'), url: ROUTES.CLIENT.SUPPORT, icon: MessageSquare },
    { title: t('nav.reviews'), url: ROUTES.CLIENT.REVIEWS, icon: Star },
    { title: t('nav.faq'), url: ROUTES.CLIENT.FAQ, icon: HelpCircle },
  ];
}

export {
  getAppMenuItems,
  getClientMenuItems,
  getClientServices,
};