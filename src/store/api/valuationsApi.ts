import { apiSlice } from "./apiSlice";
import type { AutoValuationResponse, AutoValuationParams } from "@/types/api/valuations";

export const valuationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAutoValuation: builder.query<AutoValuationResponse, AutoValuationParams>({
      query: (params) => ({
        url: "/valuations/auto",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetAutoValuationQuery, useLazyGetAutoValuationQuery } = valuationsApi;
