/**
 * i18n API: languages, translations by locale, and admin CRUD for translation strings.
 * Aligned with backend app/routers/i18n.py.
 */
import { apiSlice } from "./apiSlice";

export interface LanguageItem {
  code: string;
  name: string;
  native_name: string;
  flag: string;
  is_default: boolean;
}

export interface TranslationsLanguagesResponse {
  languages: LanguageItem[];
}

/** GET /i18n/translations/{locale} returns flat key -> value */
export type TranslationsByLocaleResponse = Record<string, string>;

export interface TranslationItem {
  id: number;
  key: string;
  locale: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface TranslationCreateRequest {
  key: string;
  value: string;
  locale?: string;
}

export interface TranslationUpdateRequest {
  value: string;
}

export interface TranslationBulkUpdateRequest {
  key: string;
  translations: Record<string, string>;
}

export interface TranslationBulkUpdateResponse {
  key: string;
  updated_count: number;
  translations: Array<{ id: number; key: string; locale: string; value: string }>;
}

export const i18nApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query<TranslationsLanguagesResponse, void>({
      query: () => ({
        url: "/i18n/languages",
        method: "GET",
      }),
      providesTags: ["Translation"],
    }),

    getTranslationsByLocale: builder.query<TranslationsByLocaleResponse, string>({
      query: (locale) => ({
        url: `/i18n/translations/${encodeURIComponent(locale)}`,
        method: "GET",
      }),
      providesTags: (result, error, locale) => [{ type: "Translation", id: `locale-${locale}` }],
    }),

    listTranslations: builder.query<
      TranslationItem[],
      { locale?: string; skip?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/i18n/strings",
        method: "GET",
        params: {
          skip: params.skip ?? 0,
          limit: params.limit ?? 200,
          ...(params.locale && { locale: params.locale }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "Translation" as const, id: r.id })),
              { type: "Translation", id: "LIST" },
            ]
          : [{ type: "Translation", id: "LIST" }],
    }),

    addTranslation: builder.mutation<TranslationItem, TranslationCreateRequest>({
      query: (body) => ({
        url: "/i18n/strings",
        method: "POST",
        body: {
          key: body.key,
          value: body.value,
          locale: body.locale ?? "en",
        },
      }),
      invalidatesTags: ["Translation"],
    }),

    updateTranslation: builder.mutation<
      TranslationItem,
      { key: string; locale: string; value: string }
    >({
      query: ({ key, locale, value }) => ({
        url: `/i18n/strings/${encodeURIComponent(key)}`,
        method: "PUT",
        params: { locale },
        body: { value },
      }),
      invalidatesTags: ["Translation"],
    }),

    bulkUpdateTranslations: builder.mutation<
      TranslationBulkUpdateResponse,
      TranslationBulkUpdateRequest
    >({
      query: (body) => ({
        url: "/i18n/strings/bulk",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Translation"],
    }),

    deleteTranslation: builder.mutation<
      { deleted: boolean; key: string; locale: string },
      { key: string; locale: string }
    >({
      query: ({ key, locale }) => ({
        url: `/i18n/strings/${encodeURIComponent(key)}`,
        method: "DELETE",
        params: { locale },
      }),
      invalidatesTags: ["Translation"],
    }),
  }),
});

export const {
  useGetLanguagesQuery,
  useGetTranslationsByLocaleQuery,
  useListTranslationsQuery,
  useAddTranslationMutation,
  useUpdateTranslationMutation,
  useBulkUpdateTranslationsMutation,
  useDeleteTranslationMutation,
} = i18nApi;
