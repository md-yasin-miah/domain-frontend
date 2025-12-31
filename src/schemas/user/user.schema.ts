/**
 * User Management Validation Schema
 */
import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  is_active: z.boolean().optional(),
});

export const userUpdateSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  is_active: z.boolean().optional(),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

