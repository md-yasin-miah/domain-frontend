import LiveChat from "@/components/LiveChat";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { useTranslation } from "react-i18next";
import { getAdminServices, getClientMenuItems, getClientServices } from "@/lib/menu";
import { useAuth } from "@/store/hooks/useAuth";
import TutorialSettingsFab from "@/components/tutorial/TutorialSettingsFab";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const userServices = user && user.roles.some((role: string) => role === 'user')
    ? getClientServices(t)
    : user.roles.some((role: string) => role === 'admin')
      ? getAdminServices(t)
      : [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <ScrollToTop />
      <Header
        menuItems={getClientMenuItems(t)}
        userServices={userServices} 
        navigationType="client"
      />
      <main className="min-h-screen md:p-6 lg:p-8 p-4 container mx-auto">
        {children}
      </main>
      <TutorialSettingsFab />
      <Footer />
      <LiveChat />
    </div>
  );
};
export default ClientLayout;
