import { useGetMarketplaceListingsQuery } from "@/store/api/marketplaceApi";

export const useMarketplace = () => {
  const {
    data: listings,
    isLoading,
    error,
  } = useGetMarketplaceListingsQuery({ status: "active" });

  return {
    items: Array.isArray(listings) ? listings : listings?.items || [],
    loading: isLoading,
    error: error ? (error as any)?.data || error : null,
  };
};

export const useMarketplaceListingsById = (listing_type_id: number) => {
  const { data, isLoading } = useGetMarketplaceListingsQuery({
    status: "active",
    listing_type_id,
  });

  return {
    data: Array.isArray(data) ? data : data?.items || [],
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
