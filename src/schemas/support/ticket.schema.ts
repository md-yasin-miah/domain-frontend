/**
 * Support Ticket Validation Schema
 * Matches TicketCreateRequest interface exactly
 */
import { z } from 'zod';

export const ticketCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  category_id: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
})

export type TicketCreateFormData = z.infer<typeof ticketCreateSchema>;

// Input schema (for form - accepts strings)
const contactFormInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
  category_id: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// Output schema (for API - transforms category_id to number)
export const contactFormSchema = contactFormInputSchema.transform(data => data);

export type ContactFormData = z.input<typeof contactFormInputSchema>;

