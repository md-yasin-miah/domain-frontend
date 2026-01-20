import LiveChat from "@/components/LiveChat";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { useTranslation } from "react-i18next";
import { getClientMenuItems, getClientServices } from "@/lib/menu";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <ScrollToTop />
      <Header
        menuItems={getClientMenuItems(t)}
        userServices={getClientServices(t)}
        showDashboard={false}
      />
      <main className="min-h-screen md:p-6 lg:p-8 p-4 container mx-auto">
        {children}
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
};
export default ClientLayout;
