import type { DocumentInfo } from '../../@types/entities';

function toEntity(response: DocumentResponse): DocumentInfo {
  const document: DocumentInfo = {
    id: response.id,
    name: response.name,
    description: response.description,
    embedded_to_bm25: response.embedded_to_bm25 ?? false,
    embedded_to_vs: response.embedded_to_vs ?? null,
    mime_type: response.mime_type,
    created_at: response.created_at,
    source: response.source,
  };
  return document;
}
export { toEntity };
