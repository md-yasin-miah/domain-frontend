import { apiSlice } from './apiSlice';

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
  /** Present when returned from list/detail (backend FileUploadResponse) */
  file_url?: string;
  file_type?: string;
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

/** Params for uploading a file linked to a verification request */
export interface UploadForVerificationParams {
  formData: FormData;
  related_entity_id: number;
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
    /** Upload a file and link it to a verification request (uses query params). */
    uploadFileForVerification: builder.mutation<UploadResponse, UploadForVerificationParams>({
      query: ({ formData, related_entity_id }) => ({
        url: '/uploads',
        method: 'POST',
        body: formData,
        params: {
          related_entity_type: 'user_verification_request',
          related_entity_id,
        },
      }),
      invalidatesTags: ['User', 'Verification'],
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
  useUploadFileForVerificationMutation,
  useUploadMultipleFilesMutation,
  useGetUploadsQuery,
  useGetUploadQuery,
  useDownloadFileQuery,
  useDeleteUploadMutation,
} = uploadApi;

