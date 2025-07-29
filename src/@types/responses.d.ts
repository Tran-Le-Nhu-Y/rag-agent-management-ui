declare interface PagingWrapper<T> {
  content: Array<T>;
  first?: boolean;
  last?: boolean;
  page_number: number;
  page_size: number;
  total_elements: number;
  total_pages?: number;
}

declare interface ImageResponse {
  id: string;
  name: string;
  mime_type: string;
  created_at: string;
  assigned_label_ids: number[] | null;
  classified_label_ids: number[] | null;
}

declare interface LabelResponse {
  id: string;
  name: string;
  description: string | null;
  source: 'PREDEFINED' | 'CREATED';
}

declare interface DocumentResponse {
  id: string;
  name: string;
  description: string;
  mime_type: string;
  embedded_to_bm25?: boolean;
  embedded_to_vs?: string;
  created_at: string;
  source: string;
}

declare interface AgentStatusResponse {
  name: string;
  description: string | null;
  status: string;
  available_vector_stores: string[];
  bm25_last_sync: string | null;
}
