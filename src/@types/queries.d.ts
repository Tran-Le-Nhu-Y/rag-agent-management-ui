declare interface GetUnlabeledImagesQuery {
  offset?: number?;
  limit?: number?;
  orderBy: OrderByType;
}

declare interface GetLabeledImagesQuery {
  offset?: number?;
  limit?: number?;
  orderBy: OrderByType;
}
declare interface GetImagesByLabelIdQuery {
  labelId: string;
  offset?: number?;
  limit?: number?;
  orderBy: OrderByType;
}
