// Mock data utilities for replacing Supabase backend

export interface MockUser {
  id: string;
  email: string;
  created_at: string;
  roles?: Array<{ id: string; name: string; description: string }>;
  profile?: {
    id: string;
    full_name: string;
    phone_number?: string;
    address?: string;
    company_name?: string;
    company_address?: string;
    company_details?: string;
    profile_completed: boolean;
  };
}

export interface MockDomain {
  id: string;
  title: string;
  price: number;
  views_count: number;
  is_premium: boolean;
  domain_data?: any;
  marketplace_categories?: { name: string };
}

export interface MockBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string;
  category_id?: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: { id: string; name: string; slug: string };
}

export interface MockFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  created_at: string;
}

// Mock users storage (simulating localStorage-based session)
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    created_at: new Date().toISOString(),
    roles: [{ id: '1', name: 'Admin', description: 'Administrator' }],
    profile: {
      id: '1',
      full_name: 'Admin User',
      profile_completed: true,
    },
  },
  {
    id: '2',
    email: 'user@example.com',
    created_at: new Date().toISOString(),
    roles: [{ id: '2', name: 'Customer', description: 'Customer' }],
    profile: {
      id: '2',
      full_name: 'Regular User',
      profile_completed: true,
    },
  },
];

// Mock domains
export const mockDomains: MockDomain[] = [
  {
    id: '1',
    title: 'tecnologia.com',
    price: 2500,
    views_count: 1234,
    is_premium: true,
    domain_data: {
      domain: 'tecnologia.com',
      extension: '.com',
      registrar: 'GoDaddy',
      expires: '2025-12-15',
    },
    marketplace_categories: { name: 'Tecnología' },
  },
  {
    id: '2',
    title: 'marketing-online.com',
    price: 4800,
    views_count: 856,
    is_premium: true,
    domain_data: {
      domain: 'marketing-online.com',
      extension: '.com',
      registrar: 'Namecheap',
      expires: '2026-03-22',
    },
    marketplace_categories: { name: 'Marketing' },
  },
  {
    id: '3',
    title: 'consultoria.io',
    price: 1200,
    views_count: 432,
    is_premium: false,
    domain_data: {
      domain: 'consultoria.io',
      extension: '.io',
      registrar: '1&1',
      expires: '2025-08-10',
    },
    marketplace_categories: { name: 'Servicios' },
  },
  {
    id: '4',
    title: 'ecommerce-shop.net',
    price: 3200,
    views_count: 678,
    is_premium: false,
    domain_data: {
      domain: 'ecommerce-shop.net',
      extension: '.net',
      registrar: 'GoDaddy',
      expires: '2026-01-05',
    },
    marketplace_categories: { name: 'Comercio' },
  },
  {
    id: '5',
    title: 'inversiones.com',
    price: 15000,
    views_count: 2145,
    is_premium: true,
    domain_data: {
      domain: 'inversiones.com',
      extension: '.com',
      registrar: 'Namecheap',
      expires: '2027-06-30',
    },
    marketplace_categories: { name: 'Finanzas' },
  },
  {
    id: '6',
    title: 'salud-digital.org',
    price: 2800,
    views_count: 543,
    is_premium: false,
    domain_data: {
      domain: 'salud-digital.org',
      extension: '.org',
      registrar: 'Register.com',
      expires: '2025-11-18',
    },
    marketplace_categories: { name: 'Salud' },
  },
];

// Mock blog posts
export const mockBlogPosts: MockBlogPost[] = [
  {
    id: '1',
    title: 'Cómo elegir el dominio perfecto para tu negocio',
    slug: 'como-elegir-dominio-perfecto',
    content: '<p>Contenido del blog post...</p>',
    excerpt: 'Guía completa para elegir el mejor dominio',
    author_id: '1',
    category_id: '1',
    is_published: true,
    view_count: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: '1', name: 'Guías', slug: 'guias' },
  },
];

// Mock FAQs
export const mockFAQs: MockFAQ[] = [
  {
    id: '1',
    question: '¿Cómo funciona la transferencia de dominios?',
    answer: 'La transferencia de dominios es un proceso sencillo...',
    category: 'General',
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    question: '¿Cuánto tiempo tarda una transferencia?',
    answer: 'Generalmente toma entre 5-7 días hábiles...',
    category: 'General',
    order: 2,
    created_at: new Date().toISOString(),
  },
];

