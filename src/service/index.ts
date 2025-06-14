import {
  useGetDocumentInfoByIdQuery as useGetDocumentInfoById,
  useDeleteDocumentMutation as useDeleteDocument,
} from './document';
export { useGetDocumentInfoById, useDeleteDocument };

import {
  useGetImageInfoByIdQuery as useGetImageInfoById,
  useDeleteImageMutation as useDeleteImage,
  useGetUnlabeledImagesQuery as useGetUnlabeledImages,
  useUploadImageMutation as useUploadImage,
  useAssignLabelToImageMutation as useAssignLabelToImage,
  useGetImagesByLabelIdQuery as useGetImagesByLabelId,
  useGetLabeledImagesQuery as useGetLabeledImages,
  useGetImagesByLabelIdsQuery as useGetImagesByLabelIds,
} from './image';

export {
  useGetImageInfoById,
  useGetUnlabeledImages,
  useGetLabeledImages,
  useDeleteImage,
  useUploadImage,
  useAssignLabelToImage,
  useGetImagesByLabelId,
  useGetImagesByLabelIds,
};

import {
  useGetAllLabelQuery as useGetAllLabel,
  useGetLabelByImageIdQuery as useGetLabelByImageId,
} from './label';
export { useGetAllLabel, useGetLabelByImageId };
