import { configureStore } from '@reduxjs/toolkit';
import { labelApi } from '../service/label';
import { imageApi } from '../service/image';
import { documentApi } from '../service/document';
import { agentApi } from '../service/agent';

export const store = configureStore({
  reducer: {
    [agentApi.reducerPath]: agentApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      agentApi.middleware,
      labelApi.middleware,
      imageApi.middleware,
      documentApi.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
