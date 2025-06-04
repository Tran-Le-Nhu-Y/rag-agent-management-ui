import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery } from '../util';
// import { toEntity } from './mapper/label-mapper';

const EXTENSION_URL = 'v1/labels';
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
      //   transformResponse(rawResult: LabelResponse) {
      //     return toEntity(rawResult);
      //   },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllLabelQuery } = labelApi;
