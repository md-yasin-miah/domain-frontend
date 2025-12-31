/**
 * Offer Validation Schema
 */
import { z } from 'zod';

export const offerCreateSchema = z.object({
  listing_id: z.number().int().positive('Invalid listing ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

export const offerCounterSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

export type OfferCreateFormData = z.infer<typeof offerCreateSchema>;
export type OfferCounterFormData = z.infer<typeof offerCounterSchema>;

