export const ROUTES = {
  CLIENT: {
    ROOT: '/client',
    APPS: '/client/apps',
    AUCTIONS: '/client/auctions',
    DASHBOARD: '/client/dashboard',
    DOMAINS: '/client/domains',
    FAQ: '/client/faq',
    ORDERS: {
      INDEX: '/client/orders',
      ORDER_DETAILS: (id: number) => `/client/orders/${id}`,
      INVOICES: '/client/orders/invoices',
      PAYMENTS: '/client/orders/payments',
      ESCROWS: '/client/orders/escrows',
    },
    OFFERS: '/client/offers',
    PROFILE: '/client/profile',
    PROFILE_SETUP: '/client/profile-setup',
    SAVED_SEARCH: '/client/saved-search',
    SUPPORT: '/client/support',
    REVIEWS: '/client/reviews',
    WEBSITES: '/client/websites',
  },
};