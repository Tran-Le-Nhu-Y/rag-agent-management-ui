import { createApi } from '@reduxjs/toolkit/query/react';
import { agentManagementInstance } from './instance';
import { axiosBaseQuery } from '../util';
import { toEntity } from './mapper/document-mapper';
import type { DocumentInfo } from '../@types/entities';

const EXTENSION_URL = 'api/v1/documents';
export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: axiosBaseQuery(agentManagementInstance),
  tagTypes: ['PagingUnembeddedDocument', 'PagingEmbeddedDocument', 'Document'],
  endpoints: (builder) => ({
    getDocumentInfoById: builder.query<DocumentInfo, string>({
      query: (documentId: string) => ({
        url: `/${EXTENSION_URL}/${documentId}/info`,
        method: 'GET',
      }),
      providesTags(result) {
        return result
          ? [
              {
                type: 'Document',
                id: result.id,
              } as const,
            ]
          : [];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: DocumentResponse) {
        return toEntity(rawResult);
      },
    }),

    getUnembeddedDocuments: builder.query<
      PagingWrapper<DocumentInfo>,
      GetUnembeddedDocumentsQuery
    >({
      query: ({ offset = 0, limit = 100 }) => ({
        url: `/${EXTENSION_URL}/unembedded`,
        method: 'GET',
        params: {
          offset: offset,
          limit: limit,
        },
      }),

      providesTags(result) {
        const pagingTag = {
          type: 'PagingUnembeddedDocument',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Document', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: PagingWrapper<DocumentResponse>) {
        const content = rawResult.content.map(toEntity);
        return {
          ...rawResult,
          content,
        };
      },
    }),

    getEmbeddedDocuments: builder.query<
      PagingWrapper<DocumentInfo>,
      GetEmbeddedDocumentsQuery
    >({
      query: ({ offset = 0, limit = 100 }) => ({
        url: `/${EXTENSION_URL}/embedded`,
        method: 'GET',
        params: {
          offset: offset,
          limit: limit,
        },
      }),

      providesTags(result) {
        const pagingTag = {
          type: 'PagingEmbeddedDocument',
          id: `${result?.page_number}-${result?.total_pages}-${result?.page_size}-${result?.total_elements}`,
        } as const;

        return result
          ? [
              ...result.content.map(
                ({ id }) => ({ type: 'Document', id } as const)
              ),
              pagingTag,
            ]
          : [pagingTag];
      },
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
      transformResponse(rawResult: PagingWrapper<DocumentResponse>) {
        const content = rawResult.content.map(toEntity);
        return {
          ...rawResult,
          content,
        };
      },
    }),

    uploadDocument: builder.mutation<string, UploadDocumentRequest>({
      query: ({ file, description }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description ?? '');

        return {
          url: `/${EXTENSION_URL}/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags() {
        return [{ type: 'PagingUnembeddedDocument' } as const];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    embedDocument: builder.mutation<string, EmbedDocumentRequest>({
      query: ({ storeName, documentId }) => ({
        url: `/${EXTENSION_URL}/${storeName}/embed/${documentId}`,
        method: 'POST',
      }),
      invalidatesTags() {
        return [
          { type: 'PagingUnembeddedDocument' } as const,
          { type: 'PagingEmbeddedDocument' } as const,
        ];
      },
      transformResponse: (response: string) => response,
      transformErrorResponse(baseQueryReturnValue) {
        return baseQueryReturnValue.status;
      },
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (documentId: string) => ({
        url: `/${EXTENSION_URL}/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags(_result, _error, arg) {
        const documentId = arg;
        return [
          { type: 'Document', id: documentId } as const,
          { type: 'PagingUnembeddedDocument' } as const,
          { type: 'PagingEmbeddedDocument' } as const,
        ];
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
  useGetDocumentInfoByIdQuery,
  useDeleteDocumentMutation,
  useEmbedDocumentMutation,
  useGetEmbeddedDocumentsQuery,
  useGetUnembeddedDocumentsQuery,
  useUploadDocumentMutation,
} = documentApi;
