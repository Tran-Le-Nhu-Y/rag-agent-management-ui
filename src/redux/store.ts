import { configureStore } from '@reduxjs/toolkit';
import { pokemonService } from '../service';

export const store = configureStore({
  reducer: {
    [pokemonService.reducerPath]: pokemonService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
