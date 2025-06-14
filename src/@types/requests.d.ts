declare interface UploadImageRequest {
  userId: string;
  file: File;
}

declare interface UploadDocumentRequest {
  file: File;
}

declare interface AssignLabelRequest {
  imageId: string;
  labelIds: string[];
}

declare interface EmbedDocumentRequest {
  storeName: string;
  documentId: string;
}
