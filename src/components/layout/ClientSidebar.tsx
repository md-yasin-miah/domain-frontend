import {
  LayoutDashboard,
  ShoppingCart,
  Handshake,
  Gavel,
  Search,
  Package,
  FileText,
  CreditCard,
  Shield,
  HelpCircle,
  Star,
  MessageSquare,
} from 'lucide-react';
import { AppSidebar, MenuItem } from './AppSidebar';

const clientMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/client/dashboard',
  },
  {
    title: 'Marketplace Listing',
    icon: ShoppingCart,
    url: '/client/marketplace-listing',
  },
  {
    title: 'Offers',
    icon: Handshake,
    url: '/client/offers',
  },
  {
    title: 'Auctions',
    icon: Gavel,
    url: '/client/auctions',
  },
  {
    title: 'Saved Search',
    icon: Search,
    url: '/client/saved-search',
  },
  {
    title: 'Orders',
    icon: Package,
    url: '/client/orders',
    subItems: [
      { title: 'Orders', url: '/client/orders' },
      { title: 'Invoice', url: '/client/invoice' },
      { title: 'Payment', url: '/client/payment' },
      { title: 'Escrows', url: '/client/escrows' },
    ],
  },
  {
    title: 'Support',
    icon: MessageSquare,
    url: '/client/support',
  },
  {
    title: 'FAQs',
    icon: HelpCircle,
    url: '/client/faq',
  },
  {
    title: 'Reviews',
    icon: Star,
    url: '/client/reviews',
  },
];

export function ClientSidebar() {
  return (
    <AppSidebar
      title="Client Portal"
      menuItems={clientMenuItems}
      footerType="user-profile"
      collapsible="icon"
    />
  );
}
