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
      // transformResponse(rawResult: LabelResponse) {
      //   return toEntity(rawResult);
      // },
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllLabelQuery, useGetLabelByImageIdQuery } = labelApi;
