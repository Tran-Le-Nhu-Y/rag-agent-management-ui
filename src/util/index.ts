import type { AlertColor } from '@mui/material';
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from 'axios';

export const TextLength = {
  SHORT: 6,
  MEDIUM: 100,
  LONG: 150,
  VERY_LONG: 255,
  EXTREME_LONG: 60000,
};

export const PathHolder = {
  DOCUMENT: 'document',
  LABEL: 'label',
};

export const Path = {
  DOCUMENT: `/${PathHolder.DOCUMENT}`,
  CREATE_DOCUMENT: `/${PathHolder.DOCUMENT}/create`,

  LABEL: `/${PathHolder.LABEL}`,

  USER_GUIDE: '/guide',
};

export const HideDuration = {
  FAST: 3000,
  NORMAL: 5000,
  SLOW: 7000,
};

export type SnackbarSeverity = AlertColor;

export const axiosQueryHandler = async <T>(func: () => Promise<T>) => {
  try {
    const result = await func();
    return { data: result };
  } catch (error) {
    console.error('In querying:', error);
    if (error instanceof AxiosError) {
      const err = error as AxiosError;
      return {
        error: {
          status: err.response!.status!,
          data: err.response?.data || err.message,
        },
      };
    } else
      return {
        error: {
          status: 500,
        },
      };
  }
};

export const axiosBaseQuery =
  (
    instance: AxiosInstance
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      body?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    FetchBaseQueryError
  > =>
  async ({ url, method, body, params, headers }) => {
    try {
      const result = await instance({
        url,
        method,
        data: body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response!.status! || 500,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export function createAxiosInstance(config?: CreateAxiosDefaults) {
  const instance = axios.create(config);

  instance.interceptors.request.use(
    async function (config) {
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  return instance;
}

export function getFileSize(bytes: number) {
  const oneKB = 1024;
  const oneMB = 1024 * oneKB;
  if (bytes < oneKB) return `${bytes} bytes`;
  else if (bytes < oneMB) return `${(bytes / oneKB).toFixed(1)} KB`;
  else return `${(bytes / oneMB).toFixed(1)} MB`;
}

// export const convertToAPIDateFormat = (date: Dayjs) => {
//   return date.format('YYYY-MM-DD');
// };

export const parseDay = (date: string) => {
  return new Date(date).toLocaleString();
};

export type TextLengthValue = (typeof TextLength)[keyof typeof TextLength];
export const isValidLength = (text: string, length: TextLengthValue) =>
  text.length <= length;
