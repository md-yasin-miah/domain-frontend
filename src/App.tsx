import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import AppLayout from "./components/AppLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import DominiosPage from "./pages/marketplace/Dominios";
import SitiosPage from "./pages/marketplace/Sitios";
import NotFound from "./pages/NotFound";
import Terminos from "./pages/legal/Terminos";
import Privacidad from "./pages/legal/Privacidad";
import AML from "./pages/legal/AML";
import Cookies from "./pages/legal/Cookies";
import AvisoLegal from "./pages/legal/AvisoLegal";
import ProteccionDatos from "./pages/legal/ProteccionDatos";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SellerDashboard from "./pages/admin/SellerDashboard";
import BuyerDashboard from "./pages/admin/BuyerDashboard";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import Apps from "./pages/marketplace/Apps";
import FBA from "./pages/marketplace/FBA";
import MisDominios from "./pages/user/MisDominios";
import Facturas from "./pages/user/Facturas";
import Soporte from "./pages/user/Soporte";
import GestionListados from "./pages/admin/GestionListados";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import MarketplaceAdmin from "./pages/admin/MarketplaceAdmin";
import Valuations from "./pages/services/Valuations";
import Trends from "./pages/services/Trends";
import PremiumTrends from "./pages/services/PremiumTrends";
import Brokers from "./pages/services/Brokers";
import ReferralProgram from "./pages/services/ReferralProgram";
import Guides from "./pages/resources/Guides";
import GuideDetail from "./pages/resources/GuideDetail";
import GuideCategory from "./pages/resources/GuideCategory";
import HelpCenter from "./pages/resources/HelpCenter";
import Blog from "./pages/resources/Blog";
import BlogPostDetail from "./pages/resources/BlogPostDetail";
import EcommercePage from "./pages/categories/EcommercePage";
import NFTsPage from "./pages/categories/NFTsPage";
import SoftwareSaaSPage from "./pages/categories/SoftwareSaaSPage";
import DatabasesPage from "./pages/categories/DatabasesPage";
import DigitalChannelsPage from "./pages/categories/DigitalChannelsPage";
import SuperAdminPanel from "./pages/admin/SuperAdminPanel";
import ListingDetail from "./pages/marketplace/ListingDetail";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ProfileSetup from "./pages/client/ProfileSetup";
import FAQ from "./pages/client/FAQ";
import AdvancedSettings from "./pages/admin/AdvancedSettings";
import SEOSettings from "./pages/admin/SEOSettings";
import BackupSettings from "./pages/admin/BackupSettings";
import BlogManager from "./pages/admin/BlogManager";
import BlogPostCreateEdit from "./pages/admin/BlogPostCreateEdit";
import BlogCategories from "./pages/admin/BlogCategories";
import BlogCommentManagement from "./pages/admin/BlogCommentManagement";
import BlogSEOManagement from "./pages/admin/BlogSEOManagement";
import FAQManager from "./pages/admin/FAQManager";
import RolesPermissions from "./pages/admin/RolesPermissions";
import UserManagement from "./pages/admin/UserManagement";

