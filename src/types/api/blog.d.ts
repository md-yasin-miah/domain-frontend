interface UserBasicInfo {
  id: number;
  username: string;
  email: string;
  name: string | null;
}

interface BlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: number;
  author_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: UserBasicInfo | null;
  category?: BlogCategoryResponse | null;
}

interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  status?: string;
  category_id?: number;
}

interface BlogComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: UserBasicInfo | null;
}

interface BlogCommentCreateRequest {
  content: string;
}

interface BlogCommentUpdateRequest {
  content: string;
}
