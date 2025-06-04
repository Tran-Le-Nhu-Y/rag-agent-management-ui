import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/image-mapper';

const EXTENSION_URL = 'v1/images';
export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: axiosBaseQuery(agentManagementInstance),
  tagTypes: ['Image'],
  endpoints: (builder) => ({
    getgetImageDownloadToken: builder.query<string, string>({
      query: (imageId: string) => ({
        url: `/${EXTENSION_URL}/${imageId}/token`,
        method: 'GET',
      }),
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    getImageInfoById: builder.query<Image, string>({
      query: (imageId: string) => ({
        url: `/${EXTENSION_URL}/${imageId}/info`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Image',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: ImageResponse) {
        return toEntity(rawResult);
      },
    }),

    getUnlabeledImages: builder.query<Image[], GetUnlabeledImagesQuery>({
      query: ({ offset = 0, limit = 100, orderBy = 'CREATED_AT' }) => ({
        url: `/${EXTENSION_URL}/unlabeled`,
        method: 'GET',
        params: {
          offset: offset,
          limit: limit,
          order_by: orderBy,
        },
      }),

      transformResponse: (response: ImageResponse[]) => response.map(toEntity),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    uploadImage: builder.mutation<string, UploadImageRequest>({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `/${EXTENSION_URL}/${userId}/upload`,
          method: 'POST',
          body: formData,
        };
      },

      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    assignLabelToImage: builder.mutation<string, AssignLabelRequest>({
      query: ({ imageId, labelId }) => ({
        url: `/${EXTENSION_URL}/${imageId}/assign/${labelId}`,
        method: 'POST',
      }),

      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteImage: builder.mutation<void, string>({
      query: (imageId: string) => ({
        url: `/${EXTENSION_URL}/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const imageId = arg;
        return [{ type: 'Image', id: imageId } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetImageInfoByIdQuery,
  useDeleteImageMutation,
  useGetUnlabeledImagesQuery,
  useLazyGetgetImageDownloadTokenQuery,
  useUploadImageMutation,
  useAssignLabelToImageMutation,
} = imageApi;