const App = () => (
  <ReduxProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/marketplace" element={<AppLayout><Marketplace /></AppLayout>} />
            <Route path="/marketplace/dominios" element={<AppLayout><DominiosPage /></AppLayout>} />
            <Route path="/marketplace/sitios" element={<AppLayout><SitiosPage /></AppLayout>} />
            <Route path="/marketplace/apps" element={<AppLayout><Apps /></AppLayout>} />
            <Route path="/marketplace/fba" element={<AppLayout><FBA /></AppLayout>} />
            <Route path="/marketplace/listing/:id" element={<AppLayout><ListingDetail /></AppLayout>} />
            <Route path="/legal/terminos" element={<AppLayout><Terminos /></AppLayout>} />
            <Route path="/legal/privacidad" element={<AppLayout><Privacidad /></AppLayout>} />
            <Route path="/legal/aml" element={<AppLayout><AML /></AppLayout>} />
            <Route path="/legal/cookies" element={<AppLayout><Cookies /></AppLayout>} />
            <Route path="/legal/aviso-legal" element={<AppLayout><AvisoLegal /></AppLayout>} />
            <Route path="/legal/proteccion-datos" element={<AppLayout><ProteccionDatos /></AppLayout>} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/terminos" element={<AppLayout><Terminos /></AppLayout>} />
            <Route path="/privacidad" element={<AppLayout><Privacidad /></AppLayout>} />
            <Route path="/aml" element={<AppLayout><AML /></AppLayout>} />
            <Route path="/cookies" element={<AppLayout><Cookies /></AppLayout>} />
            <Route path="/aviso-legal" element={<AppLayout><AvisoLegal /></AppLayout>} />
            <Route path="/proteccion-datos" element={<AppLayout><ProteccionDatos /></AppLayout>} />
            
            {/* Services routes */}
            <Route path="/services/valuations" element={<AppLayout><Valuations /></AppLayout>} />
            <Route path="/services/trends" element={<AppLayout><Trends /></AppLayout>} />
            <Route path="/services/premium-trends" element={<AppLayout><PremiumTrends /></AppLayout>} />
            <Route path="/services/brokers" element={<AppLayout><Brokers /></AppLayout>} />
            <Route path="/services/referrals" element={<AppLayout><ReferralProgram /></AppLayout>} />
            
            {/* Resources routes */}
            <Route path="/resources/guides" element={<AppLayout><Guides /></AppLayout>} />
            <Route path="/resources/guides/:slug" element={<AppLayout><GuideDetail /></AppLayout>} />
            <Route path="/resources/guides/category/:category" element={<AppLayout><GuideCategory /></AppLayout>} />
            <Route path="/resources/help" element={<AppLayout><HelpCenter /></AppLayout>} />
            <Route path="/resources/blog" element={<AppLayout><Blog /></AppLayout>} />
            <Route path="/blog" element={<AppLayout><Blog /></AppLayout>} />
            <Route path="/blog/:slug" element={<AppLayout><BlogPostDetail /></AppLayout>} />
            
            {/* Support - Public access */}
            <Route path="/user/soporte" element={<AppLayout><Soporte /></AppLayout>} />
            <Route path="/soporte" element={<AppLayout><Soporte /></AppLayout>} />
            
            {/* Category routes */}
            <Route path="/categories/ecommerce" element={<AppLayout><EcommercePage /></AppLayout>} />
            <Route path="/categories/nfts" element={<AppLayout><NFTsPage /></AppLayout>} />
            <Route path="/categories/software-saas" element={<AppLayout><SoftwareSaaSPage /></AppLayout>} />
            <Route path="/categories/databases" element={<AppLayout><DatabasesPage /></AppLayout>} />
            <Route path="/categories/digital-channels" element={<AppLayout><DigitalChannelsPage /></AppLayout>} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<Login />} />

            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            
            {/* User protected routes */}
            <Route path="/user/dominios" element={
              <ProtectedRoute>
                <AppLayout><MisDominios /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/facturas" element={
              <ProtectedRoute>
                <AppLayout><Facturas /></AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Client dashboard routes */}
            <Route path="/client/dashboard" element={
              <ProtectedRoute>
                <AppLayout><ClientDashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/client/profile" element={
              <ProtectedRoute>
                <AppLayout><ClientProfile /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/client/profile-setup" element={
              <ProtectedRoute>
                <AppLayout><ProfileSetup /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/client/faq" element={
              <ProtectedRoute>
                <AppLayout><FAQ /></AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/roles-and-permissions" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><RolesPermissions /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><UserManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/seller" element={
              <ProtectedRoute>
                <AdminLayout><SellerDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/buyer" element={
              <ProtectedRoute>
                <AdminLayout><BuyerDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Secure Super Admin Route - No indexing */}
            <Route path="/_admin-roc-9b3a2f" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><SuperAdminPanel /></AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin only routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><SuperAdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/config" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminConfig /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminUsuarios /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/marketplace" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><MarketplaceAdmin /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/listados" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><GestionListados /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/gestion-listados" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><GestionListados /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/advanced-settings" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdvancedSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/seo-settings" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><SEOSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/backup-settings" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BackupSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog-manager" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BlogManager /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog-manager/create" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BlogPostCreateEdit /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog-manager/edit/:id" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BlogPostCreateEdit /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog-manager/categories" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BlogCategories /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog-manager/comments" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BlogCommentManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog-manager/seo" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><BlogSEOManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/faq-manager" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><FAQManager /></AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  </ReduxProvider>
);

export default App;
