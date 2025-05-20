import { initReactI18next } from 'react-i18next/initReactI18next';
import i18next from 'i18next';

import standardVi from '../locale/vi/standard.json';

export const defaultNS = 'standard';
export const resources = {
  vi: {
    standard: standardVi,
  },
} as const;
export const supportedLngs = ['vi'] as const;

i18next.use(initReactI18next).init({
  lng: 'vi',
  ns: ['standard'],
  supportedLngs,
  defaultNS,
  resources,
});
