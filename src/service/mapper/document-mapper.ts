import type { Document } from '../../@types/entities';

function toEntity(response: DocumentResponse): Document {
  const document: Document = {
    id: response.id,
    name: response.name,
    description: response.description,
    mime_type: response.mime_type,
    created_at: response.created_at,
    source: response.source,
  };
  return document;
}
export { toEntity };
