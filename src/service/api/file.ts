import { agentManagementInstance } from '../instance';

const getExportingAllToken = async () => {
  const response = await agentManagementInstance.get(`api/v1/export/all`);
  return response.data as string;
};

const getExportingTokenByLabelId = async (labelId: string) => {
  const response = await agentManagementInstance.get(
    `api/v1/export/${labelId}/label`
  );
  return response.data as string;
};

const downloadFile = (downloadToken: string) => {
  return `${import.meta.env.VITE_API_GATEWAY}/download?token=${downloadToken}`;
};

const getDocumentDownloadTokenById = async (documentId: string) => {
  const response = await agentManagementInstance.get(
    `api/v1/documents/${documentId}/token`
  );
  return response.data as string;
};

export {
  getExportingAllToken,
  downloadFile,
  getExportingTokenByLabelId,
  getDocumentDownloadTokenById,
};
