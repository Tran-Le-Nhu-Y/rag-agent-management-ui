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
