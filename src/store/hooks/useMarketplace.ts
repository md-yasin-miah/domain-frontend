import { useGetMarketplaceListingsQuery } from '@/store/api/marketplaceApi';
import { useGetDashboardQuery } from '@/store/api/dashboardApi';

export const useMarketplace = () => {
  const { data: listings, isLoading, error } = useGetMarketplaceListingsQuery({ status: 'active' });

  return {
    items: Array.isArray(listings) ? listings : listings?.items || [],
    loading: isLoading,
    error: error ? (error as any)?.data || error : null,
  };
};

export const useMarketplaceDomains = () => {
  const { data, isLoading } = useGetMarketplaceListingsQuery({
    status: 'active',
    listing_type_id: 1, // Assuming 1 is domain type
  });

  return {
    data: Array.isArray(data) ? data : data?.items || [],
    isLoading,
  };
};

export const useMarketplaceStats = () => {
  const { data: dashboard, isLoading } = useGetDashboardQuery();

  return {
    data: dashboard ? {
      domains: (dashboard as any).active_listings || 0,
      transactions: (dashboard as any).total_orders || 0,
      activeUsers: (dashboard as any).total_users || 0,
    } : { domains: 0, transactions: 0, activeUsers: 0 },
    isLoading,
  };
};

export const useIncrementViews = () => {
  // View incrementing is typically handled server-side when fetching listing details
  // If needed, this can be implemented as a separate endpoint
  return (id: number) => {
    // This would typically be handled by the backend when viewing a listing
    console.log('Increment views for listing:', id);
  };
};
