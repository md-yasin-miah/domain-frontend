import LiveChat from '@/components/LiveChat';
import ScrollToTop from '@/components/ScrollToTop';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/hooks/useAuth';
import { getAdminServices, useAppMenuItems, getClientServices } from '@/lib/menu';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const menuItems = useAppMenuItems(t);
  const userServices = user && user?.roles?.some((role: string) => role === 'user')
    ? getClientServices(t)
    : user?.roles?.some((role: string) => role === 'admin')
      ? getAdminServices(t)
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <ScrollToTop />
      <Header menuItems={menuItems} userServices={userServices} navigationType="client" />
        <main className="min-h-screen">
          {children}
        </main>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default AppLayout;
