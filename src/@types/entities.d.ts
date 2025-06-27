declare interface Image {
  id: string;
  name: string;
  mime_type: string;
  created_at: string;
}

declare interface ImageHasLabels {
  id: string;
  name: string;
  mime_type: string;
  created_at: string;
  labels: Label[];
}

export type ImageItem = {
  id: string;
  url: string;
};

declare interface Label {
  id: int;
  name: string;
  description: string;
  source: string;
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
