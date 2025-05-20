import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../util';
import { pokemonInstance } from './instance';

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

export const { useGetPokemonByNameQuery } = pokemonService;
