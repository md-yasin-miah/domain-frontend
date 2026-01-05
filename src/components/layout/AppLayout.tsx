import LiveChat from '@/components/LiveChat';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/hooks/useAuth';
import { getAppMenuItems, getClientServices } from '@/lib/menu';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  console.log({ user })
  const { t } = useTranslation();
  const userServices = user && user.roles.some((role: string) => role === 'user')
    ? getClientServices(t)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header menuItems={getAppMenuItems(t)} userServices={userServices} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default AppLayout;
