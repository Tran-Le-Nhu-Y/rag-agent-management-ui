declare interface PagingWrapper<T> {
  content: Array<T>;
  first?: boolean;
  last?: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  totalPages?: number;
}

declare interface ImageResponse {
  id: string;
  name: string;
  mime_type: string;
}

declare interface LabelResponse {
  id: string;
  name: string;
  description: string;
}
