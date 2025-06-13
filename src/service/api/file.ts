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

const createExportLabeledImagesUrl = (downloadToken: string) => {
  return `${import.meta.env.VITE_API_GATEWAY}/download?token=${downloadToken}`;
};

export {
  getExportingAllToken,
  createExportLabeledImagesUrl,
  getExportingTokenByLabelId,
};
