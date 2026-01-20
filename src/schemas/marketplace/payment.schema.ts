/**
 * Payment Validation Schema
 */
import { z } from 'zod';

export const paymentCreateSchema = z.object({
  order_id: z.number().int().positive('Invalid order ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  payment_method: z.string().min(1, 'Payment method is required'),
  transaction_id: z.string().optional(),
  additional_metadata: z.record(z.any()).optional(),
});

export type PaymentCreateFormData = z.infer<typeof paymentCreateSchema>;

