/**
 * Saved Search Validation Schema
 */
import { z } from 'zod';

export const savedSearchSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  listing_type_id: z.number().int().positive().nullable().optional(),
  status: z.string().nullable().optional(),
  min_price: z.number().positive().nullable().optional(),
  max_price: z.number().positive().nullable().optional(),
  currency: z.string().length(3, "Currency must be 3 characters").nullable().optional(),
  domain_extension: z.string().nullable().optional(),
  min_domain_age: z.number().int().min(0).nullable().optional(),
  max_domain_age: z.number().int().min(0).nullable().optional(),
  min_traffic: z.number().int().min(0).nullable().optional(),
  max_traffic: z.number().int().min(0).nullable().optional(),
  min_revenue: z.number().positive().nullable().optional(),
  max_revenue: z.number().positive().nullable().optional(),
  search_text: z.string().max(500, "Search text must be less than 500 characters").nullable().optional(),
}).refine(
  (data) => {
    if (data.min_price && data.max_price) {
      return data.max_price >= data.min_price;
    }
    return true;
  },
  {
    message: "Max price must be greater than or equal to min price",
    path: ["max_price"],
  }
).refine(
  (data) => {
    if (data.min_domain_age && data.max_domain_age) {
      return data.max_domain_age >= data.min_domain_age;
    }
    return true;
  },
  {
    message: "Max domain age must be greater than or equal to min domain age",
    path: ["max_domain_age"],
  }
).refine(
  (data) => {
    if (data.min_traffic && data.max_traffic) {
      return data.max_traffic >= data.min_traffic;
    }
    return true;
  },
  {
    message: "Max traffic must be greater than or equal to min traffic",
    path: ["max_traffic"],
  }
).refine(
  (data) => {
    if (data.min_revenue && data.max_revenue) {
      return data.max_revenue >= data.min_revenue;
    }
    return true;
  },
  {
    message: "Max revenue must be greater than or equal to min revenue",
    path: ["max_revenue"],
  }
);

export type SavedSearchFormData = z.infer<typeof savedSearchSchema>;

