// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../util';
import { pokemonInstance } from './instance';

// Define a service using a base URL and expected endpoints
export const pokemonService = createApi({
  reducerPath: 'pokemonService',
  baseQuery: axiosBaseQuery(pokemonInstance),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name: string) => ({ url: `pokemon/${name}`, method: 'GET' }),
      providesTags: (result, _error, name) => {
        return result ? [{ type: 'Pokemon', id: name }] : ['Pokemon'];
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonService;
