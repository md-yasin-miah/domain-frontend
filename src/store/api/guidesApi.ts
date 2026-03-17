import { apiSlice } from './apiSlice';

/**
 * Guides API: public/app endpoints for the app route (/guides), admin endpoints for admin route (/admin/guides/*).
 *
 * App (public-facing):
 *   - getPublicGuideCategories, getPublicGuideArticles, getPublicGuideArticleBySlug: no auth, public-only content.
 *   - getGuideArticles, getGuideArticleBySlug: optional auth; when logged in returns all published (including requires_auth).
 *
 * Admin (/admin/guides/categories, /admin/guides/articles):
 *   - getAdminGuideCategories, createGuideCategory, updateGuideCategory, deleteGuideCategory.
 *   - getAdminGuideArticles, getAdminGuideArticleById, createGuideArticle, updateGuideArticle, deleteGuideArticle.
 */
/** Public (app) – no auth. List active guide categories. */
const publicCategoriesUrl = '/guides/public/categories';

/** Public (app) – no auth. List published public articles. */
const publicArticlesUrl = '/guides/public/articles';

/** App – optional auth. List published articles (all if logged in, public-only if not). */
const appArticlesUrl = '/guides/articles';

/** Admin – list categories (paginated). */
const adminCategoriesUrl = '/guides/categories';

/** Admin – list/get/update/delete articles (paginated, filters). */
const adminArticlesUrl = '/guides/admin/articles';

/** Admin – create article (POST only; list/get/update/delete use adminArticlesUrl). */
const adminArticleCreateUrl = '/guides/articles';

export const guidesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Public (app) endpoints --------
    getPublicGuideCategories: builder.query<{ categories: GuideCategory[] }, void>({
      query: () => ({
        url: publicCategoriesUrl,
        method: 'GET',
      }),
      providesTags: ['GuideCategory'],
    }),
    getPublicGuideArticles: builder.query<
      PaginatedResponse<GuideArticle>,
      { skip?: number; limit?: number; category_id?: number; q?: string }
    >({
      query: (params) => ({
        url: publicArticlesUrl,
        method: 'GET',
        params: { skip: params.skip ?? 0, limit: params.limit ?? 50, category_id: params.category_id, q: params.q },
      }),
      providesTags: ['GuideArticle'],
    }),
    getPublicGuideArticleBySlug: builder.query<
      GuideArticle,
      { slug: string; increment_view?: boolean }
    >({
      query: ({ slug, increment_view = true }) => ({
        url: `${publicArticlesUrl}/${encodeURIComponent(slug)}`,
        method: 'GET',
        params: { increment_view },
      }),
      providesTags: (result, error, { slug }) => [{ type: 'GuideArticle', id: result?.id ?? slug }],
    }),

    // -------- App (auth-aware) endpoints --------
    getGuideArticles: builder.query<
      PaginatedResponse<GuideArticle>,
      { skip?: number; limit?: number; category_id?: number; q?: string }
    >({
      query: (params) => ({
        url: appArticlesUrl,
        method: 'GET',
        params: { skip: params.skip ?? 0, limit: params.limit ?? 50, category_id: params.category_id, q: params.q },
      }),
      providesTags: ['GuideArticle'],
    }),
    getGuideArticleBySlug: builder.query<
      GuideArticle,
      { slug: string; increment_view?: boolean }
    >({
      query: ({ slug, increment_view = true }) => ({
        url: `${appArticlesUrl}/${encodeURIComponent(slug)}`,
        method: 'GET',
        params: { increment_view },
      }),
      providesTags: (result, error, { slug }) => [{ type: 'GuideArticle', id: result?.id ?? slug }],
    }),

    // -------- Admin – categories --------
    getAdminGuideCategories: builder.query<
      PaginatedResponse<GuideCategory>,
      { skip?: number; limit?: number; is_active?: boolean }
    >({
      query: (params) => ({
        url: adminCategoriesUrl,
        method: 'GET',
        params: { skip: params.skip ?? 0, limit: params.limit ?? 100, is_active: params.is_active },
      }),
      providesTags: ['GuideCategory'],
    }),
    createGuideCategory: builder.mutation<GuideCategory, GuideCategoryCreateRequest>({
      query: (data) => ({
        url: adminCategoriesUrl,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GuideCategory'],
    }),
    updateGuideCategory: builder.mutation<
      GuideCategory,
      { category_id: number; data: GuideCategoryUpdateRequest }
    >({
      query: ({ category_id, data }) => ({
        url: `${adminCategoriesUrl}/${category_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GuideCategory'],
    }),
    deleteGuideCategory: builder.mutation<void, number>({
      query: (category_id) => ({
        url: `${adminCategoriesUrl}/${category_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GuideCategory'],
    }),

    // -------- Admin – articles --------
    getAdminGuideArticles: builder.query<
      PaginatedResponse<GuideArticle>,
      { skip?: number; limit?: number; category_id?: number; is_published?: boolean; q?: string }
    >({
      query: (params) => ({
        url: adminArticlesUrl,
        method: 'GET',
        params: {
          skip: params.skip ?? 0,
          limit: params.limit ?? 50,
          category_id: params.category_id,
          is_published: params.is_published,
          q: params.q,
        },
      }),
      providesTags: ['GuideArticle'],
    }),
    getAdminGuideArticleById: builder.query<GuideArticle, number>({
      query: (article_id) => ({
        url: `${adminArticlesUrl}/${article_id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'GuideArticle', id }],
    }),
    createGuideArticle: builder.mutation<GuideArticle, GuideArticleCreateRequest>({
      query: (data) => ({
        url: adminArticleCreateUrl,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GuideArticle'],
    }),
    updateGuideArticle: builder.mutation<
      GuideArticle,
      { article_id: number; data: GuideArticleUpdateRequest }
    >({
      query: ({ article_id, data }) => ({
        url: `${adminArticlesUrl}/${article_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { article_id }) => [{ type: 'GuideArticle', id: article_id }, 'GuideArticle'],
    }),
    deleteGuideArticle: builder.mutation<void, number>({
      query: (article_id) => ({
        url: `${adminArticlesUrl}/${article_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GuideArticle'],
    }),
  }),
});

export const {
  useGetPublicGuideCategoriesQuery,
  useGetPublicGuideArticlesQuery,
  useGetPublicGuideArticleBySlugQuery,
  useGetGuideArticlesQuery,
  useGetGuideArticleBySlugQuery,
  useGetAdminGuideCategoriesQuery,
  useCreateGuideCategoryMutation,
  useUpdateGuideCategoryMutation,
  useDeleteGuideCategoryMutation,
  useGetAdminGuideArticlesQuery,
  useGetAdminGuideArticleByIdQuery,
  useCreateGuideArticleMutation,
  useUpdateGuideArticleMutation,
  useDeleteGuideArticleMutation,
} = guidesApi;
