/**
 * Add Fund validation schema
 * Backend: amount min 1, max 50000; currency optional, default USD
 */
import { z } from 'zod';

export const addFundSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
    .min(1, 'Minimum amount is 1')
    .max(50000, 'Maximum amount is 50,000'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
});

export type AddFundFormData = z.infer<typeof addFundSchema>;
