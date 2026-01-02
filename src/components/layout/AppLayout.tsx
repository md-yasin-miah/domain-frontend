import LiveChat from "@/components/LiveChat";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
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
} from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
      <Header
        categoriesItems={categoriesItems}
        servicesItems={servicesItems}
        resourcesItems={resourcesItems}
        userServices={userServices}
      />

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
