import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router';
import { RootLayout } from './layout';
import { AgentManagementPage } from './page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<AgentManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
