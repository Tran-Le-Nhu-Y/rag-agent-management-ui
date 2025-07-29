import {
  useGetDocumentInfoByIdQuery as useGetDocumentInfoById,
  useDeleteDocumentMutation as useDeleteDocument,
  useEmbedDocumentMutation as useEmbedDocument,
  useGetEmbeddedDocumentsQuery as useGetEmbeddedDocuments,
  useGetUnembeddedDocumentsQuery as useGetUnembeddedDocuments,
  useUploadDocumentMutation as useUploadDocument,
  useUnembedDocumentMutation as useUnembedDocument,
} from './document';
export {
  useGetDocumentInfoById,
  useDeleteDocument,
  useEmbedDocument,
  useGetEmbeddedDocuments,
  useGetUnembeddedDocuments,
  useUploadDocument,
  useUnembedDocument,
};

import {
  useGetImageInfoByIdQuery as useGetImageInfoById,
  useDeleteImageMutation as useDeleteImage,
  useGetUnlabeledImagesQuery as useGetUnlabeledImages,
  useUploadImageMutation as useUploadImage,
  useAssignLabelToImageMutation as useAssignLabelToImage,
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
  useGetImagesByLabelIds,
};

import {
  useGetAllLabelQuery as useGetAllLabel,
  useGetLabelByImageIdQuery as useGetLabelByImageId,
  usePostLabelMutation as useCreateLabel,
  useDeleteLabelMutation as useDeleteLabel,
  usePutLabelMutation as useUpdateLabel,
} from './label';
export {
  useCreateLabel,
  useGetAllLabel,
  useGetLabelByImageId,
  useDeleteLabel,
  useUpdateLabel,
};

import {
  useGetAgentStatusQuery,
  usePostAgentStatusMutation,
  useRestartAgentMutation,
} from './agent';
export {
  useGetAgentStatusQuery as useGetAgentStatus,
  usePostAgentStatusMutation as usePostAgentStatus,
  useRestartAgentMutation as useRestartAgent,
};
