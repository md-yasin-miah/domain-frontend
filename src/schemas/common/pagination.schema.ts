/**
 * Pagination Validation Schema
 */
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  size: z.number().int().positive().max(100).optional(),
  skip: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type PaginationFormData = z.infer<typeof paginationSchema>;

