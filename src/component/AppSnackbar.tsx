// component/AppSnackbar.tsx
import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import type { SnackbarSeverity } from '../util';

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity?: SnackbarSeverity;
  onClose: () => void;
  autoHideDuration?: number;
}

const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
