import { lazy, Suspense } from "react";
import { ROUTES } from "./lib/routes";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ClientLayout from "./components/layout/ClientLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthRedirectHandler } from "./components/auth/AuthRedirectHandler";
import { Skeleton } from "./components/ui/skeleton";

// Lazy load all page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const DomainsPage = lazy(() => import("./pages/marketplace/domains"));
const WebsitesPage = lazy(() => import("./pages/marketplace/WebsitesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Terminos = lazy(() => import("./pages/legal/Terminos"));
const Privacidad = lazy(() => import("./pages/legal/Privacidad"));
const AML = lazy(() => import("./pages/legal/AML"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const AvisoLegal = lazy(() => import("./pages/legal/AvisoLegal"));
const ProteccionDatos = lazy(() => import("./pages/legal/ProteccionDatos"));
const Login = lazy(() => import("./pages/auth/Login"));
const SellerDashboard = lazy(() => import("./pages/admin/SellerDashboard"));
const BuyerDashboard = lazy(() => import("./pages/admin/BuyerDashboard"));
const SuperAdminDashboard = lazy(() => import("./pages/admin/SuperAdminDashboard"));
const Apps = lazy(() => import("./pages/marketplace/Apps"));
const FBA = lazy(() => import("./pages/marketplace/FBA"));
const ClientDomainsPage = lazy(() => import("./pages/client/ClientDomainsPage"));
const Facturas = lazy(() => import("./pages/client/Facturas"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const GestionListados = lazy(() => import("./pages/admin/GestionListados"));
const AdminConfig = lazy(() => import("./pages/admin/AdminConfig"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios"));
const MarketplaceAdmin = lazy(() => import("./pages/admin/MarketplaceAdmin"));
const Valuations = lazy(() => import("./pages/services/Valuations"));
const Trends = lazy(() => import("./pages/services/Trends"));
const PremiumTrends = lazy(() => import("./pages/services/PremiumTrends"));
const Brokers = lazy(() => import("./pages/services/Brokers"));
const ReferralProgram = lazy(() => import("./pages/services/ReferralProgram"));
const Guides = lazy(() => import("./pages/resources/Guides"));
const GuideDetail = lazy(() => import("./pages/resources/GuideDetail"));
const GuideCategory = lazy(() => import("./pages/resources/GuideCategory"));
const HelpCenter = lazy(() => import("./pages/resources/HelpCenter"));
const Blog = lazy(() => import("./pages/resources/Blog"));
const BlogPostDetail = lazy(() => import("./pages/resources/BlogPostDetail"));
const EcommercePage = lazy(() => import("./pages/categories/EcommercePage"));
const NFTsPage = lazy(() => import("./pages/categories/NFTsPage"));
const SoftwareSaaSPage = lazy(() => import("./pages/categories/SoftwareSaaSPage"));
const DatabasesPage = lazy(() => import("./pages/categories/DatabasesPage"));
const DigitalChannelsPage = lazy(() => import("./pages/categories/DigitalChannelsPage"));
const SuperAdminPanel = lazy(() => import("./pages/admin/SuperAdminPanel"));
const ListingDetail = lazy(() => import("./pages/marketplace/ListingDetail"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const ProfileSetup = lazy(() => import("./pages/client/ProfileSetup"));
const FAQ = lazy(() => import("./pages/client/FAQ"));
const AdvancedSettings = lazy(() => import("./pages/admin/AdvancedSettings"));
const SEOSettings = lazy(() => import("./pages/admin/SEOSettings"));
const BackupSettings = lazy(() => import("./pages/admin/BackupSettings"));
const BlogManager = lazy(() => import("./pages/admin/BlogManager"));
const BlogPostCreateEdit = lazy(() => import("./pages/admin/BlogPostCreateEdit"));
const BlogCategories = lazy(() => import("./pages/admin/BlogCategories"));
const BlogCommentManagement = lazy(() => import("./pages/admin/BlogCommentManagement"));
const BlogSEOManagement = lazy(() => import("./pages/admin/BlogSEOManagement"));
const FAQManager = lazy(() => import("./pages/admin/FAQManager"));
const RolesPermissions = lazy(() => import("./pages/admin/RolesPermissions"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ClientAppsPage = lazy(() => import("./pages/client/ClientAppsPage"));
const ClientWebsitesPage = lazy(() => import("./pages/client/ClientWebsitesPage"));
const ClientAllOrderPage = lazy(() => import("./pages/client/orders"));
const ClientInvoicePage = lazy(() => import("./pages/client/orders/invoice"));
const ClientPaymentPage = lazy(() => import("./pages/client/orders/ClientPaymentPage"));
const ClientEscrowsPage = lazy(() => import("./pages/client/orders/ClientEscrowsPage"));
const ClientOrderDetailsPage = lazy(() => import("./pages/client/orders/Details"));
const ClientOffersPage = lazy(() => import("./pages/client/offers/ClientOffersPage"));
const OfferDetails = lazy(() => import("./pages/client/offers/OfferDetails"));
const ClientProductsVerificationsPage = lazy(() => import("./pages/client/marketplace/productsVerification"));
const ClientProductsDetailsPage = lazy(() => import("./pages/client/marketplace/productsVerification/Details"));
const ClientAuctionsPage = lazy(() => import("./pages/client/ClientAuctionsPage"));
const ClientSavedSearchPage = lazy(() => import("./pages/client/ClientSavedSearchPage"));
const MyListing = lazy(() => import("./pages/client/marketplace/myListing"));
const MyListingDetails = lazy(() => import("./pages/client/marketplace/myListing/Details"));
const ClientChatPage = lazy(() => import("./pages/client/chat"));
const Conversation = lazy(() => import("./pages/client/chat/Conversation"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

// Helper to wrap lazy components with Suspense
const LazyComponent = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const getLastPath = (route: string) => {
  return route.split("/").pop();
};
export const router = createBrowserRouter([
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
        element: <LazyComponent><Index /></LazyComponent>,
      },
      // Marketplace routes - Nested
      {
        path: "marketplace",
        element: <LazyComponent><Marketplace /></LazyComponent>
      },
       // Categories routes - Nested
       {
        path: "categories",
        children: [
          {
            path: "domains",
            children: [
              {
                index: true,
                element: <LazyComponent><DomainsPage /></LazyComponent>,
              },
              {
                path: ":id",
                element: <LazyComponent><MyListingDetails /></LazyComponent>,
              },
            ],
          },
          {
            path: "websites",
            element: <LazyComponent><WebsitesPage /></LazyComponent>,
          },
          {
            path: "apps",
            element: <LazyComponent><Apps /></LazyComponent>,
          },
          {
            path: "fba-stores",
            element: <LazyComponent><FBA /></LazyComponent>,
          },
          {
            path: "listing/:id",
            element: <LazyComponent><ListingDetail /></LazyComponent>,
          },
          {
            path: "ecommerce",
            element: <LazyComponent><EcommercePage /></LazyComponent>,
          },
          {
            path: "nfts",
            element: <LazyComponent><NFTsPage /></LazyComponent>,
          },
          {
            path: "software-saas",
            element: <LazyComponent><SoftwareSaaSPage /></LazyComponent>,
          },
          {
            path: "databases",
            element: <LazyComponent><DatabasesPage /></LazyComponent>,
          },
          {
            path: "digital-channels",
            element: <LazyComponent><DigitalChannelsPage /></LazyComponent>,
          },
        ],
      },
      // Legal routes - Nested
      {
        path: "legal",
        children: [
          {
            path: "terminos",
            element: <LazyComponent><Terminos /></LazyComponent>,
          },
          {
            path: "privacidad",
            element: <LazyComponent><Privacidad /></LazyComponent>,
          },
          {
            path: "aml",
            element: <LazyComponent><AML /></LazyComponent>,
          },
          {
            path: "cookies",
            element: <LazyComponent><Cookies /></LazyComponent>,
          },
          {
            path: "aviso-legal",
            element: <LazyComponent><AvisoLegal /></LazyComponent>,
          },
          {
            path: "proteccion-datos",
            element: <LazyComponent><ProteccionDatos /></LazyComponent>,
          },
        ],
      },
      // Legacy legal routes for backward compatibility
      {
        path: "terminos",
        element: <LazyComponent><Terminos /></LazyComponent>,
      },
      {
        path: "privacidad",
        element: <LazyComponent><Privacidad /></LazyComponent>,
      },
      {
        path: "aml",
        element: <LazyComponent><AML /></LazyComponent>,
      },
      {
        path: "cookies",
        element: <LazyComponent><Cookies /></LazyComponent>,
      },
      {
        path: "aviso-legal",
        element: <LazyComponent><AvisoLegal /></LazyComponent>,
      },
      {
        path: "proteccion-datos",
        element: <LazyComponent><ProteccionDatos /></LazyComponent>,
      },
      // Services routes - Nested
      {
        path: "services",
        children: [
          {
            path: "valuations",
            element: <LazyComponent><Valuations /></LazyComponent>,
          },
          {
            path: "trends",
            element: <LazyComponent><Trends /></LazyComponent>,
          },
          {
            path: "premium-trends",
            element: <LazyComponent><PremiumTrends /></LazyComponent>,
          },
          {
            path: "brokers",
            element: <LazyComponent><Brokers /></LazyComponent>,
          },
          {
            path: "referrals",
            element: <LazyComponent><ReferralProgram /></LazyComponent>,
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
                element: <LazyComponent><Guides /></LazyComponent>,
              },
              {
                path: ":slug",
                element: <LazyComponent><GuideDetail /></LazyComponent>,
              },
              {
                path: "category/:category",
                element: <LazyComponent><GuideCategory /></LazyComponent>,
              },
            ],
          },
          {
            path: "help",
            element: <LazyComponent><HelpCenter /></LazyComponent>,
          },
          {
            path: "blog",
            element: <LazyComponent><Blog /></LazyComponent>,
          },
        ],
      },
      // Blog routes (alternative paths)
      {
        path: "blog",
        children: [
          {
            index: true,
            element: <LazyComponent><Blog /></LazyComponent>,
          },
          {
            path: ":slug",
            element: <LazyComponent><BlogPostDetail /></LazyComponent>,
          },
        ],
      },
      // Support routes
      {
        path: "user",
        children: [
          {
            path: "soporte",
            element: <LazyComponent><SupportPage /></LazyComponent>,
          },
        ],
      },
      {
        path: "soporte",
        element: <LazyComponent><SupportPage /></LazyComponent>,
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
    path: ROUTES.CLIENT.ROOT,
    element: (
      <ProtectedRoute>
        <ClientLayout>
          <Outlet />
        </ClientLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.CLIENT.DASHBOARD} replace />,
      },
      {
        path: getLastPath(ROUTES.CLIENT.DASHBOARD),
        element: <LazyComponent><ClientDashboard /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.ORDERS.INDEX),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.CLIENT.ORDERS.ALL} replace />,
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.ALL),
            element: <LazyComponent><ClientAllOrderPage /></LazyComponent>,
          },
          {
            path: ":id",
            element: <LazyComponent><ClientOrderDetailsPage /></LazyComponent>,
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.INVOICES),
            element: <LazyComponent><ClientInvoicePage /></LazyComponent>,
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.PAYMENTS),
            element: <LazyComponent><ClientPaymentPage /></LazyComponent>,
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.ESCROWS),
            element: <LazyComponent><ClientEscrowsPage /></LazyComponent>,
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.MARKETPLACE.ROOT),
        children: [
          {
            index: true,
            element: (
              <Navigate to={ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION} replace />
            ),
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION),
            children: [
              {
                index: true,
                element: <LazyComponent><ClientProductsVerificationsPage /></LazyComponent>,
              },
              {
                path: ":id",
                element: <LazyComponent><ClientProductsDetailsPage /></LazyComponent>,
              },
            ],
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS),
            children: [
              {
                index: true,
                element: <LazyComponent><MyListing /></LazyComponent>
              },
              {
                path: ":id",
                element: <LazyComponent><MyListingDetails /></LazyComponent>
              },
            ],
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.APPS),
            element: <LazyComponent><ClientAppsPage /></LazyComponent>,
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.DOMAINS),
            element: <LazyComponent><ClientDomainsPage /></LazyComponent>,
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.WEBSITES),
            element: <LazyComponent><ClientWebsitesPage /></LazyComponent>,
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.OFFERS.INDEX),
        children: [
          {
            index: true,
            element: <LazyComponent><ClientOffersPage /></LazyComponent>,
          },
          {
            path: ':id',
            element: <LazyComponent><OfferDetails /></LazyComponent>,
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.AUCTIONS),
        element: <LazyComponent><ClientAuctionsPage /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.SAVED_SEARCH),
        element: <LazyComponent><ClientSavedSearchPage /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.PROFILE),
        element: <LazyComponent><ClientProfile /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.PROFILE_SETUP),
        element: <LazyComponent><ProfileSetup /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.FACTURAS),
        element: <LazyComponent><Facturas /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.SUPPORT),
        element: <LazyComponent><SupportPage /></LazyComponent>,
      },
      {
        path: getLastPath(ROUTES.CLIENT.CHAT.ROOT),
        children: [
          {
            index: true,
            element: <LazyComponent><ClientChatPage /></LazyComponent>,
          },
          {
            path: ":id",
            element: <LazyComponent><Conversation /></LazyComponent>,
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.FAQ),
        element: <LazyComponent><FAQ /></LazyComponent>,
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
        element: <LazyComponent><SuperAdminDashboard /></LazyComponent>,
      },
      {
        path: "dashboard",
        element: <LazyComponent><SuperAdminDashboard /></LazyComponent>,
      },
      {
        path: "roles-and-permissions",
        element: <LazyComponent><RolesPermissions /></LazyComponent>,
      },
      {
        path: "users",
        element: <LazyComponent><UserManagement /></LazyComponent>,
      },
      {
        path: "seller",
        element: <LazyComponent><SellerDashboard /></LazyComponent>,
      },
      {
        path: "buyer",
        element: <LazyComponent><BuyerDashboard /></LazyComponent>,
      },
      {
        path: "config",
        element: <LazyComponent><AdminConfig /></LazyComponent>,
      },
      {
        path: "usuarios",
        element: <LazyComponent><AdminUsuarios /></LazyComponent>,
      },
      {
        path: "marketplace",
        element: <LazyComponent><MarketplaceAdmin /></LazyComponent>,
      },
      {
        path: "listados",
        element: <LazyComponent><GestionListados /></LazyComponent>,
      },
      {
        path: "gestion-listados",
        element: <LazyComponent><GestionListados /></LazyComponent>,
      },
      {
        path: "advanced-settings",
        element: <LazyComponent><AdvancedSettings /></LazyComponent>,
      },
      {
        path: "seo-settings",
        element: <LazyComponent><SEOSettings /></LazyComponent>,
      },
      {
        path: "backup-settings",
        element: <LazyComponent><BackupSettings /></LazyComponent>,
      },
      {
        path: "blog-manager",
        element: <LazyComponent><BlogManager /></LazyComponent>,
      },
      {
        path: "blog-manager/create",
        element: <LazyComponent><BlogPostCreateEdit /></LazyComponent>,
      },
      {
        path: "blog-manager/edit/:id",
        element: <LazyComponent><BlogPostCreateEdit /></LazyComponent>,
      },
      {
        path: "blog-manager/categories",
        element: <LazyComponent><BlogCategories /></LazyComponent>,
      },
      {
        path: "blog-manager/comments",
        element: <LazyComponent><BlogCommentManagement /></LazyComponent>,
      },
      {
        path: "blog-manager/seo",
        element: <LazyComponent><BlogSEOManagement /></LazyComponent>,
      },
      {
        path: "faq-manager",
        element: <LazyComponent><FAQManager /></LazyComponent>,
      },
    ],
  },
  // Catch all
  {
    path: "*",
    element: <LazyComponent><NotFound /></LazyComponent>,
  },
]);
  