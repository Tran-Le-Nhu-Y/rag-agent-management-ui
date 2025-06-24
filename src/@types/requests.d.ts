declare interface UploadImageRequest {
  userId: string;
  file: File;
}

declare interface UploadDocumentRequest {
  file: File;
  description?: string;
}

declare interface AssignLabelRequest {
  imageId: string;
  labelIds: string[];
}

declare interface EmbedDocumentRequest {
  storeName: string;
  documentId: string;
}

declare interface UnembedDocumentRequest {
  storeName: string;
  documentId: string;
}
