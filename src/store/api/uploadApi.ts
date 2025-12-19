import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface Upload {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  upload_type: string | null;
  created_at: string;
}

export interface UploadResponse {
  id: number;
  filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
}

export interface MultipleUploadResponse {
  files: UploadResponse[];
}

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/uploads',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
    uploadMultipleFiles: builder.mutation<MultipleUploadResponse, FormData>({
      query: (formData) => ({
        url: '/uploads/multiple',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
    getUploads: builder.query<PaginatedResponse<Upload> | Upload[], PaginationParams>({
      query: (params) => ({
        url: '/uploads',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getUpload: builder.query<Upload, number>({
      query: (id) => ({
        url: `/uploads/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    downloadFile: builder.query<Blob, number>({
      query: (id) => ({
        url: `/uploads/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    deleteUpload: builder.mutation<void, number>({
      query: (id) => ({
        url: `/uploads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useUploadMultipleFilesMutation,
  useGetUploadsQuery,
  useGetUploadQuery,
  useDownloadFileQuery,
  useDeleteUploadMutation,
} = uploadApi;

