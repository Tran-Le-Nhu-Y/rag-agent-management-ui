import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery } from '../util';
import type { AgentStatus } from '../@types/entities';

const EXTENSION_URL = 'agent';
export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: axiosBaseQuery(agentManagementInstance),
  tagTypes: ['Status'],
  endpoints: (builder) => ({
    getAgentStatus: builder.query<AgentStatus, void>({
      query: () => ({
        url: `/${EXTENSION_URL}/health`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Status',
                id: 'current-status',
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: AgentStatusResponse) {
        return {
          ...rawResult,
          status: rawResult.status as AgentStatus['status'],
          available_vector_stores: rawResult.available_vector_stores,
          bm25_last_sync: rawResult.bm25_last_sync,
        };
      },
    }),
    postAgentStatus: builder.mutation<void, 'ON' | 'OFF'>({
      query: (status) => ({
        url: `/${EXTENSION_URL}/status`,
        method: 'POST',
        params: {
          new_status: status,
        },
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    restartAgent: builder.mutation<void, void>({
      query: () => ({
        url: `/${EXTENSION_URL}/restart`,
        method: 'POST',
      }),
      invalidatesTags(_result, error) {
        return error?.status !== 500
          ? [
              {
                type: 'Status',
                id: 'current-status',
              } as const,
            ]
          : [];
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
  useGetAgentStatusQuery,
  usePostAgentStatusMutation,
  useRestartAgentMutation,
} = agentApi;
