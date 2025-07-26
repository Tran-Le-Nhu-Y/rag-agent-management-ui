import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery, axiosQueryHandler } from '../util';
import { toEntity, toImageHasLabelsEntity } from './mapper/image-mapper';
import { toEntity as toLabelEntity } from './mapper/label-mapper';
import type { Image, ImageHasLabels } from '../@types/entities';
import { getLabelById } from './api';

const EXTENSION_URL = 'api/v1/images';
export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: axiosBaseQuery(agentManagementInstance),
  tagTypes: ['UnlabeledPagingImage', 'LabeledPagingImage', 'Image'],
  endpoints: (builder) => ({
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

    getImagesByLabelIds: builder.query<
      PagingWrapper<ImageHasLabels>,
      GetImagesByLabelIdsQuery
    >({
      async queryFn(arg) {
        const { labelIds, offset = 0, limit = 50 } = arg;
        const func = async () => {
          const params = new URLSearchParams();
          params.append('offset', `${offset}`);
          params.append('limit', `${limit}`);
          labelIds.forEach((labelId) => {
            params.append('label_ids', labelId);
          });
          const response = await agentManagementInstance.get(
            `/${EXTENSION_URL}/labels`,
            {
              params: params,
            }
          );
          const labeledImage: PagingWrapper<ImageResponse> = response.data;
          const labelIdSet = new Set(
            labeledImage.content
              .map((img) => {
                const labelIds: number[] = [];
                img.assigned_label_ids?.forEach((id) => {
                  labelIds.push(id);
                });
                img.classified_label_ids?.forEach((id) => {
                  labelIds.push(id);
                });
                return labelIds;
              })
              .flat()
          );
          const labelIdsToGet: number[] = [];
          labelIdSet.forEach((id) => labelIdsToGet.push(id));
          const labels = await Promise.all(
            labelIdsToGet.map(async (id) => {
              const result = await getLabelById(id);
              return toLabelEntity(result);
            })
          );

          const content = toImageHasLabelsEntity(labeledImage.content, labels);
          return { ...labeledImage, content };
        };
        return axiosQueryHandler(func);
      },
      providesTags(result) {
        const pagingTag = {
          type: 'LabeledPagingImage',
          id: `ByLabelIds-${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
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
    }),

    getUnlabeledImages: builder.query<
      PagingWrapper<ImageHasLabels>,
      GetUnlabeledImagesQuery
    >({
      async queryFn(arg) {
        const { offset = 0, limit = 50 } = arg;
        const func = async () => {
          const response = await agentManagementInstance.get(
            `/${EXTENSION_URL}/unlabeled`,
            {
              params: {
                offset: offset,
                limit: limit,
              },
            }
          );
          const labeledImage: PagingWrapper<ImageResponse> = response.data;
          const labelIdSet = new Set(
            labeledImage.content
              .map((img) => {
                const labelIds: number[] = [];
                img.assigned_label_ids?.forEach((id) => {
                  labelIds.push(id);
                });
                img.classified_label_ids?.forEach((id) => {
                  labelIds.push(id);
                });
                return labelIds;
              })
              .flat()
          );
          const labelIdsToGet: number[] = [];
          labelIdSet.forEach((id) => labelIdsToGet.push(id));
          const labels = await Promise.all(
            labelIdsToGet.map(async (id) => {
              const result = await getLabelById(id);
              return toLabelEntity(result);
            })
          );

          const content = toImageHasLabelsEntity(labeledImage.content, labels);
          return { ...labeledImage, content };
        };
        return axiosQueryHandler(func);
      },
      providesTags(result) {
        const pagingTag = {
          type: 'UnlabeledPagingImage',
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
    }),

    getLabeledImages: builder.query<
      PagingWrapper<ImageHasLabels>,
      GetLabeledImagesQuery
    >({
      async queryFn(arg) {
        const { offset = 0, limit = 50, orderBy = 'created_at' } = arg;
        const func = async () => {
          const response = await agentManagementInstance.get(
            `/${EXTENSION_URL}/labeled`,
            {
              params: {
                offset: offset,
                limit: limit,
                order_by: orderBy,
              },
            }
          );
          const labeledImage: PagingWrapper<ImageResponse> = response.data;
          const labelIdSet = new Set(
            labeledImage.content
              .map((img) => {
                const labelIds: number[] = [];
                img.assigned_label_ids?.forEach((id) => {
                  labelIds.push(id);
                });
                img.classified_label_ids?.forEach((id) => {
                  labelIds.push(id);
                });
                return labelIds;
              })
              .flat()
          );
          const labelIdsToGet: number[] = [];
          labelIdSet.forEach((id) => labelIdsToGet.push(id));
          const labels = await Promise.all(
            labelIdsToGet.map(async (id) => {
              const result = await getLabelById(id);
              return toLabelEntity(result);
            })
          );

          const content = toImageHasLabelsEntity(labeledImage.content, labels);
          return { ...labeledImage, content };
        };
        return axiosQueryHandler(func);
      },

      providesTags(result) {
        const pagingTag = {
          type: 'LabeledPagingImage',
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
    }),

    uploadImage: builder.mutation<string, UploadImageRequest>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `/${EXTENSION_URL}/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags() {
        return [{ type: 'UnlabeledPagingImage' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    assignLabelToImage: builder.mutation<string, AssignLabelRequest>({
      query: ({ imageId, labelIds }) => ({
        url: `/${EXTENSION_URL}/${imageId}/assign`,
        method: 'POST',
        body: labelIds,
      }),
      invalidatesTags() {
        return [
          { type: 'UnlabeledPagingImage' } as const,
          { type: 'LabeledPagingImage' } as const,
        ];
      },
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
  useGetLabeledImagesQuery,
  useGetImagesByLabelIdsQuery,
} = imageApi;
