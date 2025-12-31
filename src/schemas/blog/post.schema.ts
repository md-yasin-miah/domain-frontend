/**
 * Blog Post Validation Schema
 */
import { z } from 'zod';

export const blogPostCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  featured_image: z.string().url('Invalid URL').optional().or(z.literal('')),
  meta_title: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  meta_description: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export type BlogPostCreateFormData = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdateFormData = z.infer<typeof blogPostUpdateSchema>;

