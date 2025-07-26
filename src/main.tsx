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
  UpdateKnowledgePage,
  UseGuidePage,
} from './page/index.ts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<ImageTaggingPage />} />
      <Route path="create-document" element={<CreateDocumentPage />} />
      <Route
        path="update-knowledge-management"
        element={<UpdateKnowledgePage />}
      />
      <Route path="label-management" element={<LabelManagementPage />} />
      <Route path="use-guide" element={<UseGuidePage />} />
      <Route path="health" element={<HealthPage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  </Provider>
);
