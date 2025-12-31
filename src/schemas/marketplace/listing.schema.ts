/**
 * Listing Validation Schema
 */
import { z } from 'zod';

export const listingCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  listing_type_id: z.number().int().positive('Invalid listing type'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  domain_name: z.string().optional(),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'active']).optional(),
});

export const listingUpdateSchema = listingCreateSchema.partial();

export type ListingCreateFormData = z.infer<typeof listingCreateSchema>;
export type ListingUpdateFormData = z.infer<typeof listingUpdateSchema>;

