import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/image-mapper';
import type { Image } from '../@types/entities';

const EXTENSION_URL = 'api/v1/images';
export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: axiosBaseQuery(agentManagementInstance),
  tagTypes: ['PagingImage', 'Image'],
  endpoints: (builder) => ({
    showImageById: builder.query<string, string>({
      query: (imageId: string) => ({
        url: `/${EXTENSION_URL}/${imageId}/show`,
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

    getUnlabeledImages: builder.query<
      PagingWrapper<Image>,
      GetUnlabeledImagesQuery
    >({
      query: ({ offset = 0, limit = 100, orderBy = 'created_at' }) => ({
        url: `/${EXTENSION_URL}/unlabeled`,
        method: 'GET',
        params: {
          offset: offset,
          limit: limit,
          order_by: orderBy,
        },
      }),

      providesTags(result) {
        const pagingTag = {
          type: 'PagingImage',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Image', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: PagingWrapper<ImageResponse>) {
        const content = rawResult.content.map(toEntity);
        return {
          ...rawResult,
          content,
        };
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
  useUploadImageMutation,
  useAssignLabelToImageMutation,
  useShowImageByIdQuery,
} = imageApi;
