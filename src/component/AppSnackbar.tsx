import { Alert, Snackbar } from '@mui/material';
import React, { useCallback, useState, type PropsWithChildren } from 'react';
import { SnackbarContext } from '../hook';
import type { SnackbarValue } from '../hook/useSnackbar';

const AppSnackbar: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<SnackbarValue>();

  const handler = useCallback((value?: SnackbarValue) => setState(value), []);

  return (
    <SnackbarContext value={{ show: handler }}>
      <Snackbar
        open={state !== undefined}
        autoHideDuration={state?.duration ?? 3000}
        onClose={() => handler(undefined)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => handler(undefined)}
          severity={state?.severity ?? 'info'}
          sx={{ width: '100%' }}
        >
          {state?.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext>
  );
};

export default AppSnackbar;
