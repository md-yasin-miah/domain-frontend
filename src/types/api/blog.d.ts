/**
 * Blog API Types
 */

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: number;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published';
}

interface BlogComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  replies?: BlogComment[];
}

interface BlogCommentCreateRequest {
  content: string;
  parent_id?: number;
}

