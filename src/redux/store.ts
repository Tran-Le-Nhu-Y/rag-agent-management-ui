import { configureStore } from '@reduxjs/toolkit';
import { labelApi } from '../service/label';
import { imageApi } from '../service/image';
import { documentApi } from '../service/document';

export const store = configureStore({
  reducer: {
    [labelApi.reducerPath]: labelApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      labelApi.middleware,
      imageApi.middleware,
      documentApi.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
