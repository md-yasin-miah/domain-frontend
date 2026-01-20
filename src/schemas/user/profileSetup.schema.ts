/**
 * Profile Setup Validation Schema
 */
import { z } from 'zod';

export const profileSetupSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(200, 'Full name must be less than 200 characters'),
  address_line1: z.string().min(1, 'Address is required').max(500, 'Address must be less than 500 characters'),
  address_line2: z.string().max(500, 'Address line 2 must be less than 500 characters').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  state: z.string().max(100, 'State must be less than 100 characters').optional().or(z.literal('')),
  country: z.string().min(1, 'Country is required').max(100, 'Country must be less than 100 characters'),
  postal_code: z.string().min(1, 'Postal code is required').max(20, 'Postal code must be less than 20 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required').max(20, 'Phone number must be less than 20 characters'),
  company_name: z.string().max(200, 'Company name must be less than 200 characters').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional().or(z.literal('')),
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;

