import { createBrowserRouter, Outlet } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ClientLayout } from "./components/layout/ClientLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
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
import { AuthRedirectHandler } from "./components/auth/AuthRedirectHandler";
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

export const router = createBrowserRouter([
  // Root route
  {
    path: "/",
    element: (
      <>
        <AuthRedirectHandler />
        <AppLayout>
          <Outlet />
        </AppLayout>
      </>
    ),
    children: [
      {
        index: true,
        element: <Index />,
      },
      // Marketplace routes - Nested
      {
        path: "marketplace",
        children: [
          {
            index: true,
            element: <Marketplace />,
          },
          {
            path: "dominios",
            element: <DominiosPage />,
          },
          {
            path: "sitios",
            element: <SitiosPage />,
          },
          {
            path: "apps",
            element: <Apps />,
          },
          {
            path: "fba",
            element: <FBA />,
          },
          {
            path: "listing/:id",
            element: <ListingDetail />,
          },
        ],
      },
      // Legal routes - Nested
      {
        path: "legal",
        children: [
          {
            path: "terminos",
            element: <Terminos />,
          },
          {
            path: "privacidad",
            element: <Privacidad />,
          },
          {
            path: "aml",
            element: <AML />,
          },
          {
            path: "cookies",
            element: <Cookies />,
          },
          {
            path: "aviso-legal",
            element: <AvisoLegal />,
          },
          {
            path: "proteccion-datos",
            element: <ProteccionDatos />,
          },
        ],
      },
      // Legacy legal routes for backward compatibility
      {
        path: "terminos",
        element: <Terminos />,
      },
      {
        path: "privacidad",
        element: <Privacidad />,
      },
      {
        path: "aml",
        element: <AML />,
      },
      {
        path: "cookies",
        element: <Cookies />,
      },
      {
        path: "aviso-legal",
        element: <AvisoLegal />,
      },
      {
        path: "proteccion-datos",
        element: <ProteccionDatos />,
      },
      // Services routes - Nested
      {
        path: "services",
        children: [
          {
            path: "valuations",
            element: <Valuations />,
          },
          {
            path: "trends",
            element: <Trends />,
          },
          {
            path: "premium-trends",
            element: <PremiumTrends />,
          },
          {
            path: "brokers",
            element: <Brokers />,
          },
          {
            path: "referrals",
            element: <ReferralProgram />,
          },
        ],
      },
      // Resources routes - Nested
      {
        path: "resources",
        children: [
          {
            path: "guides",
            children: [
              {
                index: true,
                element: <Guides />,
              },
              {
                path: ":slug",
                element: <GuideDetail />,
              },
              {
                path: "category/:category",
                element: <GuideCategory />,
              },
            ],
          },
          {
            path: "help",
            element: <HelpCenter />,
          },
          {
            path: "blog",
            element: <Blog />,
          },
        ],
      },
      // Blog routes (alternative paths)
      {
        path: "blog",
        children: [
          {
            index: true,
            element: <Blog />,
          },
          {
            path: ":slug",
            element: <BlogPostDetail />,
          },
        ],
      },
      // Support routes
      {
        path: "user",
        children: [
          {
            path: "soporte",
            element: <Soporte />,
          },
        ],
      },
      {
        path: "soporte",
        element: <Soporte />,
      },
      // Categories routes - Nested
      {
        path: "categories",
        children: [
          {
            path: "ecommerce",
            element: <EcommercePage />,
          },
          {
            path: "nfts",
            element: <NFTsPage />,
          },
          {
            path: "software-saas",
            element: <SoftwareSaaSPage />,
          },
          {
            path: "databases",
            element: <DatabasesPage />,
          },
          {
            path: "digital-channels",
            element: <DigitalChannelsPage />,
          },
        ],
      },
    ],
  },
  // Auth routes (no layout)
  {
    path: "/auth",
    element: (
      <>
        <AuthRedirectHandler />
        <Login />
      </>
    ),
  },
  // Client routes with ClientLayout
  {
    path: "/client",
    element: (
      <ProtectedRoute>
        <ClientLayout>
          <Outlet />
        </ClientLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <ClientDashboard />,
      },
      {
        path: "profile",
        element: <ClientProfile />,
      },
      {
        path: "profile-setup",
        element: <ProfileSetup />,
      },
      {
        path: "dominios",
        element: <MisDominios />,
      },
      {
        path: "facturas",
        element: <Facturas />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
    ],
  },
  // Protected routes with AppLayout (for other protected routes)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ProtectedRoute>
    ),
    children: [
      // Other protected routes can go here
    ],
  },
  // Admin routes - Nested under /admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SuperAdminDashboard />,
      },
      {
        path: "dashboard",
        element: <SuperAdminDashboard />,
      },
      {
        path: "roles-and-permissions",
        element: <RolesPermissions />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "seller",
        element: <SellerDashboard />,
      },
      {
        path: "buyer",
        element: <BuyerDashboard />,
      },
      {
        path: "config",
        element: <AdminConfig />,
      },
      {
        path: "usuarios",
        element: <AdminUsuarios />,
      },
      {
        path: "marketplace",
        element: <MarketplaceAdmin />,
      },
      {
        path: "listados",
        element: <GestionListados />,
      },
      {
        path: "gestion-listados",
        element: <GestionListados />,
      },
      {
        path: "advanced-settings",
        element: <AdvancedSettings />,
      },
      {
        path: "seo-settings",
        element: <SEOSettings />,
      },
      {
        path: "backup-settings",
        element: <BackupSettings />,
      },
      {
        path: "blog-manager",
        element: <BlogManager />,
      },
      {
        path: "blog-manager/create",
        element: <BlogPostCreateEdit />,
      },
      {
        path: "blog-manager/edit/:id",
        element: <BlogPostCreateEdit />,
      },
      {
        path: "blog-manager/categories",
        element: <BlogCategories />,
      },
      {
        path: "blog-manager/comments",
        element: <BlogCommentManagement />,
      },
      {
        path: "blog-manager/seo",
        element: <BlogSEOManagement />,
      },
      {
        path: "faq-manager",
        element: <FAQManager />,
      },
    ],
  },
  // Catch all
  {
    path: "*",
    element: (
      <AppLayout>
        <NotFound />
      </AppLayout>
    ),
  },
]);

