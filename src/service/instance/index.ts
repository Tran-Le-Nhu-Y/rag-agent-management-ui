import { createAxiosInstance } from '../../util';

export const agentManagementInstance = createAxiosInstance({
  baseURL: `${import.meta.env.VITE_API_GATEWAY}`,
});
