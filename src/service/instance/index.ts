import { createAxiosInstance } from '../../util';

export const pokemonInstance = createAxiosInstance({
  url: 'https://pokeapi.co/api/v2/',
});

export const agentManagementInstance = createAxiosInstance({
  baseURL: `${import.meta.env.VITE_API_GATEWAY}`,
});
