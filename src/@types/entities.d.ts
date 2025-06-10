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
  id: string;
  name: string;
  description: string;
}

declare type OrderByType = 'CREATED_AT' | 'UPDATED_AT';

declare interface Document {
  id: string;
  name: string;
  mime_type: string;
  created_at: string;
}
