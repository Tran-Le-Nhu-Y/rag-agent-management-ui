// components/ConfirmDeleteDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import AppSnackbar from './AppSnackbar';

interface ConfirmDialogProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  onClose?: () => void;
  onDelete: () => Promise<void> | void;
  successMessage?: string;
  errorMessage?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  open = false,
  onClose,
  onDelete,
  successMessage,
  errorMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const handleClose = () => {
    if (!loading) {
      onClose?.();
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onDelete();
      handleClose();
      setSnackbar({
        open: true,
        message: successMessage || '',
        severity: 'success',
      });
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: errorMessage || '',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            size="small"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            disabled={loading}
            variant="contained"
            color="error"
            size="small"
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default ConfirmDialog;
