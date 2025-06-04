import { configureStore } from '@reduxjs/toolkit';
import { pokemonService } from '../service';
import { labelApi } from '../service/label';

export const store = configureStore({
  reducer: {
    [pokemonService.reducerPath]: pokemonService.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      pokemonService.middleware,
      labelApi.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