// Mock authentication functions
export const mockAuth = {
  getCurrentUser: (): MockUser | null => {
    const userId = localStorage.getItem('mock_user_id');
    if (!userId) return null;
    return mockUsers.find(u => u.id === userId) || null;
  },

  signIn: async (email: string, password: string): Promise<{ user: MockUser | null; error: any }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === email);
    if (user && password) {
      localStorage.setItem('mock_user_id', user.id);
      return { user, error: null };
    }
    return { user: null, error: { message: 'Invalid credentials' } };
  },

  signUp: async (email: string, password: string): Promise<{ user: MockUser | null; error: any }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockUsers.find(u => u.email === email)) {
      return { user: null, error: { message: 'User already exists' } };
    }

    const newUser: MockUser = {
      id: String(mockUsers.length + 1),
      email,
      created_at: new Date().toISOString(),
      roles: [{ id: '2', name: 'Customer', description: 'Customer' }],
      profile: {
        id: String(mockUsers.length + 1),
        full_name: '',
        profile_completed: false,
      },
    };

    mockUsers.push(newUser);
    localStorage.setItem('mock_user_id', newUser.id);
    return { user: newUser, error: null };
  },

  signOut: async (): Promise<{ error: any }> => {
    localStorage.removeItem('mock_user_id');
    return { error: null };
  },

  getUserRoles: (userId: string): Array<{ id: string; name: string; description: string }> => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.roles || [];
  },

  isAdmin: (userId: string): boolean => {
    const roles = mockAuth.getUserRoles(userId);
    return roles.some(r => r.name === 'Admin');
  },
};

// Mock data getters
export const mockData = {
  getDomains: async (): Promise<MockDomain[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDomains;
  },

  getDomain: async (id: string): Promise<MockDomain | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDomains.find(d => d.id === id) || null;
  },

  incrementDomainViews: async (id: string): Promise<void> => {
    const domain = mockDomains.find(d => d.id === id);
    if (domain) {
      domain.views_count += 1;
    }
  },

  getBlogPosts: async (): Promise<MockBlogPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBlogPosts.filter(p => p.is_published);
  },

  getBlogPost: async (slug: string): Promise<MockBlogPost | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlogPosts.find(p => p.slug === slug && p.is_published) || null;
  },

  incrementBlogViews: async (id: string): Promise<void> => {
    const post = mockBlogPosts.find(p => p.id === id);
    if (post) {
      post.view_count += 1;
    }
  },

  getFAQs: async (): Promise<MockFAQ[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockFAQs.sort((a, b) => a.order - b.order);
  },

  getMarketplaceStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      domains: mockDomains.length,
      transactions: 1200000,
      activeUsers: 15432,
    };
  },

  getClientProfile: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.id === userId);
    return user?.profile || null;
  },

  getClientDomains: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: '1',
        domain_name: 'example.com',
        status: 'active',
        expiry_date: '2025-12-31',
        auto_renew: true,
      },
      {
        id: '2',
        domain_name: 'test.io',
        status: 'pending',
        expiry_date: '2026-06-30',
        auto_renew: false,
      },
    ];
  },

  getClientInvoices: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: '1',
        invoice_number: 'INV-2024-001',
        amount: 2500,
        status: 'paid',
        due_date: '2024-01-15',
        description: 'Domain purchase',
      },
      {
        id: '2',
        invoice_number: 'INV-2024-002',
        amount: 1200,
        status: 'pending',
        due_date: '2024-02-20',
        description: 'Domain renewal',
      },
    ];
  },

  getSupportTickets: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: '1',
        ticket_number: 'TKT-2024-001',
        subject: 'Domain transfer question',
        status: 'open',
        priority: 'medium',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        ticket_number: 'TKT-2024-002',
        subject: 'Payment issue',
        status: 'closed',
        priority: 'high',
        created_at: new Date().toISOString(),
      },
    ];
  },

  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers;
  },

  getAllRoles: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { id: '1', name: 'Admin', description: 'Administrator' },
      { id: '2', name: 'Customer', description: 'Customer' },
      { id: '3', name: 'Support', description: 'Support Staff' },
      { id: '4', name: 'Accounts', description: 'Accounts Staff' },
    ];
  },

  getBlogCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { id: '1', name: 'Guías', slug: 'guias' },
      { id: '2', name: 'Noticias', slug: 'noticias' },
      { id: '3', name: 'Tutoriales', slug: 'tutoriales' },
    ];
  },

  getBlogComments: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: '1',
        content: 'Excelente artículo!',
        author_name: 'Usuario Anónimo',
        created_at: new Date().toISOString(),
      },
    ];
  },

  updateClientProfile: async (userId: string, profileData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === userId);
    if (user && user.profile) {
      Object.assign(user.profile, profileData);
      user.profile.profile_completed = true;
    }
    return { success: true };
  },
};

