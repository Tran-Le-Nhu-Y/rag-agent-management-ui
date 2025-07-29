declare interface Image {
  id: string;
  name: string;
  mime_type: string;
  created_at: string;
}

declare interface ImageHasLabels extends Image {
  labels: Label[];
  recommenedLabels?: Label[];
}

export type ImageItem = {
  id: string;
  url: string;
};

declare interface Label {
  id: int;
  name: string;
  description: string;
  source: 'PREDEFINED' | 'CREATED';
}

declare type OrderByType = 'created_at';

declare interface DocumentInfo {
  id: string;
  name: string;
  description: string;
  embedded_to_bm25?: boolean;
  embedded_to_vs?: string | null;
  mime_type: string;
  created_at: string;
  source: string;
}
declare interface VectorStore {
  id: string;
  name: string;
}

declare interface AgentStatus {
  name: string;
  description?: string | null;
  status: 'ON' | 'OFF' | 'RESTART' | 'EMBED_DOCUMENT';
  available_vector_stores: string[];
  bm25_last_sync: string | null;
}
