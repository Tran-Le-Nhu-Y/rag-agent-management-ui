import { agentManagementInstance } from '../instance';

const getLabelById = async (labelId: number) => {
  const response = await agentManagementInstance.get(
    `api/v1/labels/${labelId}`
  );
  return response.data as LabelResponse;
};

export { getLabelById };
