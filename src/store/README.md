# Redux Store Structure

This project uses Redux Toolkit and RTK Query for state management and API integration following best practices.

## Structure

```
src/store/
├── index.ts                 # Store configuration
├── hooks.ts                 # Typed Redux hooks
├── slices/
│   └── authSlice.ts        # Auth state management
└── api/
    ├── apiSlice.ts         # Base API slice with RTK Query
    ├── authApi.ts          # Authentication endpoints
    ├── marketplaceApi.ts   # Marketplace/domains endpoints
    ├── blogApi.ts          # Blog posts endpoints
    ├── userApi.ts          # User profile endpoints
    ├── faqApi.ts           # FAQ endpoints
    └── adminApi.ts         # Admin endpoints
```

## Usage

### Typed Hooks

Always use the typed hooks from `@/store/hooks`:

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  // ...
};
```

### Authentication

Use the `useAuth` hook (maintains compatibility with old AuthContext):

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  // ...
};
```

### RTK Query Hooks

Use RTK Query hooks for data fetching:

```typescript
import { useGetDomainsQuery } from '@/store/api/marketplaceApi';
import { useGetBlogPostsQuery } from '@/store/api/blogApi';

const MyComponent = () => {
  const { data, isLoading, error } = useGetDomainsQuery();
  // ...
};
```

## API Integration

When you're ready to integrate with a real API:

1. Update `src/store/api/apiSlice.ts`:
   - Replace `mockBaseQuery` with `baseQuery`
   - Update `baseUrl` in `fetchBaseQuery`

2. Update each API slice:
   - Replace `queryFn` with proper `query` endpoints
   - Remove mock data calls

3. The store structure supports:
   - Automatic caching
   - Request deduplication
   - Background refetching
   - Optimistic updates
   - Tag-based invalidation

## Best Practices

1. **Use RTK Query for server state**: All API calls should go through RTK Query
2. **Use Redux slices for client state**: UI state, form state, etc.
3. **Type everything**: Use TypeScript types for all state and API responses
4. **Tag-based invalidation**: Use tags to invalidate related queries
5. **Optimistic updates**: Use `onQueryStarted` for optimistic UI updates

## Migration Notes

- Old `AuthContext` is replaced with Redux auth slice
- Old React Query hooks are replaced with RTK Query hooks
- All components should use `useAuth` from `@/hooks/useAuth` (maintains compatibility)

