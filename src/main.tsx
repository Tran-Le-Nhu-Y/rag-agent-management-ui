import { createRoot } from 'react-dom/client';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './i18n';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import RootLayout from './layout/RootLayout.tsx';

import {
  CreateDocumentPage,
  HealthPage,
  ImageTaggingPage,
  LabelManagementPage,
  DocumentManagementPage,
  UserGuidePage,
} from './page/index.ts';
import { Path } from './util/index.ts';
import AppSnackbar from './component/AppSnackbar.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<ImageTaggingPage />} />
      <Route path={Path.CREATE_DOCUMENT} element={<CreateDocumentPage />} />
      <Route path={Path.DOCUMENT} element={<DocumentManagementPage />} />
      <Route path={Path.LABEL} element={<LabelManagementPage />} />
      <Route path={Path.USER_GUIDE} element={<UserGuidePage />} />
      <Route path={Path.HEALTH} element={<HealthPage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppSnackbar>
          <RouterProvider router={router} />
        </AppSnackbar>
      </LocalizationProvider>
    </ThemeProvider>
  </Provider>
);
