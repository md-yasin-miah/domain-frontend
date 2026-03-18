import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  Bell,
  ShieldAlert,
  ChartLine,
  Globe,
  LockIcon,
  CreditCard,
  Languages,
  BarChart3,
} from "lucide-react";
import { AppSidebar, MenuItem } from "./AppSidebar";
import { ROUTES } from "@/lib/routes";

export function AdminSidebar() {
  const { t } = useTranslation();

  const adminMenuItems: MenuItem[] = useMemo(
    () => [
      {
        title: t("admin.sidebar.dashboard", "Dashboard"),
        icon: LayoutDashboard,
        url: ROUTES.ADMIN.DASHBOARD,
      },
      {
        title: t("admin.sidebar.analytics", "Analytics"),
        icon: ChartLine,
        url: ROUTES.ADMIN.ANALYTICS,
      },
      {
        title: t("admin.sidebar.user_management", "User Management"),
        icon: Users,
        url: ROUTES.ADMIN.USERS.LIST,
      },
      {
        title: t("admin.sidebar.blog_manager", "Blog Manager"),
        icon: FileText,
        url: ROUTES.ADMIN.BLOG_MANAGER,
      },
      {
        title: t("admin.sidebar.order_management", "Order Management"),
        icon: ShoppingCart,
        url: ROUTES.ADMIN.ORDERS.LIST,
      },
      {
        title: t("admin.sidebar.listings_management", "Listings Management"),
        icon: List,
        url: ROUTES.ADMIN.LISTINGS_MANAGEMENT,
      },
      {
        title: t("admin.sidebar.offers", "Offers"),
        icon: Handshake,
        url: ROUTES.ADMIN.OFFERS,
      },
      {
        title: t("admin.sidebar.categories", "Categories"),
        icon: FolderTree,
        url: ROUTES.ADMIN.CATEGORIES.SUPPORT,
        subItems: [
          { title: t("admin.sidebar.listings", "Listings"), url: ROUTES.ADMIN.CATEGORIES.LISTINGS },
          { title: t("admin.sidebar.support", "Support"), url: ROUTES.ADMIN.CATEGORIES.SUPPORT },
          { title: t("admin.sidebar.faq", "FAQ"), url: ROUTES.ADMIN.CATEGORIES.FAQ },
          { title: t("admin.sidebar.blog", "Blog"), url: ROUTES.ADMIN.CATEGORIES.BLOG },
        ],
      },
      {
        title: t("admin.sidebar.Reports", "Reports"),
        icon: FileText,
        url: ROUTES.ADMIN.REPORTS.OVERVIEW,
        subItems: [
          { title: t("admin.sidebar.reports.overview", "Overview"), url: ROUTES.ADMIN.REPORTS.OVERVIEW },
          { title: t("admin.sidebar.reports.revenue", "Revenue"), url: ROUTES.ADMIN.REPORTS.REVENUE },
          { title: t("admin.sidebar.reports.users", "Users"), url: ROUTES.ADMIN.REPORTS.USERS },
          { title: t("admin.sidebar.reports.listings", "Listings"), url: ROUTES.ADMIN.REPORTS.LISTINGS },
          { title: t("admin.sidebar.reports.orders", "Orders"), url: ROUTES.ADMIN.REPORTS.ORDERS },
          { title: t("admin.sidebar.reports.payments", "Payments"), url: ROUTES.ADMIN.REPORTS.PAYMENTS },
          { title: t("admin.sidebar.reports.escrow", "Escrow"), url: ROUTES.ADMIN.REPORTS.ESCROW },
          { title: t("admin.sidebar.reports.withdrawals", "Withdrawals"), url: ROUTES.ADMIN.REPORTS.WITHDRAWALS },
          { title: t("admin.sidebar.reports.disputes", "Disputes"), url: ROUTES.ADMIN.REPORTS.DISPUTES },
          { title: t("admin.sidebar.reports.support", "Support"), url: ROUTES.ADMIN.REPORTS.SUPPORT },
          { title: t("admin.sidebar.reports.auctions", "Auctions"), url: ROUTES.ADMIN.REPORTS.AUCTIONS },
          { title: t("admin.sidebar.reports.invoices", "Invoices"), url: ROUTES.ADMIN.REPORTS.INVOICES },
        ],
      },
      {
        title: t("admin.sidebar.faq_manager", "FAQ Manager"),
        icon: HelpCircle,
        url: ROUTES.ADMIN.FAQ_MANAGER,
      },
      {
        title: t("admin.sidebar.guides", "Guides"),
        icon: FileText,
        url: ROUTES.ADMIN.GUIDES.CATEGORIES,
        subItems: [
          { title: t("admin.sidebar.guides_categories", "Guide Categories"), url: ROUTES.ADMIN.GUIDES.CATEGORIES },
          { title: t("admin.sidebar.guides_articles", "Guide Articles"), url: ROUTES.ADMIN.GUIDES.ARTICLES },
        ],
      },
      {
        title: t("admin.sidebar.roles_permissions", "Roles & Permissions"),
        icon: Shield,
        url: ROUTES.ADMIN.ROLES_PERMISSIONS,
      },
      {
        title: t("admin.sidebar.payments", "Payments"),
        icon: CreditCard,
        url: ROUTES.ADMIN.PAYMENTS,
      },
      {
        title: t("admin.sidebar.social", "Social"),
        icon: Globe,
        url: ROUTES.ADMIN.SOCIAL,
      },
      {
        title: t("admin.sidebar.valuations", "Valuation"),
        icon: BarChart3,
        url: ROUTES.ADMIN.VALUATIONS.LISTINGS,
        subItems: [
          { title: t("admin.sidebar.valuations_all", "All Valuations"), url: ROUTES.ADMIN.VALUATIONS.LISTINGS },
          // { title: t("admin.sidebar.valuations_comparable", "Comparable Sales"), url: ROUTES.ADMIN.VALUATIONS.COMPARABLE_SALES },
          { title: t("admin.sidebar.valuations_trends", "Market Trends"), url: ROUTES.ADMIN.VALUATIONS.MARKET_TRENDS },
        ],
      },
      {
        title: t("admin.sidebar.disputes", "Disputes"),
        icon: ShieldAlert,
        url: ROUTES.ADMIN.DISPUTES,
      },
      {
        title: t("admin.sidebar.secure_box", "Secure Box"),
        icon: LockIcon,
        url: ROUTES.ADMIN.SECURE_BOX,
      },
      {
        title: t("admin.sidebar.notifications", "Notifications"),
        icon: Bell,
        url: ROUTES.ADMIN.NOTIFICATIONS,
      },
      {
        title: t("admin.sidebar.support", "Support"),
        icon: MessageSquare,
        url: ROUTES.ADMIN.SUPPORT,
      },
      {
        title: t("admin.sidebar.translations", "Translations"),
        icon: Languages,
        url: ROUTES.ADMIN.TRANSLATIONS,
      },
    ],
    [t]
  );

  return (
    <AppSidebar
      menuItems={adminMenuItems}
      footerType="simple"
      collapsible="icon"
    />
  );
}
