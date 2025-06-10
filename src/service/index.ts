import {
  useShowImageByIdQuery as useShowImageById,
  useGetImageInfoByIdQuery as useGetImageInfoById,
  useDeleteImageMutation as useDeleteImage,
  useGetUnlabeledImagesQuery as useGetUnlabeledImages,
  useUploadImageMutation as useUploadImage,
  useAssignLabelToImageMutation as useAssignLabelToImage,
  useGetImagesByLabelIdQuery as useGetImagesByLabelId,
  useGetLabeledImagesQuery as useGetLabeledImages,
} from './image';

export {
  useShowImageById,
  useGetImageInfoById,
  useGetUnlabeledImages,
  useGetLabeledImages,
  useDeleteImage,
  useUploadImage,
  useAssignLabelToImage,
  useGetImagesByLabelId,
};

import {
  useGetAllLabelQuery as useGetAllLabel,
  useGetLabelByImageIdQuery as useGetLabelByImageId,
} from './label';
export { useGetAllLabel, useGetLabelByImageId };
