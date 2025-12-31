/**
 * Profile Validation Schema
 */
import { z } from 'zod';

export const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  company_name: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_links: z.record(z.string()).optional().nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

