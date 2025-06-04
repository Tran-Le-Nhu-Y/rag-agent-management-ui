import { pokemonService } from './pokemon';
export { pokemonService };

import {
  useGetImageInfoByIdQuery as useGetImageInfoById,
  useDeleteImageMutation as useDeleteImage,
  useGetUnlabeledImagesQuery as useGetUnlabeledImages,
  useLazyGetgetImageDownloadTokenQuery as useLazyGetgetImageDownloadToken,
  useUploadImageMutation as useUploadImage,
  useAssignLabelToImageMutation as useAssignLabelToImage,
} from './image';

export {
  useGetImageInfoById,
  useGetUnlabeledImages,
  useLazyGetgetImageDownloadToken,
  useDeleteImage,
  useUploadImage,
  useAssignLabelToImage,
};

import { useGetAllLabelQuery as useGetAllLabel } from './label';
export { useGetAllLabel };
