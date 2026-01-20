/**
 * Profile Setup Validation Schema
 */
import { z } from 'zod';

export const profileSetupSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(200, 'Full name must be less than 200 characters'),
  address: z.string().min(1, 'Address is required').max(500, 'Address must be less than 500 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required').max(20, 'Phone number must be less than 20 characters'),
  company_name: z.string().max(200, 'Company name must be less than 200 characters').optional().or(z.literal('')),
  company_address: z.string().max(500, 'Company address must be less than 500 characters').optional().or(z.literal('')),
  company_details: z.string().max(1000, 'Company details must be less than 1000 characters').optional().or(z.literal('')),
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;

