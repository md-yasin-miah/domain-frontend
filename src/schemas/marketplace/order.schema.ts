/**
 * Order Validation Schema
 */
import { z } from 'zod';

export const orderCreateSchema = z.object({
  listing_id: z.number().int().positive('Invalid listing ID'),
  final_price: z.number().positive('Price must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  offer_id: z.number().int().positive('Invalid offer ID').optional(),
});

export type OrderCreateFormData = z.infer<typeof orderCreateSchema>;

