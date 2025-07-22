import { LabelError } from './../util/errors';
import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery } from '../util';
import type { Label } from '../@types/entities';
import { toEntity } from './mapper/label-mapper';

const EXTENSION_URL = 'api/v1/labels';
export const labelApi = createApi({
  reducerPath: 'labelApi',
  baseQuery: axiosBaseQuery(agentManagementInstance),
  tagTypes: ['Label'],
  endpoints: (builder) => ({
    postLabel: builder.mutation<Label, LabelCreateRequest>({
      query: (data: LabelCreateRequest) => ({
        url: `/${EXTENSION_URL}/create`,
        method: 'POST',
        body: {
          name: data.name,
          description: data.description,
        },
      }),
      invalidatesTags() {
        return [{ type: 'Label' } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        const status = baseQueryReturnValue.status;
        const { message } = baseQueryReturnValue.data as { message: string };
        if (
          status === 400 &&
          message.localeCompare('Label with name a already exists.') === 0
        )
          return LabelError.DUPLICATE_LABEL_NAME;
        return LabelError.UNKNOWN_ERROR;
      },
      transformResponse(rawResult: LabelResponse) {
        return toEntity(rawResult);
      },
    }),

    putLabel: builder.mutation<void, LabelUpdateRequest>({
      query: (data: LabelUpdateRequest) => ({
        url: `/${EXTENSION_URL}/${data.labelId}/update`,
        method: 'PUT',
        body: {
          description: data.description,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const { labelId } = arg;
        return [{ type: 'Label', id: labelId } as const];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    getAllLabel: builder.query<Label[], void>({
      query: () => ({
        url: `/${EXTENSION_URL}/all`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? result.map((label) => ({
              type: 'Label' as const,
              id: label.id,
            }))
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: LabelResponse[]) {
        return rawResult.map((label) => toEntity(label));
      },
    }),
    getLabelById: builder.query<Label, number>({
      query: (id) => ({
        url: `/${EXTENSION_URL}/${id}`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Label' as const,
                id: result.id,
              },
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: LabelResponse) {
        return toEntity(rawResult);
      },
    }),
    getLabelByImageId: builder.query<Label[], string>({
      query: (imageId: string) => ({
        url: `/${EXTENSION_URL}/${imageId}/image`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Label',
                id: result.map((label) => label.id).join(','),
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: LabelResponse[]) {
        return rawResult.map((label) => toEntity(label));
      },
    }),
    deleteLabel: builder.mutation<void, string>({
      query: (labelId: string) => ({
        url: `/${EXTENSION_URL}/delete`,
        method: 'DELETE',
        body: {
          id: labelId,
        },
      }),
      invalidatesTags(_result, _error, arg) {
        const labelId = arg;
        return [{ type: 'Label', id: labelId } as const];
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
  usePostLabelMutation,
  useGetAllLabelQuery,
  useGetLabelByImageIdQuery,
  useDeleteLabelMutation,
  usePutLabelMutation,
} = labelApi;
