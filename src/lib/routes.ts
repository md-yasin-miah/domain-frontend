export const ROUTES = {
  ROOT: '/',
  APP: {
    MARKETPLACE: '/marketplace',
    CATEGORIES: {
      DOMAINS: '/marketplace/domains',
      WEBSITES: '/marketplace/websites',
      APPS: '/marketplace/apps',
      FBA_STORES: '/marketplace/fba-stores',
      E_COMMERCE: '/categories/e-commerce',
      SOFTWARE_SAAS: '/categories/software-saas',
      DATABASES: '/categories/databases',
      DIGITAL_CHANNELS: '/categories/digital-channels',
      NFTs: '/categories/nfts',
    },
  },
  CLIENT: {
    ROOT: '/client',
    FACTURAS: '/client/facturas',
    AUCTIONS: '/client/auctions',
    DASHBOARD: '/client/dashboard',
    FAQ: '/client/faq',
    ORDERS: {
      INDEX: '/client/orders',
      ORDER_DETAILS: (id: number) => `/client/orders/${id}`,
      INVOICES: '/client/orders/invoices',
      PAYMENTS: '/client/orders/payments',
      ESCROWS: '/client/orders/escrows',
    },
    MARKETPLACE: {
      ROOT: '/client/marketplace',
      MY_LISTINGS: '/client/marketplace/my-listings',
      MY_LISTINGS_DETAILS: (id: number) => `/client/marketplace/my-listings/${id}`,
      PRODUCTS_VERIFICATION: '/client/marketplace/products-verification',
      PRODUCTS_VERIFICATION_DETAILS: (id: number) => `/client/marketplace/products-verification/${id}`,
      APPS: '/client/marketplace/apps',
      DOMAINS: '/client/marketplace/domains',
      WEBSITES: '/client/marketplace/websites'
    },
    OFFERS: {
      INDEX: '/client/offers',
      DETAILS: (id: number) => `/client/offers/${id}`,
    },
    PROFILE: '/client/profile',
    PROFILE_SETUP: '/client/profile-setup',
    SAVED_SEARCH: '/client/saved-search',
    SUPPORT: '/client/support',
    CHAT: {
      ROOT: '/client/chat',
      CONVERSATION: (id: number) => `/client/chat/${id}`,
    },
    REVIEWS: '/client/reviews',
  },
}; 