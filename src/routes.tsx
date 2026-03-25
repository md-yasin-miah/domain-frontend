import { lazy } from "react";
import { ROUTES } from "./lib/routes";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ClientLayout from "./components/layout/ClientLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthRedirectHandler } from "./components/auth/AuthRedirectHandler";
import LazyComponent from "./components/common/LazyComponent";

// Lazy load all page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ListingIndexByCategory = lazy(
  () => import("./pages/categories/ListingIndexByCategory"),
);
const ListingDetailsBySlug = lazy(() => import("./pages/ListingDetailsBySlug"));
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
const SuperAdminDashboard = lazy(
  () => import("./pages/admin/SuperAdminDashboard"),
);
const Facturas = lazy(() => import("./pages/client/Facturas"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const SupportTicketConversationPage = lazy(
  () => import("./pages/SupportTicketConversationPage"),
);
const ListingsManagement = lazy(
  () => import("./pages/admin/ListingsManagement"),
);
const ListingCreateEdit = lazy(() => import("./pages/admin/ListingCreateEdit"));
const AdminListingDetail = lazy(() => import("./pages/admin/ListingDetail"));
const AdminConfig = lazy(() => import("./pages/admin/AdminConfig"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios"));
const Trends = lazy(() => import("./pages/services/Trends"));
const PremiumTrends = lazy(() => import("./pages/services/PremiumTrends"));
const Brokers = lazy(() => import("./pages/services/Brokers"));
const ReferralProgram = lazy(() => import("./pages/services/ReferralProgram"));
const HelpAndGuidesPage = lazy(
  () => import("./pages/resources/HelpAndGuidesPage"),
);
const HelpAndGuidesArticlePage = lazy(
  () => import("./pages/resources/HelpAndGuidesArticlePage"),
);
const Blog = lazy(() => import("./pages/resources/Blog"));
const BlogPostDetail = lazy(() => import("./pages/resources/BlogPostDetail"));
const AppValuationsIndex = lazy(() => import("./pages/valuations/index"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const ProfileSetup = lazy(() => import("./pages/client/ProfileSetup"));
const FAQ = lazy(() => import("./pages/client/FAQ"));
const AdvancedSettings = lazy(() => import("./pages/admin/AdvancedSettings"));
const SEOSettings = lazy(() => import("./pages/admin/SEOSettings"));
const BackupSettings = lazy(() => import("./pages/admin/BackupSettings"));
const BlogManager = lazy(() => import("./pages/admin/BlogManager"));
const BlogPostCreateEdit = lazy(
  () => import("./pages/admin/BlogPostCreateEdit"),
);
const BlogCategories = lazy(
  () => import("./pages/admin/categories/BlogCategories"),
);
const AdminSupportCategories = lazy(
  () => import("./pages/admin/categories/AdminSupportCategories"),
);
const AdminListingCategories = lazy(
  () => import("./pages/admin/categories/AdminListingCategories"),
);
const AdminFAQCategories = lazy(
  () => import("./pages/admin/categories/AdminFAQCategories"),
);
const AdminGuideCategoriesPage = lazy(
  () => import("./pages/admin/AdminGuideCategoriesPage"),
);
const AdminGuideArticlesPage = lazy(
  () => import("./pages/admin/AdminGuideArticlesPage"),
);
const AdminGuideArticleEditPage = lazy(
  () => import("./pages/admin/AdminGuideArticleEditPage"),
);
const FAQManager = lazy(() => import("./pages/admin/FAQManager"));
const AdminSupportTickets = lazy(
  () => import("./pages/admin/AdminSupportTickets"),
);
const AdminOffersPage = lazy(() => import("./pages/admin/AdminOffersPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminNotificationsPage = lazy(
  () => import("./pages/admin/AdminNotificationsPage"),
);
const AdminUploadsPage = lazy(() => import("./pages/admin/AdminUploadsPage"));
const AdminVerificationsPage = lazy(
  () => import("./pages/admin/AdminVerificationsPage"),
);
const AdminVerificationDetailPage = lazy(
  () => import("./pages/admin/AdminVerificationDetailPage"),
);
const AdminDisputesPage = lazy(() => import("./pages/admin/AdminDisputesPage"));
const AdminValuationsPage = lazy(
  () => import("./pages/admin/valuations/AdminValuationsPage"),
);
// const AdminComparableSalesPage = lazy(
//   () => import("./pages/admin/valuations/AdminComparableSalesPage"),
// );
const AdminMarketTrendsPage = lazy(
  () => import("./pages/admin/valuations/AdminMarketTrendsPage"),
);
const AdminSocialPage = lazy(() => import("./pages/admin/AdminSocialPage"));
const AdminSecureBoxPage = lazy(
  () => import("./pages/admin/AdminSecureBoxPage"),
);
const AdminPaymentsPage = lazy(() => import("./pages/admin/AdminPaymentsPage"));
const AdminPaymentViewPage = lazy(
  () => import("./pages/admin/AdminPaymentViewPage"),
);
const AdminTranslationsPage = lazy(
  () => import("./pages/admin/AdminTranslationsPage"),
);
const AdminProfilePage = lazy(() => import("./pages/admin/AdminProfilePage"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUserDetailPage = lazy(
  () => import("./pages/admin/AdminUserDetailPage"),
);
const AdminAnalyticsPage = lazy(
  () => import("./pages/admin/AdminAnalyticsPage"),
);
const AdminReportsPage = lazy(() => import("./pages/admin/AdminReportsPage"));
const AdminOrderDetailPage = lazy(
  () => import("./pages/admin/orders/AdminOrderDetailPage"),
);
const AdminOrderInvoicePage = lazy(
  () => import("./pages/admin/orders/AdminOrderInvoicePage"),
);
const AdminOrderPaymentPage = lazy(
  () => import("./pages/admin/orders/AdminOrderPaymentPage"),
);
const AdminOrderEscrowPage = lazy(
  () => import("./pages/admin/orders/AdminOrderEscrowPage"),
);
const RolesPermissions = lazy(() => import("./pages/admin/RolesPermissions"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ClientAllOrderPage = lazy(() => import("./pages/client/orders"));
const ClientInvoicePage = lazy(() => import("./pages/client/orders/invoice"));
const ClientPaymentPage = lazy(
  () => import("./pages/client/orders/ClientPaymentPage"),
);
const ClientEscrowsPage = lazy(
  () => import("./pages/client/orders/ClientEscrowsPage"),
);
const ClientOrderDetailsPage = lazy(
  () => import("./pages/client/orders/Details"),
);
const ClientOffersPage = lazy(
  () => import("./pages/client/offers/ClientOffersPage"),
);
const OfferDetails = lazy(() => import("./pages/client/offers/OfferDetails"));
const ClientProductsVerificationsPage = lazy(
  () => import("./pages/client/marketplace/productsVerification"),
);
const ClientProductsDetailsPage = lazy(
  () => import("./pages/client/marketplace/productsVerification/Details"),
);
const ClientAuctionsPage = lazy(() => import("./pages/client/auctions"));
const ClientSavedSearchPage = lazy(() => import("./pages/client/savedSearch"));
const ClientWalletPage = lazy(() => import("./pages/client/ClientWalletPage"));
const MyListing = lazy(() => import("./pages/client/marketplace/myListing"));
const MyListingDetails = lazy(
  () => import("./pages/client/marketplace/myListing/Details"),
);
const CreateListingPage = lazy(
  () => import("./pages/client/marketplace/myListing/CreateListingPage"),
);
const ClientChatPage = lazy(() => import("./pages/client/chat"));
const ClientReviews = lazy(() => import("./pages/client/Reviews"));
const Conversation = lazy(() => import("./pages/client/chat/Conversation"));

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
        element: (
          <LazyComponent>
            <Index />
          </LazyComponent>
        ),
      },
      // Marketplace routes - Nested
      {
        path: "marketplace",
        element: (
          <LazyComponent>
            <Marketplace />
          </LazyComponent>
        ),
      },
      {
        path: "listings/:listingSlug",
        element: (
          <LazyComponent>
            <ListingDetailsBySlug />
          </LazyComponent>
        ),
      },
      // Categories routes - dynamic by listing type slug (from GET /marketplace/listing-types)
      {
        path: "categories",
        children: [
          {
            path: ":slug",
            children: [
              {
                index: true,
                element: (
                  <LazyComponent>
                    <ListingIndexByCategory />
                  </LazyComponent>
                ),
              },
              {
                path: ":listingSlug",
                element: (
                  <LazyComponent>
                    <ListingDetailsBySlug />
                  </LazyComponent>
                ),
              },
            ],
          },
        ],
      },
      // Legal routes - Nested
      {
        path: "legal",
        children: [
          {
            path: "terminos",
            element: (
              <LazyComponent>
                <Terminos />
              </LazyComponent>
            ),
          },
          {
            path: "privacidad",
            element: (
              <LazyComponent>
                <Privacidad />
              </LazyComponent>
            ),
          },
          {
            path: "aml",
            element: (
              <LazyComponent>
                <AML />
              </LazyComponent>
            ),
          },
          {
            path: "cookies",
            element: (
              <LazyComponent>
                <Cookies />
              </LazyComponent>
            ),
          },
          {
            path: "aviso-legal",
            element: (
              <LazyComponent>
                <AvisoLegal />
              </LazyComponent>
            ),
          },
          {
            path: "proteccion-datos",
            element: (
              <LazyComponent>
                <ProteccionDatos />
              </LazyComponent>
            ),
          },
        ],
      },
      // Legacy legal routes for backward compatibility
      {
        path: "terminos",
        element: (
          <LazyComponent>
            <Terminos />
          </LazyComponent>
        ),
      },
      {
        path: "privacidad",
        element: (
          <LazyComponent>
            <Privacidad />
          </LazyComponent>
        ),
      },
      {
        path: "aml",
        element: (
          <LazyComponent>
            <AML />
          </LazyComponent>
        ),
      },
      {
        path: "cookies",
        element: (
          <LazyComponent>
            <Cookies />
          </LazyComponent>
        ),
      },
      {
        path: "aviso-legal",
        element: (
          <LazyComponent>
            <AvisoLegal />
          </LazyComponent>
        ),
      },
      {
        path: "proteccion-datos",
        element: (
          <LazyComponent>
            <ProteccionDatos />
          </LazyComponent>
        ),
      },
      // Services routes - Nested
      {
        path: "services",
        children: [
          {
            path: "trends",
            element: (
              <LazyComponent>
                <Trends />
              </LazyComponent>
            ),
          },
          {
            path: "premium-trends",
            element: (
              <LazyComponent>
                <PremiumTrends />
              </LazyComponent>
            ),
          },
          {
            path: "brokers",
            element: (
              <LazyComponent>
                <Brokers />
              </LazyComponent>
            ),
          },
          {
            path: "referrals",
            element: (
              <LazyComponent>
                <ReferralProgram />
              </LazyComponent>
            ),
          },
        ],
      },
      // Valuations routes
      {
        path: "valuations",
        element: (
          <LazyComponent>
            <AppValuationsIndex />
          </LazyComponent>
        ),
      },
      {
        path: "help-and-guides",
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <HelpAndGuidesPage />
              </LazyComponent>
            ),
          },
          {
            path: "category/:slug",
            element: (
              <LazyComponent>
                <HelpAndGuidesPage />
              </LazyComponent>
            ),
          },
          {
            path: "article/:slug",
            element: (
              <LazyComponent>
                <HelpAndGuidesArticlePage />
              </LazyComponent>
            ),
          },
        ],
      },
      // Blog routes (alternative paths)
      {
        path: "blog",
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <Blog />
              </LazyComponent>
            ),
          },
          {
            path: ":slug",
            element: (
              <LazyComponent>
                <BlogPostDetail />
              </LazyComponent>
            ),
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
        <ScrollToTop />
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
        element: (
          <LazyComponent>
            <ClientDashboard />
          </LazyComponent>
        ),
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
            element: (
              <LazyComponent>
                <ClientAllOrderPage />
              </LazyComponent>
            ),
          },
          {
            path: ":id",
            element: (
              <LazyComponent>
                <ClientOrderDetailsPage />
              </LazyComponent>
            ),
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.INVOICES),
            element: (
              <LazyComponent>
                <ClientInvoicePage />
              </LazyComponent>
            ),
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.PAYMENTS),
            element: (
              <LazyComponent>
                <ClientPaymentPage />
              </LazyComponent>
            ),
          },
          {
            path: getLastPath(ROUTES.CLIENT.ORDERS.ESCROWS),
            element: (
              <LazyComponent>
                <ClientEscrowsPage />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.MARKETPLACE.ROOT),
        children: [
          {
            index: true,
            element: (
              <Navigate
                to={ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION}
                replace
              />
            ),
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION),
            children: [
              {
                index: true,
                element: (
                  <LazyComponent>
                    <ClientProductsVerificationsPage />
                  </LazyComponent>
                ),
              },
              {
                path: ":id",
                element: (
                  <LazyComponent>
                    <ClientProductsDetailsPage />
                  </LazyComponent>
                ),
              },
            ],
          },
          {
            path: getLastPath(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS),
            children: [
              {
                index: true,
                element: (
                  <LazyComponent>
                    <MyListing />
                  </LazyComponent>
                ),
              },
              {
                path: "create",
                element: (
                  <LazyComponent>
                    <CreateListingPage />
                  </LazyComponent>
                ),
              },
              {
                path: ":slug",
                element: (
                  <LazyComponent>
                    <MyListingDetails />
                  </LazyComponent>
                ),
              },
            ],
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.OFFERS.INDEX),
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <ClientOffersPage />
              </LazyComponent>
            ),
          },
          {
            path: ":id",
            element: (
              <LazyComponent>
                <OfferDetails />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.AUCTIONS),
        element: (
          <LazyComponent>
            <ClientAuctionsPage />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.SAVED_SEARCH),
        element: (
          <LazyComponent>
            <ClientSavedSearchPage />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.PROFILE),
        element: (
          <LazyComponent>
            <ClientProfile />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.PROFILE_SETUP),
        element: (
          <LazyComponent>
            <ProfileSetup />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.FACTURAS),
        element: (
          <LazyComponent>
            <Facturas />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.SUPPORT),
        element: (
          <LazyComponent>
            <SupportPage />
          </LazyComponent>
        ),
      },
      {
        path: "support/tickets/:ticketId",
        element: (
          <LazyComponent>
            <SupportTicketConversationPage />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.CHAT.ROOT),
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <ClientChatPage />
              </LazyComponent>
            ),
          },
          {
            path: ":id",
            element: (
              <LazyComponent>
                <Conversation />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: getLastPath(ROUTES.CLIENT.FAQ),
        element: (
          <LazyComponent>
            <FAQ />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.REVIEWS),
        element: (
          <LazyComponent>
            <ClientReviews />
          </LazyComponent>
        ),
      },
      {
        path: getLastPath(ROUTES.CLIENT.WALLET()),
        element: (
          <LazyComponent>
            <ClientWalletPage />
          </LazyComponent>
        ),
      },
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
        element: (
          <LazyComponent>
            <SuperAdminDashboard />
          </LazyComponent>
        ),
      },
      {
        path: "dashboard",
        element: (
          <LazyComponent>
            <SuperAdminDashboard />
          </LazyComponent>
        ),
      },
      {
        path: "analytics",
        element: (
          <LazyComponent>
            <AdminAnalyticsPage />
          </LazyComponent>
        ),
      },
      {
        path: "reports",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN.REPORTS.OVERVIEW} replace />,
          },
          {
            path: ":reportType",
            element: (
              <LazyComponent>
                <AdminReportsPage />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: "roles-and-permissions",
        element: (
          <LazyComponent>
            <RolesPermissions />
          </LazyComponent>
        ),
      },
      {
        path: "users",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <UserManagement />
              </LazyComponent>
            ),
          },
          {
            path: ":id/details",
            element: (
              <LazyComponent>
                <AdminUserDetailPage />
              </LazyComponent>
            ),
          },
          {
            path: "verifications",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: (
                  <LazyComponent>
                    <AdminVerificationsPage />
                  </LazyComponent>
                ),
              },
              {
                path: ":id",
                element: (
                  <LazyComponent>
                    <AdminVerificationDetailPage />
                  </LazyComponent>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "profile",
        element: (
          <LazyComponent>
            <AdminProfilePage />
          </LazyComponent>
        ),
      },
      {
        path: "settings",
        element: (
          <LazyComponent>
            <AdminSettings />
          </LazyComponent>
        ),
      },
      {
        path: "seller",
        element: (
          <LazyComponent>
            <SellerDashboard />
          </LazyComponent>
        ),
      },
      {
        path: "buyer",
        element: (
          <LazyComponent>
            <BuyerDashboard />
          </LazyComponent>
        ),
      },
      {
        path: "config",
        element: (
          <LazyComponent>
            <AdminConfig />
          </LazyComponent>
        ),
      },
      {
        path: "usuarios",
        element: (
          <LazyComponent>
            <AdminUsuarios />
          </LazyComponent>
        ),
      },
      {
        path: "listings-management",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <ListingsManagement />
              </LazyComponent>
            ),
          },
          {
            path: "create",
            element: (
              <LazyComponent>
                <ListingCreateEdit />
              </LazyComponent>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <LazyComponent>
                <ListingCreateEdit />
              </LazyComponent>
            ),
          },
          {
            path: "view/:id",
            element: (
              <LazyComponent>
                <AdminListingDetail />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: "advanced-settings",
        element: (
          <LazyComponent>
            <AdvancedSettings />
          </LazyComponent>
        ),
      },
      {
        path: "seo-settings",
        element: (
          <LazyComponent>
            <SEOSettings />
          </LazyComponent>
        ),
      },
      {
        path: "backup-settings",
        element: (
          <LazyComponent>
            <BackupSettings />
          </LazyComponent>
        ),
      },
      {
        path: "blog-manager",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <BlogManager />
              </LazyComponent>
            ),
          },
          {
            path: "create",
            element: (
              <LazyComponent>
                <BlogPostCreateEdit />
              </LazyComponent>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <LazyComponent>
                <BlogPostCreateEdit />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: "categories",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN.CATEGORIES.SUPPORT} replace />,
          },
          {
            path: "listings",
            element: (
              <LazyComponent>
                <AdminListingCategories />
              </LazyComponent>
            ),
          },
          {
            path: "support",
            element: (
              <LazyComponent>
                <AdminSupportCategories />
              </LazyComponent>
            ),
          },
          {
            path: "faq",
            element: (
              <LazyComponent>
                <AdminFAQCategories />
              </LazyComponent>
            ),
          },
          {
            path: "blog",
            element: (
              <LazyComponent>
                <BlogCategories />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: "faq-manager",
        element: (
          <LazyComponent>
            <FAQManager />
          </LazyComponent>
        ),
      },
      {
        path: "guides/categories",
        element: (
          <LazyComponent>
            <AdminGuideCategoriesPage />
          </LazyComponent>
        ),
      },
      {
        path: "guides/articles",
        element: (
          <LazyComponent>
            <AdminGuideArticlesPage />
          </LazyComponent>
        ),
      },
      {
        path: "guides/articles/new",
        element: (
          <LazyComponent>
            <AdminGuideArticleEditPage />
          </LazyComponent>
        ),
      },
      {
        path: "guides/articles/:id",
        element: (
          <LazyComponent>
            <AdminGuideArticleEditPage />
          </LazyComponent>
        ),
      },
      {
        path: "support",
        element: (
          <LazyComponent>
            <AdminSupportTickets />
          </LazyComponent>
        ),
      },
      {
        path: "support/tickets/:ticketId",
        element: (
          <LazyComponent>
            <SupportTicketConversationPage />
          </LazyComponent>
        ),
      },
      {
        path: "offers",
        element: (
          <LazyComponent>
            <AdminOffersPage />
          </LazyComponent>
        ),
      },
      {
        path: "notifications",
        element: (
          <LazyComponent>
            <AdminNotificationsPage />
          </LazyComponent>
        ),
      },
      {
        path: "uploads",
        element: (
          <LazyComponent>
            <AdminUploadsPage />
          </LazyComponent>
        ),
      },
      {
        path: "disputes",
        element: (
          <LazyComponent>
            <AdminDisputesPage />
          </LazyComponent>
        ),
      },
      {
        path: "valuations",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN.VALUATIONS.LISTINGS} replace />,
          },
          {
            path: "listings",
            element: (
              <LazyComponent>
                <AdminValuationsPage />
              </LazyComponent>
            ),
          },
          // {
          //   path: "comparable-sales",
          //   element: (
          //     <LazyComponent>
          //       <AdminComparableSalesPage />
          //     </LazyComponent>
          //   ),
          // },
          {
            path: "market-trends",
            element: (
              <LazyComponent>
                <AdminMarketTrendsPage />
              </LazyComponent>
            ),
          },
        ],
      },
      {
        path: "social",
        element: (
          <LazyComponent>
            <AdminSocialPage />
          </LazyComponent>
        ),
      },
      {
        path: "secure-box",
        element: (
          <LazyComponent>
            <AdminSecureBoxPage />
          </LazyComponent>
        ),
      },
      {
        path: "payments",
        element: (
          <LazyComponent>
            <AdminPaymentsPage />
          </LazyComponent>
        ),
      },
      {
        path: "payments/:id",
        element: (
          <LazyComponent>
            <AdminPaymentViewPage />
          </LazyComponent>
        ),
      },
      {
        path: "translations",
        element: (
          <LazyComponent>
            <AdminTranslationsPage />
          </LazyComponent>
        ),
      },
      {
        path: "orders",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: (
              <LazyComponent>
                <AdminOrdersPage />
              </LazyComponent>
            ),
          },
          {
            path: ":id",
            element: (
              <LazyComponent>
                <AdminOrderDetailPage />
              </LazyComponent>
            ),
          },
          {
            path: ":id/invoices",
            element: (
              <LazyComponent>
                <AdminOrderInvoicePage />
              </LazyComponent>
            ),
          },
          {
            path: ":id/payments",
            element: (
              <LazyComponent>
                <AdminOrderPaymentPage />
              </LazyComponent>
            ),
          },
          {
            path: ":id/escrows",
            element: (
              <LazyComponent>
                <AdminOrderEscrowPage />
              </LazyComponent>
            ),
          },
        ],
      },
    ],
  },
  // Catch all
  {
    path: "*",
    element: (
      <>
        <ScrollToTop />
        <LazyComponent>
          <NotFound />
        </LazyComponent>
      </>
    ),
  },
]);
