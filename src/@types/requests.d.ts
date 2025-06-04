declare interface UploadImageRequest {
  userId: string;
  file: File;
}

declare interface AssignLabelRequest {
  imageId: string;
  labelId: number;
}
