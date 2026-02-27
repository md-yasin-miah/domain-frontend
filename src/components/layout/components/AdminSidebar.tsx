import {
  Shield,
  Users,
  LayoutDashboard,
  FileText,
  HelpCircle,
  List,
  MessageSquare,
  FolderTree,
  Handshake,
  ShoppingCart,
} from "lucide-react";
import { AppSidebar, MenuItem } from "./AppSidebar";
import { ROUTES } from "@/lib/routes";

const adminMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: ROUTES.ADMIN.DASHBOARD,
  },
  {
    title: "User Management",
    icon: Users,
    url: ROUTES.ADMIN.USERS,
  },
  {
    title: "Blog Manager",
    icon: FileText,
    url: ROUTES.ADMIN.BLOG_MANAGER,
  },
  {
    title: "Order Management",
    icon: ShoppingCart,
    url: ROUTES.ADMIN.ORDERS.LIST,
  },
  {
    title: "Listings Management",
    icon: List,
    url: ROUTES.ADMIN.LISTINGS_MANAGEMENT,
  },
  {
    title: "Offers",
    icon: Handshake,
    url: ROUTES.ADMIN.OFFERS,
  },
  {
    title: "Categories",
    icon: FolderTree,
    url: ROUTES.ADMIN.CATEGORIES.SUPPORT,
    subItems: [
      { title: "Support", url: ROUTES.ADMIN.CATEGORIES.SUPPORT },
      { title: "FAQ", url: ROUTES.ADMIN.CATEGORIES.FAQ },
      { title: "Blog", url: ROUTES.ADMIN.CATEGORIES.BLOG },
    ],
  },
  {
    title: "FAQ Manager",
    icon: HelpCircle,
    url: ROUTES.ADMIN.FAQ_MANAGER,
  },
  {
    title: "Roles & Permissions",
    icon: Shield,
    url: ROUTES.ADMIN.ROLES_PERMISSIONS,
  },
  {
    title: "Support",
    icon: MessageSquare,
    url: ROUTES.ADMIN.SUPPORT,
  },
];

export function AdminSidebar() {
  return (
    <AppSidebar
      title="Admin Panel"
      menuItems={adminMenuItems}
      footerType="simple"
      collapsible="icon"
    />
  );
}
