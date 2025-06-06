import { configureStore } from '@reduxjs/toolkit';
import { labelApi } from '../service/label';
import { imageApi } from '../service/image';

export const store = configureStore({
  reducer: {
    [labelApi.reducerPath]: labelApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      labelApi.middleware,
      imageApi.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
