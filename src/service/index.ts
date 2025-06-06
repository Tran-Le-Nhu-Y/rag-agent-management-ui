import {
  useShowImageByIdQuery as useShowImageById,
  useGetImageInfoByIdQuery as useGetImageInfoById,
  useDeleteImageMutation as useDeleteImage,
  useGetUnlabeledImagesQuery as useGetUnlabeledImages,
  useUploadImageMutation as useUploadImage,
  useAssignLabelToImageMutation as useAssignLabelToImage,
} from './image';

export {
  useShowImageById,
  useGetImageInfoById,
  useGetUnlabeledImages,
  useDeleteImage,
  useUploadImage,
  useAssignLabelToImage,
};

import { useGetAllLabelQuery as useGetAllLabel } from './label';
export { useGetAllLabel };
