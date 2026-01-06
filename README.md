# ADOMINIOZ - Digital Asset Marketplace Platform

A comprehensive digital asset trading platform built with React, TypeScript, and modern web technologies. ADOMINIOZ provides a secure marketplace for buying and selling digital assets including domains, websites, mobile apps, NFTs, e-commerce stores, and more.

## 🚀 Features

### Core Functionality

- **Digital Asset Marketplace**: Browse and trade premium digital assets

  - Domains
  - Websites
  - Mobile Apps
  - E-commerce Stores
  - Software/SaaS
  - NFTs
  - Databases
  - Digital Channels (YouTube, TikTok, Social Media)
  - FBA Stores

- **User Management**

  - Role-based access control (Admin, Seller, Buyer, Broker)
  - User authentication and authorization
  - Profile management
  - Verification system

- **Trading Features**

  - Offers management (create, accept, reject, counter)
  - Order processing
  - Escrow services
  - Payment management
  - Invoice generation

- **Client Dashboard**

  - Domain management
  - Order tracking
  - Invoice management
  - Support tickets
  - Offers overview

- **Admin Panel**

  - User management
  - Content management (Blog, FAQ)
  - Marketplace administration
  - Role and permissions management
  - Analytics and reporting

- **Support System**

  - Ticket creation and management
  - Category-based support
  - Priority levels
  - Agent assignment

- **Internationalization**
  - Multi-language support (English, Spanish)
  - Dynamic language switching

## 🛠️ Technology Stack

### Frontend

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Redux Toolkit** - State management
- **React Query (RTK Query)** - Data fetching and caching

### UI Components

- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Forms & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Rich Text Editing

- **TipTap** - Rich text editor
- **TipTap Extensions** - Image, link, placeholder support

### Internationalization

- **i18next** - Internationalization framework
- **react-i18next** - React integration

### Additional Libraries

- **Moment.js** - Date formatting
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd domain-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   VITE_API_BASE_URL=your_api_base_url
   VITE_APP_NAME=ADOMINIOZ
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/         # Admin-specific components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components (Header, Footer, Sidebar)
│   └── ui/            # Base UI components (shadcn/ui)
├── pages/             # Page components
│   ├── admin/         # Admin pages
│   ├── auth/          # Authentication pages
│   ├── client/        # Client dashboard pages
│   ├── marketplace/   # Marketplace pages
│   └── resources/     # Blog, guides, etc.
├── store/             # Redux store
│   ├── api/           # RTK Query API slices
│   ├── hooks/         # Redux hooks
│   └── slices/        # Redux slices
├── types/             # TypeScript type definitions
│   └── api/           # API type definitions
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── i18n/              # Internationalization
│   └── locales/       # Translation files
├── routes.tsx         # Route configuration
└── App.tsx           # Main application component
```

## 🔐 Authentication & Authorization

The application uses role-based access control (RBAC) with the following roles:

- **Super Admin** - Full system access
- **Admin** - Administrative access
- **Seller** - Can list and sell assets
- **Buyer** - Can purchase assets
- **Broker** - Can facilitate transactions

Protected routes are handled by the `ProtectedRoute` component.

## 🌐 Internationalization

The application supports multiple languages:

- English (en)
- Spanish (es)

Translation files are located in `src/i18n/locales/`. To add a new language:

1. Create a new JSON file in `src/i18n/locales/`
2. Add the language to `src/i18n/config.ts`

## 🎨 Styling

The project uses Tailwind CSS with custom configuration. Component styles follow the shadcn/ui pattern with:

- CSS variables for theming
- Dark mode support (via next-themes)
- Responsive design utilities

## 📡 API Integration

API integration is handled through RTK Query with the following main API slices:

- `authApi` - Authentication
- `marketplaceApi` - Marketplace listings
- `offersApi` - Offer management
- `ordersApi` - Order processing
- `supportApi` - Support tickets
- `userApi` - User management
- `blogApi` - Blog/CMS
- And more...

## 🚦 Routing

Routes are configured in `src/routes.tsx` using React Router v6. The application has three main route groups:

1. **Public routes** - Home, marketplace, legal pages
2. **Client routes** - Protected client dashboard (`/client/*`)
3. **Admin routes** - Protected admin panel (`/admin/*`)

## 🧪 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React best practices (functional components, hooks)
- Use ESLint for code quality
- Follow the existing component structure

### Component Structure

```typescript
// Component example
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  const [state, setState] = useState();

  return <div>{/* Component JSX */}</div>;
};

export default MyComponent;
```

### Adding New Features

1. Create components in appropriate directories
2. Add routes in `src/routes.tsx`
3. Add API endpoints in `src/store/api/`
4. Add TypeScript types in `src/types/`
5. Add translations in `src/i18n/locales/`

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

**Build errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Type errors**

```bash
# Regenerate TypeScript definitions
npm run build
```

## 📝 License

[Add your license information here]

## 👥 Contributors

[Add contributor information here]

## 📞 Support

For support, please:

- Create a support ticket in the application
- Contact the development team
- Check the FAQ section

## 🔄 Version History

- **v0.0.0** - Initial release
  - Core marketplace functionality
  - User authentication
  - Admin panel
  - Support system
  - Multi-language support

---

Built with ❤️ by the ADOMINIOZ team
